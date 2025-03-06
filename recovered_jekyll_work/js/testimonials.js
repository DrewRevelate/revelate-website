/**
 * Revelate Operations - Testimonials Slider
 * Handles the testimonial carousel functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize testimonials slider
    initTestimonialsSlider();
});

/**
 * Initialize the testimonials slider
 */
function initTestimonialsSlider() {
    // Get slider elements
    const slider = document.getElementById('testimonials-slider');
    
    // Exit if no slider is found
    if (!slider) return;
    
    const track = slider.querySelector('.testimonials-track');
    const slides = slider.querySelectorAll('.testimonial-slide');
    const dots = slider.querySelectorAll('.testimonial-dot');
    const prevArrow = slider.querySelector('.prev-arrow');
    const nextArrow = slider.querySelector('.next-arrow');
    
    // Exit if essential elements are missing
    if (!track || !slides.length) return;
    
    // Set initial state
    let currentIndex = 0;
    let autoplayInterval;
    const slideCount = slides.length;
    
    // Set up initial slider
    setupSlider();
    
    // Start autoplay
    startAutoplay();
    
    // Add event listeners for navigation
    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetAutoplay();
        });
    }
    
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetAutoplay();
        });
    }
    
    // Add click listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoplay();
        });
    });
    
    // Add keyboard navigation
    slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentIndex - 1);
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentIndex + 1);
            resetAutoplay();
        }
    });
    
    // Add touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    /**
     * Handle swipe gestures
     */
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swiped left - go to next slide
            goToSlide(currentIndex + 1);
            resetAutoplay();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swiped right - go to previous slide
            goToSlide(currentIndex - 1);
            resetAutoplay();
        }
    }
    
    /**
     * Set up initial slider state
     */
    function setupSlider() {
        // Set slider height based on the current slide
        updateSliderHeight();
        
        // Add active class to first slide
        if (slides[0]) {
            slides[0].classList.add('active');
        }
        
        // Add active class to first dot
        if (dots[0]) {
            dots[0].classList.add('active');
            dots[0].setAttribute('aria-current', 'true');
        }
        
        // Set tabindex for keyboard navigation
        slider.setAttribute('tabindex', '0');
        
        // Make non-active slides invisible to screen readers
        slides.forEach((slide, index) => {
            if (index !== 0) {
                slide.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Add resize listener to update height
        window.addEventListener('resize', updateSliderHeight);
    }
    
    /**
     * Update slider height based on current slide
     */
    function updateSliderHeight() {
        const activeSlide = slider.querySelector('.testimonial-slide.active');
        
        if (activeSlide) {
            const slideHeight = activeSlide.offsetHeight;
            track.style.height = `${slideHeight}px`;
        }
    }
    
    /**
     * Start autoplay for the slider
     */
    function startAutoplay() {
        // Clear any existing interval
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        
        // Set new interval (every 6 seconds)
        autoplayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 6000);
    }
    
    /**
     * Reset autoplay timer
     */
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
 /**
 * Navigate to a specific slide
 * @param {number} index - The slide index to go to
 */
function goToSlide(index) {
    // Handle index bounds (loop around if needed)
    let targetIndex = index;
    
    if (targetIndex < 0) {
        targetIndex = slideCount - 1;
    } else if (targetIndex >= slideCount) {
        targetIndex = 0;
    }
    
    // If already on the target slide, do nothing
    if (targetIndex === currentIndex) return;
    
    // Hide all slides first
    slides.forEach(slide => {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
    });
    
    // Then show the target slide
    slides[targetIndex].classList.add('active');
    slides[targetIndex].removeAttribute('aria-hidden');
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === targetIndex);
        dot.setAttribute('aria-current', i === targetIndex ? 'true' : 'false');
    });
    
    // Update current index
    currentIndex = targetIndex;
    
    // Update slider height
    setTimeout(updateSliderHeight, 10);
}
    
    /**
     * Pause autoplay when slider is hovered
     * This improves user experience by not changing slides while the user is reading
     */
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        startAutoplay();
    });
    
    // Add focus/blur events to manage autoplay
    slider.addEventListener('focus', () => {
        clearInterval(autoplayInterval);
    }, true);
    
    slider.addEventListener('blur', () => {
        startAutoplay();
    }, true);
}
