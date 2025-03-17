/**
 * Revelate Operations - Approach Page JavaScript
 * This file handles specific interactions for the approach page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize approach page functionality
    initApproachFunctionality();
});

/**
 * Initialize all approach page specific functionality
 */
function initApproachFunctionality() {
    // Initialize FAQ accordion
    initFaqAccordion();
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Initialize timeline interactions
    initTimelineInteractions();
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
        }, 8000); // Change slide every 8 seconds
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
        const testimonialSection = document.querySelector('.approach-testimonials');
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
 * Initialize timeline interactions
 */
function initTimelineInteractions() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;
    
    // Add hover effects
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const marker = this.querySelector('.timeline-marker');
            if (marker) {
                marker.style.transform = 'scale(1.1)';
                marker.style.transition = 'transform 0.3s ease';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const marker = this.querySelector('.timeline-marker');
            if (marker) {
                marker.style.transform = 'scale(1)';
            }
        });
    });
    
    // Add scroll animations for timeline items
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const delay = item.dataset.aosDelay || 0;
                
                setTimeout(() => {
                    item.classList.add('timeline-item-visible');
                }, delay);
                
                observer.unobserve(item);
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

/**
 * Track user interactions with timeline items for analytics purposes
 * This can be expanded to integrate with Google Analytics, etc.
 */
function trackTimelineInteractions() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;
    
    timelineItems.forEach((item, index) => {
        // Track when a timeline item becomes visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log(`Timeline phase ${index + 1} viewed`);
                    
                    // Example for Google Analytics (uncomment if GA is implemented)
                    // if (typeof gtag === 'function') {
                    //     gtag('event', 'view_methodology_phase', {
                    //         'phase_number': index + 1,
                    //         'phase_name': item.querySelector('h3')?.textContent || `Phase ${index + 1}`
                    //     });
                    // }
                    
                    observer.unobserve(item);
                }
            });
        }, {
            threshold: 0.7 // Item is considered viewed when 70% visible
        });
        
        observer.observe(item);
    });
}

// Initialize tracking on page load with a delay to prioritize critical functions
window.addEventListener('load', function() {
    setTimeout(trackTimelineInteractions, 2000);
});

/**
 * Add animation to results counters
 * This is also handled by animations.js, but added here for redundancy
 */
function initResultCounters() {
    const resultCards = document.querySelectorAll('.result-card');
    if (!resultCards.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const counter = card.querySelector('.stat-counter');
                
                if (counter && !counter.classList.contains('counted')) {
                    const target = parseInt(counter.getAttribute('data-count'));
                    
                    if (!isNaN(target)) {
                        animateCounter(counter, target);
                        counter.classList.add('counted');
                    }
                }
                
                observer.unobserve(card);
            }
        });
    }, observerOptions);
    
    resultCards.forEach(card => {
        counterObserver.observe(card);
    });
    
    function animateCounter(element, target) {
        let start = 0;
        const duration = 2000;
        const step = timestamp => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const value = Math.floor(progress * target);
            element.textContent = value;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = target; // Ensure the final value is exact
            }
        };
        
        window.requestAnimationFrame(step);
    }
}

// Initialize counter animations on page load
window.addEventListener('load', initResultCounters);
