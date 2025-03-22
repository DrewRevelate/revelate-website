/**
 * Sanity Client Configuration
 * This file configures the connection to Sanity CMS
 */

// Import Sanity client libraries
const { createClient } = require("next-sanity");
const imageUrlBuilder = require('@sanity/image-url');

// Create Sanity client with your project details
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "o4fxge9p",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-03-01", // Use current date in YYYY-MM-DD format
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for faster image loading
  token: process.env.SANITY_TOKEN // Optional: For previewing drafts
});

// Set up the image URL builder
const builder = imageUrlBuilder(client);

// Helper function to generate image URLs from Sanity
const urlFor = (source) => {
  return builder.image(source);
};

module.exports = {
  client,
  urlFor
};
