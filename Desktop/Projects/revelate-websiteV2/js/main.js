/**
 * Revelate Operations - Main JavaScript
 * Core functionality for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load templates (navigation and footer)
    loadTemplates();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize service card links
    initServiceLinks();
    
    // Check for page-specific initializations
    initPageSpecific();
});

/**
 * Load navigation and footer templates
 */
function loadTemplates() {
    // Set the base path for templates
    const basePath = '';
    
    // Load the navigation
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (navPlaceholder) {
        fetch(basePath + 'navigation.html')
            .then(response => response.text())
            .then(html => {
                // Replace template variables
                html = html.replace(/\${basePath}/g, basePath);
                navPlaceholder.innerHTML = html;
                
                // Initialize navigation JS after loading
                initNavigation();
                
                // Handle scroll effects for transparent header
                if (document.body.classList.contains('home-page')) {
                    initTransparentHeader();
                }
            })
            .catch(error => {
                console.error('Error loading navigation:', error);
            });
    }
    
    // Load the footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch(basePath + 'footer.html')
            .then(response => response.text())
            .then(html => {
                // Replace template variables
                html = html.replace(/\${basePath}/g, basePath);
                footerPlaceholder.innerHTML = html;
                
                // Initialize portal button if it exists
                const portalBtn = document.getElementById('portal-btn');
                if (portalBtn) {
                    initPortalModal();
                }
            })
            .catch(error => {
                console.error('Error loading footer:', error);
            });
    }
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
            navLinks.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            document.body.style.overflow = expanded ? '' : 'hidden';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !mobileToggle.contains(event.target) && navLinks.classList.contains('active')) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on window resize if it gets into desktop mode
        window.addEventListener('resize', function() {
            if (window.innerWidth > 991 && navLinks.classList.contains('active')) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Highlight current page in navigation
    highlightCurrentPage();
}

/**
 * Initialize transparent header for homepage
 */
function initTransparentHeader() {
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Initial check
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        }
    }
}

/**
 * Highlight the active navigation link based on the current page
 */
function highlightCurrentPage() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (!href) return;
        
        // Remove basePath template variable if present
        const cleanHref = href.replace('${basePath}', '');
        
        // Handle index/home page
        if ((currentPath === '/' || currentPath.endsWith('index.html')) && 
            (cleanHref === 'index.html' || cleanHref === '/')) {
            link.classList.add('active');
        }
        // Handle other pages
        else if (currentPath.includes(cleanHref) && cleanHref !== 'index.html' && cleanHref !== '/') {
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
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (portalBtn && loginModal) {
        portalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
        
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                loginModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && loginModal.getAttribute('aria-hidden') === 'false') {
                loginModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Login Form Submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle authentication (for future implementation)
            console.log('Login form submitted');
            
            // For now, show a simple loading and success message
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
                    loginModal.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    loginForm.reset();
                }, 1000);
            }, 1500);
        });
    }
}

/**
 * Initialize page-specific functionality based on body class or URL
 */
function initPageSpecific() {
    // Home page specific
    if (document.body.classList.contains('home-page')) {
        initHomePageFeatures();
    }
    
    // Services page
    else if (window.location.pathname.includes('services.html')) {
        initExpandableServices();
    }
    
    // Case studies page
    else if (window.location.pathname.includes('case-studies')) {
        initCaseStudyFilters();
    }
    
    // Contact page
    else if (window.location.pathname.includes('contact.html')) {
        initContactForm();
    }
}

/**
 * Initialize home page specific features
 */
function initHomePageFeatures() {
    // Initialize counter animations for metrics
    const counters = document.querySelectorAll('.counter');
    
    const startCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.closest('.metric').dataset.value);
            
            let count = 0;
            const animate = () => {
                if (count < target) {
                    count += Math.ceil(target / 100);
                    if (count > target) count = target;
                    counter.innerText = count;
                    requestAnimationFrame(animate);
                }
            };
            
            animate();
        });
    };
    
    // Use Intersection Observer to start counters when in view
    const metricsSection = document.querySelector('.hero-metrics');
    
    if (metricsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(metricsSection);
    }
    
    // Initialize testimonial slider
    const slider = document.getElementById('testimonials-slider');
    
    if (slider) {
        const track = slider.querySelector('.testimonials-track');
        const slides = slider.querySelectorAll('.testimonial-slide');
        const dots = slider.querySelectorAll('.testimonial-dot');
        const prevBtn = slider.querySelector('.prev-arrow');
        const nextBtn = slider.querySelector('.next-arrow');
        
        let currentIndex = 0;
        
        const goToSlide = (index) => {
            // Handle boundary conditions
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            currentIndex = index;
            
            // Update track position
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };
        
        // Set up event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });
        }
        
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
        });
        
        // Auto-advance slider every 5 seconds
        setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }
    
    // Handle newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would normally submit to your backend
            // For now, we'll just show a success message
            const formContainer = this.closest('.newsletter-form-container');
            
            formContainer.innerHTML = `
                <div class="newsletter-success">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank You!</h3>
                    <p>You've been successfully subscribed to our newsletter.</p>
                </div>
            `;
        });
    }
}

/**
 * Initialize expandable services on the services page
 */
function initExpandableServices() {
    // Implementation will depend on services page structure
    // This will be implemented when working on the services page
}

/**
 * Initialize case study filters
 */
function initCaseStudyFilters() {
    // Implementation will depend on case studies page structure
    // This will be implemented when working on the case studies page
}

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
 * Support function for dark mode toggle
 */
function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (!darkModeToggle) return;
    
    // Check for saved user preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    
    // Toggle dark mode when switch is clicked
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Also check system preference if no saved preference
    if (!savedTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
    }
}
