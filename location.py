import re
import sys
import argparse
from geopy.geocoders import Nominatim

if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
    print("✅ Virtual environment is active")
else:
    print("❌ No virtual environment detected")
    print("Exiting script...")
    sys.exit()


# Initialize argument parser
parser = argparse.ArgumentParser(description="Convert DMS coordinates to Decimal Degrees.")

# Add command-line arguments
parser.add_argument("lat", type=str, help="DMS coordinate string (e.g., '62 deg 27' 38.21\" N')")
parser.add_argument("long", type=str, help="DMS coordinate string (e.g., '62 deg 27' 38.21\" N')")

# Parse arguments
args = parser.parse_args()

# Print input
print(f"Received LAT input: {args.lat}")
print(f"Received LONG input: {args.long}")

# Initialize geocoder
geolocator = Nominatim(user_agent="http")

def dms_to_decimal(dms_str):
    """
    Convert a DMS (Degrees, Minutes, Seconds) string to Decimal Degrees.
    
    :param dms_str: A string in the format "62 deg 27' 38.21\" N"
    :return: Decimal degrees as a float
    """
    # Regular expression to extract DMS components
    dms_pattern = r"(\d+)\s*deg\s*(\d+)'?\s*([\d.]+)\"?\s*([NSEW])"
    match = re.match(dms_pattern, dms_str)

    if not match:
        raise ValueError(f"Invalid DMS format: {dms_str}")

    degrees, minutes, seconds, direction = match.groups()
    degrees = int(degrees)
    minutes = int(minutes)
    seconds = float(seconds)

    # Convert to decimal degrees
    decimal_degrees = degrees + (minutes / 60) + (seconds / 3600)

    # Handle South and West (negative values)
    if direction in ["S", "W"]:
        decimal_degrees *= -1

    return decimal_degrees

# Example usage
latitude_dms = args.lat
longitude_dms = args.long

latitude_dd = dms_to_decimal(latitude_dms)
longitude_dd = dms_to_decimal(longitude_dms)

print(f"Latitude (Decimal Degrees): {latitude_dd}")
print(f"Longitude (Decimal Degrees): {longitude_dd}")


# Latitude & Longitude Example (San Francisco)
latitude = latitude_dd
longitude = longitude_dd

# Get location
location = geolocator.reverse((latitude, longitude), exactly_one=True)

# Print formatted address
print("Location:", location.address)

