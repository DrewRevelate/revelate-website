/**
 * Revelate Operations - Animations
 * Handles animations for page elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations when DOM is ready
    initAnimations();
    
    // Initialize counter animations for metrics
    initCounters();
});

/**
 * Initialize animations for elements with data-aos attribute
 */
function initAnimations() {
    // Get all elements with data-aos attribute
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    // If no animated elements, exit
    if (!animatedElements.length) return;
    
    // Function to check if element is in viewport and animate
    function checkElementsInView() {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                // Add class to trigger animation
                element.classList.add('aos-animate');
                
                // Add delay if specified
                const delay = element.getAttribute('data-aos-delay');
                if (delay) {
                    element.style.transitionDelay = `${parseInt(delay) / 1000}s`;
                }
            }
        });
    }
    
    // Check initially and on scroll
    checkElementsInView();
    window.addEventListener('scroll', throttle(checkElementsInView, 100));
    window.addEventListener('resize', throttle(checkElementsInView, 100));
}

/**
 * Initialize counter animations for metric values
 */
function initCounters() {
    const counterElements = document.querySelectorAll('.counter');
    const metrics = document.querySelectorAll('.metric');
    
    // If no counter elements, exit
    if (!counterElements.length && !metrics.length) return;
    
    // Function to animate counters that are in viewport
    function animateCounters() {
        // Handle regular counter elements
        counterElements.forEach(counter => {
            // Skip if already animated
            if (counter.classList.contains('counted')) return;
            
            // Only animate if in viewport
            if (isInViewport(counter)) {
                counter.classList.add('counted');
                
                // Get target value from parent element or data attribute
                let target = 0;
                if (counter.parentElement.classList.contains('metric-value')) {
                    // For metrics in hero section
                    const metric = counter.closest('.metric');
                    if (metric) {
                        target = parseInt(metric.getAttribute('data-value'), 10);
                    }
                } else {
                    // For other counter elements with data-count
                    target = parseInt(counter.getAttribute('data-count'), 10);
                }
                
                // Default to 0 if no valid target
                if (isNaN(target)) target = 0;
                
                // Animate counter from 0 to target
                animateValue(counter, 0, target, 2000);
            }
        });
        
        // Also check for metrics that don't have a .counter element yet
        metrics.forEach(metric => {
            // Skip if already has a counted element
            if (metric.querySelector('.counted')) return;
            
            // Only animate if in viewport
            if (isInViewport(metric)) {
                const valueEl = metric.querySelector('.metric-value');
                if (!valueEl) return;
                
                // Find or create counter element
                let counter = valueEl.querySelector('.counter');
                if (!counter) {
                    // If there's no counter element, create one
                    const text = valueEl.textContent;
                    const number = parseInt(text, 10);
                    if (!isNaN(number)) {
                        // Replace text with counter span
                        valueEl.innerHTML = `<span class="counter">0</span>${text.substring(number.toString().length)}`;
                        counter = valueEl.querySelector('.counter');
                    }
                }
                
                if (counter) {
                    counter.classList.add('counted');
                    const target = parseInt(metric.getAttribute('data-value'), 10) || 0;
                    animateValue(counter, 0, target, 2000);
                }
            }
        });
    }
    
    // Check initially and on scroll
    animateCounters();
    window.addEventListener('scroll', throttle(animateCounters, 200));
}

/**
 * Animate a counter from start to end over a duration
 * @param {HTMLElement} element - The element to animate
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Animation duration in ms
 */
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.innerHTML = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/**
 * Check if an element is in the viewport
 * @param {HTMLElement} element - The element to check
 * @param {number} offset - Offset percentage (0-1)
 * @returns {boolean} - Whether element is in viewport
 */
function isInViewport(element, offset = 0.2) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    // Calculate threshold based on element height
    const threshold = rect.height * offset;
    
    // Element is considered in viewport if it's visible by the threshold amount
    return (
        rect.top + threshold <= windowHeight &&
        rect.left <= windowWidth &&
        rect.bottom - threshold >= 0 &&
        rect.right >= 0
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
 * Add parallax effect to elements with data-parallax attribute
 * Currently not used but can be enabled for additional effects
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (!parallaxElements.length) return;
    
    function updateParallax() {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.2;
            const reverseDirection = element.hasAttribute('data-parallax-reverse');
            
            // Calculate new position based on scroll and speed
            const yPos = reverseDirection 
                ? scrollY * speed 
                : -scrollY * speed;
            
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
    
    // Update parallax on scroll
    window.addEventListener('scroll', throttle(updateParallax, 10));
    updateParallax();
}
