#!/bin/bash

# Make scripts executable
chmod +x cleanup.sh

# Run cleanup script
./cleanup.sh

# Add all changes to git
echo "Adding files to git..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Convert from Jekyll to Express.js architecture

- Complete rebuild of website with Node.js and Express
- Add database integration for contact form and assessment
- Implement API endpoints for data submission
- Create EJS templating system with layouts
- Optimize deployment configuration for Heroku"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

# Deploy to Heroku
echo "Deploying to Heroku..."
git push heroku main

# Run database setup on Heroku
echo "Setting up database on Heroku..."
heroku run npm run setup-db --app revelate-operations

echo "Deployment complete!"