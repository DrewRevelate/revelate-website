/**
 * Revelate Operations - Client Portal
 * Handles client portal login functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the portal button
    const portalBtn = document.getElementById('portal-btn');
    
    if (portalBtn) {
        // Update the portal button to go directly to the external portal
        portalBtn.addEventListener('click', function(e) {
            // Allow the default action (linking to client.revelateops.com)
            // The href attribute is set in the header.html template
        });
    }
    
    // Initialize the portal modal functionality for backward compatibility
    // This code can be removed once the direct link is working reliably
    initPortalModal();
});

/**
 * Initialize portal modal functionality
 */
function initPortalModal() {
    const portalModal = document.getElementById('portal-modal');
    const loginForm = portalModal ? portalModal.querySelector('#login-form') : null;
    
    // Exit if essential elements aren't found
    if (!portalModal || !loginForm) return;

    // Add open event to all portal links
    const portalLinks = document.querySelectorAll('.nav-cta, [data-modal="login"]');
    portalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if it's a link to the client portal
            if (link.href && link.href.includes('client.revelateops.com')) {
                e.preventDefault();
            }
            openPortalModal();
        });
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
     * This will redirect to the external portal site
     */
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form inputs
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        
        // Simple validation
        if (validatePortalForm(email, password)) {
            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            
            // Simulate brief loading then redirect to external portal
            setTimeout(() => {
                window.location.href = 'https://client.revelateops.com';
            }, 1000);
        }
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
    portalModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Focus the first input for accessibility
    setTimeout(() => {
        const firstInput = portalModal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
}

/**
 * Close the portal login modal
 */
function closePortalModal() {
    const portalModal = document.getElementById('portal-modal');
    if (!portalModal) return;
    
    // Hide the modal
    portalModal.setAttribute('aria-hidden', 'true');
    
    // Reset the form
    const loginForm = portalModal.querySelector('#login-form');
    if (loginForm) {
        loginForm.reset();
        
        // Clear any validation errors
        const invalidInputs = loginForm.querySelectorAll('.is-invalid');
        invalidInputs.forEach(input => {
            input.classList.remove('is-invalid');
            const feedback = input.nextElementSibling;
            if (feedback && feedback.classList.contains('form-feedback')) {
                feedback.textContent = '';
                feedback.style.display = 'none';
            }
        });
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
    email.classList.remove('is-invalid');
    password.classList.remove('is-invalid');
    
    const emailFeedback = email.nextElementSibling;
    const passwordFeedback = password.nextElementSibling;
    
    if (emailFeedback) emailFeedback.textContent = '';
    if (passwordFeedback) passwordFeedback.textContent = '';
    
    // Validate email
    if (!email.value.trim()) {
        email.classList.add('is-invalid');
        if (emailFeedback) {
            emailFeedback.textContent = 'Email address is required';
            emailFeedback.style.display = 'block';
        }
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        email.classList.add('is-invalid');
        if (emailFeedback) {
            emailFeedback.textContent = 'Please enter a valid email address';
            emailFeedback.style.display = 'block';
        }
        isValid = false;
    }
    
    // Validate password
    if (!password.value.trim()) {
        password.classList.add('is-invalid');
        if (passwordFeedback) {
            passwordFeedback.textContent = 'Password is required';
            passwordFeedback.style.display = 'block';
        }
        isValid = false;
    }
    
    return isValid;
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