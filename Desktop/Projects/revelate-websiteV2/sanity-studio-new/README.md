# Revelate Operations Sanity Studio

This is a minimal Sanity Studio setup for managing images on the Revelate Operations website.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Deploy to Sanity:
   ```bash
   npm run deploy
   ```

## Adding Images

Use the "Website Images" document type to add images to your website. Each image should have:

- A descriptive name
- A category (to organize images by section)
- A unique identifier (used to reference the image in code)
- The image file
- Alt text for accessibility

## Using with Your Website

After uploading images to Sanity, you can use the Sanity client in your website code to fetch and display them. Make sure to set up a webhook to automatically rebuild your site when content changes.
