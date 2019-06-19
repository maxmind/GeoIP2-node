#!/bin/bash

set -eu -o pipefail

function sanitize_paths_in {
    echo "Sanitizing paths in: $1"
    sed -i -E 's%(^|[^a-zA-Z0-9:/])/[^>"]+/GeoIP2-node/%\1GeoIP2-node/%g' $1
}

for path in $(find docs -name *.html); do
    if grep -qE '[^a-zA-Z0-9:/]/[^>"]+/GeoIP2-node/' $path; then
       sanitize_paths_in $path
    fi
done
