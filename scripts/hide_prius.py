
import os
from supabase import create_client
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
load_dotenv(env_path)

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Supabase credentials not found.")
    exit(1)

supabase = create_client(url, key)

vin = "JTDKB20U053059279" # 2005 Prius with 0 Price

print(f"Hiding vehicle {vin}...")
try:
    response = supabase.table("vehicles").update({"status": "Hidden"}).eq("vin", vin).execute()
    # Check if updated
    data = response.data
    if data:
        print(f"Success: Updated {vin} to Status: {data[0]['status']}")
    else:
        print(f"Warning: VIN {vin} not found or update failed.")

except Exception as e:
    print(f"Error: {e}")
