import csv
import sys
import os

# Paths (Relative to scripts/ execution)
BASE_DIR = r"C:\Users\TR\Desktop\ZorSan Motors\server_backups\server_backup_20260203_AfterSync"
OLD_FILE = os.path.join(BASE_DIR, "DealerCenter_Final.csv")
# Find the new file dynamically or hardcode if known from previous step
# The user output showed: DealerCenter_20260202_29009352.csv
NEW_FILE = os.path.join(BASE_DIR, "DealerCenter_20260202_29009352.csv")

def load_csv(filepath):
    data = {}
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            reader = csv.DictReader(f)
            for row in reader:
                vin = row.get('VIN')
                if vin:
                    data[vin] = row
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
    return data

def compare():
    print(f"Loading Old: {OLD_FILE}")
    old_data = load_csv(OLD_FILE)
    print(f"Loading New: {NEW_FILE}")
    new_data = load_csv(NEW_FILE)

    print(f"\n--- SUMMARY ---")
    print(f"Old Count: {len(old_data)}")
    print(f"New Count: {len(new_data)}")

    old_vins = set(old_data.keys())
    new_vins = set(new_data.keys())

    added = new_vins - old_vins
    removed = old_vins - new_vins
    common = old_vins & new_vins

    print(f"Added (New Listings): {len(added)}")
    print(f"Removed (Sold/Dropped): {len(removed)}")
    print(f"Common (Updates Checked): {len(common)}")

    print(f"\n--- ADDED VEHICLES ({len(added)}) ---")
    for vin in added:
        v = new_data[vin]
        print(f"[+] {v.get('Year')} {v.get('Make')} {v.get('Model')} - Stock: {v.get('StockNumber')}")

    print(f"\n--- REMOVED VEHICLES ({len(removed)}) ---")
    for vin in removed:
        v = old_data[vin]
        print(f"[-] {v.get('Year')} {v.get('Make')} {v.get('Model')} - Price: {v.get('SpecialPrice')}")

    print(f"\n--- MODIFIED VEHICLES ---")
    for vin in common:
        o = old_data[vin]
        n = new_data[vin]
        
        diffs = []
        # Check Price
        p_old = float(o.get('SpecialPrice') or 0)
        p_new = float(n.get('SpecialPrice') or 0)
        if p_old != p_new:
            diffs.append(f"Price: {p_old} -> {p_new}")
            
        # Check Mileage
        m_old = o.get('Odometer')
        m_new = n.get('Odometer')
        if m_old != m_new:
            diffs.append(f"Mileage: {m_old} -> {m_new}")

        # Check Status (Optional, if CSV has it, usually DealerCenter feed doesn't have internal status column same as us)
        
        if diffs:
            print(f"[*] {n.get('Year')} {n.get('Make')} {n.get('Model')} ({vin})")
            for d in diffs:
                print(f"    - {d}")

if __name__ == "__main__":
    compare()
