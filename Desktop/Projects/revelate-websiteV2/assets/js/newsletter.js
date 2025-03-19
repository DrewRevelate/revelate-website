/**
 * Revelate Operations - Newsletter Form Handler
 * Optimized for data collection and user experience
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize newsletter form if it exists
  const newsletterForm = document.getElementById('newsletterForm');
  if (!newsletterForm) return;
  
  // Capture UTM parameters for attribution
  captureNewsletterUtmParameters();
  
  // Handle form submission
  newsletterForm.addEventListener('submit', handleNewsletterSubmit);
});

/**
 * Capture UTM parameters from URL and add them to the newsletter form
 */
function captureNewsletterUtmParameters() {
  const newsletterForm = document.getElementById('newsletterForm');
  if (!newsletterForm) return;
  
  // Get UTM parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {};
  
  // List of UTM parameters to capture
  const utmFields = ['utm_source', 'utm_medium', 'utm_campaign'];
  
  // Store parameters in session storage and collect for form
  utmFields.forEach(param => {
    if (urlParams.has(param)) {
      utmParams[param] = urlParams.get(param);
      sessionStorage.setItem(param, urlParams.get(param));
    } else if (sessionStorage.getItem(param)) {
      // Use previously stored value if available
      utmParams[param] = sessionStorage.getItem(param);
    }
  });
  
  // Add UTM fields to form as hidden inputs
  utmFields.forEach(field => {
    if (utmParams[field]) {
      // Check if the field already exists
      let input = newsletterForm.querySelector(`input[name="${field}"]`);
      
      if (!input) {
        // Create the field if it doesn't exist
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = field;
        newsletterForm.appendChild(input);
      }
      
      // Set or update the value
      input.value = utmParams[field];
    }
  });
  
  // Also add referrer if available
  if (document.referrer) {
    let referrerInput = newsletterForm.querySelector('input[name="referrer"]');
    
    if (!referrerInput) {
      referrerInput = document.createElement('input');
      referrerInput.type = 'hidden';
      referrerInput.name = 'referrer';
      newsletterForm.appendChild(referrerInput);
    }
    
    referrerInput.value = document.referrer;
  }
}

/**
 * Handle newsletter form submission
 * @param {Event} event - The submit event
 */
async function handleNewsletterSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const emailInput = form.querySelector('input[type="email"]');
  const consentCheckbox = form.querySelector('input[type="checkbox"]');
  const submitButton = form.querySelector('button[type="submit"]');
  
  // Validate form
  if (!emailInput.value.trim()) {
    showNotification('Please enter your email address', 'warning');
    emailInput.focus();
    return;
  }
  
  if (!isValidEmail(emailInput.value.trim())) {
    showNotification('Please enter a valid email address', 'warning');
    emailInput.focus();
    return;
  }
  
  if (consentCheckbox && !consentCheckbox.checked) {
    showNotification('Please agree to receive our newsletter', 'warning');
    return;
  }
  
  // Show loading state
  const originalButtonText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  
  try {
    // Prepare form data
    const formData = {
      email: emailInput.value.trim(),
      name: '', // Use empty string as default
    };
    
    // Add UTM parameters if available
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign'];
    utmFields.forEach(field => {
      const input = form.querySelector(`input[name="${field}"]`);
      if (input && input.value) {
        formData[field] = input.value;
      }
    });
    
    // Add referrer if available
    const referrerInput = form.querySelector('input[name="referrer"]');
    if (referrerInput && referrerInput.value) {
      formData.referrer = referrerInput.value;
    }
    
    // Submit form data to server
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Show success message
      showNotification('Thank you for subscribing!', 'success');
      
      // Reset form
      form.reset();
      
      // Track conversion
      if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_signup', {
          'event_category': 'engagement',
          'event_label': formData.utm_source || 'direct'
        });
      }
    } else {
      // Show error message
      showNotification(result.message || 'There was a problem with your subscription', 'error');
    }
  } catch (error) {
    console.error('Error submitting newsletter form:', error);
    showNotification('Failed to connect to the server. Please try again later.', 'error');
  } finally {
    // Restore button state
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
  // Check if notifications system is available
  if (window.notifications) {
    window.notifications[type](message);
    return;
  }
  
  // Fallback to alert if notification system is not available
  alert(message);
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}