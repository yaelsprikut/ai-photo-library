#!/bin/bash
SECONDS=0 # Start tracking time
CYAN='\033[1;36m'
GREEN='\033[1;32m'
NC='\033[0m'
YELLOW='\033[1;33m'
DIR="images"

if [[ -n "$VIRTUAL_ENV" ]]; then
    echo "✅ Virtual environment is activated: $VIRTUAL_ENV"
else
    echo "❌ No virtual environment detected. Creating..."
    source venv/bin/activate
fi

echo "${GREEN}----------------------------------------------------------------------------------------------${NC}\n\n"
for file in "$DIR"/*; do
    if [[ "$file" == *.heic ]]; then
        echo "${CYAN}----------------------------------------------------------------------------------------------${NC}\n"
        echo "✅ This is a HEIC file. Proceed..."
        latitude=$(exiftool "$file" | grep "GPS Latitude  " | awk -F': ' '{print $2}')
        longitude=$(exiftool "$file" | grep "GPS Longitude  " | awk -F': ' '{print $2}')
        python3 location.py "$latitude" "$longitude"
    else
        echo "❌ Not a HEIC file."
    fi
done

echo "${GREEN}----------------------------------------------------------------------------------------------${NC}\n"
