#!/bin/bash

# Deploy script for RevelateOps Client Portal

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

# 5. Prompt for commit message
echo -e "\n${YELLOW}Enter commit message:${NC}"
read commit_message

# 6. Commit changes
echo -e "\n${YELLOW}Committing changes...${NC}"
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

# 9. Open the website
echo -e "\n${YELLOW}Would you like to open the website? (y/n)${NC}"
read open_website
if [ "$open_website" = "y" ] || [ "$open_website" = "Y" ]; then
  echo -e "\n${YELLOW}Opening website...${NC}"
  open "https://client-portal-nine.vercel.app/"
fi

echo -e "\n${GREEN}Deployment process completed.${NC}"
