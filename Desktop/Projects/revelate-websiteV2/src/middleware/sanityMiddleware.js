/**
 * Sanity Middleware
 * Adds Sanity data and helper functions to all routes
 */

const { getImageUrl, getImageData, getImagesByCategory } = require('../utils/sanityUtils');

/**
 * Middleware to add Sanity utilities to all requests
 */
function sanityMiddleware(req, res, next) {
  // Add image helpers to res.locals to make them available in all views
  res.locals.sanity = {
    // Async function to get image URL by identifier
    getImageUrl: async (identifier, options = {}) => {
      return await getImageUrl(identifier, options);
    },
    
    // Async function to get full image data by identifier
    getImageData: async (identifier, includeDarkMode = false) => {
      return await getImageData(identifier, includeDarkMode);
    },
    
    // Async function to get images by category
    getImagesByCategory: async (category, includeDarkMode = false) => {
      return await getImagesByCategory(category, includeDarkMode);
    },
    
    // Helper function to create srcset for responsive images
    // This generates multiple URLs at different sizes for different devices
    createSrcSet: (imageUrl, sizes = [300, 600, 1200, 1800]) => {
      if (!imageUrl) return '';
      
      // Parse the URL to extract the base and parameters
      const urlObj = new URL(imageUrl);
      const baseUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
      
      // Generate srcset with specified sizes
      return sizes.map(size => {
        // Only modify the width parameter
        const params = new URLSearchParams(urlObj.search);
        params.set('w', size.toString());
        
        return `${baseUrl}?${params.toString()} ${size}w`;
      }).join(', ');
    },
    
    // Add a placeholder function for when images are loading
    getPlaceholder: (width = 400, height = 300) => {
      return `https://via.placeholder.com/${width}x${height}?text=Loading...`;
    }
  };
  
  next();
}

module.exports = sanityMiddleware;
