/**
 * Revelate Operations Website JavaScript
 * 
 * This file contains all the JavaScript functionality for the Revelate Operations website.
 * It handles navigation, animations, expandable service cards, testimonial carousels, and more.
 */

document.addEventListener('DOMContentLoaded', function() {
    
    /**
     * STICKY NAVBAR
     * Changes navbar appearance when scrolling down
     */
    const navbar = document.getElementById('navbar');
    
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    // Call once on load to set initial state
    handleNavbarScroll();
    
    /**
     * MOBILE MENU TOGGLE
     * Handles showing/hiding the mobile menu
     */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
            navLinks.classList.toggle('active');
            
            // Change icon based on state
            const icon = this.querySelector('i');
            if (expanded) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinksArray = document.querySelectorAll('.nav-link');
    navLinksArray.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    /**
     * SMOOTH SCROLL
     * Smooth scrolling for anchor links
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    /**
     * LOGO INTERACTION
     * Adds cursor-based glow to the logo
     */
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(72, 149, 239, 0.1), transparent 80px)`;
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
        });
    }
    
    /**
     * LOGIN MODAL
     * Handles showing/hiding the login modal
     */
    const portalBtn = document.getElementById('portal-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close-modal');
    const loginForm = document.getElementById('login-form');
    
    if (portalBtn && loginModal) {
        portalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'flex';
            loginModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Focus the first input field
            setTimeout(() => {
                const firstInput = loginModal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        });
    }
    
    if (closeModal && loginModal) {
        closeModal.addEventListener('click', function() {
            closeLoginModal();
        });
    }
    
    // Close modal when clicking outside of it
    if (loginModal) {
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
        
        // Close modal on escape key
        window.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && loginModal.style.display === 'flex') {
                closeLoginModal();
            }
        });
    }
    
    function closeLoginModal() {
        if (!loginModal) return;
        
        loginModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Add a fade-out animation
        loginModal.style.opacity = '0';
        setTimeout(() => {
            loginModal.style.display = 'none';
            loginModal.style.opacity = '1';
        }, 300);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate the form
            let isValid = true;
            const email = document.getElementById('email-login');
            const password = document.getElementById('password-login');
            const emailFeedback = email.nextElementSibling;
            const passwordFeedback = password.nextElementSibling;
            
            // Reset previous validation
            email.classList.remove('is-invalid');
            password.classList.remove('is-invalid');
            emailFeedback.textContent = '';
            passwordFeedback.textContent = '';
            
            // Email validation
            if (!email.value.trim()) {
                email.classList.add('is-invalid');
                emailFeedback.textContent = 'Email is required';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                email.classList.add('is-invalid');
                emailFeedback.textContent = 'Please enter a valid email address';
                isValid = false;
            }
            
            // Password validation
            if (!password.value) {
                password.classList.add('is-invalid');
                passwordFeedback.textContent = 'Password is required';
                isValid = false;
            }
            
            if (isValid) {
                // Simulate login success
                alert('This would normally log you into the client portal. Feature coming soon!');
                closeLoginModal();
                loginForm.reset();
            }
        });
    }
    
    /**
     * CONTACT FORM VALIDATION
     * Validates the contact form before submission
     */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate the form
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            // Get feedback elements
            const nameFeedback = name.nextElementSibling;
            const emailFeedback = email.nextElementSibling;
            const messageFeedback = message.nextElementSibling;
            
            // Reset previous validation
            name.classList.remove('is-invalid');
            email.classList.remove('is-invalid');
            message.classList.remove('is-invalid');
            nameFeedback.textContent = '';
            emailFeedback.textContent = '';
            messageFeedback.textContent = '';
            
            // Name validation
            if (!name.value.trim()) {
                name.classList.add('is-invalid');
                nameFeedback.textContent = 'Name is required';
                isValid = false;
            }
            
            // Email validation
            if (!email.value.trim()) {
                email.classList.add('is-invalid');
                emailFeedback.textContent = 'Email is required';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                email.classList.add('is-invalid');
                emailFeedback.textContent = 'Please enter a valid email address';
                isValid = false;
            }
            
            // Message validation
            if (!message.value.trim()) {
                message.classList.add('is-invalid');
                messageFeedback.textContent = 'Message is required';
                isValid = false;
            }
            
            if (isValid) {
                // Simulate form submission success
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                // Simulate async operation
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    
                    // Success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success';
                    successMessage.innerHTML = `
                        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                        <h4>Thank you for your message!</h4>
                        <p>We'll get back to you shortly.</p>
                    `;
                    
                    // Insert success message
                    contactForm.parentNode.insertBefore(successMessage, contactForm);
                    contactForm.style.display = 'none';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Restore button after 5 seconds
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }, 5000);
                }, 1500);
            }
        });
        
        // Real-time validation
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateInput(this);
                }
            });
        });
        
        function validateInput(input) {
            const feedback = input.nextElementSibling;
            
            // Reset validation
            input.classList.remove('is-invalid');
            feedback.textContent = '';
            
            // Skip validation for non-required fields
            if (!input.hasAttribute('required')) return;
            
            // Validate based on input type
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                feedback.textContent = `${input.previousElementSibling.textContent.replace('*', '').trim()} is required`;
            } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
                input.classList.add('is-invalid');
                feedback.textContent = 'Please enter a valid email address';
            }
        }
    }
    
    /**
     * EXPANDABLE SERVICE CARDS
     * Makes service cards expand to show more details when clicked
     */
    const featureLinks = document.querySelectorAll('.feature-link');
    
    featureLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.feature-card');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // If this card is already expanded, collapse it
            if (isExpanded) {
                card.classList.remove('expanded');
                this.setAttribute('aria-expanded', 'false');
                this.querySelector('.link-text').textContent = 'Learn More';
            } else {
                // First collapse any other expanded cards
                document.querySelectorAll('.feature-card.expanded').forEach(expandedCard => {
                    expandedCard.classList.remove('expanded');
                    expandedCard.querySelector('.feature-link').setAttribute('aria-expanded', 'false');
                    expandedCard.querySelector('.link-text').textContent = 'Learn More';
                });
                
                // Now expand this card
                card.classList.add('expanded');
                this.setAttribute('aria-expanded', 'true');
                this.querySelector('.link-text').textContent = 'Close';
                
                // Smooth scroll to this card if it's not in view
                const cardRect = card.getBoundingClientRect();
                if (cardRect.top < 100 || cardRect.bottom > window.innerHeight) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });
    
    /**
     * TESTIMONIAL CAROUSEL
     * Manages the testimonial slider/carousel
     */
    const testimonials = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const prevButton = document.getElementById('prev-testimonial');
    const nextButton = document.getElementById('next-testimonial');
    
    // No need to run carousel code if elements don't exist
    if (testimonials.length > 0) {
        let currentTestimonial = 0;
        const testimonialCount = testimonials.length;
        
        // Function to display a specific testimonial
        function showTestimonial(index) {
            // Handle index bounds
            if (index < 0) index = testimonialCount - 1;
            if (index >= testimonialCount) index = 0;
            
            // Get the current active testimonial
            const currentActive = document.querySelector('.testimonial-card.active');
            
            // If there's currently an active testimonial, animate it out
            if (currentActive) {
                currentActive.style.transform = 'translateX(-100%)';
                currentActive.style.opacity = '0';
                
                // After animation, remove active class
                setTimeout(() => {
                    currentActive.classList.remove('active');
                    // Then add active class to new testimonial and animate it in
                    testimonials[index].classList.add('active');
                    testimonials[index].style.transform = 'translateX(0)';
                    testimonials[index].style.opacity = '1';
                }, 300);
            } else {
                // If no active testimonial yet, just add the class
                testimonials[index].classList.add('active');
            }
            
            // Store new current index
            currentTestimonial = index;
            
            // Update the dot indicators
            testimonialDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentTestimonial);
                dot.setAttribute('aria-current', i === currentTestimonial);
            });
        }
        
        // Initialize first testimonial
        showTestimonial(0);
        
        // Add click handlers for navigation buttons
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                showTestimonial(currentTestimonial - 1);
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                showTestimonial(currentTestimonial + 1);
            });
        }
        
        // Add click handlers to dots
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showTestimonial(index);
            });
        });
        
        // Add keyboard navigation for testimonials
        document.addEventListener('keydown', function(e) {
            // Only if testimonials section is in viewport
            const testimonialsSection = document.getElementById('testimonials');
            if (!isElementInViewport(testimonialsSection)) return;
            
            if (e.key === 'ArrowLeft') {
                showTestimonial(currentTestimonial - 1);
            } else if (e.key === 'ArrowRight') {
                showTestimonial(currentTestimonial + 1);
            }
        });
        
        // Auto advance testimonials every 6 seconds
        const autoAdvanceInterval = setInterval(function() {
            showTestimonial(currentTestimonial + 1);
        }, 6000);
        
        // Stop auto-advance when user interacts with testimonials
        [prevButton, nextButton, ...testimonialDots].forEach(el => {
            if (el) {
                el.addEventListener('click', function() {
                    clearInterval(autoAdvanceInterval);
                });
            }
        });
    }
    
    /**
     * SCROLL ANIMATIONS
     * Adds animation to elements as they come into view
     */
    const animateElements = document.querySelectorAll('.animate, .feature-card, .approach-step, .team-card, .case-study-card');
    
    function checkVisibility() {
        animateElements.forEach(el => {
            if (isElementInViewport(el, 0.8)) {
                el.classList.add('in-view');
            }
        });
    }
    
    function isElementInViewport(el, threshold = 0) {
        if (!el) return false;
        
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // If threshold is set, element must be at least that % in view
        const visiblePart = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const thresholdPixels = threshold * rect.height;
        
        return (
            visiblePart >= thresholdPixels && 
            rect.top < windowHeight && 
            rect.bottom > 0
        );
    }
    
    // Check visibility initially and on scroll
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
    
    /**
     * ACTIVE NAV LINKS
     * Highlights the active navigation link based on scroll position
     */
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksArray.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();
    
    /**
     * SCROLL TO TOP BUTTON
     * Shows/hides the scroll to top button and handles scrolling
     */
    const scrollTopBtn = document.getElementById('scroll-top');
    
    function handleScrollToTopVisibility() {
        if (window.scrollY > 700) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', handleScrollToTopVisibility);
    handleScrollToTopVisibility();
    
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    /**
     * ANIMATED STATISTICS
     * Animates the counting up of statistics
     */
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            if (isElementInViewport(stat) && !stat.classList.contains('counted')) {
                stat.classList.add('counted');
                
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000; // ms
                const step = Math.ceil(target / (duration / 16)); // approx 60fps
                
                let current = 0;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        stat.textContent = target;
                        clearInterval(timer);
                    } else {
                        stat.textContent = current;
                    }
                }, 16);
            }
        });
    }
    
    window.addEventListener('scroll', animateStats);
    // Call once on load
    setTimeout(animateStats, 1000);
});