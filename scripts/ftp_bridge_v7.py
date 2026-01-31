import os
import requests
import csv
import time
import threading
import shutil
import datetime
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer

# Configuration
FTP_USER = "dealercenter"
FTP_PASS = "AAaaRedDark4250"
FTP_PORT = 21
WEBHOOK_URL = "https://www.zorsanmotors.com/api/webhooks/inventory-sync"
WEBHOOK_TOKEN = "zs-sync-2026-secure-x92" 
HEARTBEAT_INTERVAL = 3600 # 1 Hour

# Status Codes
STATUS_SUCCESS = "SUCCESS"
STATUS_RETRYING = "RETRYING"
STATUS_FAILED = "FAILED"

class InventoryHandler(FTPHandler):
    def on_file_received(self, file_path):
        """Called when a file has been completely received."""
        print(f"File received: {file_path}")
        
        # 1. Backup the Original File immediately
        self.backup_file(file_path)

        # 2. Process with Retry Logic
        if file_path.endswith('.csv') or file_path.endswith('.txt'):
            threading.Thread(target=self.process_file_with_retry, args=(file_path,)).start()
        else:
            print(f"Ignored non-csv file: {file_path}")

    def backup_file(self, file_path):
        try:
            backup_dir = "backups"
            if not os.path.exists(backup_dir):
                os.makedirs(backup_dir)
            
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_filename = f"{backup_dir}/inventory_{timestamp}_{os.path.basename(file_path)}"
            shutil.copy2(file_path, backup_filename)
            print(f"Original Backup created: {backup_filename}")
        except Exception as e:
            print(f"Backup failed: {e}")

    def process_file_with_retry(self, file_path, max_retries=3):
        retry_count = 0
        
        while retry_count <= max_retries:
            print(f"Processing attempt {retry_count + 1} for {file_path}...")
            
            success, message = self.process_and_send_to_api(file_path, retry_count)
            
            if success:
                print(f"Successfully processed: {file_path}")
                self.move_file(file_path, "processed")
                return # Done
            
            # If failed
            retry_count += 1
            print(f"Attempt {retry_count} failed: {message}")
            
            if retry_count <= max_retries:
                # Wait 10 minutes before retry
                wait_time = 600 # 10 minutes
                print(f"Waiting {wait_time}s before next retry...")
                
                # Notify API about RETRY status
                self.send_status_to_api(STATUS_RETRYING, f"Attempt {retry_count} failed. Retrying in 10m. Error: {message}")
                
                time.sleep(wait_time)
            else:
                # All retries failed
                print(f"All {max_retries} attempts failed. Giving up.")
                self.move_file(file_path, "failed")
                
                # Notify API about FAILURE (This should trigger email)
                self.send_status_to_api(STATUS_FAILED, f"Critical: Failed to process file after {max_retries} retries. Error: {message}")

    def process_and_send_to_api(self, file_path, retry_count):
        try:
            vehicles = []
            skipped_rows = []
            
            with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                reader = csv.DictReader(f)
                for row_num, row in enumerate(reader, start=1):
                    # 1. Extract Data with Fallbacks
                    vin = row.get('VIN')
                    
                    if not vin:
                        skipped_rows.append({"row": row_num, "reason": "Missing VIN"})
                        continue
                    
                    # DealerCenter Column Mapping
                    raw_photos = row.get('PhotoURLs', '')
                    photo_list = [p for p in raw_photos.split(' ') if p.strip()] if raw_photos else []
                    
                    price_raw = row.get('SpecialPrice') or row.get('Price') or row.get('Internet Price')
                    
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
                        "images": photo_list,
                        "image": photo_list[0] if photo_list else None
                    }
                    
                    vehicles.append(vehicle)

            # Send to API
            payload = {
                "vehicles": vehicles,
                "meta": {
                    "total_rows": len(vehicles) + len(skipped_rows),
                    "skipped_count": len(skipped_rows),
                    "filename": os.path.basename(file_path),
                    "retry_attempt": retry_count
                }
            }
            
            headers = { "Content-Type": "application/json", "Authorization": f"Bearer {WEBHOOK_TOKEN}" }
            response = requests.post(WEBHOOK_URL, json=payload, headers=headers, timeout=30)
            
            if response.status_code == 200:
                response_json = response.json()
                if response_json.get("success"):
                    return True, "Synced successfully"
                else:
                    return False, f"API Logic Error: {response_json.get('error')}"
            else:
                return False, f"HTTP Error: {response.status_code} - {response.text}"

        except Exception as e:
            return False, str(e)

    def send_status_to_api(self, status, message):
        """Sends a status update to the API (handled by route.ts to maybe send emails)"""
        try:
            payload = {
                "type": "STATUS_UPDATE",
                "status": status,
                "message": message,
                "timestamp": datetime.datetime.now().isoformat()
            }
            headers = { "Content-Type": "application/json", "Authorization": f"Bearer {WEBHOOK_TOKEN}" }
            requests.post(WEBHOOK_URL, json=payload, headers=headers, timeout=10)
        except Exception as e:
            print(f"Failed to report status: {e}")

    def move_file(self, file_path, target_folder):
        try:
            if not os.path.exists(target_folder):
                os.makedirs(target_folder)
            
            filename = os.path.basename(file_path)
            shutil.move(file_path, os.path.join(target_folder, filename))
            print(f"Moved {filename} to {target_folder}/")
        except Exception as e:
            print(f"Error moving file: {e}")

def run_heartbeat():
    """Independent heartbeat loop"""
    time.sleep(10) 
    print("[Heartbeat] Service started.")
    while True:
        try:
            payload = {"type": "HEARTBEAT"}
            headers = {"Content-Type": "application/json", "Authorization": f"Bearer {WEBHOOK_TOKEN}"}
            requests.post(WEBHOOK_URL, json=payload, headers=headers, timeout=10)
        except:
            pass
        time.sleep(HEARTBEAT_INTERVAL)

def main():
    t = threading.Thread(target=run_heartbeat, daemon=True)
    t.start()

    authorizer = DummyAuthorizer()
    authorizer.add_user(FTP_USER, FTP_PASS, ".", perm="elradfmwMT")
    
    handler = InventoryHandler
    handler.authorizer = authorizer
    
    server = FTPServer(("0.0.0.0", FTP_PORT), handler)
    print(f"FTP Server V7 (Smart Retry & Alerting) running on port {FTP_PORT}.")
    server.serve_forever()

if __name__ == "__main__":
    main()
