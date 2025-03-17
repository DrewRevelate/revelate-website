/**
 * Revelate Operations - API Client
 * Handles API requests to the backend for form submissions
 */

// API client for RevOps website
window.RevOpsAPI = (function() {
  // Base URL for API requests
  const API_BASE_URL = window.location.origin;

  /**
   * Save contact form data to the database
   * @param {Object} contactData - Contact form data
   * @returns {Promise} - Promise that resolves with the API response
   */
  async function saveContact(contactData) {
    try {
      console.log('Saving contact data:', contactData);
      
      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save contact');
      }
      
      const result = await response.json();
      console.log('Contact saved successfully:', result);
      return result;
    } catch (error) {
      console.error('Error saving contact:', error);
      throw error;
    }
  }
  
  /**
   * Save assessment data to the database
   * @param {Object} assessmentData - Assessment form data
   * @returns {Promise} - Promise that resolves with the API response
   */
  async function saveAssessment(assessmentData) {
    try {
      console.log('Saving assessment data');
      
      const response = await fetch(`${API_BASE_URL}/api/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assessmentData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save assessment');
      }
      
      const result = await response.json();
      console.log('Assessment saved successfully:', result);
      return result;
    } catch (error) {
      console.error('Error saving assessment:', error);
      throw error;
    }
  }
  
  // Public API
  return {
    saveContact,
    saveAssessment
  };
})();