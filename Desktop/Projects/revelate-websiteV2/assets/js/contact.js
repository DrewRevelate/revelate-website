/**
 * Revelate Operations - Enhanced Contact Form
 * Optimized for user experience, validation, and data collection
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the contact form if it exists
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  // Initialize notification system
  initNotifications();
  
  // Capture UTM parameters and add them to the form
  captureUtmParameters();
  
  // Setup multi-step form
  setupMultiStepForm();
  
  // Add inline validation to improve user experience
  setupFormValidation();
  
  // Setup newsletter form if it exists
  setupNewsletterForm();
  
  // Handle form submission
  contactForm.addEventListener('submit', handleFormSubmit);
});

/**
 * Initialize notification system
 */
function initNotifications() {
  window.notifications = {
    container: document.getElementById('notification-container'),
    
    show: function(message, type = 'info', duration = 5000) {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon">
            ${this.getIcon(type)}
          </div>
          <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">&times;</button>
      `;
      
      this.container.appendChild(notification);
      
      // Add visible class after a small delay for animation
      setTimeout(() => {
        notification.classList.add('visible');
      }, 10);
      
      // Attach close handler
      const closeBtn = notification.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => {
        this.hide(notification);
      });
      
      // Auto-hide after duration
      if (duration) {
        setTimeout(() => {
          this.hide(notification);
        }, duration);
      }
      
      return notification;
    },
    
    hide: function(notification) {
      notification.classList.remove('visible');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300); // Match transition duration
    },
    
    getIcon: function(type) {
      switch (type) {
        case 'success':
          return '<i class="fas fa-check-circle"></i>';
        case 'error':
          return '<i class="fas fa-exclamation-circle"></i>';
        case 'warning':
          return '<i class="fas fa-exclamation-triangle"></i>';
        default:
          return '<i class="fas fa-info-circle"></i>';
      }
    },
    
    success: function(message, duration) {
      return this.show(message, 'success', duration);
    },
    
    error: function(message, duration) {
      return this.show(message, 'error', duration);
    },
    
    warning: function(message, duration) {
      return this.show(message, 'warning', duration);
    },
    
    info: function(message, duration) {
      return this.show(message, 'info', duration);
    }
  };
}

/**
 * Capture UTM parameters from URL and add them to the form
 */
function captureUtmParameters() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  // Get UTM parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {};
  
  // List of UTM parameters to capture
  const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  
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
      let input = contactForm.querySelector(`input[name="${field}"]`);
      
      if (!input) {
        // Create the field if it doesn't exist
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = field;
        contactForm.appendChild(input);
      }
      
      // Set or update the value
      input.value = utmParams[field];
    }
  });
  
  // Also add referrer if available
  if (document.referrer) {
    let referrerInput = contactForm.querySelector('input[name="referrer"]');
    
    if (!referrerInput) {
      referrerInput = document.createElement('input');
      referrerInput.type = 'hidden';
      referrerInput.name = 'referrer';
      contactForm.appendChild(referrerInput);
    }
    
    referrerInput.value = document.referrer;
  }
}

/**
 * Setup multi-step form navigation
 */
function setupMultiStepForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  const steps = form.querySelectorAll('.form-step-content');
  const stepIndicators = document.querySelectorAll('.form-step');
  const prevBtn = form.querySelector('.form-prev');
  const nextBtn = form.querySelector('.form-next');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  let currentStep = 0;
  
  // Show only the first step initially
  showStep(currentStep);
  
  // Next button click handler
  nextBtn.addEventListener('click', () => {
    // Validate current step
    if (validateStep(currentStep)) {
      goToStep(currentStep + 1);
    }
  });
  
  // Previous button click handler
  prevBtn.addEventListener('click', () => {
    goToStep(currentStep - 1);
  });
  
  /**
   * Show a specific step and hide others
   * @param {number} stepIndex - The step index to show
   */
  function showStep(stepIndex) {
    // Hide all steps
    steps.forEach((step, index) => {
      step.style.display = index === stepIndex ? 'block' : 'none';
    });
    
    // Update navigation buttons
    prevBtn.style.display = stepIndex > 0 ? 'block' : 'none';
    
    if (stepIndex >= steps.length - 1) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'block';
    } else {
      nextBtn.style.display = 'block';
      submitBtn.style.display = 'none';
    }
    
    // Update step indicators
    stepIndicators.forEach((indicator, index) => {
      if (index < stepIndex) {
        indicator.classList.remove('active');
        indicator.classList.add('completed');
      } else if (index === stepIndex) {
        indicator.classList.add('active');
        indicator.classList.remove('completed');
      } else {
        indicator.classList.remove('active', 'completed');
      }
    });
    
    // Scroll to top of form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  /**
   * Go to a specific step
   * @param {number} stepIndex - The step index to go to
   */
  function goToStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    
    currentStep = stepIndex;
    showStep(currentStep);
  }
  
  /**
   * Validate the current step
   * @param {number} stepIndex - The step index to validate
   * @returns {boolean} - Whether the step is valid
   */
  function validateStep(stepIndex) {
    const currentStepEl = steps[stepIndex];
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      // Focus the first invalid field
      const firstInvalid = currentStepEl.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      
      // Show notification
      window.notifications.warning('Please fill in all required fields correctly');
    }
    
    return isValid;
  }
}

/**
 * Setup inline validation for form fields
 */
function setupFormValidation() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  // Get all required inputs
  const requiredInputs = contactForm.querySelectorAll('[required]');
  
  // Add blur event listener to each required field
  requiredInputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    // Also validate on input for fields that already have a value
    input.addEventListener('input', function() {
      if (this.classList.contains('is-invalid')) {
        validateField(this);
      }
    });
  });
  
  // Add specific validation for email field
  const emailField = contactForm.querySelector('input[type="email"]');
  if (emailField) {
    emailField.addEventListener('blur', function() {
      if (this.value.trim() && !isValidEmail(this.value.trim())) {
        showError(this, 'Please enter a valid email address');
      } else if (this.value.trim()) {
        clearError(this);
      }
    });
  }
}

/**
 * Setup newsletter form
 */
function setupNewsletterForm() {
  const newsletterForm = document.getElementById('newsletterForm');
  if (!newsletterForm) return;
  
  newsletterForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Validate email
    const emailInput = this.querySelector('input[type="email"]');
    if (!emailInput.value.trim()) {
      window.notifications.warning('Please enter your email address');
      return;
    }
    
    if (!isValidEmail(emailInput.value.trim())) {
      window.notifications.warning('Please enter a valid email address');
      return;
    }
    
    // Validate consent
    const consentCheckbox = this.querySelector('input[type="checkbox"]');
    if (!consentCheckbox.checked) {
      window.notifications.warning('Please agree to receive marketing communications');
      return;
    }
    
    // Collect form data
    const formData = {
      email: emailInput.value.trim(),
      name: ''
    };
    
    // Add UTM parameters
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign'];
    utmFields.forEach(field => {
      const value = sessionStorage.getItem(field);
      if (value) {
        formData[field] = value;
      }
    });
    
    try {
      // Submit the form
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
        window.notifications.success('Thank you for subscribing to our newsletter!');
        
        // Reset form
        newsletterForm.reset();
      } else {
        // Show error message
        window.notifications.error(result.message || 'There was a problem with your subscription');
      }
    } catch (error) {
      console.error('Error submitting newsletter form:', error);
      window.notifications.error('There was a problem connecting to the server');
    }
  });
}

/**
 * Validate a single form field
 * @param {HTMLElement} field - The field to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(field) {
  // Check if field is required and empty
  if (field.hasAttribute('required') && !field.value.trim()) {
    showError(field, `${getFieldLabel(field)} is required`);
    return false;
  }
  
  // Validate email format if it's an email field
  if (field.type === 'email' && field.value.trim() && !isValidEmail(field.value.trim())) {
    showError(field, 'Please enter a valid email address');
    return false;
  }
  
  // If we got here, the field is valid
  clearError(field);
  return true;
}

/**
 * Get a human-readable label for a field
 * @param {HTMLElement} field - The field element
 * @returns {string} - The label text
 */
function getFieldLabel(field) {
  // Try to get the associated label
  const id = field.id;
  const label = document.querySelector(`label[for="${id}"]`);
  
  if (label) {
    // Remove any asterisks or colons from the label text
    return label.textContent.replace(/[*:]/g, '').trim();
  }
  
  // Fall back to the placeholder or name
  return field.placeholder || field.name || 'This field';
}

/**
 * Show an error message for a field
 * @param {HTMLElement} field - The field with the error
 * @param {string} message - The error message
 */
function showError(field, message) {
  field.classList.add('is-invalid');
  field.classList.remove('is-valid');
  
  // Find or create the error message element
  let feedback = field.nextElementSibling;
  if (!feedback || !feedback.classList.contains('form-feedback')) {
    feedback = document.createElement('div');
    feedback.className = 'form-feedback';
    field.insertAdjacentElement('afterend', feedback);
  }
  
  feedback.textContent = message;
  feedback.style.display = 'block';
}

/**
 * Clear the error state for a field
 * @param {HTMLElement} field - The field to clear
 */
function clearError(field) {
  field.classList.remove('is-invalid');
  field.classList.add('is-valid');
  
  // Find and clear the error message
  const feedback = field.nextElementSibling;
  if (feedback && feedback.classList.contains('form-feedback')) {
    feedback.textContent = '';
    feedback.style.display = 'none';
  }
}

/**
 * Handle form submission
 * @param {Event} event - The submit event
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  
  // Validate all required fields
  let isValid = true;
  const requiredFields = form.querySelectorAll('[required]');
  
  requiredFields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });
  
  if (!isValid) {
    // Focus the first invalid field
    const firstInvalid = form.querySelector('.is-invalid');
    if (firstInvalid) {
      firstInvalid.focus();
    }
    
    // Show notification
    window.notifications.warning('Please fill in all required fields correctly');
    return;
  }
  
  // Disable submit button and show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  
  try {
    // Collect form data
    const formData = new FormData(form);
    const formDataJson = {};
    
    for (const [key, value] of formData.entries()) {
      formDataJson[key] = value;
    }
    
    // Send the data to the server
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formDataJson)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Show success state
      submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      
      // Replace form with success message
      const formContainer = form.parentElement;
      
      const successMessage = document.createElement('div');
      successMessage.className = 'form-success-message';
      successMessage.innerHTML = `
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3>Thank you for contacting us!</h3>
        <p>We've received your message and will respond as soon as possible.</p>
      `;
      
      // Animate the transition
      form.style.opacity = '0';
      setTimeout(() => {
        form.style.display = 'none';
        formContainer.appendChild(successMessage);
        
        // Fade in the success message
        setTimeout(() => {
          successMessage.style.opacity = '1';
        }, 50);
      }, 300);
      
      // Show notification
      window.notifications.success('Your message has been sent successfully!');
      
      // Reset form for future use
      form.reset();
      
      // Scroll to success message
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Show error state
      submitButton.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error';
      
      // Show notification
      window.notifications.error(result.message || 'There was a problem submitting your form');
      
      // Restore button after a delay
      setTimeout(() => {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }, 3000);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    
    // Show error state
    submitButton.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error';
    
    // Show notification
    window.notifications.error('There was a problem connecting to the server. Please try again later.');
    
    // Restore button after a delay
    setTimeout(() => {
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
    }, 3000);
  }
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