/**
 * Revelate Operations Website JavaScript
 * This file contains functionality for animations, forms, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animated elements
    initAnimations();
    
    // Initialize expandable service cards
    initServiceCards();
    
    // Initialize testimonial slider if present
    if (document.querySelector('.testimonials-slider')) {
        initTestimonialSlider();
    }
    
    // Initialize contact form if present
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        initContactForm(contactForm);
    }
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize statistics animation
    initStatsAnimation();
});

/**
 * Initialize scroll animations for elements
 */
function initAnimations() {
    const animateElements = document.querySelectorAll('.animate, .feature-card, .approach-step, .team-card, .case-study-card');
    
    function checkVisibility() {
        animateElements.forEach(el => {
            if (isElementInViewport(el, 0.15)) {
                el.classList.add('in-view');
            }
        });
    }
    
    // Check visibility initially and on scroll
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
}

/**
 * Check if an element is in the viewport
 */
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

/**
 * Initialize expandable service cards
 */
function initServiceCards() {
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
}

/**
 * Initialize testimonial slider/carousel
 */
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const prevButton = document.getElementById('prev-testimonial');
    const nextButton = document.getElementById('next-testimonial');
    
    let currentTestimonial = 0;
    const testimonialCount = testimonials.length;
    
    // Function to display a specific testimonial
    function showTestimonial(index) {
        // Handle index bounds
        if (index < 0) index = testimonialCount - 1;
        if (index >= testimonialCount) index = 0;
        
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Show the selected testimonial
        testimonials[index].classList.add('active');
        
        // Update current index
        currentTestimonial = index;
        
        // Update dots
        testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentTestimonial);
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
 * Initialize contact form with validation
 */
function initContactForm(contactForm) {
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
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or id doesn't exist
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for header height
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize statistics animation
 */
function initStatsAnimation() {
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
}
