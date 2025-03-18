/**
 * Revelate Operations - Main JavaScript
 * Handles core functionality and user interactions
 */

// Immediately invoked function expression to avoid polluting global namespace
(function() {
  'use strict';
  
  // DOM Elements
  const header = document.getElementById('header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainMenu = document.getElementById('main-menu');
  const backToTopBtn = document.getElementById('back-to-top');
  const portalBtn = document.getElementById('portal-btn');
  const portalModal = document.getElementById('portal-modal');
  const modalClose = document.querySelector('.modal-close');
  const loginForm = document.getElementById('login-form');
  const cookieConsent = document.getElementById('cookie-consent');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieEssential = document.getElementById('cookie-essential');
  const cookieSettings = document.getElementById('cookie-settings');
  const cookieSettingsModal = document.getElementById('cookie-settings-modal');
  const cookiePreferencesForm = document.getElementById('cookie-preferences-form');
  
  // Initialize function - called when DOM is fully loaded
  function init() {
    setupEventListeners();
    setupScrollEffects();
    initializeTooltips();
    checkCookieConsent();
    
    // Any page-specific initialization (delegated to separate modules)
    if (window.revelatePageInit && typeof window.revelatePageInit === 'function') {
      window.revelatePageInit();
    }
  }
  
  // Set up event listeners for interactive elements
  function setupEventListeners() {
    // Mobile menu toggle
    if (mobileToggle) {
      mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Back to top button
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', scrollToTop);
      
      // Show/hide back to top button based on scroll position
      window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      });
    }
    
    // Client portal modal
    if (portalBtn && portalModal) {
      portalBtn.addEventListener('click', openPortalModal);
    }
    
    // Modal close button
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal on outside click
    if (portalModal) {
      portalModal.addEventListener('click', (e) => {
        if (e.target === portalModal) {
          closeModal();
        }
      });
    }
    
    // Login form submission
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
      
      // Password visibility toggle
      const passwordToggle = document.querySelector('.password-toggle');
      if (passwordToggle) {
        passwordToggle.addEventListener('click', togglePasswordVisibility);
      }
    }
    
    // Cookie consent
    if (cookieConsent) {
      if (cookieAccept) cookieAccept.addEventListener('click', acceptAllCookies);
      if (cookieEssential) cookieEssential.addEventListener('click', acceptEssentialCookies);
      if (cookieSettings) cookieSettings.addEventListener('click', openCookieSettings);
    }
    
    // Cookie preferences form
    if (cookiePreferencesForm) {
      cookiePreferencesForm.addEventListener('submit', saveCookiePreferences);
    }
    
    // Close cookie settings modal
    if (cookieSettingsModal) {
      const closeBtn = cookieSettingsModal.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeCookieSettings);
      }
      
      // Close modal on outside click
      cookieSettingsModal.addEventListener('click', (e) => {
        if (e.target === cookieSettingsModal) {
          closeCookieSettings();
        }
      });
    }
    
    // Key press handling for modals (Escape key)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    });
  }
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    mainMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }
  
  // Scroll to top smoothly
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  // Set up scroll effects (header state, animations, etc.)
  function setupScrollEffects() {
    let lastScrollPosition = 0;
    
    window.addEventListener('scroll', () => {
      const currentScrollPosition = window.scrollY;
      
      // Add/remove sticky class to header
      if (currentScrollPosition > 100) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
      
      // Show/hide header on scroll direction (mobile only)
      if (window.innerWidth < 992) {
        if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 300) {
          header.classList.add('header-hidden');
        } else {
          header.classList.remove('header-hidden');
        }
      }
      
      lastScrollPosition = currentScrollPosition;
    });
  }
  
  // Initialize tooltips
  function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
      tooltip.addEventListener('mouseenter', showTooltip);
      tooltip.addEventListener('mouseleave', hideTooltip);
      tooltip.addEventListener('focus', showTooltip);
      tooltip.addEventListener('blur', hideTooltip);
    });
  }
  
  // Show tooltip
  function showTooltip(e) {
    const target = e.currentTarget;
    const tooltipText = target.getAttribute('data-tooltip');
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    document.body.appendChild(tooltip);
    
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    tooltip.style.top = `${targetRect.top - tooltipRect.height - 10 + window.scrollY}px`;
    tooltip.style.left = `${targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)}px`;
    
    target.setAttribute('data-tooltip-id', Date.now());
    tooltip.setAttribute('data-for', target.getAttribute('data-tooltip-id'));
    
    // Add visible class to start transition
    setTimeout(() => {
      tooltip.classList.add('visible');
    }, 10);
  }
  
  // Hide tooltip
  function hideTooltip(e) {
    const target = e.currentTarget;
    const tooltipId = target.getAttribute('data-tooltip-id');
    
    if (tooltipId) {
      const tooltip = document.querySelector(`.tooltip[data-for="${tooltipId}"]`);
      
      if (tooltip) {
        tooltip.classList.remove('visible');
        
        // Remove tooltip after transition completes
        setTimeout(() => {
          if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
          }
        }, 300);
      }
    }
  }
  
  // Open portal modal
  function openPortalModal(e) {
    e.preventDefault();
    
    if (portalModal) {
      portalModal.setAttribute('aria-hidden', 'false');
      portalModal.classList.add('active');
      document.body.classList.add('modal-open');
      
      // Focus first input
      setTimeout(() => {
        const firstInput = portalModal.querySelector('input');
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }
  }
  
  // Close modal
  function closeModal() {
    const modals = document.querySelectorAll('.modal.active');
    
    modals.forEach(modal => {
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('active');
    });
    
    document.body.classList.remove('modal-open');
  }
  
  // Close all modals
  function closeAllModals() {
    closeModal();
    if (cookieSettingsModal) {
      cookieSettingsModal.setAttribute('aria-hidden', 'true');
      cookieSettingsModal.classList.remove('active');
    }
  }
  
  // Handle login form submission
  function handleLogin(e) {
    e.preventDefault();
    
    const emailInput = loginForm.querySelector('#email');
    const passwordInput = loginForm.querySelector('#password');
    const messageContainer = loginForm.querySelector('.login-message');
    
    // Simple validation
    let isValid = true;
    
    if (!emailInput.value || !emailInput.value.includes('@')) {
      showInputError(emailInput, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearInputError(emailInput);
    }
    
    if (!passwordInput.value || passwordInput.value.length < 8) {
      showInputError(passwordInput, 'Password must be at least 8 characters');
      isValid = false;
    } else {
      clearInputError(passwordInput);
    }
    
    if (!isValid) {
      return;
    }
    
    // In a real implementation, this would be an API call
    // For now, just show a message
    if (messageContainer) {
      messageContainer.innerHTML = '<div class="alert alert-info">This is a demo. The client portal is not implemented in this version.</div>';
    }
  }
  
  // Show input error
  function showInputError(input, message) {
    const formGroup = input.closest('.form-group');
    
    if (formGroup) {
      formGroup.classList.add('has-error');
      
      const feedback = formGroup.querySelector('.form-feedback');
      if (feedback) {
        feedback.textContent = message;
      }
    }
  }
  
  // Clear input error
  function clearInputError(input) {
    const formGroup = input.closest('.form-group');
    
    if (formGroup) {
      formGroup.classList.remove('has-error');
      
      const feedback = formGroup.querySelector('.form-feedback');
      if (feedback) {
        feedback.textContent = '';
      }
    }
  }
  
  // Toggle password visibility
  function togglePasswordVisibility(e) {
    const button = e.currentTarget;
    const passwordInput = button.closest('.password-input-wrapper').querySelector('input');
    const icon = button.querySelector('i');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
      button.setAttribute('aria-label', 'Hide password');
    } else {
      passwordInput.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
      button.setAttribute('aria-label', 'Show password');
    }
  }
  
  // Check if cookie consent is needed
  function checkCookieConsent() {
    if (cookieConsent) {
      const cookiesAccepted = localStorage.getItem('cookiesAccepted');
      
      if (!cookiesAccepted) {
        // Show cookie consent banner after a short delay
        setTimeout(() => {
          cookieConsent.classList.add('active');
        }, 1000);
      }
    }
  }
  
  // Accept all cookies
  function acceptAllCookies() {
    // Save preferences
    const preferences = {
      essential: true,
      analytics: true,
      marketing: true,
      accepted: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    
    // Hide consent banner
    if (cookieConsent) {
      cookieConsent.classList.remove('active');
    }
    
    // Initialize analytics (if implemented)
    initializeAnalytics();
  }
  
  // Accept only essential cookies
  function acceptEssentialCookies() {
    // Save preferences
    const preferences = {
      essential: true,
      analytics: false,
      marketing: false,
      accepted: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    
    // Hide consent banner
    if (cookieConsent) {
      cookieConsent.classList.remove('active');
    }
  }
  
  // Open cookie settings modal
  function openCookieSettings(e) {
    e.preventDefault();
    
    if (cookieSettingsModal) {
      // Load saved preferences
      loadCookiePreferences();
      
      cookieSettingsModal.setAttribute('aria-hidden', 'false');
      cookieSettingsModal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  }
  
  // Close cookie settings modal
  function closeCookieSettings() {
    if (cookieSettingsModal) {
      cookieSettingsModal.setAttribute('aria-hidden', 'true');
      cookieSettingsModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  }
  
  // Load cookie preferences into form
  function loadCookiePreferences() {
    const savedPreferences = localStorage.getItem('cookiePreferences');
    
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        
        // Set checkbox states
        const analyticsCheckbox = document.getElementById('analytics-cookies');
        const marketingCheckbox = document.getElementById('marketing-cookies');
        
        if (analyticsCheckbox && preferences.hasOwnProperty('analytics')) {
          analyticsCheckbox.checked = preferences.analytics;
        }
        
        if (marketingCheckbox && preferences.hasOwnProperty('marketing')) {
          marketingCheckbox.checked = preferences.marketing;
        }
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    }
  }
  
  // Save cookie preferences from form
  function saveCookiePreferences(e) {
    e.preventDefault();
    
    const analyticsCheckbox = document.getElementById('analytics-cookies');
    const marketingCheckbox = document.getElementById('marketing-cookies');
    
    // Save preferences
    const preferences = {
      essential: true, // Always required
      analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
      marketing: marketingCheckbox ? marketingCheckbox.checked : false,
      accepted: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    
    // Hide consent banner and close modal
    if (cookieConsent) {
      cookieConsent.classList.remove('active');
    }
    
    closeCookieSettings();
    
    // Initialize analytics if enabled
    if (preferences.analytics) {
      initializeAnalytics();
    }
  }
  
  // Initialize analytics (placeholder function)
  function initializeAnalytics() {
    // This would be implemented to initialize analytics based on preferences
    console.log('Analytics initialized based on cookie preferences');
  }
  
  // Initialize counter animations for numbers in hero section
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000; // 2 seconds
      const step = Math.ceil(target / (duration / 16)); // 60fps
      let current = 0;
      
      const updateCounter = () => {
        current += step;
        
        if (current > target) {
          current = target;
        }
        
        counter.textContent = current;
        
        if (current < target) {
          requestAnimationFrame(updateCounter);
        }
      };
      
      // Use Intersection Observer to trigger counter when visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(counter);
    });
  }
  
  // Initialize testimonial slider
  function initTestimonialSlider() {
    const slider = document.getElementById('testimonials-slider');
    
    if (!slider) return;
    
    const track = slider.querySelector('.testimonials-track');
    const slides = slider.querySelectorAll('.testimonial-slide');
    const dots = slider.querySelectorAll('.testimonial-dot');
    const prevBtn = slider.querySelector('.prev-arrow');
    const nextBtn = slider.querySelector('.next-arrow');
    
    if (!track || !slides.length) return;
    
    let currentIndex = 0;
    
    // Function to update slide position
    const updateSlidePosition = () => {
      slides.forEach((slide, index) => {
        if (index === currentIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      
      // Update dots
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('active');
          dot.setAttribute('aria-current', 'false');
        }
      });
    };
    
    // Previous slide
    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlidePosition();
    };
    
    // Next slide
    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlidePosition();
    };
    
    // Event listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateSlidePosition();
      });
    });
    
    // Auto advance slides (can be disabled)
    const autoAdvance = true;
    const autoAdvanceDelay = 5000; // 5 seconds
    
    if (autoAdvance) {
      let interval = setInterval(nextSlide, autoAdvanceDelay);
      
      // Pause auto-advance on hover or focus
      slider.addEventListener('mouseenter', () => {
        clearInterval(interval);
      });
      
      slider.addEventListener('mouseleave', () => {
        interval = setInterval(nextSlide, autoAdvanceDelay);
      });
      
      slider.addEventListener('focusin', () => {
        clearInterval(interval);
      });
      
      slider.addEventListener('focusout', (e) => {
        if (!slider.contains(e.relatedTarget)) {
          interval = setInterval(nextSlide, autoAdvanceDelay);
        }
      });
    }
    
    // Enable touch swipe for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    });
    
    function handleSwipe() {
      const threshold = 50; // Minimum swipe distance
      
      if (touchEndX < touchStartX - threshold) {
        // Swipe left, go to next slide
        nextSlide();
      }
      
      if (touchEndX > touchStartX + threshold) {
        // Swipe right, go to previous slide
        prevSlide();
      }
    }
  }
  
  // Initialize when DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Initialize counters and slider after a short delay (to ensure AOS animations run first)
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      initCounters();
      initTestimonialSlider();
    }, 500);
  });
  
  // Export public API
  window.revelate = {
    scrollToTop,
    closeModal,
    openPortalModal
  };
})();