/**
 * Revelate Operations - Newsletter Script
 * Handle newsletter signups across the site
 */

document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.getElementById('newsletterForm');
  if (!newsletterForm) return;
  
  // Handle form submission
  newsletterForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form elements
    const emailInput = this.querySelector('input[type="email"]');
    const consentCheckbox = this.querySelector('input[type="checkbox"]');
    const submitButton = this.querySelector('button[type="submit"]');
    
    // Basic validation
    if (!emailInput.value.trim()) {
      alert('Please enter your email address');
      emailInput.focus();
      return;
    }
    
    if (!isValidEmail(emailInput.value.trim())) {
      alert('Please enter a valid email address');
      emailInput.focus();
      return;
    }
    
    if (consentCheckbox && !consentCheckbox.checked) {
      alert('Please agree to receive our newsletter');
      return;
    }
    
    // Show loading state
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    try {
      // Prepare data
      const data = {
        email: emailInput.value.trim(),
        name: ''
      };
      
      // Add UTM parameters from URL or session storage
      const utmParams = getUtmParameters();
      Object.assign(data, utmParams);
      
      // Submit the form
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Show success message
        showSuccess(newsletterForm);
        
        // Track conversion
        if (typeof gtag !== 'undefined') {
          gtag('event', 'newsletter_signup', {
            'event_category': 'conversion',
            'event_label': data.utm_source || 'direct'
          });
        }
      } else {
        // Show error message
        alert(result.message || 'There was a problem with your subscription. Please try again.');
        
        // Restore button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    } catch (error) {
      console.error('Error submitting newsletter form:', error);
      
      // Show error message
      alert('Could not connect to the server. Please try again later.');
      
      // Restore button
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });
  
  /**
   * Show success message
   * @param {HTMLElement} form - The form element
   */
  function showSuccess(form) {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'newsletter-success';
    successMessage.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <h3>Thank you for subscribing!</h3>
      <p>We've sent a confirmation email to your inbox.</p>
    `;
    
    // Replace form with success message
    form.style.opacity = '0';
    setTimeout(() => {
      form.style.display = 'none';
      form.parentNode.appendChild(successMessage);
      
      // Fade in success message
      setTimeout(() => {
        successMessage.classList.add('visible');
      }, 10);
      
      // Reset form for future use
      form.reset();
    }, 300);
  }
  
  /**
   * Get UTM parameters from URL or session storage
   * @returns {Object} - UTM parameters
   */
  function getUtmParameters() {
    const params = {};
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    
    // Check URL first
    const urlParams = new URLSearchParams(window.location.search);
    
    utmFields.forEach(field => {
      // Check URL
      if (urlParams.has(field)) {
        params[field] = urlParams.get(field);
        // Store in session
        sessionStorage.setItem(field, urlParams.get(field));
      } 
      // Fallback to session storage
      else if (sessionStorage.getItem(field)) {
        params[field] = sessionStorage.getItem(field);
      }
    });
    
    // Add referrer if available
    if (document.referrer && !params.utm_source) {
      params.referrer = document.referrer;
    }
    
    return params;
  }
  
  /**
   * Validate email format
   * @param {string} email - The email to validate
   * @returns {boolean} - Whether the email is valid
   */
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }
});
