/**
 * Revelate Operations - Contact Form
 * Handles contact form validation and submission
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form functionality
    initContactForm();
});

/**
 * Initialize contact form
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form inputs
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const interest = document.getElementById('interest');
        const message = document.getElementById('message');
        
        // Basic validation
        let isValid = true;
        
        if (!name.value.trim()) {
            showError(name, 'Please enter your name');
            isValid = false;
        } else {
            clearError(name);
        }
        
        if (!email.value.trim()) {
            showError(email, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(email);
        }
        
        if (interest.value === "") {
            showError(interest, 'Please select a service');
            isValid = false;
        } else {
            clearError(interest);
        }
        
        if (!message.value.trim()) {
            showError(message, 'Please enter your message');
            isValid = false;
        } else {
            clearError(message);
        }
        
        if (isValid) {
            // Get the submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Update button to show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Collect form data
            const formData = {
                name: name.value.trim(),
                email: email.value.trim(),
                phone: document.getElementById('phone')?.value.trim(),
                company: document.getElementById('company')?.value.trim(),
                interest: interest.value,
                message: message.value.trim()
            };
            
            // Check if API client is available
            if (window.RevOpsAPI && typeof window.RevOpsAPI.saveContact === 'function') {
                // Save to database
                window.RevOpsAPI.saveContact(formData)
                    .then(() => {
                        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                        showSuccessMessage();
                    })
                    .catch(error => {
                        console.error('Failed to save contact:', error);
                        // Show failure message
                        alert('Sorry, there was an error submitting your form. Please try again later.');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    });
            } else {
                // If API not available, fall back to mock submission for development
                console.log('API client not available, using mock submission');
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                    showSuccessMessage();
                }, 2000);
            }
            
            function showSuccessMessage() {
                setTimeout(() => {
                    // Reset form
                    contactForm.reset();
                    
                    // Show success message
                    const formContainer = document.querySelector('.contact-form-container');
                    formContainer.innerHTML = `
                        <div class="form-success">
                            <div class="success-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <h3>Thank You!</h3>
                            <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                            <button type="button" class="btn btn-primary btn-large" id="resetFormBtn">Send Another Message</button>
                        </div>
                    `;
                    
                    // Add event listener to reset button
                    const resetBtn = document.getElementById('resetFormBtn');
                    if (resetBtn) {
                        resetBtn.addEventListener('click', function() {
                            location.reload();
                        });
                    }
                }, 1000);
            }
        }
    });
    
    // Add real-time validation for form fields
    const formFields = contactForm.querySelectorAll('.form-control');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                clearError(this);
            }
        });
    });
}

/**
 * Validate a single form field
 * @param {HTMLElement} field - The field to validate
 */
function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        const labelText = field.previousElementSibling.textContent.replace(' *', '');
        showError(field, `${labelText} is required`);
    } else if (field.type === 'email' && field.value.trim() && !isValidEmail(field.value)) {
        showError(field, 'Please enter a valid email address');
    } else {
        clearError(field);
    }
}

/**
 * Show error message for a field
 * @param {HTMLElement} field - The field with an error
 * @param {string} message - Error message to display
 */
function showError(field, message) {
    field.classList.add('is-invalid');
    const feedback = field.nextElementSibling;
    if (feedback && feedback.classList.contains('form-feedback')) {
        feedback.textContent = message;
        feedback.style.display = 'block';
    }
}

/**
 * Clear error message for a field
 * @param {HTMLElement} field - The field to clear error for
 */
function clearError(field) {
    field.classList.remove('is-invalid');
    const feedback = field.nextElementSibling;
    if (feedback && feedback.classList.contains('form-feedback')) {
        feedback.textContent = '';
        feedback.style.display = 'none';
    }
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