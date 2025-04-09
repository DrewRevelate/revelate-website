#!/bin/bash

# Deploy script for RevelateOps Client Portal

# Change to the project directory
cd /Users/drewlambert/Desktop/Projects/clientPortal-main

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment of RevelateOps Client Portal...${NC}"

# 1. Run linting and type checking
echo -e "\n${YELLOW}Running TypeScript checks and linting...${NC}"
npm run lint
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Linting failed. Please fix the issues before deploying.${NC}"
  exit 1
fi

# 2. Run tests (if available)
if [ -f "package.json" ] && grep -q "\"test\":" "package.json"; then
  echo -e "\n${YELLOW}Running tests...${NC}"
  npm test
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Tests failed. Please fix the failing tests before deploying.${NC}"
    exit 1
  fi
fi

# 3. Build the application
echo -e "\n${YELLOW}Building application...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Build failed. Please fix the build issues before deploying.${NC}"
  exit 1
fi

# 4. Stage all changes
echo -e "\n${YELLOW}Staging changes for commit...${NC}"
git add .

# 5. Use predefined commit message
commit_message="Optimize client portal: Fix dashboard merge conflicts, implement server components, improve performance tracking"

# 6. Commit changes
echo -e "\n${YELLOW}Committing changes with message:${NC} $commit_message"
git commit -m "$commit_message"
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Git commit failed.${NC}"
  exit 1
fi

# 7. Push to GitHub
echo -e "\n${YELLOW}Pushing to GitHub...${NC}"
git push origin main
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Git push failed.${NC}"
  exit 1
fi

# 8. Success message
echo -e "\n${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}The changes have been pushed to the GitHub repository.${NC}"
echo -e "${GREEN}Vercel should automatically deploy the changes.${NC}"

echo -e "\n${GREEN}Deployment process completed.${NC}"
