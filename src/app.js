require('dotenv').config();
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const ejsLayouts = require('express-ejs-layouts');
const favicon = require('serve-favicon');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Redirect .html URLs to clean directory paths
app.use((req, res, next) => {
  if (req.path.endsWith('.html')) {
    const cleanPath = req.path.slice(0, -5); // Remove .html
    return res.redirect(301, cleanPath);
  }
  next();
});
app.use(compression()); // Compress responses
app.use(helmet({ contentSecurityPolicy: false })); // Security headers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IMPORTANT: Use consistent static file paths
// This ensures assets are served with the same structure on all routes
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

// Favicon
app.use(favicon(path.join(__dirname, '..', 'assets', 'images', 'favicon.png')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layouts/main');

// Routes
const pageRoutes = require('./routes/pages');
// Uncomment when API routes are ready
// const apiRoutes = require('./routes/api');

app.use('/', pageRoutes);
// app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/404', { 
    title: 'Page Not Found | Revelate Operations',
    layout: 'layouts/main'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/error', {
    title: 'Error | Revelate Operations',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    layout: 'layouts/main'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
