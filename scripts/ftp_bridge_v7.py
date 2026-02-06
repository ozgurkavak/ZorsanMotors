import os
import requests
import csv
import time
import threading
import shutil
import datetime
import logging
from dotenv import load_dotenv
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import ThreadedFTPServer
try:
    from feature_parser import generate_features_from_raw
except ImportError:
    # Fallback if file missing
    def generate_features_from_raw(text):
        return text.replace('  ', ', ').strip() if text else None

# Load env variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Configuration
FTP_USER = os.getenv("FTP_USER")
if not FTP_USER:
    raise ValueError("FTP_USER not found in environment variables.")

FTP_PASS = os.getenv("FTP_PASS")
if not FTP_PASS:
    raise ValueError("FTP_PASS not found in environment variables. Please check .env file.")

port_str = os.getenv("FTP_PORT")
if not port_str:
    raise ValueError("FTP_PORT not found in environment variables.")
FTP_PORT = int(port_str)

WEBHOOK_URL = os.getenv("WEBHOOK_URL", "https://www.zorsanmotors.com/api/webhooks/inventory-sync")
WEBHOOK_TOKEN = os.getenv("WEBHOOK_TOKEN") 
HEARTBEAT_INTERVAL = 3600
LOG_FILE = "dealercenter_logs.log"

# Setup Logger
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format='[%(asctime)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger()

def log_event(message):
    """Write to local log file and print to console"""
    logger.info(message)
    print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] {message}")

def run_heartbeat():
    """Independent heartbeat loop"""
    time.sleep(10) 
    log_event("[Heartbeat] Service started.")
    
    while True:
        try:
            payload = {"type": "HEARTBEAT"}
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {WEBHOOK_TOKEN}"
            }
            try:
                response = requests.post(WEBHOOK_URL, json=payload, headers=headers, timeout=10)
                if response.status_code != 200:
                    log_event(f"[Heartbeat] Warning: API returned {response.status_code}")
            except requests.exceptions.RequestException as e:
                log_event(f"[Heartbeat] Request failed: {e}")
                
        except Exception as e:
            log_event(f"[Heartbeat] Error: {e}")
        
        time.sleep(HEARTBEAT_INTERVAL)

