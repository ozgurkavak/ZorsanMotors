import os
import csv
import glob

def check_downloaded_csv():
    # Search in current directory (Project Root) first
    cwd = os.getcwd()
    print(f"Searching for downloaded CSVs in: {cwd}")
    
    # Match the filename pattern from the remote server
    files = glob.glob("inventory_*.csv")
    
    if not files:
        # Check processed_backups
        files = glob.glob("processed_backups/inventory_*.csv")
        
    if not files:
        # Check scripts folder if run from there
        files = glob.glob(os.path.join(os.path.dirname(__file__), "inventory_*.csv"))

    if not files:
        print("❌ No 'inventory_*.csv' files found in current folder.")
        print("Please run the SCP command first to download the file to this folder.")
        return

    # Get the most recent file found
    target_file = max(files, key=os.path.getmtime)
    print(f"🔎 Inspecting file: {os.path.basename(target_file)}")
    
    target_vin = "042827"
    found = False

    try:
        with open(target_file, 'r', encoding='utf-8', errors='replace') as f:
            reader = csv.DictReader(f)
            for row in reader:
                vin = row.get('VIN', '')
                stock = row.get('StockNumber', '')
                
                if target_vin in vin or target_vin in stock:
                    print(f"\n✅ VEHICLE FOUND (VIN: {target_vin})")
                    print("-" * 50)
                    print(f"Make/Model: {row.get('Year')} {row.get('Make')} {row.get('Model')}")
                    print(f"Stock #:    {stock}")
                    print(f"VIN:        {vin}")
                    
                    raw_photos = row.get('PhotoURLs', '')
                    print("-" * 50)
                    print(f"📸 RAW PhotoURLs Content:\n{raw_photos}")
                    print("-" * 50)
                    
                    photos = raw_photos.split(' ') if raw_photos else []
                    valid_photos = [p for p in photos if p.strip()]
                    
                    if not valid_photos:
                        print("⚠️  Photo list is EMPTY after parsing.")
                    else:
                        print(f"✅ Found {len(valid_photos)} photos.")
                        print(f"   First Photo: {valid_photos[0]}")
                    
                    found = True
                    break
    except Exception as e:
        print(f"Error reading file: {e}")

    if not found:
        print(f"❌ Vehicle {target_vin} was NOT found in this CSV.")

if __name__ == "__main__":
    check_downloaded_csv()
