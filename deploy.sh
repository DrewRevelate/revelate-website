#!/bin/bash

# Revelate Operations - Deployment Script
# This script helps deploy the website to GitHub and Heroku

# Set script to exit immediately if any command fails
set -e

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}======================================${NC}"
echo -e "${YELLOW}   Revelate Operations Deployment     ${NC}"
echo -e "${YELLOW}======================================${NC}\n"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Please install git and try again.${NC}"
    exit 1
fi

# Check if heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo -e "${YELLOW}Warning: Heroku CLI is not installed. You won't be able to deploy to Heroku from this script.${NC}"
    HEROKU_INSTALLED=false
else
    HEROKU_INSTALLED=true
fi

# Verify we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "server.js" ]; then
    echo -e "${RED}Error: package.json or server.js not found.${NC}"
    echo -e "${RED}Make sure you're running this script from the root of your project.${NC}"
    exit 1
fi

# Step 1: Install dependencies
echo -e "\n${GREEN}Step 1: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 2: Git operations
echo -e "\n${GREEN}Step 2: Setting up Git repository...${NC}"

# Check if .git directory exists
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
fi

echo "Adding files to Git..."
git add .

echo "Committing changes..."
read -p "Enter commit message [Deploy to GitHub and Heroku]: " commit_message
commit_message=${commit_message:-"Deploy to GitHub and Heroku"}
git commit -m "$commit_message"

echo -e "${GREEN}✓ Git setup complete${NC}"

# Step 3: GitHub push
echo -e "\n${GREEN}Step 3: Pushing to GitHub...${NC}"
read -p "Enter GitHub repository URL (e.g., git@github.com:username/repo.git): " github_url

if [ -z "$github_url" ]; then
    echo -e "${RED}Error: GitHub URL is required.${NC}"
    exit 1
fi

# Check if remote exists
if git remote | grep -q "^origin$"; then
    echo "Remote 'origin' already exists. Updating URL..."
    git remote set-url origin "$github_url"
else
    echo "Adding remote 'origin'..."
    git remote add origin "$github_url"
fi

echo "Pushing to GitHub..."
git push -u origin main || git push -u origin master

echo -e "${GREEN}✓ Code pushed to GitHub${NC}"

# Step 4: Heroku deployment
if [ "$HEROKU_INSTALLED" = true ]; then
    echo -e "\n${GREEN}Step 4: Deploying to Heroku...${NC}"
    read -p "Enter Heroku app name (leave empty to skip Heroku deployment): " heroku_app

    if [ -n "$heroku_app" ]; then
        # Check if Heroku remote exists
        if heroku apps:info --app "$heroku_app" &> /dev/null; then
            echo "Heroku app '$heroku_app' exists."
            
            # Check if Heroku remote exists
            if git remote | grep -q "^heroku$"; then
                echo "Remote 'heroku' already exists. Updating URL..."
                git remote set-url heroku "https://git.heroku.com/$heroku_app.git"
            else
                echo "Adding Heroku remote..."
                git remote add heroku "https://git.heroku.com/$heroku_app.git"
            fi
            
            echo "Pushing to Heroku..."
            git push heroku main || git push heroku master
            
            echo "Running database setup..."
            heroku run npm run setup-db --app "$heroku_app"
            
            echo -e "${GREEN}✓ Deployed to Heroku${NC}"
        else
            echo -e "${YELLOW}Heroku app '$heroku_app' does not exist.${NC}"
            read -p "Do you want to create it? (y/n): " create_app
            
            if [[ $create_app == "y" || $create_app == "Y" ]]; then
                echo "Creating Heroku app..."
                heroku create "$heroku_app"
                
                echo "Adding PostgreSQL add-on..."
                heroku addons:create heroku-postgresql:hobby-dev --app "$heroku_app"
                
                echo "Pushing to Heroku..."
                git push heroku main || git push heroku master
                
                echo "Running database setup..."
                heroku run npm run setup-db --app "$heroku_app"
                
                echo -e "${GREEN}✓ Created and deployed to Heroku${NC}"
            else
                echo -e "${YELLOW}Skipping Heroku deployment.${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}Skipping Heroku deployment.${NC}"
    fi
else
    echo -e "\n${YELLOW}Step 4: Skipping Heroku deployment (Heroku CLI not installed)${NC}"
fi

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}  Deployment completed successfully!     ${NC}"
echo -e "${GREEN}=========================================${NC}\n"

echo -e "Next steps:"
echo -e "1. Verify your website on GitHub: https://github.com/DrewRevelate/revelate-website"
if [ "$HEROKU_INSTALLED" = true ] && [ -n "$heroku_app" ]; then
    echo -e "2. Check your Heroku deployment: https://$heroku_app.herokuapp.com"
fi
echo -e "${YELLOW}Note: You may need to configure environment variables in Heroku dashboard.${NC}"

exit 0
