/**
 * Revelate Operations - Main Server
 * Root server file for Vercel/Heroku deployment
 */

// Import required modules
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced security with proper CSP rules
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com', 'www.google-analytics.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'cdnjs.cloudflare.com'],
      imgSrc: ["'self'", 'data:', 'www.google-analytics.com', 'cdn.sanity.io'],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'cdnjs.cloudflare.com'],
      connectSrc: ["'self'", 'www.google-analytics.com', '*.api.sanity.io'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  xssFilter: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  }
};

// Basic middleware for all environments
app.use(helmet(helmetConfig));
app.use(compression());

// Middleware to handle URLs
app.use((req, res, next) => {
  // Normalize trailing slashes
  if (req.path.length > 1 && req.path.endsWith('/')) {
    return res.redirect(301, req.path.slice(0, -1));
  }
  
  // Handle .html extension removal
  if (req.path.endsWith('.html')) {
    return res.redirect(301, req.path.slice(0, -5));
  }
  
  next();
});

// Serve static files with appropriate caching
const staticOptions = {
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    const hashRegExp = /\.[0-9a-f]{8}\.(css|js|jpg|png|gif|svg)$/;
    if (hashRegExp.test(path)) {
      // If the file has a hash in filename, cache for a year
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else {
      // Otherwise, cache for a day
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
};

// Serve all static files directly from the project root
app.use(express.static(__dirname, staticOptions));

// Routes for specific directories
app.use('/images', express.static(path.join(__dirname, 'images'), staticOptions));
app.use('/css', express.static(path.join(__dirname, 'css'), staticOptions));
app.use('/js', express.static(path.join(__dirname, 'js'), staticOptions));
app.use('/assets', express.static(path.join(__dirname, 'assets'), staticOptions));

// Root route for index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback route for all HTML pages
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const htmlFile = path.join(__dirname, `${page}.html`);
  
  // Check if the HTML file exists
  try {
    if (require('fs').existsSync(htmlFile)) {
      return res.sendFile(htmlFile);
    }
    next();
  } catch (e) {
    next();
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// For Vercel serverless deployment
if (process.env.VERCEL) {
  // Export the Express app for Vercel
  module.exports = app;
} else {
  // Start the server in non-Vercel environments
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
