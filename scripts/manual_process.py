import os
import shutil
import sys
import glob

# Try to import process_file_logic from ftp_bridge
# On server it is named 'ftp_bridge.py'
try:
    from ftp_bridge import process_file_logic
except ImportError:
    # Locally it might be ftp_bridge_v7
    try:
        from ftp_bridge_v7 import process_file_logic
    except ImportError:
        print("ERROR: Could not import 'ftp_bridge'. Ensure this script is in the same directory as 'ftp_bridge.py'.")
        sys.exit(1)

def run_manual_import():
    # 1. Find the target CSV (Latest in processed_backups)
    # Adjust path if needed. On server, processed_backups is in /root/processed_backups
    backup_dir = "processed_backups"
    
    if not os.path.exists(backup_dir):
        print(f"Directory not found: {backup_dir}")
        return

    files = glob.glob(os.path.join(backup_dir, "*.csv"))
    if not files:
        print(f"No CSV files found in {backup_dir}")
        return

    # Pick latest
    target_file = max(files, key=os.path.getmtime)
    print(f"Targeting latest backup: {target_file}")

    # 2. Create a temporary copy to 'simulate' a new upload
    # We name it strangely to avoid overwriting anything important, but it should end in .csv
    trigger_file = "manual_import_trigger.csv"
    shutil.copy2(target_file, trigger_file)
    print(f"Staged file as: {trigger_file}")

    # 3. Trigger Logic
    print(">>> Starting Manual Processing...")
    try:
        # Dummy connection info
        conn_info = {"ip": "127.0.0.1", "user": "manual scanner"}
        process_file_logic(trigger_file, conn_info)
        print(">>> Processing Finished Successfully.")
    except Exception as e:
        print(f"!!! Error during processing: {e}")

if __name__ == "__main__":
    run_manual_import()
