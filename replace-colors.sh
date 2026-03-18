#!/bin/bash

# Replace all color references in all tsx files
find d:/Optimus-manpower/frontend/src -name "*.tsx" -type f | while read file; do
  sed -i 's/text-primary\/35/text-gray-medium/g' "$file"
  sed -i 's/text-primary\/25/text-gray-light/g' "$file"
  sed -i 's/text-primary\/15/text-gray-light/g' "$file"
  sed -i 's/text-primary\/10/text-gray-light/g' "$file"
  sed -i 's/text-primary\/[0-9]\+/text-gray-medium/g' "$file"
  sed -i 's/bg-accent\/20/bg-black\/10/g' "$file"
  sed -i 's/bg-accent\/15/bg-black\/10/g' "$file"
done

echo "Color replacements completed!"
