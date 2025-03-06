/**
 * Revelate Operations - Case Studies JavaScript
 * This file contains specific interactions for the case studies pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize case studies functionality
    initCaseStudiesFunctionality();
});

/**
 * Initialize all case studies specific functionality
 */
function initCaseStudiesFunctionality() {
    // Initialize filter tabs on the case studies index page
    initFilterTabs();
    
    // Initialize stat counters
    initStatCounters();
    
    // Initialize scroll animations for timelines
    initTimelineAnimations();
    
    // Initialize anchor link smooth scrolling
    initSmoothScrolling();
}

/**
 * Initialize filter tabs on case studies index page
 */
function initFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const caseCards = document.querySelectorAll('.case-card');
    
    if (!filterTabs.length || !caseCards.length) return;
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            
            // Show all cards or filter by category
            caseCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    
                    // Add animation when showing cards
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    const category = card.getAttribute('data-category');
                    
                    if (category === filter) {
                        card.style.display = 'block';
                        
                        // Add animation when showing cards
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        // Animate hiding
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        // Hide after animation completes
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
    
    // Set initial styles for animation
    caseCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
}

/**
 * Initialize stat counters with animation
 */
function initStatCounters() {
    const statCounters = document.querySelectorAll('.stat-counter');
    if (!statCounters.length) return;
    
    // Helper function to check if element is in viewport
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
        // Set duration based on target value
        const duration = Math.min(2000, Math.max(1000, target * 10));
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        
        let frame = 0;
        counter.innerText = '0';
        
        // Add 'counting' class to prevent repeated animations
        counter.classList.add('counting');
        
        // Start animation
        const timer = setInterval(() => {
            frame++;
            
            // Calculate eased progress (easeOutQuad)
            const progress = frame / totalFrames;
            const easeProgress = 1 - Math.pow(1 - progress, 2);
            
            // Calculate current value
            const currentValue = Math.round(easeProgress * target);
            
            // Update counter text
            counter.innerText = currentValue;
            
            // End animation when complete
            if (frame === totalFrames) {
                clearInterval(timer);
                counter.innerText = target; // Ensure final value is exact
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
    
    // Check counters on scroll and initial load
    window.addEventListener('scroll', throttle(checkCounters, 200));
    window.addEventListener('resize', throttle(checkCounters, 200));
    
    // Initial check after a short delay
    setTimeout(checkCounters, 500);
}

/**
 * Initialize timeline animations for case study page
 */
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;
    
    // Add scroll-triggered animations if not using AOS
    function checkTimeline() {
        timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top <= window.innerHeight * 0.8;
            
            if (isVisible && !item.classList.contains('animated')) {
                item.classList.add('animated');
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial styles
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Check on scroll and initial load
    window.addEventListener('scroll', throttle(checkTimeline, 200));
    
    // Initial check
    setTimeout(checkTimeline, 500);
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Account for fixed header
                const header = document.getElementById('header');
                const headerOffset = header ? header.offsetHeight : 0;
                
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // Extra 20px buffer
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without scrolling
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
}

/**
 * Helper function to throttle events
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
