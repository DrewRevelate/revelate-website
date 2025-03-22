#!/bin/bash

# Make this script executable
chmod +x deploy-to-github.sh

echo "===== Deploying Revelate Website to GitHub ====="

# Check if there are changes to commit
if [[ -z $(git status -s) ]]; then
  echo "No changes to deploy."
  exit 0
fi

# Ask for commit message
echo "Enter a commit message:"
read commit_message

# If no message provided, use default
if [[ -z "$commit_message" ]]; then
  commit_message="Update website with Sanity integration"
fi

# Add all changes
echo "Adding changes to git..."
git add .

# Commit changes
echo "Committing changes with message: $commit_message"
git commit -m "$commit_message"

# Push to GitHub main branch
echo "Pushing to GitHub main branch..."
git push origin main

echo "===== Deployment complete! ====="
echo "Changes pushed to GitHub. Vercel should automatically rebuild your site."
