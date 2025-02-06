#!/bin/bash

GREEN='\033[1;32m'
NC='\033[0m' # No color
DIR="images"

for file in "$DIR"/*; do
    echo "${GREEN}----------------------------------------------------------------------------------------------${NC}\n"
    echo "Processing: $file\n\n"
    output=$(node api.js $file)
    # echo "\n\nTAGS: $output"
    # tag -a "$output" $file
    # tag -r "*" $file
done

for file in "$DIR"/*; do echo $file; done