import requests
import json

# Configuration
WEBHOOK_URL = "http://localhost:3000/api/webhooks/inventory-sync" 
# Note: Ensure this matches your local env or use the production URL if testing live
WEBHOOK_TOKEN = "zs-sync-2026-secure-x92"

def test_sync():
    print("Testing Sync with 0 Price Vehicle...")

    # Mock Payload mimicking what the FTP bridge sends
    payload = {
        "vehicles": [
            {
                "vin": "TEST_ZERO_PRICE_001",
                "stockNumber": "STK-001",
                "year": 2024,
                "make": "Toyota",
                "model": "Camry",
                "price": 0, # The problematic value
                "mileage": 1500,
                "bodyType": "Sedan",
                "fuelType": "Hybrid",
                "transmission": "Automatic",
                "image": "https://placehold.co/600x400",
                "images": ["https://placehold.co/600x400"],
                "description": "Call for Price Test Vehicle"
            }
        ],
        "meta": {
            "total_rows": 1,
            "skipped_count": 0,
            "skipped_details": []
        }
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {WEBHOOK_TOKEN}"
    }

    try:
        response = requests.post(WEBHOOK_URL, json=payload, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")

        if response.status_code == 200:
            print("\nSUCCESS! The API accepted the 0-price vehicle.")
            print("Please check your local database or website to see if 'TEST_ZERO_PRICE_001' is listed.")
        else:
            print("\nFAILED. The API rejected the request.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_sync()
