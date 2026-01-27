import os
import requests
import csv
import io
import json
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer

# Configuration
FTP_USER = "dealercenter"
FTP_PASS = "ZorSan2026!Upload" # We will give this to the vendor
FTP_PORT = 21
WEBHOOK_URL = "https://zorsanmotors.com/api/webhooks/inventory-sync"
# In a real scenario, use an env var or config file for the token
WEBHOOK_TOKEN = "zs-sync-2026-secure-x92" 

class InventoryHandler(FTPHandler):
    def on_file_received(self, file):
        """Called when a file has been completely received."""
        print(f"File received: {file}")
        
        # Check if it's a CSV or TXT
        if not (file.endswith('.csv') or file.endswith('.txt')):
            print("Ignored non-csv file.")
            return

        try:
            # Read the file header to map columns (Basic implementation)
            vehicles = []
            
            with open(file, 'r', encoding='utf-8', errors='replace') as f:
                # Basic CSV parsing - we might need to adjust delimiter based on Vendor file
                reader = csv.DictReader(f)
                for row in reader:
                    # Map Vendor Columns to Our Schema
                    # Note: We need to see the real file to do exact mapping.
                    # This is a generic mapper for now.
                    vehicle = {
                        "vin": row.get('VIN') or row.get('vin'),
                        "stockNumber": row.get('Stock Number') or row.get('stk') or row.get('StockNumber'),
                        "year": int(row.get('Year') or 0),
                        "make": row.get('Make'),
                        "model": row.get('Model'),
                        "price": float(row.get('Price') or row.get('Internet Price') or 0),
                        "mileage": int(row.get('Mileage') or 0),
                        "description": row.get('Description'),
                        # Add more fields as we learn the vendor format
                    }
                    if vehicle['vin']: # Only add if VIN exists
                        vehicles.append(vehicle)

            print(f"Parsed {len(vehicles)} vehicles. Sending to API...")
            
            # Send to Next.js API
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
    # Setup the FTP user
    authorizer = DummyAuthorizer()
    # Allow writing to the current directory
    authorizer.add_user(FTP_USER, FTP_PASS, ".", perm="elradfmwMT")
    
    handler = InventoryHandler
    handler.authorizer = authorizer
    
    # Listen on all IPs
    server = FTPServer(("0.0.0.0", FTP_PORT), handler)
    
    print(f"FTP Server running on port {FTP_PORT}...")
    print(f"User: {FTP_USER}")
    server.serve_forever()

if __name__ == "__main__":
    main()
