/**
 * Revelate Operations - Main JavaScript
 * Core functionality for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize header functionality
    initHeader();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize service card links
    initServiceLinks();
    
    // Check if the portal button exists and initialize modal
    if (document.getElementById('portal-btn')) {
        initPortalModal();
    }
    
    // Check for page-specific initializations
    initPageSpecific();
});

/**
 * Initialize header functionality (sticky header, mobile menu)
 */
function initHeader() {
    const header = document.getElementById('header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Sticky header on scroll
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Initial check and add scroll listener
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu toggle
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
        });
        
        // Close mobile menu when clicking a nav link
        const navItems = navLinks.querySelectorAll('.nav-link');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navLinks && 
                mobileToggle.getAttribute('aria-expanded') === 'true' && 
                !navLinks.contains(event.target) && 
                !mobileToggle.contains(event.target)) {
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Highlight active nav link based on current page
    highlightCurrentPage();
}

/**
 * Highlight the active navigation link based on the current page
 */
function highlightCurrentPage() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Handle root/index page
        if ((currentPath === '/' || currentPath.endsWith('index.html')) && 
            (href === '/' || href === '/index.html' || href === 'index.html')) {
            link.classList.add('active');
        }
        // Handle other pages
        else if (href && currentPath.includes(href) && href !== '/' && href !== 'index.html') {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    
    if (!backToTop) return;
    
    // Show button when scrolled down
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize service card links
 */
function initServiceLinks() {
    const serviceLinks = document.querySelectorAll('.service-link');
    
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If it's a true link (with href), let it navigate
            if (this.getAttribute('href')) return;
            
            // Otherwise, prevent default and handle expansion
            e.preventDefault();
            
            const card = this.closest('.service-card');
            
            if (card) {
                // Toggle expanded class
                card.classList.toggle('expanded');
                
                // Update aria-expanded state
                const expanded = card.classList.contains('expanded');
                this.setAttribute('aria-expanded', expanded);
                
                // Update text if needed
                const textSpan = this.querySelector('span');
                if (textSpan) {
                    textSpan.textContent = expanded ? 'Show Less' : 'Learn More';
                }
            }
        });
    });
}

/**
 * Initialize client portal modal
 */
function initPortalModal() {
    const portalBtn = document.getElementById('portal-btn');
    const portalModal = document.getElementById('portal-modal');
    const closeBtn = portalModal ? portalModal.querySelector('.modal-close') : null;
    const loginForm = portalModal ? portalModal.querySelector('#login-form') : null;
    
    // Open modal when portal button is clicked
    if (portalBtn && portalModal) {
        portalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(portalModal);
        });
    }
    
    // Close modal when close button is clicked
    if (closeBtn && portalModal) {
        closeBtn.addEventListener('click', function() {
            closeModal(portalModal);
        });
    }
    
    // Close modal when clicking outside of content
    if (portalModal) {
        portalModal.addEventListener('click', function(e) {
            if (e.target === portalModal) {
                closeModal(portalModal);
            }
        });
    }
    
    // Close modal when escape key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && portalModal && portalModal.getAttribute('aria-hidden') === 'false') {
            closeModal(portalModal);
        }
    });
    
    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple client-side validation
            const email = this.querySelector('#email');
            const password = this.querySelector('#password');
            let isValid = true;
            
            // Clear previous errors
            document.querySelectorAll('.form-feedback').forEach(feedback => {
                feedback.textContent = '';
            });
            document.querySelectorAll('.form-control').forEach(control => {
                control.classList.remove('is-invalid');
            });
            
            // Validate email
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value.trim())) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            }
            
            // Validate password
            if (!password.value.trim()) {
                showError(password, 'Password is required');
                isValid = false;
            }
            
            if (isValid) {
                // This would normally send the data to the server
                // For demo purposes, we'll just show a success message
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
                
                // Simulate server request
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                    
                    setTimeout(() => {
                        // Here you would redirect to the client portal
                        // For now, just close the modal and reset the form
                        closeModal(portalModal);
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        loginForm.reset();
                    }, 1000);
                }, 1500);
            }
        });
    }
}

