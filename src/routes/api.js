/**
 * API Routes for Revelate Operations
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { validateContact, validateAssessment } = require('../utils/validation');

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
router.post('/contacts', async (req, res) => {
  try {
    const { name, email, phone, company, interest, message } = req.body;
    
    // Validate input
    const validationError = validateContact(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validationError
      });
    }
    
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
router.post('/assessments', async (req, res) => {
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
    
    // Validate input
    const validationError = validateAssessment(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validationError
      });
    }
    
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

// API endpoint for checking database status
router.get('/status', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() as time');
    
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

module.exports = router;