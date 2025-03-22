/**
 * Revelate Operations - Sanity Image Loader
 * Handles loading and displaying images from Sanity CMS
 */

const SanityImageLoader = {
  // Sanity project configuration
  config: {
    projectId: 'o4fxge9p',
    dataset: 'production',
    apiVersion: '2024-03-22'
  },
  
  /**
   * Initialize the image loader
   */
  init: function() {
    // Look for all images with data-sanity-id attribute
    const sanityImages = document.querySelectorAll('[data-sanity-id]');
    
    if (sanityImages.length) {
      console.log(`Found ${sanityImages.length} Sanity images to load`);
      this.loadImages(sanityImages);
    }
  },
  
  /**
   * Load images from Sanity
   * @param {NodeList} imageElements - Elements with data-sanity-id attribute
   */
  loadImages: function(imageElements) {
    imageElements.forEach(img => {
      const identifier = img.getAttribute('data-sanity-id');
      if (!identifier) return;
      
      // Get options from data attributes
      const width = img.getAttribute('data-sanity-width') || null;
      const height = img.getAttribute('data-sanity-height') || null;
      const darkMode = document.body.classList.contains('dark-mode');
      
      // Fetch and apply the image
      this.fetchImageUrl(identifier, { width, height, darkMode })
        .then(imageUrl => {
          if (imageUrl) {
            // Store the original src as a fallback
            const originalSrc = img.src;
            
            // Apply the Sanity image URL
            img.src = imageUrl;
            
            // Add error handling to fall back to original image if loading fails
            img.onerror = function() {
              console.warn(`Failed to load Sanity image: ${identifier}`);
              img.src = originalSrc;
              img.onerror = null; // Prevent infinite error loop
            };
          }
        })
        .catch(error => {
          console.error(`Error loading Sanity image ${identifier}:`, error);
        });
    });
  },
  
  /**
   * Fetch an image URL from Sanity
   * @param {string} identifier - The image identifier
   * @param {Object} options - Options for the image
   * @returns {Promise<string>} - The image URL
   */
  fetchImageUrl: function(identifier, options = {}) {
    const { width, height, darkMode = false } = options;
    const { projectId, dataset, apiVersion } = this.config;
    
    // Construct the GROQ query
    const query = encodeURIComponent(`*[_type == "siteImages" && identifier == "${identifier}"][0]`);
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;
    
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        if (!data.result) {
          console.warn(`No image found with identifier: ${identifier}`);
          return null;
        }
        
        // Determine which image field to use (regular or dark mode variant)
        const imageField = darkMode && data.result.darkModeVariant ? 'darkModeVariant' : 'image';
        
        if (!data.result[imageField]) {
          console.warn(`Image field "${imageField}" not found for "${identifier}"`);
          return null;
        }
        
        // Build the image URL
        return this.buildImageUrl(data.result[imageField], { width, height });
      });
  },
  
  /**
   * Build a Sanity image URL
   * @param {Object} imageRef - The Sanity image reference
   * @param {Object} options - URL options
   * @returns {string} - The complete image URL
   */
  buildImageUrl: function(imageRef, options = {}) {
    const { width, height } = options;
    const { projectId, dataset } = this.config;
    
    // Base URL for Sanity images
    let url = `https://cdn.sanity.io/images/${projectId}/${dataset}/`;
    
    // Extract the image ID and format from the reference
    const imageParts = imageRef.asset._ref.split('-');
    const id = imageParts[1];
    const format = imageParts[imageParts.length - 1];
    
    // Build the URL with the image ID and format
    url += `${id}.${format}`;
    
    // Add query parameters for resizing if specified
    const params = [];
    if (width) params.push(`w=${width}`);
    if (height) params.push(`h=${height}`);
    if (params.length) url += `?${params.join('&')}`;
    
    return url;
  }
};

// Initialize the image loader when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  SanityImageLoader.init();
});