/**
 * Open a modal
 * @param {HTMLElement} modal - The modal element to open
 */
function openModal(modal) {
    if (!modal) return;
    
    // Make modal visible
    modal.setAttribute('aria-hidden', 'false');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Focus first input if there is one
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
}

/**
 * Close a modal
 * @param {HTMLElement} modal - The modal element to close
 */
function closeModal(modal) {
    if (!modal) return;
    
    // Hide modal
    modal.setAttribute('aria-hidden', 'true');
    
    // Re-enable body scrolling
    document.body.style.overflow = '';
}

/**
 * Show validation error for a form field
 * @param {HTMLElement} input - The input element
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
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

/**
 * Initialize page-specific functionality based on current URL
 */
function initPageSpecific() {
    const path = window.location.pathname;
    
    // Home page specific initializations
    if (path === '/' || path.endsWith('index.html')) {
        // These will be handled by their own JS files
        console.log('Home page loaded');
    }
    
    // Services page
    else if (path.includes('services.html')) {
        // Initialize expandable services
        initExpandableCards();
    }
    
    // Contact page
    else if (path.includes('contact.html')) {
        initContactForm();
    }
    
    // Assessment page
    else if (path.includes('assessment.html')) {
        console.log('Assessment page loaded');
        // Assessment page JavaScript is loaded separately
    }
}

/**
 * Initialize expandable cards (for services page)
 */
function initExpandableCards() {
    const cards = document.querySelectorAll('.feature-card');
    const toggles = document.querySelectorAll('.feature-link');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.feature-card');
            const isExpanded = card.classList.contains('expanded');
            
            // Close all cards first
            cards.forEach(c => c.classList.remove('expanded'));
            toggles.forEach(t => {
                t.setAttribute('aria-expanded', 'false');
                if (t.querySelector('.link-text')) {
                    t.querySelector('.link-text').textContent = 'Learn More';
                }
            });
            
            // Then expand this one if it wasn't already expanded
            if (!isExpanded) {
                card.classList.add('expanded');
                this.setAttribute('aria-expanded', 'true');
                if (this.querySelector('.link-text')) {
                    this.querySelector('.link-text').textContent = 'Close';
                }
                
                // Scroll to the card if it's not fully visible
                const cardRect = card.getBoundingClientRect();
                const headerHeight = document.getElementById('header').offsetHeight;
                
                if (cardRect.top < headerHeight) {
                    window.scrollTo({
                        top: window.pageYOffset + cardRect.top - headerHeight - 20,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // If URL has a hash, open that card
    const hash = window.location.hash;
    if (hash) {
        const targetCard = document.querySelector(hash);
        if (targetCard) {
            const toggle = targetCard.querySelector('.feature-link');
            if (toggle) {
                setTimeout(() => {
                    toggle.click();
                }, 500);
            }
        }
    }
}

/* Case studies section removed */

/**
 * Initialize contact form validation
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        // Clear all error states
        contactForm.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('is-invalid');
        });
        contactForm.querySelectorAll('.form-feedback').forEach(feedback => {
            feedback.textContent = '';
        });
        
        // Check required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, `${field.getAttribute('placeholder') || 'This field'} is required`);
                isValid = false;
            }
        });
        
        // Validate email format if present
        const emailField = contactForm.querySelector('input[type="email"]');
        if (emailField && emailField.value.trim() && !isValidEmail(emailField.value.trim())) {
            showError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        if (isValid) {
            // Submit the form - in a real application, this would use fetch or XMLHttpRequest
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate server request
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank you for your message!</h3>
                    <p>We've received your inquiry and will respond promptly.</p>
                `;
                
                // Insert success message and hide form
                contactForm.parentNode.insertBefore(successMessage, contactForm);
                contactForm.style.display = 'none';
                
                // Reset for future use
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        }
    });
}
