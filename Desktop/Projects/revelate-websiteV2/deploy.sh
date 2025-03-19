#!/bin/bash

# Revelate Operations Website Deployment Script
# This script deploys the website to both GitHub and Heroku

echo "🚀 Starting deployment process for Revelate Operations website..."

# Step 1: Make sure we have the latest code
echo "📥 Ensuring we have the latest code..."
git add .
git status

echo "💬 Enter commit message:"
read commit_message

# Step 2: Commit changes
echo "💾 Committing changes: $commit_message"
git commit -m "$commit_message"

# Step 3: Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

# Step 4: Deploy to Heroku
echo "🚀 Deploying to Heroku..."
git push heroku main

# Step 5: Open the website
echo "🌐 Opening the deployed website..."
heroku open

echo "✅ Deployment complete! The website is now live."
echo "📊 To check Heroku logs, run: heroku logs --tail"
