/**
 * Validation Utilities for Revelate Operations
 */

// Validate contact form input
function validateContact(data) {
  const { name, email, message, interest } = data;
  
  // Check required fields
  if (!name || !name.trim()) {
    return 'Name is required';
  }
  
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  
  if (!interest || !interest.trim()) {
    return 'Please select an area of interest';
  }
  
  if (!message || !message.trim()) {
    return 'Message is required';
  }
  
  return null; // No validation errors
}

// Validate email format
function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

module.exports = {
  validateContact,
  isValidEmail
};
