import os
import requests
import csv
import time
import threading
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer

# Configuration
FTP_USER = "dealercenter"
FTP_PASS = "ZorSan2026!Upload"
FTP_PORT = 21
WEBHOOK_URL = "https://zorsanmotors.com/api/webhooks/inventory-sync"
WEBHOOK_TOKEN = "zs-sync-2026-secure-x92" 
HEARTBEAT_INTERVAL = 3600 # 1 Hour

def run_heartbeat():
    """Independent heartbeat loop"""
    time.sleep(5) # Wait for server to start
    print("[Heartbeat] Service started. First pulse in 5s...")
    
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
        
        if not (file.endswith('.csv') or file.endswith('.txt')):
            print("Ignored non-csv file.")
            return

        try:
            vehicles = []
            with open(file, 'r', encoding='utf-8', errors='replace') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    vehicle = {
                        "vin": row.get('VIN') or row.get('vin'),
                        "stockNumber": row.get('Stock Number') or row.get('stk') or row.get('StockNumber'),
                        "year": int(row.get('Year') or 0),
                        "make": row.get('Make'),
                        "model": row.get('Model'),
                        "price": float(row.get('Price') or row.get('Internet Price') or 0),
                        "mileage": int(row.get('Mileage') or 0),
                        "description": row.get('Description'),
                    }
                    if vehicle['vin']:
                        vehicles.append(vehicle)

            print(f"Parsed {len(vehicles)} vehicles. Sending to API...")
            
            payload = {"vehicles": vehicles}
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {WEBHOOK_TOKEN}"
            }
            
            response = requests.post(WEBHOOK_URL, json=payload, headers=headers)
            print(f"API Response: {response.status_code} - {response.text}")

        except Exception as e:
            print(f"Error processing file: {e}")

def main():
    # Start Heartbeat in a Separate Daemon Thread
    # Daemon means it will close when the main program closes
    t = threading.Thread(target=run_heartbeat, daemon=True)
    t.start()

    authorizer = DummyAuthorizer()
    authorizer.add_user(FTP_USER, FTP_PASS, ".", perm="elradfmwMT")
    
    handler = InventoryHandler
    handler.authorizer = authorizer
    
    server = FTPServer(("0.0.0.0", FTP_PORT), handler)
    
    print(f"FTP Server running on port {FTP_PORT}. Heartbeat thread active.")
    server.serve_forever()

if __name__ == "__main__":
    main()
