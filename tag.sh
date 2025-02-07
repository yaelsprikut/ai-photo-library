#!/bin/bash
SECONDS=0 # Start tracking time
CYAN='\033[1;36m'
GREEN='\033[1;32m'
NC='\033[0m'
YELLOW='\033[1;33m'
DIR="images/Screenshots"

remove_tags() {
    tag -r "*" "$1"
}

rename_file() {
    local file="$1"

    # Check if file exists
    if [[ ! -f "$file" ]]; then
        echo "❌ Error: File '$file' not found!"
        return 1
    fi

    # Generate a new filename by replacing spaces with underscores
    local new_file="${file// /_}"

    # If the new filename is the same, do nothing
    if [[ "$file" == "$new_file" ]]; then
        echo "✅ No spaces found in '$file'"
        return 0
    fi

    # Rename the file
    mv "$file" "$new_file"
    echo "✅ Renamed: '$file' → '$new_file'"
}

for file in "$DIR"/*; do
    echo "${CYAN}----------------------------------------------------------------------------------------------${NC}\n"
    echo "Processing: $file\n"

    TAGS=$(tag -l "$file" | awk -v var="$file" '{gsub(var, ""); print}')

    if [[ "$file" =~ \  ]]; then
        echo "❌ $file contains spaces - skipping..."
        rename_file "$file"
    elif [[ -d "$file" ]]; then
        echo "❌ '$file' is a directory - skipping..."
    else
        if [[ -z "$TAGS" ]]; then
            echo "❌ No tags found for $file - proceed with tagging"
            node --no-warnings api.js "$file"
        else
            echo "🏷️ Tags already exist! $TAGS"
        fi
    fi
    remove_tags "$file"
done

echo "${GREEN}----------------------------------------------------------------------------------------------${NC}\n"
echo "Script duration: $SECONDS seconds"
