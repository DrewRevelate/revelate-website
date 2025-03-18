/**
 * Revelate Operations - Main Application
 */

// Load environment variables first
require('dotenv').config();

// Core dependencies
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const ejsLayouts = require('express-ejs-layouts');
const favicon = require('serve-favicon');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const morgan = require('morgan');

// Custom middleware and utilities
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const db = require('./config/database');

// Initialize Express app
const app = express();

// Security, performance and utility middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'cdnjs.cloudflare.com', 'unpkg.com', "'unsafe-inline'"], // Allow external scripts from CDNs
      styleSrc: ["'self'", 'fonts.googleapis.com', 'cdnjs.cloudflare.com', 'unpkg.com', "'unsafe-inline'"],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'cdnjs.cloudflare.com'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(compression()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging in development and production
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
} else {
  app.use(morgan('dev'));
}

// Session configuration
app.use(session({
  store: new pgSession({
    pool: db.pool,
    tableName: 'sessions'
  }),
  secret: process.env.SESSION_SECRET || 'development-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

// Static files with proper cache headers
const staticOptions = {
  maxAge: process.env.NODE_ENV === 'production' ? '30d' : 0,
  etag: true
};

app.use(express.static(path.join(__dirname, '..', 'public'), staticOptions));
app.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets'), staticOptions));

// Favicon
app.use(favicon(path.join(__dirname, '..', 'public', 'assets', 'images', 'favicon.png')));

// Redirect .html URLs to clean directory paths
app.use((req, res, next) => {
  if (req.path.endsWith('.html')) {
    const cleanPath = req.path.slice(0, -5); // Remove .html
    return res.redirect(301, cleanPath);
  }
  next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layouts/main');

// Apply rate limiting to sensitive routes
app.use('/api', rateLimiter);
app.use('/contact', rateLimiter);
app.use('/assessment', rateLimiter);

// Routes
const pageRoutes = require('./routes/pages');
const apiRoutes = require('./routes/api');

app.use('/', pageRoutes);
app.use('/api', apiRoutes);

// 404 handler - Must be before other error handlers
app.use((req, res, next) => {
  res.status(404).render('pages/404', { 
    title: 'Page Not Found | Revelate Operations',
    layout: 'layouts/main'
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;