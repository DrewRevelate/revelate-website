/**
 * Enhanced testimonial slider functionality
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
  function showTestimonial(index, direction = null) {
    // Handle index bounds
    if (index < 0) index = totalTestimonials - 1;
    if (index >= totalTestimonials) index = 0;
    
    // Get the current active testimonial
    const currentTestimonial = document.querySelector('.testimonial-card.active');
    const currentIndex = Array.from(testimonials).indexOf(currentTestimonial);
    
    // Remove all classes first
    testimonials.forEach(testimonial => {
      testimonial.classList.remove('active', 'previous', 'next');
      testimonial.style.display = 'none';
    });
    
    // Set the direction of animation based on index change
    if (direction === null) {
      direction = index > currentIndex ? 'next' : 'prev';
      // If we're wrapping around
      if (index === 0 && currentIndex === totalTestimonials - 1) direction = 'next';
      if (index === totalTestimonials - 1 && currentIndex === 0) direction = 'prev';
    }
    
    // Show the selected testimonial with proper animation
    const targetTestimonial = testimonials[index];
    
    // Make testimonial visible but with starting transform
    targetTestimonial.style.display = 'block';
    targetTestimonial.style.opacity = '0';
    
    if (direction === 'next') {
      targetTestimonial.style.transform = 'translateX(100%)';
    } else {
      targetTestimonial.style.transform = 'translateX(-100%)';
    }
    
    // Force a reflow to enable the transition
    void targetTestimonial.offsetWidth;
    
    // Apply the transition
    targetTestimonial.style.transition = 'all 0.5s ease';
    targetTestimonial.style.opacity = '1';
    targetTestimonial.style.transform = 'translateX(0)';
    
    // Add active class
    setTimeout(() => {
      targetTestimonial.classList.add('active');
    }, 50);
    
    // Update current index
    currentIndex = index;
    
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }
  
  // Initialize with the first testimonial
  testimonials[0].classList.add('active');
  testimonials[0].style.display = 'block';
  testimonials[0].style.opacity = '1';
  testimonials[0].style.transform = 'translateX(0)';
  
  // Add event listeners for navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showTestimonial(currentIndex - 1, 'prev');
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showTestimonial(currentIndex + 1, 'next');
    });
  }
  
  // Add event listeners for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const direction = index > currentIndex ? 'next' : 'prev';
      showTestimonial(index, direction);
    });
  });
  
  // Automatic slide change
  let autoSlideInterval = setInterval(() => {
    showTestimonial(currentIndex + 1, 'next');
  }, 6000);
  
  // Pause auto-sliding when user interacts with controls
  [prevBtn, nextBtn, ...dots].forEach(control => {
    if (control) {
      control.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        // Restart auto-sliding after 15 seconds of inactivity
        autoSlideInterval = setInterval(() => {
          showTestimonial(currentIndex + 1, 'next');
        }, 6000);
      });
    }
  });
}

// Override the original testimonial init function
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.testimonials-slider')) {
    initTestimonialSlider();
  }
});
