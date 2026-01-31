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
FTP_PASS = "ZorSan2026!Upload"
FTP_PORT = 21
WEBHOOK_URL = "https://www.zorsanmotors.com/api/webhooks/inventory-sync"
WEBHOOK_TOKEN = "zs-sync-2026-secure-x92" 
HEARTBEAT_INTERVAL = 3600 # 1 Hour

def run_heartbeat():
    """Independent heartbeat loop"""
    time.sleep(10) 
    print("[Heartbeat] Service started. First pulse in 10s...")
    
    while True:
        try:
            print("[Heartbeat] Sending pulse...")
            payload = {"type": "HEARTBEAT"}
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {WEBHOOK_TOKEN}"
            }
            response = requests.post(WEBHOOK_URL, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 200:
                print("[Heartbeat] Success. System is alive.")
            else:
                print(f"[Heartbeat] Warning: API returned {response.status_code}")
                
        except Exception as e:
            print(f"[Heartbeat] Error: {e}")
        
        time.sleep(HEARTBEAT_INTERVAL)

class InventoryHandler(FTPHandler):
    def on_file_received(self, file):
        """Called when a file has been completely received."""
        print(f"File received: {file}")
        
        # --- BACKUP LOGIC ---
        try:
            backup_dir = "processed_backups"
            if not os.path.exists(backup_dir):
                os.makedirs(backup_dir)
            
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_filename = f"{backup_dir}/inventory_{timestamp}_{os.path.basename(file)}"
            shutil.copy2(file, backup_filename)
            print(f"Backup created: {backup_filename}")
        except Exception as e:
            print(f"Backup failed: {e}")
        # --------------------

        if not (file.endswith('.csv') or file.endswith('.txt')):
            print("Ignored non-csv file.")
            return

        try:
            vehicles = []
            skipped_rows = []
            total_rows = 0

            with open(file, 'r', encoding='utf-8', errors='replace') as f:
                reader = csv.DictReader(f)
                for row_num, row in enumerate(reader, start=1):
                    total_rows += 1
                    
                    # 1. Basic Validation
                    vin = row.get('VIN')
                    # DealerCenter uses 'SpecialPrice' as the selling price
                    price_raw = row.get('SpecialPrice') or row.get('Price') or row.get('Internet Price')
                    
                    if not vin:
                        skipped_rows.append({"row": row_num, "reason": "Missing VIN"})
                        continue
                    
                    # 2. Extract Data
                    # Handle Photo URLs (space separated in CSV)
                    raw_photos = row.get('PhotoURLs', '')
                    photo_list = raw_photos.split(' ') if raw_photos else []
                    # Filter empty strings
                    photo_list = [p for p in photo_list if p.strip()]

                    vehicle = {
                        "vin": vin,
                        "stockNumber": row.get('StockNumber') or f"VIN-{vin[-6:]}", # Fallback if no stock #
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
                    
                    # 3. Enhanced Validation
                    # Allow 0 price (will be treated as "Call for Price") in case SpecialPrice is empty
                    vehicles.append(vehicle)

            print(f"Parsed {len(vehicles)} vehicles. Skipped {len(skipped_rows)}.")
            
            # Send Payload with Stats
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
            
            response = requests.post(WEBHOOK_URL, json=payload, headers=headers)
            print(f"API Response: {response.status_code} - {response.text}")

        except Exception as e:
            print(f"Error processing file: {e}")

def main():
    t = threading.Thread(target=run_heartbeat, daemon=True)
    t.start()

    authorizer = DummyAuthorizer()
    authorizer.add_user(FTP_USER, FTP_PASS, ".", perm="elradfmwMT")
    
    handler = InventoryHandler
    handler.authorizer = authorizer
    
    server = FTPServer(("0.0.0.0", FTP_PORT), handler)
    
    print(f"FTP Server running on port {FTP_PORT}. V6 (Enhanced Reporting).")
    server.serve_forever()

if __name__ == "__main__":
    main()
