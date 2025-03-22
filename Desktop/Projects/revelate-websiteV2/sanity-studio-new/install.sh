#!/bin/bash

# Make the script executable
chmod +x install.sh

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the development server
echo "Starting Sanity Studio development server..."
echo "You can access it at http://localhost:3333"
echo "Use this to add images to your website"
npm run dev
