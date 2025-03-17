/**
 * Revelate Operations - Server
 * Properly serves static Jekyll site and handles API requests with PostgreSQL
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Load environment variables
dotenv.config();

// Initialize PostgreSQL pool
const dbUrl = process.env.DATABASE_URL || process.env.HEROKU_POSTGRESQL_ROSE_URL;
const pool = new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false // Required for Heroku PostgreSQL
  }
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  const faviconPath = path.join(__dirname, 'assets/images/favicon.png');
  if (fs.existsSync(faviconPath)) {
    res.sendFile(faviconPath);
  } else {
    res.status(204).end(); // No content if favicon doesn't exist
  }
});

// Set cache headers for static assets
app.use((req, res, next) => {
  // Cache static assets for 1 day
  if (req.url.match(/\.(css|js|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
  next();
});

// Serve static files from _site directory which contains the Jekyll build
const siteDir = path.join(__dirname, '_site');
app.use(express.static(siteDir));

// Serve other static files from root as fallback
app.use(express.static(__dirname));

// Specific route handlers for top-level pages
const mainPages = ['about', 'services', 'approach', 'assessment', 'contact', 'projects'];
mainPages.forEach(page => {
  app.get(`/${page}`, (req, res, next) => {
    console.log(`Direct route for main page: /${page}`);
    
    // Try _site directory first, then root
    const siteFilePath = path.join(siteDir, `${page}.html`);
    const rootFilePath = path.join(__dirname, `${page}.html`);
    
    if (fs.existsSync(siteFilePath)) {
      console.log(`Serving file from _site: ${siteFilePath}`);
      return res.sendFile(siteFilePath);
    } else if (fs.existsSync(rootFilePath)) {
      console.log(`Serving file from root: ${rootFilePath}`);
      return res.sendFile(rootFilePath);
    } else {
      console.log(`No file found for page: ${page}`);
      // Continue to next route handler
      next();
    }
  });
});

// API Routes

// API endpoint to save contact form submissions
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, phone, company, interest, message } = req.body;
    
    // Insert into database
    const query = `
      INSERT INTO contacts 
        (name, email, phone, company, interest, message, created_at) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id
    `;
    
    const values = [name, email, phone || '', company || '', interest, message];
    const result = await pool.query(query, values);
    
    res.status(201).json({
      success: true,
      message: 'Contact saved successfully',
      contactId: result.rows[0].id
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save contact information',
      error: error.message
    });
  }
});

// API endpoint to save assessment submissions
app.post('/api/assessments', async (req, res) => {
  try {
    const {
      fullName, email, companyName, jobTitle, industry, companySize,
      // Data Infrastructure scores
      crmImplementation, systemIntegration, dataQuality,
      // Analytics scores
      analyticsCapabilities, revenueAttribution, dataDrivenDecisions,
      // Process scores
      salesProcess, leadProcess, retentionProcess,
      // Team scores
      teamAlignment, revenueForecasting, revopsLeadership
    } = req.body;
    
    // Calculate dimension scores
    const dataInfrastructureScore = calculateScore([
      parseInt(crmImplementation), 
      parseInt(systemIntegration), 
      parseInt(dataQuality)
    ]);
    
    const analyticsScore = calculateScore([
      parseInt(analyticsCapabilities), 
      parseInt(revenueAttribution), 
      parseInt(dataDrivenDecisions)
    ]);
    
    const processScore = calculateScore([
      parseInt(salesProcess), 
      parseInt(leadProcess), 
      parseInt(retentionProcess)
    ]);
    
    const teamScore = calculateScore([
      parseInt(teamAlignment), 
      parseInt(revenueForecasting), 
      parseInt(revopsLeadership)
    ]);
    
    // Calculate overall score
    const overallScore = calculateScore([
      dataInfrastructureScore,
      analyticsScore,
      processScore,
      teamScore
    ]);
    
    // Determine maturity level
    const maturityLevel = getMaturityLevel(overallScore);
    
    // Insert into database
    const query = `
      INSERT INTO assessments 
        (full_name, email, company_name, job_title, industry, company_size,
        crm_implementation, system_integration, data_quality,
        analytics_capabilities, revenue_attribution, data_driven_decisions,
        sales_process, lead_process, retention_process,
        team_alignment, revenue_forecasting, revops_leadership,
        data_infrastructure_score, analytics_score, process_score, team_score,
        overall_score, maturity_level, created_at) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 
        $19, $20, $21, $22, $23, $24, NOW())
      RETURNING id
    `;
    
    const values = [
      fullName, email, companyName, jobTitle, industry, companySize,
      crmImplementation, systemIntegration, dataQuality,
      analyticsCapabilities, revenueAttribution, dataDrivenDecisions,
      salesProcess, leadProcess, retentionProcess,
      teamAlignment, revenueForecasting, revopsLeadership,
      dataInfrastructureScore, analyticsScore, processScore, teamScore,
      overallScore, maturityLevel
    ];
    
    const result = await pool.query(query, values);
    
    res.status(201).json({
      success: true,
      message: 'Assessment saved successfully',
      assessmentId: result.rows[0].id,
      results: {
        dataInfrastructureScore,
        analyticsScore,
        processScore,
        teamScore,
        overallScore,
        maturityLevel
      }
    });
  } catch (error) {
    console.error('Error saving assessment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save assessment information',
      error: error.message
    });
  }
});

// API endpoint for checking database status
app.get('/api/status', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as time');
    
    res.status(200).json({
      success: true,
      database: {
        connected: true,
        timestamp: result.rows[0].time
      },
      server: {
        timestamp: new Date(),
        uptime: process.uptime() + ' seconds'
      }
    });
  } catch (error) {
    console.error('Error checking database status:', error);
    res.status(500).json({
      success: false,
      database: {
        connected: false,
        error: error.message
      },
      server: {
        timestamp: new Date(),
        uptime: process.uptime() + ' seconds'
      }
    });
  }
});

// Handle Jekyll-style directory paths (with trailing slash)
app.get('/:page/', (req, res, next) => {
  const page = req.params.page;
  
  // Skip API requests
  if (page === 'api' || page.startsWith('api/')) {
    return next();
  }
  
  // Log the request for debugging
  console.log(`Processing directory route: /${page}/`);
  
  // Try different file locations in order
  const possibilities = [
    path.join(siteDir, page, 'index.html'),
    path.join(siteDir, `${page}.html`),
    path.join(__dirname, page, 'index.html'),
    path.join(__dirname, `${page}.html`)
  ];
  
  // Find the first valid file
  for (const filePath of possibilities) {
    if (fs.existsSync(filePath)) {
      console.log(`Serving file: ${filePath}`);
      return res.sendFile(filePath);
    }
  }
  
  // If no file found, continue to next middleware
  console.log(`No file found for: /${page}/`);
  next();
});

// Handle nested directory paths (with trailing slash)
app.get('/:section/:page/', (req, res, next) => {
  const { section, page } = req.params;
  
  // Skip API requests
  if (section === 'api' || section.startsWith('api/')) {
    return next();
  }
  
  // Log the request for debugging
  console.log(`Processing nested directory route: /${section}/${page}/`);
  
  // Try different file locations in order
  const possibilities = [
    path.join(siteDir, section, page, 'index.html'),
    path.join(siteDir, section, `${page}.html`),
    path.join(__dirname, section, page, 'index.html'),
    path.join(__dirname, section, `${page}.html`)
  ];
  
  // Find the first valid file
  for (const filePath of possibilities) {
    if (fs.existsSync(filePath)) {
      console.log(`Serving file: ${filePath}`);
      return res.sendFile(filePath);
    }
  }
  
  // If no file found, continue to next middleware
  console.log(`No file found for: /${section}/${page}/`);
  next();
});

// Handle paths without trailing slash (not already caught by specific handlers)
app.get('/:page', (req, res, next) => {
  // Skip if it's an API route or file with extension
  const page = req.params.page;
  if (page.startsWith('api') || page.includes('.')) {
    return next();
  }
  
  // Handle main pages - this should have been caught by the specific handlers,
  // but we'll check again just to be sure
  if (mainPages.includes(page)) {
    return next();
  }
  
  // Log the request for debugging
  console.log(`Processing page route: /${page}`);
  
  // Try different file locations in order
  const possibilities = [
    path.join(siteDir, page, 'index.html'),
    path.join(siteDir, `${page}.html`),
    path.join(__dirname, page, 'index.html'),
    path.join(__dirname, `${page}.html`)
  ];
  
  // Find the first valid file
  for (const filePath of possibilities) {
    if (fs.existsSync(filePath)) {
      console.log(`Serving file: ${filePath}`);
      return res.sendFile(filePath);
    }
  }
  
  // If no file found, continue to next middleware
  console.log(`No file found for: /${page}`);
  next();
});

// Handle nested paths without trailing slash
app.get('/:section/:page', (req, res, next) => {
  // Skip if it's a file with extension
  const page = req.params.page;
  if (page.includes('.')) {
    return next();
  }
  
  const { section } = req.params;
  
  // Skip API requests
  if (section === 'api' || section.startsWith('api/')) {
    return next();
  }
  
  // Log the request for debugging
  console.log(`Processing nested page route: /${section}/${page}`);
  
  // Try different file locations in order
  const possibilities = [
    path.join(siteDir, section, page, 'index.html'),
    path.join(siteDir, section, `${page}.html`),
    path.join(__dirname, section, page, 'index.html'),
    path.join(__dirname, section, `${page}.html`)
  ];
  
  // Find the first valid file
  for (const filePath of possibilities) {
    if (fs.existsSync(filePath)) {
      console.log(`Serving file: ${filePath}`);
      return res.sendFile(filePath);
    }
  }
  
  // If no file found, continue to next middleware
  console.log(`No file found for: /${section}/${page}`);
  next();
});

// Catch-all route for 404 errors
app.use((req, res, next) => {
  console.log(`404 for: ${req.url}`);
  
  // Check for 404 page in site directory first, then root
  const path404Site = path.join(siteDir, '404.html');
  const path404Root = path.join(__dirname, '404.html');
  
  if (fs.existsSync(path404Site)) {
    return res.status(404).sendFile(path404Site);
  } else if (fs.existsSync(path404Root)) {
    return res.status(404).sendFile(path404Root);
  } else {
    return res.status(404).send('<h1>Page Not Found</h1><p>Sorry, the page you are looking for does not exist.</p>');
  }
});

// Helper function to calculate scores
function calculateScore(scores) {
  // Filter out invalid scores
  const validScores = scores.filter(score => !isNaN(score));
  if (validScores.length === 0) return 0;
  
  // Calculate average and round to 2 decimal places
  return parseFloat((validScores.reduce((sum, score) => sum + score, 0) / validScores.length).toFixed(2));
}

// Helper function to determine maturity level
function getMaturityLevel(score) {
  if (score < 1.5) return 'Beginner';
  if (score < 2.5) return 'Developing';
  if (score < 3.5) return 'Established';
  if (score < 4.5) return 'Advanced';
  return 'Expert';
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Database setup function exported for CLI
module.exports = {
  setupDb: async () => {
    try {
      // Create contacts table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          company VARCHAR(255),
          interest VARCHAR(50),
          message TEXT,
          created_at TIMESTAMP NOT NULL
        )
      `);
      
      // Create assessments table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS assessments (
          id SERIAL PRIMARY KEY,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          company_name VARCHAR(255),
          job_title VARCHAR(255),
          industry VARCHAR(100),
          company_size VARCHAR(50),
          
          crm_implementation INTEGER,
          system_integration INTEGER,
          data_quality INTEGER,
          
          analytics_capabilities INTEGER,
          revenue_attribution INTEGER,
          data_driven_decisions INTEGER,
          
          sales_process INTEGER,
          lead_process INTEGER,
          retention_process INTEGER,
          
          team_alignment INTEGER,
          revenue_forecasting INTEGER,
          revops_leadership INTEGER,
          
          data_infrastructure_score DECIMAL(5,2),
          analytics_score DECIMAL(5,2),
          process_score DECIMAL(5,2),
          team_score DECIMAL(5,2),
          overall_score DECIMAL(5,2),
          maturity_level VARCHAR(50),
          
          created_at TIMESTAMP NOT NULL
        )
      `);
      
      console.log('Database tables created successfully');
      process.exit(0);
    } catch (error) {
      console.error('Error initializing database:', error);
      process.exit(1);
    }
  }
};