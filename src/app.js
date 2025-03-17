/**
 * Revelate Operations - Main Application
 * Express-based server for static website and API endpoints
 */

const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const apiRoutes = require('./routes/api');
const pageRoutes = require('./routes/pages');

// Import custom middleware
const ejsLayouts = require('./utils/expressEjsLayouts');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled to allow inline scripts (enable in production with proper CSP)
}));
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts()); // Add EJS layouts support

// Middleware for common redirects
app.use((req, res, next) => {
  const host = req.header('host');
  const url = req.url;
  
  // Redirect domain.com to www.domain.com for better SEO
  if (host === 'revelateops.com') {
    return res.redirect(301, `https://www.revelateops.com${url}`);
  }
  
  // Redirect URLs with .html extensions to clean URLs
  if (url.endsWith('.html')) {
    console.log(`Redirecting from: ${url} to: ${url.slice(0, -5)}`);
    return res.redirect(301, url.slice(0, -5));
  }
  
  next();
});

// Handle favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../assets/images/favicon.png'));
});

// Set cache headers for static assets
app.use((req, res, next) => {
  // Cache static assets for 1 day
  if (req.url.match(/\.(css|js|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
  next();
});

// Serve static files
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/css', express.static(path.join(__dirname, '../assets/css')));
app.use('/js', express.static(path.join(__dirname, '../assets/js')));

// Use routes
app.use('/api', apiRoutes);
app.use('/', pageRoutes);

// Catch-all route for 404 errors
app.use((req, res) => {
  console.log(`404 for: ${req.url}`);
  res.status(404).render('error', {
    title: '404 - Page Not Found',
    message: 'Sorry, the page you are looking for does not exist.',
    statusCode: 404
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: '500 - Server Error',
    message: 'Something went wrong on the server.',
    statusCode: 500
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});