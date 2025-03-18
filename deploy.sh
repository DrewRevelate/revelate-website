#!/bin/bash

# Add all changes to git
echo "Adding files to git..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Update Express.js website architecture

- Improve Express.js implementation with EJS templates
- Optimize PostgreSQL database integration
- Update API endpoints for data submission
- Enhance routing system and static file serving
- Refine deployment configuration for Heroku"

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