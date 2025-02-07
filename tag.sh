#!/bin/bash
SECONDS=0 # Start tracking time
CYAN='\033[1;36m'
GREEN='\033[1;32m'
NC='\033[0m'
DIR="images"

remove_tags() {
    tag -r "*" "$1"
}

for file in "$DIR"/*; do
    echo "${CYAN}----------------------------------------------------------------------------------------------${NC}\n"
    echo "Processing: $file\n\n"
    TAGS=$(tag -l "$file")
    if [[ "$TAGS" ]]; then
        echo "Image already tagged with $TAGS" && continue
    fi


    # node --no-warnings api.js "$file"
    # remove_tags "$file"
done

echo "${GREEN}----------------------------------------------------------------------------------------------${NC}\n"
echo "Script duration: $SECONDS seconds"
