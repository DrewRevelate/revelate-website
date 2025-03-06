document.addEventListener('DOMContentLoaded', function() {
    // Contact form validation and submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const company = document.getElementById('company').value.trim();
            const message = document.getElementById('message').value.trim();
            const consent = document.getElementById('privacy-consent').checked;
            
            // Basic validation
            let isValid = true;
            
            if (name === '') {
                showError('name', 'Please enter your name');
                isValid = false;
            } else {
                clearError('name');
            }
            
            if (email === '') {
                showError('email', 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError('email');
            }
            
            if (message === '') {
                showError('message', 'Please enter your message');
                isValid = false;
            } else {
                clearError('message');
            }
            
            if (!consent) {
                showError('privacy-consent', 'You must agree to our privacy policy');
                isValid = false;
            } else {
                clearError('privacy-consent');
            }
            
            // Simulate form submission for demo purposes
            if (isValid) {
                document.getElementById('submit-btn').innerHTML = 'Sending...';
                document.getElementById('submit-btn').disabled = true;
                
                // This would be replaced with your actual form submission code
                setTimeout(() => {
                    // Show success message
                    const formContent = document.querySelector('.form-content');
                    const successMessage = document.querySelector('.success-message');
                    
                    formContent.style.display = 'none';
                    successMessage.style.display = 'block';
                    
                    // Reset the form
                    contactForm.reset();
                }, 1500);
            }
        });
    }
    
    // Helper functions
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = field.parentElement.querySelector('.form-error') || document.createElement('div');
        
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        
        if (!field.parentElement.querySelector('.form-error')) {
            field.parentElement.appendChild(errorElement);
        }
        
        field.classList.add('error');
    }
    
    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = field.parentElement.querySelector('.form-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        field.classList.remove('error');
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});