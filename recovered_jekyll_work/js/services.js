/**
 * Revelate Operations - Services Page JavaScript
 * This file handles specific interactions for the services page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize services page functionality
    initServicesFunctionality();
});

/**
 * Initialize all services page specific functionality
 */
function initServicesFunctionality() {
    // Handle FAQ accordion functionality
    initFaqAccordion();
    
    // Handle smooth scrolling to service sections
    initServiceSmoothScroll();
    
    // Initialize service animations
    initServiceAnimations();
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
 * Initialize smooth scrolling to service sections
 */
function initServiceSmoothScroll() {
    const serviceLinks = document.querySelectorAll('a[href^="#"]');
    
    serviceLinks.forEach(link => {
        // Skip empty links
        if (link.getAttribute('href') === '#') return;
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get header height for offset
                const header = document.getElementById('header');
                const headerOffset = header ? header.offsetHeight : 0;
                
                // Calculate scroll position
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // Additional 20px buffer
                
                // Scroll smoothly to target
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
                
                // If on mobile, close mobile menu if it's open
                const mobileToggle = document.querySelector('.mobile-toggle');
                if (mobileToggle && mobileToggle.getAttribute('aria-expanded') === 'true') {
                    mobileToggle.click();
                }
            }
        });
    });
}

/**
 * Initialize service animations
 * Enhances AOS (Animate on Scroll) functionality with custom animations
 */
function initServiceAnimations() {
    // Get service detail sections for custom animations
    const serviceDetailSections = document.querySelectorAll('.service-detail');
    
    if (!serviceDetailSections.length) return;
    
    // Function to check if element is in viewport and add animation classes
    function checkServiceAnimations() {
        serviceDetailSections.forEach(section => {
            if (isElementInViewport(section, 0.2)) {
                // Add animation classes to elements within the section
                const content = section.querySelector('.service-detail-content');
                const image = section.querySelector('.service-detail-image');
                const testimonial = section.querySelector('.service-testimonial');
                
                if (content && !content.classList.contains('animated')) {
                    content.classList.add('animated');
                    fadeInElements(content.querySelectorAll('h3, p, .service-feature, .service-cta'), 100);
                }
                
                if (image && !image.classList.contains('animated')) {
                    image.classList.add('animated');
                    setTimeout(() => {
                        image.style.opacity = '1';
                        image.style.transform = 'translateY(0)';
                    }, 300);
                }
                
                if (testimonial && !testimonial.classList.contains('animated')) {
                    setTimeout(() => {
                        testimonial.classList.add('animated');
                        testimonial.style.opacity = '1';
                        testimonial.style.transform = 'translateY(0)';
                    }, 800);
                }
            }
        });
    }
    
    // Apply initial styles for animations
    serviceDetailSections.forEach(section => {
        const image = section.querySelector('.service-detail-image');
        const testimonial = section.querySelector('.service-testimonial');
        
        if (image) {
            image.style.opacity = '0';
            image.style.transform = 'translateY(40px)';
            image.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
        
        if (testimonial) {
            testimonial.style.opacity = '0';
            testimonial.style.transform = 'translateY(20px)';
            testimonial.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
    });
    
    // Function to fade in elements sequentially
    function fadeInElements(elements, delay) {
        Array.from(elements).forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 50);
            }, index * delay);
        });
    }
    
    // Check animations on scroll and on page load
    window.addEventListener('scroll', throttle(checkServiceAnimations, 100));
    window.addEventListener('load', checkServiceAnimations);
    
    // Run initial check after a short delay to ensure all elements are loaded
    setTimeout(checkServiceAnimations, 300);
}

/**
 * Check if an element is in the viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} threshold - Viewport threshold (0-1)
 * @returns {boolean} - Whether element is in viewport
 */
function isElementInViewport(element, threshold = 0) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Calculate threshold based on element height
    const thresholdPixels = threshold * rect.height;
    
    // Element is in viewport if it's visible by at least the threshold amount
    return (
        rect.top + thresholdPixels <= windowHeight &&
        rect.bottom - thresholdPixels >= 0
    );
}

/**
 * Throttle function to limit how often a function runs
 * @param {Function} callback - Function to throttle
 * @param {number} limit - Throttle limit in ms
 * @returns {Function} - Throttled function
 */
function throttle(callback, limit) {
    let waiting = false;
    return function() {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(() => {
                waiting = false;
            }, limit);
        }
    };
}

/**
 * Track service section visibility for analytics
 * This can be expanded to integrate with Google Analytics, etc.
 */
function trackServiceSectionVisibility() {
    const serviceSections = document.querySelectorAll('.service-detail');
    const visibleSections = new Set();
    
    function checkSectionsVisibility() {
        serviceSections.forEach(section => {
            const sectionId = section.getAttribute('id');
            
            if (sectionId && isElementInViewport(section, 0.5)) {
                // Only track if not already seen in this session
                if (!visibleSections.has(sectionId)) {
                    visibleSections.add(sectionId);
                    
                    // This is where you would send to analytics platform
                    console.log(`Service section viewed: ${sectionId}`);
                    
                    // Example for Google Analytics (uncomment if GA is implemented)
                    // if (typeof gtag === 'function') {
                    //     gtag('event', 'view_service_section', {
                    //         'service_id': sectionId
                    //     });
                    // }
                }
            }
        });
    }
    
    window.addEventListener('scroll', throttle(checkSectionsVisibility, 1000));
    setTimeout(checkSectionsVisibility, 1000); // Initial check after delay
}

/**
 * Add interactive highlights to service features on hover
 * This enhances user engagement with the content
 */
function initServiceFeatureHighlights() {
    const serviceFeatures = document.querySelectorAll('.service-feature');
    
    serviceFeatures.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            // Add highlight class to feature
            this.classList.add('feature-highlight');
            
            // Get icon to animate
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.add('pulse-animation');
                
                // Remove animation class after it completes
                setTimeout(() => {
                    icon.classList.remove('pulse-animation');
                }, 1000);
            }
        });
        
        feature.addEventListener('mouseleave', function() {
            this.classList.remove('feature-highlight');
        });
    });
}

// Initialize the feature highlights when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initServiceFeatureHighlights();
    trackServiceSectionVisibility();
});
