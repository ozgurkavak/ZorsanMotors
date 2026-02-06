
# Feature Parser for DealerCenter CSV EquipmentCode
# Extracts known features from the raw, space-separated string.

import re

# Comprehensive list of features to look for.
# Longer phrases should come first to avoid partial matches (e.g. 'Power Windows' before 'Windows')
KNOWN_FEATURES = [
    "F&R Head Curtain Air Bags", "F&R Side Air Bags", "Dual Air Bags", "Side Air Bags", "Knee Air Bags", "Head Curtain Air Bags", "Air Bag",
    "Power Steering", "Power Brakes", "Power Door Locks", "Power Windows", "Power Seat", "Dual Power Seats", "Power Liftgate Release",
    "Tilt & Telescoping Wheel", "Tilt Wheel", "Cruise Control", "Adaptive Cruise Control", "Dynamic Cruise Control",
    "Air Conditioning", "Rear Air Conditioning", "Climate Control", "Cold Weather Pkg", "Towing Pkg",
    "AM/FM Stereo", "AM/FM/HD Radio", "CD/MP3 (Single Disc)", "CD/MP3 (Multi Disc)", "Premium Sound", "JBL Audio", "Bose Soun", "Satellite Feature", "SiriusXM Satellite", "Bluetooth Wireless", "Bluetooth", "Navigation", "Backup Camera", "Rear View Camera", "Top View Camera", "Rear Camera",
    "Alloy Wheels", "Steel Wheels", "Premium Wheels", "Moon Roof", "Sun Roof", "Glass Roof", "Roof Rack", "Running Boards", "Bed Liner", "Tonneau Cover",
    "ABS (4-Wheel)", "Traction Control", "Stability Control", "Enhanced Stability Control", "Hill Start Assist Control", "Downhill Assist Control", "Crawl Control", "Multi-Terrain Select",
    "Keyless Entry", "Keyless Start", "Push Button Start", "Remote Start", "Anti-Theft System", "Alarm System",
    "Leather Seats", "Heated Seats", "Cooled Seats", "Third Row Seat", "Quad Seating",
    "Daytime Running Lights", "Fog Lights", "LED Headlamps", "Xenon Headlamps",
    "Blind-Spot Monitor", "Lane Departure Warning System", "Lane Keep Assistant", "Parking Sensors", "F&R Parking Sensors",
    "AWD", "4WD", "FWD", "RWD", "4x4",
    "V6 Hybrid", "4-Cyl Hybrid", "V8", "V6", "4-Cyl", "Turbo", "Diesel", "Liter",
    "Automatic", "Manual", "CVT", "Tixtronic", "S tronic", "Dual-Clutch"
]

def generate_features_from_raw(raw_text):
    """
    Parses the raw feature string and returns a comma-separated string of known features.
    """
    if not raw_text:
        return None
    
    found_features = []
    
    # We work on a copy of the text to prevent re-matching? 
    # Actually, we just check existence.
    # But checking "Air Bags" might match inside "Side Air Bags".
    # So we should iterate through KNOWN_FEATURES (ordered by length DESC ideally)
    # and if found, add to list.
    
    # Sort known features by length descending to match longest first
    sorted_features = sorted(KNOWN_FEATURES, key=len, reverse=True)
    
    remaining_text = raw_text
    
    for feature in sorted_features:
        # Case insensitive match
        pattern = re.compile(re.escape(feature), re.IGNORECASE)
        if pattern.search(remaining_text):
            found_features.append(feature)
            # Remove found feature to avoid double counting? 
            # Actually, "Side Air Bags" and "Air Bags" -> if we find Side, we shouldn't find Air Bags?
            # Or maybe we want both?
            # Usually specific is better. 
            # If we remove it from text, we prevent matching sub-parts.
            remaining_text = pattern.sub("", remaining_text)
            
    # Clean up results
    if not found_features:
        # If no known features found, maybe return the raw text cleaned up?
        # But raw text is "PowerSteeringConveniencePkg..." (nospaces?)
        # Base on CSV, it has spaces.
        # Fallback to raw text if nothing matched?
        # Or just return empty?
        if len(raw_text) < 200: # If reasonably short
             return raw_text.strip()
        return ""

    return found_features

# Test execution (if run directly)
if __name__ == "__main__":
    sample = "Steel Wheels V8 4.6 Liter Cold Weather Pkg Dual Air Bags Bluetooth Wireless F&R Head Curtain Air Bags Daytime Running Lights 4WD Power Door Locks"
    print(generate_features_from_raw(sample))
