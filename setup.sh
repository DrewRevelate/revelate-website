#!/bin/bash

# Revelate Operations - Setup Script
# This script helps set up the Express.js application for development

# Set script to exit immediately if any command fails
set -e

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}======================================${NC}"
echo -e "${YELLOW}   Revelate Operations Setup Script    ${NC}"
echo -e "${YELLOW}======================================${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js and try again.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm and try again.${NC}"
    exit 1
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

# Step 2: Move static assets
echo -e "\n${GREEN}Step 2: Moving static assets...${NC}"
node src/scripts/move-assets.js
echo -e "${GREEN}✓ Static assets moved${NC}"

# Step 3: Set up environment variables
echo -e "\n${GREEN}Step 3: Setting up environment variables...${NC}"
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    echo "PORT=3000" > .env
    echo "NODE_ENV=development" >> .env
    
    # Ask for PostgreSQL connection details
    read -p "Enter PostgreSQL username [postgres]: " db_username
    db_username=${db_username:-postgres}
    
    read -p "Enter PostgreSQL password: " db_password
    
    read -p "Enter PostgreSQL host [localhost]: " db_host
    db_host=${db_host:-localhost}
    
    read -p "Enter PostgreSQL port [5432]: " db_port
    db_port=${db_port:-5432}
    
    read -p "Enter PostgreSQL database name [revelate]: " db_name
    db_name=${db_name:-revelate}
    
    echo "DATABASE_URL=postgres://$db_username:$db_password@$db_host:$db_port/$db_name" >> .env
    
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${YELLOW}⚠️ .env file already exists. Skipping...${NC}"
    echo "You can edit the .env file manually if needed."
fi

# Step 4: Set up the database
echo -e "\n${GREEN}Step 4: Setting up the database...${NC}"
echo -e "${YELLOW}Note: Make sure PostgreSQL is running and the database exists.${NC}"
read -p "Do you want to run the database setup script? (y/n): " setup_db

if [[ $setup_db == "y" || $setup_db == "Y" ]]; then
    echo "Running database setup script..."
    node src/scripts/setup-db.js
else
    echo -e "${YELLOW}Skipping database setup.${NC}"
    echo "You can run the database setup script later with: npm run setup-db"
fi

# Step 5: Make deploy script executable
echo -e "\n${GREEN}Step 5: Making deploy script executable...${NC}"
chmod +x deploy.sh
echo -e "${GREEN}✓ deploy.sh is now executable${NC}"

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}  Setup completed successfully!          ${NC}"
echo -e "${GREEN}=========================================${NC}\n"

echo -e "Next steps:"
echo -e "1. Start the development server with: ${YELLOW}npm run dev${NC}"
echo -e "2. Deploy to GitHub and Heroku with: ${YELLOW}./deploy.sh${NC}"
echo -e "3. Visit your local site at: ${YELLOW}http://localhost:3000${NC}"

exit 0
