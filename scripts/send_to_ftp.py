import os
import ftplib
import glob
import time
from dotenv import load_dotenv

# Load env credentials from scripts/.env
script_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(script_dir, '.env'))

# Server Details
HOST = "5.78.96.33"
USER = os.getenv("FTP_USER")
PASS = os.getenv("FTP_PASS")
PORT = int(os.getenv("FTP_PORT", 21))

def upload_latest_csv():
    # 1. Find local CSV
    # Check processed_backups folder in project root
    project_root = os.path.dirname(script_dir)
    backup_dir = os.path.join(project_root, "processed_backups")
    
    # Also check current dir just in case
    search_paths = [
        os.path.join(backup_dir, "*.csv"),
        os.path.join(project_root, "*.csv"),
        os.path.join(os.getcwd(), "*.csv")
    ]
    
    files = []
    for p in search_paths:
        files.extend(glob.glob(p))
        
    if not files:
        print("❌ No CSV files found to upload.")
        return

    # Get newest
    target_file = max(files, key=os.path.getmtime)
    print(f"📄 Found File: {os.path.basename(target_file)}")
    
    # 2. Connect to FTP
    print(f"🔌 Connecting to {HOST}:{PORT}...")
    try:
        ftp = ftplib.FTP()
        ftp.connect(HOST, PORT)
        ftp.login(USER, PASS)
        print("✅ Logged in.")
        
        # 3. Upload
        upload_name = f"manual_sync_{int(time.time())}.csv"
        print(f"🚀 Uploading as: {upload_name}")
        
        with open(target_file, "rb") as f:
            ftp.storbinary(f"STOR {upload_name}", f)
            
        print("✅ Upload Successful!")
        print("ℹ️  The Server should now be processing the file automatically.")
        
        ftp.quit()
        
    except Exception as e:
        print(f"❌ FTP Error: {e}")
        print("Check if the FTP Service (zorsan-ftp) is running on the server.")

if __name__ == "__main__":
    upload_latest_csv()
