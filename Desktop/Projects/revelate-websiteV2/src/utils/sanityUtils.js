/**
 * Sanity Utility Functions
 * Helper functions for working with Sanity CMS data
 */

const { client, urlFor } = require('../sanity/client');

/**
 * Get an image URL from Sanity by its identifier
 * @param {string} identifier - The unique identifier for the image
 * @param {object} options - Additional options
 * @param {boolean} options.darkMode - Whether to return the dark mode variant if available
 * @param {number} options.width - Width to resize the image to
 * @param {number} options.height - Height to resize the image to
 * @param {number} options.quality - Image quality (1-100)
 * @returns {Promise<string|null>} - The image URL or null if not found
 */
async function getImageUrl(identifier, options = {}) {
  try {
    const { darkMode = false, width, height, quality = 80 } = options;
    
    // Query Sanity for the image
    const query = `*[_type == "siteImages" && identifier == $identifier][0]`;
    const image = await client.fetch(query, { identifier });
    
    if (!image) {
      console.warn(`Image with identifier "${identifier}" not found in Sanity`);
      return null;
    }
    
    // Determine which image field to use (regular or dark mode variant)
    const imageField = darkMode && image.darkModeVariant ? 'darkModeVariant' : 'image';
    
    if (!image[imageField]) {
      console.warn(`Image field "${imageField}" not found for "${identifier}"`);
      return null;
    }
    
    // Build the URL with any sizing options
    let imageUrl = urlFor(image[imageField]);
    
    if (width) imageUrl = imageUrl.width(width);
    if (height) imageUrl = imageUrl.height(height);
    if (quality) imageUrl = imageUrl.quality(quality);
    
    return imageUrl.url();
  } catch (error) {
    console.error('Error fetching image from Sanity:', error);
    return null;
  }
}

/**
 * Get complete image data from Sanity by its identifier
 * @param {string} identifier - The unique identifier for the image
 * @param {boolean} includeDarkMode - Whether to include the dark mode variant
 * @returns {Promise<object|null>} - The image data or null if not found
 */
