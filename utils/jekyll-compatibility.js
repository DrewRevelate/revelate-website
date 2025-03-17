/**
 * Jekyll Compatibility Middleware
 * 
 * This middleware helps maintain compatibility with Jekyll-style routes,
 * enabling the site to work with both the old and new URL patterns.
 */

const path = require('path');
const fs = require('fs');

// Map of Jekyll routes to their corresponding file paths
const jekyllRouteMap = {
  // Main pages
  '/about/': '/about.html',
  '/services/': '/services.html',
  '/approach/': '/approach.html',
  '/assessment/': '/assessment.html',
  '/contact/': '/contact.html',
  
  // Case studies
  '/case-studies/': '/case-studies/index.html',
  
  // Any special project pages
  '/projects/': '/projects/index.html',
  
  // Blog/posts routes if they exist
  '/posts/': '/posts/index.html',
};

/**
 * Middleware that handles Jekyll-style routes
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
function jekyllCompatibilityMiddleware(req, res, next) {
  const url = req.url;
  
  // Check if this is a Jekyll-style route
  if (jekyllRouteMap[url]) {
    const filePath = path.join(process.cwd(), jekyllRouteMap[url]);
    
    // Check if the mapped file exists
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  
  // Handle directory-style routes (with trailing slash)
  if (url.endsWith('/') && url !== '/') {
    const directoryIndexPath = path.join(process.cwd(), url.slice(0, -1) + '.html');
    
    // Check if there's a direct HTML file matching the route
    if (fs.existsSync(directoryIndexPath)) {
      return res.sendFile(directoryIndexPath);
    }
    
    // Check if there's an index.html in the directory
    const indexPath = path.join(process.cwd(), url, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  
  // If not handled, proceed to next middleware
  next();
}

module.exports = jekyllCompatibilityMiddleware;