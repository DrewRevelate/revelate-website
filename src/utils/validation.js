/**
 * Input validation utilities
 */

// Validate contact form submissions
function validateContact(data) {
  const { name, email, message } = data;
  
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return 'Name is required and must be at least 2 characters.';
  }
  
  if (!email || !isValidEmail(email)) {
    return 'A valid email address is required.';
  }
  
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return 'Message is required and must be at least 10 characters.';
  }
  
  return null;
}

// Validate assessment form submissions
function validateAssessment(data) {
  const { fullName, email } = data;
  
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return 'Full name is required and must be at least 2 characters.';
  }
  
  if (!email || !isValidEmail(email)) {
    return 'A valid email address is required.';
  }
  
  // Additional validations can be added for the scores if needed
  
  return null;
}

// Helper to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
  validateContact,
  validateAssessment
};
