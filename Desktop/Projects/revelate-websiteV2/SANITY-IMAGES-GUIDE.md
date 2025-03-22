# Sanity Images Guide for Revelate Operations Website

This guide explains how to add and use images from Sanity CMS on your website.

## Adding Images to Sanity

1. **Access your Sanity Studio**:
   - Go to https://revelateoperations.sanity.studio/structure
   - Log in with your credentials

2. **Create a new "Website Images" document**:
   - Click the "Create new document" button
   - Select "Website Images" from the options
   - Fill in the following fields:
     - **Name**: Descriptive name for the image (e.g., "Team Member Photo - Drew Lambert")
     - **Category**: Select the appropriate category (e.g., "About Page")
     - **Identifier**: A unique ID to reference this image in code (e.g., "team-drew-lambert")
     - **Image**: Upload the image file
     - **Alt Text**: Descriptive text for accessibility and SEO
     - **Caption**: (Optional) Caption to display with the image
     - **Dark Mode Variant**: (Optional) Alternative version for dark mode

3. **Save the document**

## Using Sanity Images on Your Website

### Method 1: HTML Data Attributes

Add data attributes to your `<img>` tags to automatically load images from Sanity:

```html
<img 
  src="images/fallback.jpg" 
  alt="Description" 
  data-sanity-id="your-image-identifier" 
  data-sanity-width="600"
>
```

The `sanity-image-loader.js` script will automatically replace these images with their Sanity versions.

### Method 2: Using the Sanity API in JavaScript

You can also fetch and use Sanity images programmatically in your JavaScript code:

```javascript
// Example of loading a Sanity image dynamically
SanityImageLoader.fetchImageUrl('your-image-identifier')
  .then(imageUrl => {
    if (imageUrl) {
      document.getElementById('your-image-element').src = imageUrl;
    }
  });
```

## Common Image Identifiers

Here's a list of image identifiers currently used on the website:

| Identifier | Description | Page |
|------------|-------------|------|
| team-drew-lambert | Drew Lambert's profile photo | About |
| team-melanie-tummino | Melanie Tummino's profile photo | About |
| home-hero | Homepage hero image | Home |
| logo-light | Company logo (light version) | All pages |
| logo-dark | Company logo (dark version) | All pages |

## Troubleshooting

If images aren't loading from Sanity:

1. **Check the console**: Open browser developer tools and look for errors
2. **Verify the identifier**: Make sure the identifier in your HTML matches exactly what's in Sanity
3. **Check your Internet connection**: Sanity images require an active connection
4. **Clear your browser cache**: Old cached images might be displayed instead of new Sanity images

## Setting Up Webhooks (Automatic Deployment)

When you update images in Sanity, your website can automatically update:

1. **Get a Vercel Deploy Hook URL**:
   - Go to your Vercel project dashboard
   - Navigate to Settings > Git > Deploy Hooks
   - Create a hook named "Sanity Content Update"
   - Copy the generated URL

2. **Set up a webhook in Sanity**:
   - Go to sanity.io/manage
   - Select your project
   - Navigate to API > Webhooks
   - Click "Add webhook"
   - Name it "Vercel Deploy"
   - Paste the Vercel Deploy Hook URL
   - Set it to trigger on "Create" and "Update" events
   - Set a filter for siteImages document type: `_type == "siteImages"`
