#!/bin/bash
SECONDS=0  # Start tracking time

GREEN='\033[1;32m'
NC='\033[0m' # No color
DIR="images"

for file in "$DIR"/*; do
    echo "${GREEN}----------------------------------------------------------------------------------------------${NC}\n"
    echo "Processing: $file\n\n"
    # node --no-warnings api.js $file
    # tag -a "$output" $file
    tag -r "*" $file
done

for file in "$DIR"/*; do echo $file; done

echo "Script duration: $SECONDS seconds"