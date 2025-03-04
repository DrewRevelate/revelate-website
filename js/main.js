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
    
    // Initialize FAQ toggles if present
    if (document.querySelector('.faq-item')) {
        initFaqToggles();
    }
    
    // Set up scroll to top button
    initScrollToTop();
});

/**
 * Initialize scroll animations for elements
 */
function initAnimations() {
    const animateElements = document.querySelectorAll('.animate, .feature-card, .approach-card, .team-card, .case-study-card');
    
    function checkVisibility() {
        animateElements.forEach(el => {
            if (isElementInViewport(el, 0.15)) {
                el.classList.add('in-view');
                
                // Add delay for cascading animations if specified
                if (el.dataset.delay) {
                    el.style.setProperty('--delay', el.dataset.delay + 's');
                }
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
            
            // Check if this card is already expanded
            const isExpanded = card.classList.contains('expanded');
            
            // If this card is already expanded, collapse it
            if (isExpanded) {
                card.classList.remove('expanded');
                this.setAttribute('aria-expanded', 'false');
                this.querySelector('.link-text').textContent = 'Learn More';
            } else {
                // First collapse any other expanded cards
                document.querySelectorAll('.feature-card.expanded').forEach(expandedCard => {
                    expandedCard.classList.remove('expanded');
                    const expandedLink = expandedCard.querySelector('.feature-link');
                    if (expandedLink) {
                        expandedLink.setAttribute('aria-expanded', 'false');
                        const linkText = expandedLink.querySelector('.link-text');
                        if (linkText) {
                            linkText.textContent = 'Learn More';
                        }
                    }
                });
                
                // Now expand this card
                card.classList.add('expanded');
                this.setAttribute('aria-expanded', 'true');
                this.querySelector('.link-text').textContent = 'Close';
                
                // Smooth scroll to this card if it's not fully in view
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
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    if (!testimonials.length) return;
    
    let currentIndex = 0;
    const totalTestimonials = testimonials.length;
    
    // Function to show a specific testimonial
    function showTestimonial(index) {
        // Handle index bounds
        if (index < 0) index = totalTestimonials - 1;
        if (index >= totalTestimonials) index = 0;
        
        // Hide all testimonials and remove active class
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
            testimonial.style.transform = 'translateX(100%)';
            testimonial.style.opacity = '0';
        });
        
        // Show the selected testimonial with animation
        setTimeout(() => {
            testimonials[index].classList.add('active');
            testimonials[index].style.transform = 'translateX(0)';
            testimonials[index].style.opacity = '1';
        }, 50);
        
        // Update current index
        currentIndex = index;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Initialize with the first testimonial
    showTestimonial(0);
    
    // Add event listeners for navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showTestimonial(currentIndex - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showTestimonial(currentIndex + 1);
        });
    }
    
    // Add event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });
    
    // Automatic slide change
    let autoSlideInterval = setInterval(() => {
        showTestimonial(currentIndex + 1);
    }, 6000);
    
    // Pause auto-sliding when user interacts with controls
    [prevBtn, nextBtn, ...dots].forEach(control => {
        if (control) {
            control.addEventListener('click', () => {
                clearInterval(autoSlideInterval);
                // Restart auto-sliding after 15 seconds of inactivity
                autoSlideInterval = setInterval(() => {
                    showTestimonial(currentIndex + 1);
                }, 6000);
            });
        }
    });
}

/**
 * Initialize contact form with validation
 */
function initContactForm(contactForm) {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset previous validation state
        const formControls = contactForm.querySelectorAll('.form-control');
        formControls.forEach(control => {
            control.classList.remove('is-invalid');
            const feedback = control.nextElementSibling;
            if (feedback && feedback.classList.contains('form-feedback')) {
                feedback.textContent = '';
            }
        });
        
        // Validate form fields
        let isValid = true;
        
        // Required fields validation
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            const feedback = field.nextElementSibling;
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                if (feedback && feedback.classList.contains('form-feedback')) {
                    feedback.textContent = `${field.getAttribute('placeholder')} is required`;
                }
                isValid = false;
            }
        });
        
        // Email validation
        const emailField = contactForm.querySelector('input[type="email"]');
        if (emailField && emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const feedback = emailField.nextElementSibling;
            
            if (!emailRegex.test(emailField.value.trim())) {
                emailField.classList.add('is-invalid');
                if (feedback && feedback.classList.contains('form-feedback')) {
                    feedback.textContent = 'Please enter a valid email address';
                }
                isValid = false;
            }
        }
        
        if (isValid) {
            // Show loading state on submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate form submission (replace with actual API call in production)
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                
                // Create success message
                const successMsg = document.createElement('div');
                successMsg.className = 'form-success';
                successMsg.innerHTML = `
                    <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                    <h4>Thank you for your message!</h4>
                    <p>We'll get back to you shortly.</p>
                `;
                
                // Insert success message before form and hide form
                contactForm.parentNode.insertBefore(successMsg, contactForm);
                contactForm.style.display = 'none';
                
                // Reset form
                contactForm.reset();
                
                // Restore button after delay
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }, 5000);
            }, 1500);
        }
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - navbarHeight - 20, // Additional offset for spacing
                    behavior: 'smooth'
                });
                
                // Update URL without reloading the page
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Initialize statistics animation
 */
function initStatsAnimation() {
    const statElements = document.querySelectorAll('.stat-number[data-count]');
    
    function animateStats() {
        statElements.forEach(stat => {
            if (isElementInViewport(stat) && !stat.classList.contains('animated')) {
                stat.classList.add('animated');
                
                const targetValue = parseInt(stat.getAttribute('data-count'), 10);
                const duration = 2000; // milliseconds
                const framesPerSecond = 60;
                const totalFrames = duration / (1000 / framesPerSecond);
                const incrementPerFrame = targetValue / totalFrames;
                
                let currentValue = 0;
                const counter = setInterval(() => {
                    currentValue += incrementPerFrame;
                    
                    if (currentValue >= targetValue) {
                        stat.textContent = targetValue;
                        clearInterval(counter);
                    } else {
                        stat.textContent = Math.floor(currentValue);
                    }
                }, 1000 / framesPerSecond);
            }
        });
    }
    
    // Run on page load
    animateStats();
    
    // Run on scroll
    window.addEventListener('scroll', animateStats);
}

/**
 * Initialize FAQ accordion functionality
 */
function initFaqToggles() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-toggle i');
        
        if (question && answer && icon) {
            question.addEventListener('click', () => {
                // Check if this item is already open
                const isOpen = item.classList.contains('open');
                
                // Close all FAQs
                faqItems.forEach(otherItem => {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-toggle i');
                    
                    otherItem.classList.remove('open');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                    if (otherIcon) {
                        otherIcon.classList.remove('fa-minus');
                        otherIcon.classList.add('fa-plus');
                    }
                });
                
                // If the clicked item wasn't open, open it
                if (!isOpen) {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                }
            });
        }
    });
}

/**
 * Initialize scroll to top button
 */
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (scrollTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}
