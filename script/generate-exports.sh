#!/bin/bash

target_dir="./libs/ui/src/components/ui"

# Create target directory if it doesn't exist
mkdir -p "$target_dir"

# Go to the target directory
cd "$target_dir"

# Clear or create the index.ts file
> index.ts

# Generate exports for all directories
for dir in */; do
    if [ -d "$dir" ]; then
        # Remove trailing slash
        dir_name=${dir%/}
        # Skip hidden directories
        if [[ ! "$dir_name" == .* ]]; then
            echo "export * from './$dir_name';" >> index.ts
        fi
    fi
done

echo "Generated exports in $target_dir/index.ts"