def process_file_logic(file, connection_info):
    """Background processing logic"""
    filename = os.path.basename(file)
    user_ip = connection_info.get("ip", "unknown")
    username = connection_info.get("user", "unknown")
    
    log_event(f"[PROCESSING] Start: {filename} (Uploaded by {username}@{user_ip})")
    
    # --- BACKUP LOGIC ---
    try:
        backup_dir = "processed_backups"
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)
        
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_filename = f"{backup_dir}/inventory_{timestamp}_{filename}"
        shutil.copy2(file, backup_filename)
        log_event(f"[BACKUP] Saved copy to {backup_filename}")
    except Exception as e:
        log_event(f"[BACKUP ERROR] Failed to backup: {e}")
    # --------------------

    if not (file.endswith('.csv') or file.endswith('.txt')):
        log_event(f"[IGNORED] Non-csv file: {filename}")
        return

    try:
        vehicles = []
        skipped_rows = []
        total_rows = 0

        with open(file, 'r', encoding='utf-8', errors='replace') as f:
            reader = csv.DictReader(f)
            for row_num, row in enumerate(reader, start=1):
                total_rows += 1
                
                # Validation
                vin = row.get('VIN')
                price_raw = row.get('SpecialPrice') or row.get('Price') or row.get('Internet Price')
                
                if not vin:
                    skipped_rows.append({"row": row_num, "reason": "Missing VIN"})
                    continue
                
                # Handle Photos
                raw_photos = row.get('PhotoURLs', '')
                photo_list = [p for p in raw_photos.split(' ') if p.strip()] if raw_photos else []

                vehicle = {
                    "vin": vin,
                    "stockNumber": row.get('StockNumber') or f"VIN-{vin[-6:]}",
                    "year": int(row.get('Year') or 0),
                    "make": row.get('Make'),
                    "model": row.get('Model'),
                    "trim": row.get('Trim'),
                    "price": float(price_raw or 0),
                    "mileage": int(row.get('Odometer') or row.get('Mileage') or 0),
                    "description": row.get('WebAdDescription') or row.get('Description'),
                    "exteriorColor": row.get('ExteriorColor'),
                    "interiorColor": row.get('InteriorColor'),
                    "transmission": row.get('Transmission'),
                    "features": generate_features_from_raw(row.get('EquipmentCode')),
                    "images": photo_list,
                    "image": photo_list[0] if photo_list else None
                }
                
                # Intelligent Field Refinement
                features_set = set(vehicle["features"] or [])
                trim_upper = (row.get('Trim') or "").upper()
                model_upper = (row.get('Model') or "").upper()
                
                # 1. Body Type Inference
                if not vehicle.get("bodyType") or vehicle["bodyType"] == "Other":
                    if "PICKUP" in trim_upper or "TRUCK" in trim_upper or "TUNDRA" in model_upper or "SILVERADO" in model_upper or "F-150" in model_upper:
                        vehicle["bodyType"] = "Truck"
                    elif "SUV" in trim_upper or "UTILITY" in trim_upper or "JEEP" in model_upper or "RAV4" in model_upper:
                        vehicle["bodyType"] = "SUV"
                    elif "SEDAN" in trim_upper:
                        vehicle["bodyType"] = "Sedan"
                    elif "COUPE" in trim_upper:
                        vehicle["bodyType"] = "Coupe"
                    elif "WAGON" in trim_upper:
                        vehicle["bodyType"] = "Wagon"
                    elif "VAN" in trim_upper:
                        vehicle["bodyType"] = "Van"

                # 2. Drivetrain Inference
                if "AWD" in features_set or "4WD" in features_set or "4X4" in features_set:
                    vehicle["drivetrain"] = "AWD/4WD"
                elif "FWD" in features_set:
                    vehicle["drivetrain"] = "FWD"
                elif "RWD" in features_set:
                    vehicle["drivetrain"] = "RWD"
                    
                # 3. Engine Inference
                engine_parts = []
                for f in features_set:
                    if f in ["V6", "V8", "4-Cyl", "Hybrid", "Electric", "Diesel", "Turbo"]:
                        engine_parts.append(f)
                    if "LITER" in f.upper():
                        engine_parts.append(f)
                if engine_parts:
                    vehicle["engine"] = " ".join(engine_parts)
                
                # 4. Fuel Type Refinement
                if "HYBRID" in trim_upper or "HYBRID" in features_set:
                    vehicle["fuelType"] = "Hybrid"
                elif "ELECTRIC" in trim_upper or "ELECTRIC" in features_set:
                    vehicle["fuelType"] = "Electric"
                elif "DIESEL" in trim_upper or "DIESEL" in features_set:
                    vehicle["fuelType"] = "Diesel"
                vehicles.append(vehicle)

        log_event(f"[PARSING] Parsed {len(vehicles)} vehicles. Skipped {len(skipped_rows)} rows.")
        
        # Send Payload
        payload = {
            "vehicles": vehicles,
            "meta": {
                "total_rows": total_rows,
                "skipped_count": len(skipped_rows),
                "skipped_details": skipped_rows
            }
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {WEBHOOK_TOKEN}"
        }
        
        response = requests.post(WEBHOOK_URL, json=payload, headers=headers, timeout=120)
        
        if response.status_code == 200:
            data = response.json()
            stats = data.get('stats', {})
            processed = stats.get('processed', len(vehicles))
            sold = stats.get('sold', 0)
            
            log_event(f"[SYNC SUCCESS] File: {filename} | Active: {processed} | Sold: {sold}")
            
            # --- CLEANUP (Delete Original) ---
            try:
                os.remove(file)
                log_event(f"[CLEANUP] Deleted original file: {filename}")
            except Exception as rm_err:
                log_event(f"[CLEANUP ERROR] Failed to delete file: {rm_err}")
            # ---------------------------------
            
        else:
            log_event(f"[SYNC FAILED] API returned {response.status_code}: {response.text}")

    except Exception as e:
        log_event(f"[PROCESSING ERROR] Fatal error: {e}")
        # Notify API about status (Optional)
        try:
             requests.post(WEBHOOK_URL, json={
                 "type": "STATUS_UPDATE",
                 "status": "FAILED",
                 "message": f"Processing Script Error: {str(e)}"
             }, headers=headers)
        except:
             pass


class InventoryHandler(FTPHandler):
    def on_connect(self):
        log_event(f"[CONNECTION] New connection from {self.remote_ip}:{self.remote_port}")

    def on_file_received(self, file):
        """Called when a file has been completely received."""
        log_event(f"[UPLOAD COMPLETE] File received: {file}")
        
        conn_info = {
            "ip": self.remote_ip,
            "user": self.username
        }
        
        # Offload to thread
        t = threading.Thread(target=process_file_logic, args=(file, conn_info))
        t.start()
        
    def on_incomplete_file_received(self, file):
        """Called when file transfer is interrupted"""
        log_event(f"[UPLOAD FAILED] Incomplete transfer for file: {file} from {self.remote_ip}")
        # Notify via Email/Log (handled by status update logic if needed, but here simple log is 'Black Box')

def main():
    # Start Heartbeat
    t = threading.Thread(target=run_heartbeat, daemon=True)
    t.start()

    authorizer = DummyAuthorizer()
    authorizer.add_user(FTP_USER, FTP_PASS, ".", perm="elradfmwMT")
    
    handler = InventoryHandler
    handler.authorizer = authorizer
    
    server = ThreadedFTPServer(("0.0.0.0", FTP_PORT), handler)
    
    log_event(f"FTP Server V7.0 Started on port {FTP_PORT}")
    server.serve_forever()

if __name__ == "__main__":
    main()
