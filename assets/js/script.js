/**
 * Revelate Operations Website JavaScript - Improved version
 * 
 * This file contains all the JavaScript functionality for the Revelate Operations website.
 * It handles navigation, animations, expandable service cards, testimonial carousels, and more.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait for all components to load or proceed if already loaded
    const initializeMain = () => {
        setTimeout(initializeMainFunctionality, 300);
    };
    
    // Handle case when components might already be loaded
    if (document.readyState === 'complete' || 
        (document.querySelector('#nav-placeholder')?.children.length > 0 && 
         document.querySelector('#footer-placeholder')?.children.length > 0)) {
        initializeMain();
    } else {
        // Listen for all components loaded event
        document.addEventListener('allComponentsLoaded', initializeMain);
    }
    
    function initializeMainFunctionality() {
        /**
         * STICKY NAVBAR
         * Changes navbar appearance when scrolling down
         */
        const navbar = document.getElementById('navbar');
        
        function handleNavbarScroll() {
            if (navbar && window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else if (navbar) {
                navbar.classList.remove('scrolled');
            }
        }
        
        if (navbar) {
            window.addEventListener('scroll', handleNavbarScroll);
            // Call once on load to set initial state
            handleNavbarScroll();
        }
        
        /**
         * SMOOTH SCROLL
         * Smooth scrolling for anchor links
         */
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            if (anchor.getAttribute('href') === "#") return; // Skip empty anchors
            
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Account for fixed header
                    const headerOffset = navbar ? navbar.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
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
                
                // Ensure form elements exist
                if (!name || !email || !message) return;
                
                // Get feedback elements
                const nameFeedback = name.nextElementSibling;
                const emailFeedback = email.nextElementSibling;
                const messageFeedback = message.nextElementSibling;
                
                // Reset previous validation
                name.classList.remove('is-invalid');
                email.classList.remove('is-invalid');
                message.classList.remove('is-invalid');
                
                if (nameFeedback) nameFeedback.textContent = '';
                if (emailFeedback) emailFeedback.textContent = '';
                if (messageFeedback) messageFeedback.textContent = '';
                
                // Name validation
                if (!name.value.trim()) {
                    name.classList.add('is-invalid');
                    if (nameFeedback) nameFeedback.textContent = 'Name is required';
                    isValid = false;
                }
                
                // Email validation
                if (!email.value.trim()) {
                    email.classList.add('is-invalid');
                    if (emailFeedback) emailFeedback.textContent = 'Email is required';
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                    email.classList.add('is-invalid');
                    if (emailFeedback) emailFeedback.textContent = 'Please enter a valid email address';
                    isValid = false;
                }
                
                // Message validation
                if (!message.value.trim()) {
                    message.classList.add('is-invalid');
                    if (messageFeedback) messageFeedback.textContent = 'Message is required';
                    isValid = false;
                }
                
                if (isValid) {
                    // Simulate form submission success
                    const submitBtn = contactForm.querySelector('button[type="submit"]');
                    if (!submitBtn) return;
                    
                    const originalText = submitBtn.innerHTML;
                    
                    // Show loading state
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    
                    // Simulate async operation
                    setTimeout(() => {
                        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                        
                        // Create success message
                        const successMessage = document.createElement('div');
                        successMessage.className = 'form-success';
                        successMessage.innerHTML = `
                            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                            <h4>Thank you for your message!</h4>
                            <p>We'll get back to you shortly.</p>
                        `;
                        
                        // Insert success message
                        if (contactForm.parentNode) {
                            contactForm.parentNode.insertBefore(successMessage, contactForm);
                            contactForm.style.display = 'none';
                        }
                        
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
                // Skip if input doesn't exist
                if (!input) return;
                
                const feedback = input.nextElementSibling;
                
                // Reset validation
                input.classList.remove('is-invalid');
                if (feedback) feedback.textContent = '';
                
                // Skip validation for non-required fields
                if (!input.hasAttribute('required')) return;
                
                // Get label text if available
                const labelText = input.previousElementSibling ? 
                                  input.previousElementSibling.textContent.replace('*', '').trim() : 
                                  input.getAttribute('placeholder') || 'This field';
                
                // Validate based on input type
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    if (feedback) feedback.textContent = `${labelText} is required`;
                } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
                    input.classList.add('is-invalid');
                    if (feedback) feedback.textContent = 'Please enter a valid email address';
                }
            }
        }
        
        /**
         * EXPANDABLE SERVICE CARDS
         * Makes service cards expand to show more details when clicked
         */
        const featureLinks = document.querySelectorAll('.feature-link');
        
        featureLinks.forEach(link => {
            // Set initial aria-expanded attribute if missing
            if (!link.hasAttribute('aria-expanded')) {
                link.setAttribute('aria-expanded', 'false');
            }
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const card = this.closest('.feature-card');
                if (!card) return;
                
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                const linkText = this.querySelector('.link-text');
                
                // If this card is already expanded, collapse it
                if (isExpanded) {
                    card.classList.remove('expanded');
                    this.setAttribute('aria-expanded', 'false');
                    if (linkText) linkText.textContent = 'Learn More';
                } else {
                    // First collapse any other expanded cards
                    document.querySelectorAll('.feature-card.expanded').forEach(expandedCard => {
                        expandedCard.classList.remove('expanded');
                        const expandedLink = expandedCard.querySelector('.feature-link');
                        if (expandedLink) {
                            expandedLink.setAttribute('aria-expanded', 'false');
                            const expandedLinkText = expandedLink.querySelector('.link-text');
                            if (expandedLinkText) expandedLinkText.textContent = 'Learn More';
                        }
                    });
                    
                    // Now expand this card
                    card.classList.add('expanded');
                    this.setAttribute('aria-expanded', 'true');
                    if (linkText) linkText.textContent = 'Close';
                    
                    // Smooth scroll to this card if it's not in view
                    const cardRect = card.getBoundingClientRect();
                    const headerOffset = navbar ? navbar.offsetHeight : 0;
                    
                    if (cardRect.top < headerOffset || cardRect.bottom > window.innerHeight) {
                        const targetPosition = window.pageYOffset + cardRect.top - headerOffset - 20;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
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
            let autoAdvanceInterval;
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
                    dot.setAttribute('aria-current', i === currentTestimonial ? 'true' : 'false');
                });
            }
            
            // Initialize first testimonial
            showTestimonial(0);
            
            // Add click handlers for navigation buttons
            if (prevButton) {
                prevButton.addEventListener('click', function() {
                    showTestimonial(currentTestimonial - 1);
                    stopAutoAdvance();
                });
            }
            
            if (nextButton) {
                nextButton.addEventListener('click', function() {
                    showTestimonial(currentTestimonial + 1);
                    stopAutoAdvance();
                });
            }
            
            // Add click handlers to dots
            testimonialDots.forEach((dot, index) => {
                dot.addEventListener('click', function() {
                    showTestimonial(index);
                    stopAutoAdvance();
                });
            });
            
            // Add keyboard navigation for testimonials
            document.addEventListener('keydown', function(e) {
                // Only if testimonials section is in viewport
                const testimonialsSection = document.getElementById('testimonials');
                if (!testimonialsSection) return;
                
                const isSectionVisible = isElementInViewport(testimonialsSection);
                
                if (isSectionVisible) {
                    if (e.key === 'ArrowLeft') {
                        showTestimonial(currentTestimonial - 1);
                        stopAutoAdvance();
                    } else if (e.key === 'ArrowRight') {
                        showTestimonial(currentTestimonial + 1);
                        stopAutoAdvance();
                    }
                }
            });
            
            // Start auto advance testimonials every 6 seconds
            startAutoAdvance();
            
            function startAutoAdvance() {
                autoAdvanceInterval = setInterval(function() {
                    showTestimonial(currentTestimonial + 1);
                }, 6000);
            }
            
            function stopAutoAdvance() {
                clearInterval(autoAdvanceInterval);
            }
        }
        
        /**
         * SCROLL ANIMATIONS
         * Adds animation to elements as they come into view
         */
        const animateElements = document.querySelectorAll('.animate, .feature-card, .approach-step, .team-card, .case-study-card');
        
        function checkVisibility() {
            animateElements.forEach(el => {
                if (isElementInViewport(el, 0.2)) {
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
            if (sections.length === 0) return;
            
            const scrollPosition = window.scrollY + 150; // Adjust offset as needed
            const navLinksArray = document.querySelectorAll('.nav-link');
            
            if (navLinksArray.length === 0) return;
            
            // Find the section that's currently in view
            let currentSection = null;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            });
            
            // Update nav links based on current section
            navLinksArray.forEach(link => {
                const href = link.getAttribute('href') || '';
                const linkSectionId = href.split('#')[1]; // Get the ID part of the href
                
                if (currentSection && linkSectionId === currentSection) {
                    link.classList.add('active');
                } else {
                    // Don't remove active class from case studies link when on case studies page
                    const onCaseStudiesPage = window.location.pathname.includes('case-stud');
                    const isCaseStudiesLink = href.includes('case-stud');
                    
                    if (!(onCaseStudiesPage && isCaseStudiesLink)) {
                        link.classList.remove('active');
                    }
                }
            });
        }
        
        window.addEventListener('scroll', highlightNavLink);
        // Delay highlighting to ensure components have loaded
        setTimeout(highlightNavLink, 500);
        
        /**
         * SCROLL TO TOP BUTTON
         * Shows/hides the scroll to top button and handles scrolling
         */
        const scrollTopBtn = document.getElementById('scroll-top');
        
        function handleScrollToTopVisibility() {
            if (!scrollTopBtn) return;
            
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
                    
                    const target = parseInt(stat.getAttribute('data-count') || '0');
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
    }
});
