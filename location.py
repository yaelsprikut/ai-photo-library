import re
from geopy.geocoders import Nominatim

# Initialize geocoder
geolocator = Nominatim(user_agent="http")

def dms_to_decimal(dms_str):
    """
    Convert a DMS (Degrees, Minutes, Seconds) string to Decimal Degrees.
    
    :param dms_str: A string in the format "62° 27' 38.208\" N" or "114° 20' 55.458\" W"
    :return: Decimal degrees as a float
    """
    # Regular expression to extract DMS components
    dms_pattern = r"(\d+)°\s*(\d+)'?\s*([\d.]+)\"?\s*([NSEW])"
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
latitude_dms = "62° 27' 38.208\" N"
longitude_dms = "114° 20' 55.458\" W"

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

