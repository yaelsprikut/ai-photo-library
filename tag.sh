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
    echo "Processing: $file\n"

    TAGS=$(tag -l "$file" | awk -v var="$file" '{gsub(var, ""); print}')

    if [[ "$file" =~ \  ]]; then
        echo "❌ $file contains spaces - skipping..."
    else
        if [[ -z "$TAGS" ]]; then
            echo "❌ No tags found for $file - proceed with tagging"
            node --no-warnings api.js "$file"
        else
            echo "🏷️ Tags already exist! $TAGS"
        fi
    fi
    # remove_tags "$file"
done

echo "${GREEN}----------------------------------------------------------------------------------------------${NC}\n"
echo "Script duration: $SECONDS seconds"
