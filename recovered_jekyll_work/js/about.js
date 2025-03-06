/**
 * Revelate Operations - About Page JavaScript
 * This file handles specific interactions for the about page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize about page functionality
    initAboutPageFunctionality();
});

/**
 * Initialize all about page specific functionality
 */
function initAboutPageFunctionality() {
    // Initialize FAQ accordion
    initFaqAccordion();
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Initialize stat counters
    initStatCounters();
    
    // Initialize team member interactions
    initTeamInteractions();
}

/**
 * Initialize FAQ accordion functionality
 */
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (!faqQuestions.length) return;
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other open FAQs
            document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(openQuestion => {
                if (openQuestion !== this) {
                    openQuestion.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current FAQ
            this.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Handle keyboard interaction
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Initialize testimonial slider
 */
function initTestimonialSlider() {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    if (!testimonialSlides.length) return;
    
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    
    let currentSlide = 0;
    const slideCount = testimonialSlides.length;
    let autoSlideInterval;
    
    // Function to show a specific slide
    function showSlide(index) {
        // Handle index bounds
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;
        
        // Remove active class from all slides
        testimonialSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Add active class to current slide
        testimonialSlides[index].classList.add('active');
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
        
        // Update current slide index
        currentSlide = index;
    }
    
    // Next button click handler
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            resetAutoSlide();
        });
    }
    
    // Previous button click handler
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            resetAutoSlide();
        });
    }
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoSlide();
        });
    });
    
    // Auto slide functionality
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 6000); // Change slide every 6 seconds
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Start auto slide on page load
    startAutoSlide();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only handle keyboard navigation if testimonial section is in viewport
        const testimonialSection = document.querySelector('.about-testimonials');
        if (!testimonialSection) return;
        
        const rect = testimonialSection.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isInViewport) {
            if (e.key === 'ArrowLeft') {
                showSlide(currentSlide - 1);
                resetAutoSlide();
            } else if (e.key === 'ArrowRight') {
                showSlide(currentSlide + 1);
                resetAutoSlide();
            }
        }
    });
}

/**
 * Initialize stat counters with animation
 */
function initStatCounters() {
    const statCounters = document.querySelectorAll('.stat-counter');
    if (!statCounters.length) return;
    
    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Animate counter from 0 to target value
    function animateCounter(counter, target) {
        // Set duration based on target value (higher targets = longer animation)
        const duration = Math.min(2000, Math.max(1000, target * 10));
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        
        let frame = 0;
        let currentValue = 0;
        
        // Add 'counting' class to prevent repeated animations
        counter.classList.add('counting');
        
        // Start animation
        const timer = setInterval(() => {
            frame++;
            
            // Calculate progress using easeOutQuad for smoother effect
            const progress = frame / totalFrames;
            const easeProgress = 1 - Math.pow(1 - progress, 2);
            
            // Calculate current value
            currentValue = Math.round(easeProgress * target);
            
            // Update counter text
            counter.textContent = currentValue;
            
            // End animation when complete
            if (frame === totalFrames) {
                clearInterval(timer);
                counter.textContent = target; // Ensure final value is exact
                counter.classList.remove('counting');
                counter.classList.add('counted');
            }
        }, frameDuration);
    }
    
    // Check and start animations for visible counters
    function checkCounters() {
        statCounters.forEach(counter => {
            if (isElementInViewport(counter) && !counter.classList.contains('counting') && !counter.classList.contains('counted')) {
                const target = parseInt(counter.getAttribute('data-count'));
                if (!isNaN(target)) {
                    animateCounter(counter, target);
                }
            }
        });
    }
    
    // Check counters on scroll and on initial load
    window.addEventListener('scroll', checkCounters);
    window.addEventListener('resize', checkCounters);
    
    // Initial check after a short delay to ensure elements are rendered
    setTimeout(checkCounters, 500);
}

/**
 * Initialize team member interaction features
 */
function initTeamInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');
    if (!teamMembers.length) return;
    
    teamMembers.forEach(member => {
        // Add subtle hover animation effect
        member.addEventListener('mouseenter', function() {
            const image = this.querySelector('.member-image img');
            if (image) {
                image.style.transform = 'scale(1.05)';
                image.style.transition = 'transform 0.5s ease';
            }
        });
        
        member.addEventListener('mouseleave', function() {
            const image = this.querySelector('.member-image img');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
        
        // Handle social media button interactions
        const socialButtons = member.querySelectorAll('.member-social a');
        socialButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.querySelector('i').classList.add('fa-bounce');
            });
            
            button.addEventListener('mouseleave', function() {
                this.querySelector('i').classList.remove('fa-bounce');
            });
        });
    });
}

/**
 * Helper function to throttle scroll events
 */
function throttle(callback, limit) {
    let waiting = false;
    return function() {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(function() {
                waiting = false;
            }, limit);
        }
    };
}