async function getImageData(identifier, includeDarkMode = false) {
  try {
    // Query Sanity for the image
    const query = `*[_type == "siteImages" && identifier == $identifier][0]`;
    const image = await client.fetch(query, { identifier });
    
    if (!image) {
      console.warn(`Image with identifier "${identifier}" not found in Sanity`);
      return null;
    }
    
    // Prepare the response with both the data and URLs
    const response = {
      name: image.name,
      category: image.category,
      identifier: image.identifier,
      alt: image.alt,
      caption: image.caption,
      url: urlFor(image.image).url()
    };
    
    // Add dark mode URL if requested and available
    if (includeDarkMode && image.darkModeVariant) {
      response.darkModeUrl = urlFor(image.darkModeVariant).url();
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching image data from Sanity:', error);
    return null;
  }
}

/**
 * Get multiple images from Sanity by category
 * @param {string} category - The category of images to fetch
 * @param {boolean} includeDarkMode - Whether to include dark mode variants
 * @returns {Promise<Array<object>>} - Array of image data objects
 */
async function getImagesByCategory(category, includeDarkMode = false) {
  try {
    // Query Sanity for images in the specified category
    const query = `*[_type == "siteImages" && category == $category]`;
    const images = await client.fetch(query, { category });
    
    if (!images || images.length === 0) {
      console.warn(`No images found in category "${category}"`);
      return [];
    }
    
    // Process each image
    return images.map(image => {
      const result = {
        name: image.name,
        category: image.category,
        identifier: image.identifier,
        alt: image.alt,
        caption: image.caption,
        url: urlFor(image.image).url()
      };
      
      // Add dark mode URL if requested and available
      if (includeDarkMode && image.darkModeVariant) {
        result.darkModeUrl = urlFor(image.darkModeVariant).url();
      }
      
      return result;
    });
  } catch (error) {
    console.error('Error fetching images from Sanity:', error);
    return [];
  }
}

/**
 * Fetch case studies from Sanity
 * @param {object} options - Options for fetching case studies
 * @param {boolean} options.featured - Whether to fetch only featured case studies
 * @param {number} options.limit - Number of case studies to fetch
 * @param {string} options.industry - Filter by industry
 * @param {string} options.service - Filter by service
 * @returns {Promise<Array<object>>} - Array of case study objects
 */
async function getCaseStudies(options = {}) {
  try {
    const { featured, limit, industry, service } = options;
    
    // Build the GROQ query based on options
    let query = '*[_type == "caseStudy"';
    
    // Add filters
    if (featured) query += ' && featured == true';
    if (industry) query += ` && industry == "${industry}"`;
    if (service) query += ` && "${service}" in services`;
    
    // Close the query and add ordering and limit
    query += '] | order(publishedAt desc)';
    if (limit) query += `[0...${limit}]`;
    
    // Execute the query
    const caseStudies = await client.fetch(query);
    
    // Process each case study to add image URLs
    return caseStudies.map(study => {
      return {
        ...study,
        coverImageUrl: study.coverImage ? urlFor(study.coverImage).url() : null,
        additionalImageUrls: study.additionalImages ? study.additionalImages.map(img => ({
          url: urlFor(img).url(),
          caption: img.caption,
          alt: img.alt
        })) : []
      };
    });
  } catch (error) {
    console.error('Error fetching case studies from Sanity:', error);
    return [];
  }
}

/**
 * Fetch team members from Sanity
 * @param {object} options - Options for fetching team members
 * @param {boolean} options.founders - Whether to fetch only founders
 * @param {number} options.limit - Number of team members to fetch
 * @returns {Promise<Array<object>>} - Array of team member objects
 */
async function getTeamMembers(options = {}) {
  try {
    const { founders, limit } = options;
    
    // Build the GROQ query based on options
    let query = '*[_type == "teamMember"';
    
    // Add filters
    if (founders) query += ' && isFounder == true';
    
    // Close the query and add ordering and limit
    query += '] | order(order asc)';
    if (limit) query += `[0...${limit}]`;
    
    // Execute the query
    const teamMembers = await client.fetch(query);
    
    // Process each team member to add image URLs
    return teamMembers.map(member => {
      return {
        ...member,
        photoUrl: member.photo ? urlFor(member.photo).url() : null
      };
    });
  } catch (error) {
    console.error('Error fetching team members from Sanity:', error);
    return [];
  }
}

/**
 * Fetch service cards from Sanity
 * @param {object} options - Options for fetching service cards
 * @param {boolean} options.featured - Whether to fetch only featured services
 * @param {string} options.category - Filter by category
 * @param {number} options.limit - Number of services to fetch
 * @returns {Promise<Array<object>>} - Array of service card objects
 */
async function getServiceCards(options = {}) {
  try {
    const { featured, category, limit } = options;
    
    // Build the GROQ query based on options
    let query = '*[_type == "serviceCard"';
    
    // Add filters
    if (featured) query += ' && featured == true';
    if (category) query += ` && category == "${category}"`;
    
    // Close the query and add ordering and limit
    query += '] | order(order asc)';
    if (limit) query += `[0...${limit}]`;
    
    // Execute the query
    const services = await client.fetch(query);
    
    // Process each service to add image URLs
    return services.map(service => {
      return {
        ...service,
        iconUrl: service.icon ? urlFor(service.icon).url() : null,
        coverImageUrl: service.coverImage ? urlFor(service.coverImage).url() : null
      };
    });
  } catch (error) {
    console.error('Error fetching service cards from Sanity:', error);
    return [];
  }
}

module.exports = {
  getImageUrl,
  getImageData,
  getImagesByCategory,
  getCaseStudies,
  getTeamMembers,
  getServiceCards,
  urlFor
};
