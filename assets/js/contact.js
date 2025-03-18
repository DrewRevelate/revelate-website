/**
 * Revelate Operations - Contact Form Handler
 * Handles contact form submission to API
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous error messages
        document.querySelectorAll('.form-feedback').forEach(feedback => {
            feedback.textContent = '';
        });
        document.querySelectorAll('.form-control').forEach(control => {
            control.classList.remove('is-invalid');
        });
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            company: document.getElementById('company').value,
            interest: document.getElementById('interest').value,
            message: document.getElementById('message').value
        };
        
        // Validate form data
        let isValid = true;
        
        if (!formData.name.trim()) {
            showError(document.getElementById('name'), 'Name is required');
            isValid = false;
        }
        
        if (!formData.email.trim()) {
            showError(document.getElementById('email'), 'Email is required');
            isValid = false;
        } else if (!isValidEmail(formData.email)) {
            showError(document.getElementById('email'), 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!formData.interest) {
            showError(document.getElementById('interest'), 'Please select an area of interest');
            isValid = false;
        }
        
        if (!formData.message.trim()) {
            showError(document.getElementById('message'), 'Message is required');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Update submit button state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            // Submit to API
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank you for your message!</h3>
                    <p>We've received your inquiry and will respond within 24 hours.</p>
                `;
                
                // Insert success message and hide form
                contactForm.parentNode.insertBefore(successMessage, contactForm);
                contactForm.style.display = 'none';
                
                // Reset form
                contactForm.reset();
            } else {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show error message
                alert('There was a problem submitting your form: ' + (result.message || 'Please try again.'));
            }
        } catch (error) {
            console.error('Error:', error);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            alert('There was a problem connecting to the server. Please try again later.');
        }
    });
    
    /**
     * Show error message for a form field
     * @param {HTMLElement} input - The form field
     * @param {string} message - The error message
     */
    function showError(input, message) {
        input.classList.add('is-invalid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('form-feedback')) {
            feedback.textContent = message;
        }
    }
    
    /**
     * Validate email format
     * @param {string} email - The email to validate
     * @returns {boolean} Whether the email is valid
     */
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }
});
