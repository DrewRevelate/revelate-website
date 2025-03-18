/**
 * API Controller
 * Handles API endpoints for forms and data
 */

const db = require('../config/database');
const { validateContact, validateAssessment } = require('../utils/validation');
const logger = require('../utils/logger');

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

// API endpoint to save contact form submissions
exports.submitContactForm = async (req, res) => {
  try {
    // Validate and sanitize input
    const validation = validateContact(req.body);
    
    if (!validation.valid) {
      logger.warn('Contact form validation failed', { errors: validation.errors });
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: validation.errors
      });
    }
    
    const { name, email, phone, company, interest, message } = validation.sanitizedData;
    
    // Store IP for security and tracking
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Insert into database
    const query = `
      INSERT INTO contacts 
        (name, email, phone, company, interest, message, created_at, ip_address) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, NOW(), $7)
      RETURNING id
    `;
    
    const values = [name, email, phone || '', company || '', interest, message, ipAddress];
    const result = await db.query(query, values);
    
    logger.info('Contact form submitted successfully', { 
      contactId: result.rows[0].id,
      email
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Your message has been sent successfully. We\'ll be in touch soon!',
      contactId: result.rows[0].id
    });
  } catch (error) {
    logger.error('Error saving contact form:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing your request. Please try again later.'
    });
  }
};

// API endpoint to save assessment submissions
exports.submitAssessment = async (req, res) => {
  try {
    // Validate and sanitize input
    const validation = validateAssessment(req.body);
    
    if (!validation.valid) {
      logger.warn('Assessment validation failed', { errors: validation.errors });
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: validation.errors
      });
    }
    
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
    } = validation.sanitizedData;
    
    // Store additional tracking info
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers.referer || '';
    
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
        overall_score, maturity_level, created_at, ip_address, user_agent, referrer) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 
        $19, $20, $21, $22, $23, $24, NOW(), $25, $26, $27)
      RETURNING id
    `;
    
    const values = [
      fullName, email, companyName, jobTitle, industry, companySize,
      crmImplementation, systemIntegration, dataQuality,
      analyticsCapabilities, revenueAttribution, dataDrivenDecisions,
      salesProcess, leadProcess, retentionProcess,
      teamAlignment, revenueForecasting, revopsLeadership,
      dataInfrastructureScore, analyticsScore, processScore, teamScore,
      overallScore, maturityLevel, ipAddress, userAgent, referrer
    ];
    
    const result = await db.query(query, values);
    
    logger.info('Assessment submitted successfully', { 
      assessmentId: result.rows[0].id,
      email,
      overallScore,
      maturityLevel
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Your assessment has been submitted successfully.',
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
    logger.error('Error saving assessment:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing your assessment. Please try again later.'
    });
  }
};

// API endpoint for checking system status
exports.getSystemStatus = async (req, res) => {
  try {
    const startTime = Date.now();
    const result = await db.query('SELECT NOW() as time');
    const queryTime = Date.now() - startTime;
    
    res.status(200).json({
      status: 'success',
      uptime: process.uptime() + ' seconds',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        timestamp: result.rows[0].time,
        responseTime: queryTime + 'ms'
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    logger.error('Error checking system status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection error',
      uptime: process.uptime() + ' seconds',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: process.env.NODE_ENV === 'production' ? 'Database connection error' : error.message
      },
      environment: process.env.NODE_ENV || 'development'
    });
  }
};