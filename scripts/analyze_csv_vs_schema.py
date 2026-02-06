import os
import csv
import glob

# Keys we know we use in ftp_bridge_v7.py
PROCESSED_KEYS_EXACT = {
    'VIN', 'StockNumber', 
    'Year', 'Make', 'Model', 'Trim', 
    'SpecialPrice', 'Price', 'Internet Price', 
    'Odometer', 'Mileage', 
    'WebAdDescription', 'Description', 
    'ExteriorColor', 'InteriorColor', 
    'Transmission', 
    'PhotoURLs'
}

def analyze():
    files = glob.glob("processed_backups/inventory_*.csv")
    if not files:
        files = glob.glob("inventory_*.csv")
    
    if not files:
        print("No CSV found.")
        return

    target_file = max(files, key=os.path.getmtime)
    print(f"Analyzing file: {os.path.basename(target_file)}")
    
    with open(target_file, 'r', encoding='utf-8', errors='replace') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        
        # Get a sample row that is NOT empty for improved detection
        sample_row = None
        for row in reader:
            if row.get('Model'): # Valid row
                sample_row = row
                break
        
        if not sample_row:
            print("Could not find a valid sample row.")
            return

        ignored = []
        for h in headers:
            h_clean = h.strip()
            if h_clean not in PROCESSED_KEYS_EXACT:
                val = sample_row.get(h, '').strip()
                if val: # Only list if it has data
                    ignored.append((h_clean, val))
        
        print(f"\nTotal Headers: {len(headers)}")
        print(f"Potential NEW Data Points ({len(ignored)}):")
        print("=" * 70)
        print(f"{'COLUMN':<30} | {'EXAMPLE DATA'}")
        print("-" * 70)
        for k, v in ignored:
            val_disp = (v[:50] + '..') if len(v) > 50 else v
            print(f"{k:<30} | {val_disp}")

if __name__ == "__main__":
    analyze()
