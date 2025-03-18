/**
 * API Routes for Revelate Operations
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { validateContact } = require('../utils/validation');

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

// Simple test endpoint to confirm Express is working
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Express.js API is working!',
    timestamp: new Date()
  });
});

module.exports = router;
