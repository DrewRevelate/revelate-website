# Setting Up Sanity CMS for Revelate Operations

This guide will help you set up Sanity CMS to manage images and other content for your Revelate Operations website.

## Quick Start

1. Navigate to the Sanity Studio directory:
   ```bash
   cd sanity-studio-new
   ```

2. Run the installation script:
   ```bash
   ./install.sh
   ```

3. Use the Sanity Studio at http://localhost:3333 to add images and other content

4. When ready, deploy the studio:
   ```bash
   ./deploy.sh
   ```

## Adding Drew's Photo

1. In the Sanity Studio, create a new "Website Images" document
2. Fill in the following details:
   - **Name**: "Drew Lambert Team Photo"
   - **Category**: "About Page"
   - **Identifier**: "team-drew-lambert"
   - **Image**: Upload Drew's photo
   - **Alt Text**: "Drew Lambert, Co-Founder & SaaS Expert at Revelate Operations"

## Setting Up a Webhook to Update Your Website

1. Get a Vercel Deploy Hook URL:
   - Go to your Vercel project dashboard
   - Navigate to Settings > Git > Deploy Hooks
   - Create a hook named "Sanity Content Update"
   - Copy the generated URL

2. Set up a webhook in Sanity:
   - Go to sanity.io/manage
   - Select your project
   - Navigate to API > Webhooks
   - Click "Add webhook"
   - Name it "Vercel Deploy"
   - Paste the Vercel Deploy Hook URL
   - Set it to trigger on "Create" and "Update" events
   - Set a filter for the document types you want to trigger a deploy (e.g., `_type == "siteImages"`)

3. Test the webhook:
   - Make a change to a document in Sanity Studio
   - Check if your website automatically rebuilds with the new content

## Using Sanity Images in Your Website

To fetch and display images from Sanity in your website, you'll use the Sanity client and image URL builder:

```javascript
// Example code for fetching an image in your Express.js application
const { client, urlFor } = require('./src/sanity/client');

// Fetch a specific image by identifier
async function getImageUrl(identifier, options = {}) {
  const query = `*[_type == "siteImages" && identifier == $identifier][0]`;
  const image = await client.fetch(query, { identifier });
  
  if (!image) return null;
  
  // Build the image URL with options
  return urlFor(image.image).url();
}
```

## Troubleshooting

- If the Sanity Studio doesn't load, check that your projectId is correct
- If images don't appear on your website, verify that the Sanity client is properly configured
- If webhooks aren't triggering, check the webhook logs in the Sanity dashboard
