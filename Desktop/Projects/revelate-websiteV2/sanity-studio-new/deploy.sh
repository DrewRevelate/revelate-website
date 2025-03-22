#!/bin/bash

# Make the script executable
chmod +x deploy.sh

# Build the studio
echo "Building Sanity Studio..."
npm run build

# Deploy to Sanity's servers
echo "Deploying to Sanity's servers..."
npm run deploy

echo "Deployment complete!"
echo "Your Sanity Studio is now accessible at https://revelateoperations.sanity.studio/"
