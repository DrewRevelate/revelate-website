/**
 * Revelate Operations - Client Portal
 * Handles client portal login functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize portal functionality
    initPortal();
});

/**
 * Initialize portal login functionality
 */
function initPortal() {
    // Get the portal button, modal and form elements
    const portalBtn = document.getElementById('portal-btn');
    const portalModal = document.getElementById('portal-modal');
    const loginForm = portalModal ? portalModal.querySelector('#login-form') : null;
    
    // Exit if essential elements aren't found
    if (!portalBtn || !portalModal || !loginForm) return;
    
    /**
     * Handle portal button click - open the modal
     */
    portalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openPortalModal();
    });
    
    /**
     * Handle closing the modal when the close button is clicked
     */
    const closeBtn = portalModal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePortalModal);
    }
    
    /**
     * Handle closing the modal when clicking outside the modal content
     */
    portalModal.addEventListener('click', function(e) {
        if (e.target === portalModal) {
            closePortalModal();
        }
    });
    
    /**
     * Handle closing the modal when the Escape key is pressed
     */
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && portalModal.getAttribute('aria-hidden') === 'false') {
            closePortalModal();
        }
    });
    
    /**
     * Handle form submission with validation
     */
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form inputs
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const remember = document.getElementById('remember');
        
        // Validate form inputs
        if (validatePortalForm(email, password)) {
            // Simulate form submission (replace with actual API call in production)
            submitPortalForm(email, password, remember);
        }
    });
    
    /**
     * Add real-time validation for form fields
     */
    const formInputs = loginForm.querySelectorAll('input');
    formInputs.forEach(input => {
        // Validate on blur (when user leaves the field)
        input.addEventListener('blur', function() {
            if (input.hasAttribute('required')) {
                if (!input.value.trim()) {
                    showPortalError(input, `${input.previousElementSibling.textContent} is required`);
                } else if (input.type === 'email' && !isValidEmail(input.value)) {
                    showPortalError(input, 'Please enter a valid email address');
                } else {
                    clearPortalError(input);
                }
            }
        });
        
        // Clear error when user starts typing
        input.addEventListener('input', function() {
            if (input.classList.contains('is-invalid')) {
                clearPortalError(input);
            }
        });
    });
}

/**
 * Open the portal login modal
 */
function openPortalModal() {
    const portalModal = document.getElementById('portal-modal');
    if (!portalModal) return;
    
    // Show the modal
    portalModal.setAttribute('aria-hidden', 'false');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Focus the first input field
    setTimeout(() => {
        const firstInput = portalModal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
    
    // Add animation class
    portalModal.classList.add('fade-in');
}

/**
 * Close the portal login modal
 */
function closePortalModal() {
    const portalModal = document.getElementById('portal-modal');
    if (!portalModal) return;
    
    // Hide the modal
    portalModal.setAttribute('aria-hidden', 'true');
    
    // Restore body scrolling
    document.body.style.overflow = '';
    
    // Reset the form
    const loginForm = portalModal.querySelector('#login-form');
    if (loginForm) {
        loginForm.reset();
        
        // Clear any validation errors
        const invalidInputs = loginForm.querySelectorAll('.is-invalid');
        invalidInputs.forEach(input => clearPortalError(input));
    }
}

/**
 * Validate portal login form
 * @param {HTMLElement} email - Email input element
 * @param {HTMLElement} password - Password input element
 * @returns {boolean} - Whether the form is valid
 */
function validatePortalForm(email, password) {
    let isValid = true;
    
    // Reset previous errors
    clearPortalError(email);
    clearPortalError(password);
    
    // Validate email
    if (!email.value.trim()) {
        showPortalError(email, 'Email address is required');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        showPortalError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password.value.trim()) {
        showPortalError(password, 'Password is required');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Show validation error for a form field
 * @param {HTMLElement} input - The input element
 * @param {string} message - Error message to display
 */
function showPortalError(input, message) {
    if (!input) return;
    
    // Add invalid class to input
    input.classList.add('is-invalid');
    
    // Display error message
    const feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains('form-feedback')) {
        feedback.textContent = message;
        feedback.style.display = 'block';
    }
}

/**
 * Clear validation error for a form field
 * @param {HTMLElement} input - The input element 
 */
function clearPortalError(input) {
    if (!input) return;
    
    // Remove invalid class
    input.classList.remove('is-invalid');
    
    // Clear error message
    const feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains('form-feedback')) {
        feedback.textContent = '';
        feedback.style.display = 'none';
    }
}

/**
 * Submit portal login form
 * @param {HTMLElement} email - Email input element
 * @param {HTMLElement} password - Password input element
 * @param {HTMLElement} remember - Remember checkbox element
 */
function submitPortalForm(email, password, remember) {
    // Get the submit button
    const submitBtn = document.querySelector('#login-form button[type="submit"]');
    if (!submitBtn) return;
    
    // Store original button text
    const originalText = submitBtn.innerHTML;
    
    // Update button to show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    
    // Data to send to server (in a real implementation)
    const formData = {
        email: email.value.trim(),
        password: password.value,
        remember: remember ? remember.checked : false
    };
    
    // Simulate API call (replace with actual API call in production)
    setTimeout(() => {
        // For demo, we'll always show success
        // In production, you would handle success/error based on API response
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
        
        setTimeout(() => {
            // This would normally redirect to the client portal dashboard
            // For now, just close the modal
            closePortalModal();
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // In a real app, you might redirect here
            // window.location.href = '/portal/dashboard';
            
            // For demo, we'll show a notification
            showNotification('Successfully signed in. Redirecting to portal...', 'success');
        }, 1000);
    }, 1500);
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists, create if not
    let notifContainer = document.querySelector('.notification-container');
    
    if (!notifContainer) {
        notifContainer = document.createElement('div');
        notifContainer.className = 'notification-container';
        document.body.appendChild(notifContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Add appropriate icon
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add notification to container
    notifContainer.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Wait for fade out animation before removing
        setTimeout(() => {
            notification.remove();
            
            // Remove container if empty
            if (notifContainer.children.length === 0) {
                notifContainer.remove();
            }
        }, 300);
    }, 5000);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
