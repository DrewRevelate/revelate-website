/**
 * Enhanced API Routes for Revelate Operations
 * Optimized for performance, security, and data collection
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { validateContact } = require('../utils/validation');
const { getImageUrl, getImageData, getImagesByCategory } = require('../utils/sanityUtils');

// API endpoint to save contact form submissions with enhanced data collection
router.post('/contacts', async (req, res) => {
  try {
    const { name, email, phone, company, interest, message } = req.body;
    
    // Get UTM parameters and referrer
    const utmSource = req.body.utm_source || null;
    const utmMedium = req.body.utm_medium || null;
    const utmCampaign = req.body.utm_campaign || null;
    const utmTerm = req.body.utm_term || null;
    const utmContent = req.body.utm_content || null;
    const referrer = req.body.referrer || req.get('Referrer') || null;
    
    // Capture client information
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const userAgent = req.headers['user-agent'] || '';
    
    // Validate input
    const validationError = validateContact(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validationError
      });
    }
    
    // Spam detection (basic implementation)
    if (detectSpam(message)) {
      // Log potential spam but don't tell the user
      console.warn('Potential spam detected', { email, ip: ipAddress });
      
      // Pretend it succeeded to avoid giving feedback to spammers
      return res.status(201).json({
        success: true,
        message: 'Contact saved successfully',
        contactId: Date.now() // Fake ID
      });
    }
    
    // Enhanced database query with UTM tracking
    const query = `
      INSERT INTO contacts 
        (name, email, phone, company, interest, message, 
         utm_source, utm_medium, utm_campaign, utm_term, utm_content, 
         referrer, ip_address, user_agent, created_at) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
      RETURNING id
    `;
    
    const values = [
      name, 
      email.toLowerCase().trim(), 
      phone || '', 
      company || '', 
      interest, 
      message,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      referrer,
      ipAddress,
      userAgent
    ];
    
    const result = await db.query(query, values);
    
    // Success response
    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      contactId: result.rows[0].id
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({
      success: false,
      message: 'There was a problem submitting your form. Please try again.',
      error: process.env.NODE_ENV === 'production' ? 'Server error' : error.message
    });
  }
});

// Newsletter signup endpoint
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    // Get UTM parameters and referrer
    const utmSource = req.body.utm_source || null;
    const utmMedium = req.body.utm_medium || null;
    const utmCampaign = req.body.utm_campaign || null;
    
    // Capture client information
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    
    // Validate email
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Check if email is already subscribed
    const checkQuery = 'SELECT id FROM subscribers WHERE email = $1';
    const checkResult = await db.query(checkQuery, [email.toLowerCase().trim()]);
    
    if (checkResult.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter!'
      });
    }
    
    // Insert new subscriber
    const query = `
      INSERT INTO subscribers 
        (email, name, utm_source, utm_medium, utm_campaign, ip_address)
      VALUES 
        ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    
    const values = [
      email.toLowerCase().trim(),
      name || '',
      utmSource,
      utmMedium,
      utmCampaign,
      ipAddress
    ];
    
    await db.query(query, values);
    
    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!'
    });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).json({
      success: false,
      message: 'There was a problem with your subscription. Please try again.',
      error: process.env.NODE_ENV === 'production' ? 'Server error' : error.message
    });
  }
});

// API health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbResult = await db.query('SELECT NOW()');
    
    res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: dbResult.rows[0].now,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: process.env.NODE_ENV === 'production' ? 'Database connection error' : error.message
    });
  }
});

// API endpoints for Sanity CMS images

// Get a specific image by its identifier
router.get('/images/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const { darkMode = 'false', width, height, quality } = req.query;
    
    // Set up options for image fetching
    const options = {
      darkMode: darkMode === 'true',
      width: width ? parseInt(width, 10) : undefined,
      height: height ? parseInt(height, 10) : undefined,
      quality: quality ? parseInt(quality, 10) : undefined
    };
    
    // Get the image URL from Sanity
    const imageUrl = await getImageUrl(identifier, options);
    
    if (!imageUrl) {
      return res.status(404).json({
        success: false,
        message: `Image with identifier "${identifier}" not found`
      });
    }
    
    // If successful, get the full image data
    const imageData = await getImageData(identifier, options.darkMode);
    
    // Create srcset for responsive images
    const sizes = [300, 600, 900, 1200, 1800];
    const srcSet = sizes.map(size => {
      const sizeOpts = { ...options, width: size };
      return `${getImageUrl(identifier, sizeOpts)} ${size}w`;
    }).join(', ');
    
    res.json({
      success: true,
      url: imageUrl,
      srcSet: srcSet,
      alt: imageData?.alt || '',
      caption: imageData?.caption || '',
      ...(imageData || {})
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production'
        ? 'Error fetching image'
        : error.message
    });
  }
});

// Get all images in a category
router.get('/images/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { darkMode = 'false' } = req.query;
    
    // Get images by category
    const images = await getImagesByCategory(category, darkMode === 'true');
    
    res.json({
      success: true,
      count: images.length,
      images: images
    });
  } catch (error) {
    console.error('Error fetching images by category:', error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production'
        ? 'Error fetching images'
        : error.message
    });
  }
});

// Simple spam detection function
function detectSpam(message) {
  if (!message) return false;
  
  // Convert to lowercase for case-insensitive matching
  const lowerMessage = message.toLowerCase();
  
  // Check for common spam patterns
  const spamKeywords = [
    'viagra', 'casino', 'lottery', 'bitcoin', 'investment opportunity',
    'crypto', 'million dollar', 'MLM', 'multi-level', 'earn from home',
    'suspicious link', 'prize', 'winner', 'free money'
  ];
  
  // Check if message contains spam keywords
  for (const keyword of spamKeywords) {
    if (lowerMessage.includes(keyword)) {
      return true;
    }
  }
  
  // Check for excessive URLs (more than 3)
  const urlCount = (message.match(/https?:\/\//g) || []).length;
  if (urlCount > 3) {
    return true;
  }
  
  // Very short message with a link is suspicious
  if (message.length < 20 && message.includes('http')) {
    return true;
  }
  
  return false;
}

module.exports = router;