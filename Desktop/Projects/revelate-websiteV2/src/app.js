require('dotenv').config();
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const ejsLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');

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
      imgSrc: ["'self'", 'data:', 'www.google-analytics.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com', 'cdnjs.cloudflare.com'],
      connectSrc: ["'self'", 'www.google-analytics.com'],
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

// Middleware
// Optimize request handling
app.use(helmet(helmetConfig));

// Logging configuration
if (process.env.NODE_ENV === 'production') {
  // Create a log directory if it doesn't exist
  const logDirectory = path.join(__dirname, 'logs');
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }
  
  // Create a rotating write stream for production logs
  const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  app.use(morgan('dev'));
}

// Improve compression for better performance
app.use(compression({
  level: 6, // Higher compression level
  threshold: 0, // Compress all responses
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Optimize URL handling
app.use((req, res, next) => {
  // Redirect from www to non-www (or vice versa)
  const host = req.headers.host;
  if (host && host.startsWith('www.') && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${host.slice(4)}${req.url}`);
  }
  
  // Redirect HTTP to HTTPS in production
  if (req.headers['x-forwarded-proto'] === 'http' && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  
  // Handle .html extension removal
  if (req.path.endsWith('.html')) {
    return res.redirect(301, req.path.slice(0, -5));
  }
  
  // Normalize trailing slashes
  if (req.path.length > 1 && req.path.endsWith('/')) {
    return res.redirect(301, req.path.slice(0, -1));
  }
  
  next();
});

// Optimize body parser settings
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

// Add response time header in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      res.setHeader('X-Response-Time', `${duration}ms`);
    });
    next();
  });
}

// Set security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Optimize static file serving with cache control
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

app.use('/assets', express.static(path.join(__dirname, '..', 'assets'), staticOptions));
app.use('/images', express.static(path.join(__dirname, '..', 'assets', 'images'), staticOptions));
app.use('/js', express.static(path.join(__dirname, '..', 'assets', 'js'), staticOptions));
app.use('/css', express.static(path.join(__dirname, '..', 'assets', 'css'), staticOptions));

// View engine setup with improved EJS configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Add template helpers
app.locals.formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

app.locals.truncate = (str, len) => {
  if (str.length > len) {
    return str.substring(0, len) + '...';
  }
  return str;
};

// Routes
const pageRoutes = require('./routes/pages');
const apiRoutes = require('./routes/api');

// Track route performance in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const url = req.url;
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (duration > 100) { // Log slow routes (>100ms)
        console.log(`⚠️ Slow route [${duration}ms]: ${url}`);
      }
    });
    
    next();
  });
}

app.use('/', pageRoutes);
app.use('/api', apiRoutes);

// Generate dynamic sitemap for SEO
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.BASE_URL || `https://${req.headers.host}`;
  
  // Define your routes - can be made dynamic from DB
  const routes = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/services', changefreq: 'monthly', priority: 0.8 },
    { url: '/approach', changefreq: 'monthly', priority: 0.8 },
    { url: '/about', changefreq: 'monthly', priority: 0.7 },
    { url: '/contact', changefreq: 'monthly', priority: 0.8 },
    { url: '/case-studies', changefreq: 'weekly', priority: 0.9 }
  ];
  
  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  routes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route.url}</loc>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Add robots.txt for SEO
app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.BASE_URL || `https://${req.headers.host}`;
  
  const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml

# Disallow access to specific paths
Disallow: /api/
`;
  
  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

// Enhanced 404 handler with tracking
app.use((req, res) => {
  // Log 404s for analysis
  console.warn(`404 Not Found: ${req.method} ${req.url}`);
  
  res.status(404).render('pages/404', { 
    title: 'Page Not Found | Revelate Operations',
    layout: 'layouts/main',
    url: req.url
  });
});

// Enhanced error handler with better debugging
app.use((err, req, res, next) => {
  // Log full error details in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      method: req.method,
      url: req.url,
      body: req.body,
      query: req.query
    });
  } else {
    // Log minimal information in production
    console.error(`Error: ${err.message}`, {
      url: req.url,
      method: req.method,
      status: err.status || 500
    });
  }
  
  res.status(err.status || 500).render('pages/error', {
    title: 'Error | Revelate Operations',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    layout: 'layouts/main'
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  
  // Close server
  app.close(() => {
    console.log('Process terminated');
  });
  
  // Force close after 10s
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
});

// Start server with improved logging
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   Revelate Operations Server                      ║
║   Running in ${process.env.NODE_ENV || 'development'} mode                       ║
║   Server started on port ${PORT}                      ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

module.exports = app;