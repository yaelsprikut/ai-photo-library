#!/bin/bash

# tag -a "Work, Urgent" /path/to/file.txt
TAGS=$(node api.js)

echo "TAGS"
echo $TAGS
tag -a "$TAGS" images/mirvish.jpg
