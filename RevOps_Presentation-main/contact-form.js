/**
 * Contact Form Functionality for Full Throttle Presentation
 * Handles form submission and data storage
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form data storage if it doesn't exist
    if (!localStorage.getItem('contactFormSubmissions')) {
        localStorage.setItem('contactFormSubmissions', JSON.stringify([]));
    }
    
    // Find contact form elements
    const contactForm = document.getElementById('contactForm');
    const contactFormContainer = document.getElementById('contactFormContainer');
    const contactFormSuccess = document.getElementById('contactFormSuccess');
    
    // Form is always visible, no need for toggle functionality
    
    // Handle form submission in contact-form.js
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Disable submit button to prevent multiple submissions
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = 'Submitting...';
        }
        
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            major: document.getElementById('major').value,
            gradYear: document.getElementById('gradYear').value,
            careerGoals: document.getElementById('careerGoals').value,
            sessionId: sessionStorage.getItem('sessionId') || '',
            userAgent: navigator.userAgent,
            screen: `${window.screen.width}x${window.screen.height}`
        };
        
        // Send data to server
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle success
            console.log('Form submission successful:', data);
            
            // Show success message
            contactForm.reset();
            
            // If the container exists, hide it
            if (contactFormContainer) {
                contactFormContainer.style.display = 'none';
            }
            
            // Show success message
            if (contactFormSuccess) {
                contactFormSuccess.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            
            // Re-enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Submit';
            }
            
            // Try to save to localStorage as fallback
            try {
                let pendingSubmissions = JSON.parse(localStorage.getItem('pendingContactSubmissions') || '[]');
                pendingSubmissions.push({
                    ...formData,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('pendingContactSubmissions', JSON.stringify(pendingSubmissions));
                
                // Still show success to user, but log the error
                contactForm.reset();
                if (contactFormContainer) {
                    contactFormContainer.style.display = 'none';
                }
                if (contactFormSuccess) {
                    contactFormSuccess.style.display = 'block';
                }
            } catch (localStorageError) {
                console.error('Failed to save form data to localStorage:', localStorageError);
                alert('There was an error submitting the form. Please try again later.');
            }
        });
    });
});