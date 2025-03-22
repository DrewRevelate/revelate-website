#!/bin/bash

# Make this script executable
chmod +x deploy-vercel.sh

echo "===== Deploying Revelate Website to Vercel ====="

# Add all changes
echo "Adding changes to git..."
git add .

# Commit changes
echo "Committing changes with message: Fix Vercel deployment configuration"
git commit -m "Fix Vercel deployment configuration"

# Push to GitHub main branch
echo "Pushing to GitHub main branch..."
git push origin main

echo "===== Deployment initiated! ====="
echo "Changes pushed to GitHub. Vercel should automatically rebuild your site."
echo ""
echo "If this deployment fails, consider these alternatives:"
echo ""
echo "1. Deploy directly using the Vercel CLI:"
echo "   npm install -g vercel"
echo "   vercel"
echo ""
echo "2. Or manually deploy from the Vercel dashboard:"
echo "   - Go to vercel.com"
echo "   - Import your GitHub repository"
echo "   - Set the framework preset to 'Other'"
echo "   - Set the Build Command to 'npm run vercel-build'"
echo "   - Set the Output Directory to '.'"
echo ""
echo "3. OR consider switching to Netlify, which has better support for static sites:"
echo "   - Sign up at netlify.com"
echo "   - Import your GitHub repository"
echo "   - No build command needed for static sites"
echo ""
echo "After deployment succeeds, follow the Sanity integration steps in SANITY-IMAGES-GUIDE.md"
