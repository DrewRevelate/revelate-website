/**
 * Revelate Operations - Server
 * Main server file for handling API requests and database operations
 */

// Import dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./db/database');
const jekyllMiddleware = require('./utils/jekyll-compatibility');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add Jekyll compatibility middleware
app.use(jekyllMiddleware);

// Handle favicon.ico to avoid 404 errors
app.get('/favicon.ico', (req, res) => {
  const faviconPath = path.join(__dirname, 'assets/images/favicon.png');
  if (fs.existsSync(faviconPath)) {
    res.sendFile(faviconPath);
  } else {
    res.status(204).end(); // No content if favicon doesn't exist
  }
});

// Serve static files with proper caching
app.use(express.static(path.join(__dirname, '/'), {
  maxAge: '1d'
}));

// Routes
// Handle root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle HTML page routes (both with and without .html extension)
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  
  // Skip API routes and handle them separately
  if (page.startsWith('api')) {
    return next();
  }
  
  // Check if this is a directory route (without .html)
  const htmlFile = path.join(__dirname, `${page}.html`);
  const directoryIndexFile = path.join(__dirname, `${page}/index.html`);
  
  if (page.endsWith('.html')) {
    // Direct HTML request
    res.sendFile(path.join(__dirname, page));
  } else if (fs.existsSync(htmlFile)) {
    // Page exists as a direct .html file
    res.sendFile(htmlFile);
  } else if (fs.existsSync(directoryIndexFile)) {
    // Page exists as a directory with index.html
    res.sendFile(directoryIndexFile);
  } else {
    // If we couldn't find a matching file, continue to next middleware
    next();
  }
});

// Support for nested pages
app.get('/:section/:page', (req, res, next) => {
  const { section, page } = req.params;
  
  // Check for both direct file and index.html in directory
  const directFile = path.join(__dirname, `${section}/${page}`);
  const htmlFile = path.join(__dirname, `${section}/${page}.html`);
  const directoryFile = path.join(__dirname, `${section}/${page}/index.html`);
  
  if (fs.existsSync(directFile)) {
    res.sendFile(directFile);
  } else if (fs.existsSync(htmlFile)) {
    res.sendFile(htmlFile);
  } else if (fs.existsSync(directoryFile)) {
    res.sendFile(directoryFile);
  } else {
    next();
  }
});

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
    const result = await db.query(query, values);
    
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
    
    const result = await db.query(query, values);
    
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

// Database initialization route (for setup)
app.get('/setup-database', async (req, res) => {
  try {
    const result = await db.initDb();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Database tables created successfully'
      });
    } else {
      throw result.error;
    }
  } catch (error) {
    console.error('Error setting up database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set up database',
      error: error.message
    });
  }
});

// Handle 404 errors with custom 404 page
app.use((req, res) => {
  if (fs.existsSync(path.join(__dirname, '404.html'))) {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
  } else {
    res.status(404).send('Page not found');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export setupDb function for CLI usage
module.exports = {
  setupDb: async () => {
    try {
      const result = await db.initDb();
      if (result.success) {
        console.log('Database initialized successfully');
        process.exit(0);
      } else {
        console.error('Error initializing database:', result.error);
        process.exit(1);
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      process.exit(1);
    }
  }
};