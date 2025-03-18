/**
 * Validation Utilities
 * Uses Joi for schema validation and sanitize-html for content validation
 */

const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');
const logger = require('./logger');

// Define sanitization options
const sanitizeOptions = {
  allowedTags: [],  // No HTML tags allowed
  allowedAttributes: {},
  disallowedTagsMode: 'recursiveEscape'
};

// Sanitize all string input to prevent XSS
function sanitizeInput(obj) {
  if (!obj) return obj;
  
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Sanitize strings
      result[key] = sanitizeHtml(value, sanitizeOptions);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively sanitize nested objects
      result[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      // Sanitize arrays
      result[key] = value.map(item => 
        typeof item === 'string' 
          ? sanitizeHtml(item, sanitizeOptions) 
          : (typeof item === 'object' ? sanitizeInput(item) : item)
      );
    } else {
      // Pass non-string values through unchanged
      result[key] = value;
    }
  }
  
  return result;
}

// Contact form validation schema
const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must be less than 100 characters',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string().trim().email().required()
    .messages({
      'string.empty': 'Email address is required',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email address is required'
    }),
  
  phone: Joi.string().trim().allow('').max(20)
    .pattern(/^[0-9\-\+\(\)\s]*$/)
    .messages({
      'string.max': 'Phone number is too long',
      'string.pattern.base': 'Please enter a valid phone number'
    }),
  
  company: Joi.string().trim().allow('').max(100),
  
  interest: Joi.string().trim().required()
    .valid('CRM Management', 'Business Intelligence', 'Data Integration', 'Customer Retention', 'General Inquiry')
    .messages({
      'any.only': 'Please select a valid interest area',
      'any.required': 'Please select an interest area'
    }),
  
  message: Joi.string().trim().min(10).max(5000).required()
    .messages({
      'string.empty': 'Message is required',
      'string.min': 'Message must be at least 10 characters',
      'string.max': 'Message must be less than 5000 characters',
      'any.required': 'Message is required'
    })
});

// Assessment form validation schema
const assessmentSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name must be less than 100 characters',
      'any.required': 'Full name is required'
    }),
  
  email: Joi.string().trim().email().required()
    .messages({
      'string.empty': 'Email address is required',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email address is required'
    }),
  
  companyName: Joi.string().trim().allow('').max(100),
  
  jobTitle: Joi.string().trim().allow('').max(100),
  
  industry: Joi.string().trim().allow('').max(100),
  
  companySize: Joi.string().trim().allow('')
    .valid('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', ''),
  
  // Assessment scores - validate all score fields (1-5 scale)
  crmImplementation: Joi.number().integer().min(1).max(5).required(),
  systemIntegration: Joi.number().integer().min(1).max(5).required(),
  dataQuality: Joi.number().integer().min(1).max(5).required(),
  
  analyticsCapabilities: Joi.number().integer().min(1).max(5).required(),
  revenueAttribution: Joi.number().integer().min(1).max(5).required(),
  dataDrivenDecisions: Joi.number().integer().min(1).max(5).required(),
  
  salesProcess: Joi.number().integer().min(1).max(5).required(),
  leadProcess: Joi.number().integer().min(1).max(5).required(),
  retentionProcess: Joi.number().integer().min(1).max(5).required(),
  
  teamAlignment: Joi.number().integer().min(1).max(5).required(),
  revenueForecasting: Joi.number().integer().min(1).max(5).required(),
  revopsLeadership: Joi.number().integer().min(1).max(5).required()
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().trim().email().required()
    .messages({
      'string.empty': 'Email address is required',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email address is required'
    }),
  
  password: Joi.string().min(8).required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    }),
    
  remember: Joi.boolean().optional()
});

// Validate contact form data
function validateContact(data) {
  // First sanitize the input
  const sanitizedData = sanitizeInput(data);
  
  // Then validate against schema
  const { error, value } = contactSchema.validate(sanitizedData, { abortEarly: false });
  
  if (error) {
    logger.debug('Contact validation error:', { error: error.details });
    
    // Format error messages
    const errorMessages = error.details.map(detail => detail.message);
    return { valid: false, errors: errorMessages, sanitizedData };
  }
  
  return { valid: true, sanitizedData: value };
}

// Validate assessment form data
function validateAssessment(data) {
  // First sanitize the input
  const sanitizedData = sanitizeInput(data);
  
  // Then validate against schema
  const { error, value } = assessmentSchema.validate(sanitizedData, { abortEarly: false });
  
  if (error) {
    logger.debug('Assessment validation error:', { error: error.details });
    
    // Format error messages
    const errorMessages = error.details.map(detail => detail.message);
    return { valid: false, errors: errorMessages, sanitizedData };
  }
  
  return { valid: true, sanitizedData: value };
}

// Validate login data
function validateLogin(data) {
  // First sanitize the input
  const sanitizedData = sanitizeInput(data);
  
  // Then validate against schema
  const { error, value } = loginSchema.validate(sanitizedData, { abortEarly: false });
  
  if (error) {
    logger.debug('Login validation error:', { error: error.details });
    
    // Format error messages
    const errorMessages = error.details.map(detail => detail.message);
    return { valid: false, errors: errorMessages, sanitizedData };
  }
  
  return { valid: true, sanitizedData: value };
}

module.exports = {
  validateContact,
  validateAssessment,
  validateLogin,
  sanitizeInput
};