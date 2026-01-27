import os
import requests
import csv
import io
import json
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

# Heartbeat Interval (Seconds) - e.g. 3600 = 1 Hour
HEARTBEAT_INTERVAL = 3600 

def send_heartbeat():
    """Sends a 'I am alive' signal to the API periodically"""
    while True:
        try:
            print("[Heartbeat] Sending pulse...")
            payload = {"type": "HEARTBEAT"}
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {WEBHOOK_TOKEN}"
            }
            response = requests.post(WEBHOOK_URL, json=payload, headers=headers)
            if response.status_code == 200:
                print("[Heartbeat] Success. System is alive.")
            else:
                print(f"[Heartbeat] Warning: API returned {response.status_code}")
        except Exception as e:
            print(f"[Heartbeat] Error: {e}")
        
        # Wait for next interval
        time.sleep(HEARTBEAT_INTERVAL)

class InventoryHandler(FTPHandler):
    def on_file_received(self, file):
        """Called when a file has been completely received."""
        print(f"File received: {file}")
        
        # Check if it's a CSV or TXT
        if not (file.endswith('.csv') or file.endswith('.txt')):
            print("Ignored non-csv file.")
            return

        try:
            vehicles = []
            
            with open(file, 'r', encoding='utf-8', errors='replace') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # Robust Parsing
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
    # Start Heartbeat in a Background Thread
    heartbeat_thread = threading.Thread(target=send_heartbeat, daemon=True)
    heartbeat_thread.start()

    # Setup FTP
    authorizer = DummyAuthorizer()
    authorizer.add_user(FTP_USER, FTP_PASS, ".", perm="elradfmwMT")
    
    handler = InventoryHandler
    handler.authorizer = authorizer
    
    # Listen
    server = FTPServer(("0.0.0.0", FTP_PORT), handler)
    
    print(f"FTP Server running on port {FTP_PORT} with Heartbeat...")
    server.serve_forever()

if __name__ == "__main__":
    main()
