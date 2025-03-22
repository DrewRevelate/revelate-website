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
echo ""
echo "Note: If deployment fails, check the Vercel logs. The configuration has been updated"
echo "to fix Next.js vs Express.js compatibility issues."
echo ""
echo "Key files added:"
echo "- vercel.json - Configures Vercel deployment"
echo "- next.config.js - Placeholder for Next.js compatibility"
echo "- pages/index.js - Placeholder to satisfy Next.js"
echo "- static.json - Configuration for static file hosting"
echo "- Updated package.json with proper build scripts"
