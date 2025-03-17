#!/bin/bash

# Create a backup directory
mkdir -p ./backup

# Backup Jekyll files before removing
echo "Creating backup of Jekyll files..."
cp -r _config.yml Gemfile Gemfile.lock Rakefile _includes _layouts ./backup/
cp -r temp-backup ./backup/

# Remove Jekyll specific files
echo "Removing Jekyll specific files..."
rm -f _config.yml Gemfile Gemfile.lock Rakefile
rm -rf _includes _layouts _site

# Remove temp files and backups
echo "Removing temporary files..."
rm -rf temp-backup branch-consolidation

# Check if each HTML file has been migrated to EJS
# and move to backup if so
echo "Checking and moving HTML files..."
for file in about.html approach.html assessment.html contact.html services.html footer.html
do
  if [ -f "$file" ]; then
    echo "Moving $file to backup..."
    mv "$file" ./backup/
  fi
done

# Remove old Jekyll posts
echo "Removing Jekyll posts..."
mv posts ./backup/

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file from example..."
  cp .env.example .env
fi

echo "Cleanup complete!"