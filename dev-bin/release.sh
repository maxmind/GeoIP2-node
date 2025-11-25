#!/bin/bash

set -eu -o pipefail

# Check that we're not on the main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" = "main" ]; then
    echo "Error: Releases should not be done directly on the main branch."
    echo "Please create a release branch and run this script from there."
    exit 1
fi

# Fetch latest changes and check that we're not behind origin/main
echo "Fetching from origin..."
git fetch origin

if ! git merge-base --is-ancestor origin/main HEAD; then
    echo "Error: Current branch is behind origin/main."
    echo "Please merge or rebase with origin/main before releasing."
    exit 1
fi

changelog=$(cat CHANGELOG.md)

# GeoIP2-node format: "6.3.0 (2025-11-20)" followed by "---"
regex='([0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+)?) \(([0-9]{4}-[0-9]{2}-[0-9]{2})\)'

if [[ ! $changelog =~ $regex ]]; then
    echo "Could not find version/date in CHANGELOG.md!"
    exit 1
fi

version="${BASH_REMATCH[1]}"
date="${BASH_REMATCH[3]}"

# Extract release notes: everything after the "---" line until the next version header
notes=$(awk -v ver="$version" '
    $0 ~ "^" ver " \\(" { found=1; next }
    found && /^-+$/ { in_notes=1; next }
    in_notes && /^[0-9]+\.[0-9]+\.[0-9]+.* \([0-9]{4}-[0-9]{2}-[0-9]{2}\)/ { exit }
    in_notes { print }
' CHANGELOG.md | sed -e :a -e '/^\n*$/{$d;N;ba' -e '}')

if [[ "$date" != "$(date +"%Y-%m-%d")" ]]; then
    echo "Release date $date is not today ($(date +"%Y-%m-%d"))!"
    exit 1
fi

tag="v$version"

if [ -n "$(git status --porcelain)" ]; then
    echo "Working directory is not clean." >&2
    exit 1
fi

# Update version in package.json
current_version=$(node -p "require('./package.json').version")
if [ "$current_version" != "$version" ]; then
    echo "Updating version in package.json from $current_version to $version..."
    npm version "$version" --no-git-tag-version
fi

# Build and test
echo "Running build and tests..."
npm ci
npm run build
npm test
npm run lint

echo $'\nDiff:'
git diff

echo $'\nRelease notes:'
echo "$notes"

read -e -p "Commit changes and create release? (y/n) " should_continue

if [ "$should_continue" != "y" ]; then
    echo "Aborting"
    exit 1
fi

git commit -m "Prepare for $version" -a

git push

gh release create --target "$(git branch --show-current)" -t "$version" -n "$notes" "$tag"

echo ""
echo "Release $tag created successfully!"
echo "The GitHub Actions workflow will now publish to npm."
echo "Monitor the release at: https://github.com/maxmind/GeoIP2-node/actions"
