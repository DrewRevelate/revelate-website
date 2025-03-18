#!/bin/bash

# Exit on error
set -e

echo "==================== REVELATE OPERATIONS DEPLOYMENT ===================="

# Define environment
if [ "$1" == "production" ]; then
  ENVIRONMENT="production"
  HEROKU_APP="revelate-operations"
  GIT_BRANCH="main"
else
  ENVIRONMENT="staging"
  HEROKU_APP="revelate-operations-staging"
  GIT_BRANCH="staging"
fi

echo "Deploying to $ENVIRONMENT environment ($HEROKU_APP)..."

# Verify we're on the right branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "$GIT_BRANCH" ]; then
  echo "Error: You're on branch $CURRENT_BRANCH, but deploying to $ENVIRONMENT requires being on $GIT_BRANCH branch."
  echo "Please checkout the correct branch and try again."
  exit 1
fi

# Make sure we have the latest code
echo "Pulling latest changes from origin/$GIT_BRANCH..."
git pull origin $GIT_BRANCH

# Run linting and tests
echo "Running linting checks..."
npm run lint

if [ "$ENVIRONMENT" == "production" ]; then
  # Optimize assets for production
  echo "Optimizing assets for production deployment..."
  npm run build-assets
  npm run optimize-images
fi

# Add all changes to git
echo "Adding files to git..."
git add .

# Commit changes if there are any
git diff --staged --quiet || git commit -m "Deploy to $ENVIRONMENT - $(date '+%Y-%m-%d %H:%M:%S')"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin $GIT_BRANCH

# Deploy to Heroku
echo "Deploying to Heroku ($HEROKU_APP)..."
git push https://git.heroku.com/$HEROKU_APP.git $GIT_BRANCH:main

# Run database migrations on Heroku
echo "Setting up database on Heroku..."
heroku run npm run setup-db --app $HEROKU_APP

# Clear Heroku cache if needed
if [ "$2" == "clear-cache" ]; then
  echo "Clearing Heroku cache..."
  heroku plugins:install heroku-repo
  heroku repo:purge_cache --app $HEROKU_APP
  heroku restart --app $HEROKU_APP
fi

echo "===================================================================="
echo "✅ Deployment to $ENVIRONMENT completed successfully!"
echo "Visit the application at: https://$HEROKU_APP.herokuapp.com"
echo "===================================================================="