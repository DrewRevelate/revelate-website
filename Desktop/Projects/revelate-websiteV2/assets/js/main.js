/**
 * Revelate Operations - Enhanced Main JavaScript
 * Optimized for performance and user experience
 */

// Use a module pattern for better organization and to avoid globals
const Revelate = (function() {
  // Private variables
  let config = {
    animations: true,
    lazyLoading: true,
    analyticsEnabled: true
  };
  
  /**
   * Initialize all functionality
   */
  function init() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      config.animations = false;
    }
    
    // Core functionality
    initHeader();
    initBackToTop();
    initServiceLinks();
    
    // Portal modal functionality
    if (document.getElementById('portal-btn')) {
      initPortalModal();
    }
    
    // Enhanced image loading
    if (config.lazyLoading) {
      initLazyLoading();
    }
    
    // Analytics
    if (config.analyticsEnabled) {
      initAnalytics();
    }
    
    // Page-specific initializations
    initPageSpecific();
  }
  
  /**
   * Initialize header functionality (sticky header, mobile menu)
   */
  function initHeader() {
    const header = document.getElementById('header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Sticky header on scroll (throttled for performance)
    let lastScrollTop = 0;
    let ticking = false;
    
    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          
          // Add 'scrolled' class when scrolled down
          if (scrollTop > 50) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          
          // Hide/show header based on scroll direction (optional)
          if (scrollTop > 200) {
            if (scrollTop > lastScrollTop) {
              // Scrolling down
              header.classList.add('header-hidden');
            } else {
              // Scrolling up
              header.classList.remove('header-hidden');
            }
          } else {
            // Always show header near the top
            header.classList.remove('header-hidden');
          }
          
          lastScrollTop = scrollTop;
          ticking = false;
        });
        
        ticking = true;
      }
    }
    
    // Initial check and add scroll listener with passive option for performance
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Mobile menu toggle
    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        
        // Toggle body scroll when menu is open
        if (!expanded) {
          document.body.classList.add('menu-open');
        } else {
          document.body.classList.remove('menu-open');
        }
        
        // Track menu toggle in analytics
        if (config.analyticsEnabled && typeof gtag !== 'undefined') {
          gtag('event', expanded ? 'close_mobile_menu' : 'open_mobile_menu');
        }
      });
      
      // Close mobile menu when clicking a nav link
      const navItems = navLinks.querySelectorAll('.nav-link');
      navItems.forEach(item => {
        item.addEventListener('click', function() {
          mobileToggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('menu-open');
        });
      });
      
      // Close mobile menu when clicking outside
      document.addEventListener('click', function(event) {
        if (navLinks && 
            mobileToggle.getAttribute('aria-expanded') === 'true' && 
            !navLinks.contains(event.target) && 
            !mobileToggle.contains(event.target)) {
          mobileToggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('menu-open');
        }
      });
    }
    
    // Highlight active nav link based on current page
    highlightCurrentPage();
  }
  
  /**
   * Highlight the active navigation link based on the current page
   */
  function highlightCurrentPage() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Handle root/index page
      if ((currentPath === '/' || currentPath.endsWith('index.html')) && 
          (href === '/' || href === '/index.html' || href === 'index.html')) {
        link.classList.add('active');
      }
      // Handle other pages
      else if (href && currentPath.includes(href) && href !== '/' && href !== 'index.html') {
        link.classList.add('active');
      }
    });
  }
  
  /**
   * Initialize back to top button
   */
  function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    
    if (!backToTop) return;
    
    // Show button when scrolled down (throttled for performance)
    let ticking = false;
    
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 500) {
            backToTop.classList.add('visible');
          } else {
            backToTop.classList.remove('visible');
          }
          ticking = false;
        });
        
        ticking = true;
      }
    }, { passive: true });
    
    // Scroll to top when clicked
    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: config.animations ? 'smooth' : 'auto'
      });
      
      // Track interaction in analytics
      if (config.analyticsEnabled && typeof gtag !== 'undefined') {
        gtag('event', 'back_to_top_click');
      }
    });
  }
  
  /**
   * Initialize service card links with enhanced interaction
   */
  function initServiceLinks() {
    const serviceLinks = document.querySelectorAll('.service-link');
    
    serviceLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // If it's a true link (with href), let it navigate
        if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) return;
        
        // Otherwise, prevent default and handle expansion
        e.preventDefault();
        
        const card = this.closest('.service-card');
        
        if (card) {
          // Toggle expanded class
          card.classList.toggle('expanded');
          
          // Update aria-expanded state
          const expanded = card.classList.contains('expanded');
          this.setAttribute('aria-expanded', expanded);
          
          // Update text if needed
          const textSpan = this.querySelector('span');
          if (textSpan) {
            textSpan.textContent = expanded ? 'Show Less' : 'Learn More';
          }
          
          // Track interaction in analytics
          if (config.analyticsEnabled && typeof gtag !== 'undefined') {
            const serviceName = card.querySelector('.service-title')?.textContent || 'unknown';
            gtag('event', expanded ? 'expand_service' : 'collapse_service', {
              'event_category': 'engagement',
              'event_label': serviceName
            });
          }
        }
      });
    });
  }
  
  /**
   * Initialize client portal modal with enhanced functionality
   */
  function initPortalModal() {
    const portalBtn = document.getElementById('portal-btn');
    const portalModal = document.getElementById('portal-modal');
    const closeBtn = portalModal ? portalModal.querySelector('.modal-close') : null;
    const loginForm = portalModal ? portalModal.querySelector('#login-form') : null;
    
    // Open modal when portal button is clicked
    if (portalBtn && portalModal) {
      portalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(portalModal);
      });
    }
    
    // Close modal when close button is clicked
    if (closeBtn && portalModal) {
      closeBtn.addEventListener('click', function() {
        closeModal(portalModal);
      });
    }
    
    // Close modal when clicking outside of content
    if (portalModal) {
      portalModal.addEventListener('click', function(e) {
        if (e.target === portalModal) {
          closeModal(portalModal);
        }
      });
    }
    
    // Close modal when escape key is pressed
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && portalModal && portalModal.getAttribute('aria-hidden') === 'false') {
        closeModal(portalModal);
      }
    });
    
    // Enhanced form validation and submission
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Enhanced client-side validation
        const email = this.querySelector('#email');
        const password = this.querySelector('#password');
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.form-feedback').forEach(feedback => {
          feedback.textContent = '';
        });
        document.querySelectorAll('.form-control').forEach(control => {
          control.classList.remove('is-invalid');
        });
        
        // Validate email
        if (!email.value.trim()) {
          showError(email, 'Email is required');
          isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
          showError(email, 'Please enter a valid email');
          isValid = false;
        }
        
        // Validate password
        if (!password.value.trim()) {
          showError(password, 'Password is required');
          isValid = false;
        }
        
        if (isValid) {
          // This would normally send the data to the server
          // For demo purposes, we'll just show a success message
          const submitBtn = this.querySelector('button[type="submit"]');
          const originalText = submitBtn.textContent;
          
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
          
          // Simulate server request
          setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
            
            setTimeout(() => {
              // Here you would redirect to the client portal
              // For now, just close the modal and reset the form
              closeModal(portalModal);
              submitBtn.innerHTML = originalText;
              submitBtn.disabled = false;
              loginForm.reset();
            }, 1000);
          }, 1500);
          
          // Track login in analytics
          if (config.analyticsEnabled && typeof gtag !== 'undefined') {
            gtag('event', 'login_attempt', {
              'event_category': 'engagement',
              'method': 'portal'
            });
          }
        }
      });
    }
  }
  
  /**
   * Open a modal
   * @param {HTMLElement} modal - The modal element to open
   */
  function openModal(modal) {
    if (!modal) return;
    
    // Make modal visible
    modal.setAttribute('aria-hidden', 'false');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Focus first input if there is one
    setTimeout(() => {
      const firstInput = modal.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }
  
  /**
   * Close a modal
   * @param {HTMLElement} modal - The modal element to close
   */
  function closeModal(modal) {
    if (!modal) return;
    
    // Hide modal
    modal.setAttribute('aria-hidden', 'true');
    
    // Re-enable body scrolling
    document.body.style.overflow = '';
  }
  
  /**
   * Initialize performance-optimized lazy loading for images
   */
  function initLazyLoading() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            const src = lazyImage.getAttribute('data-src');
            
            if (src) {
              lazyImage.src = src;
              lazyImage.removeAttribute('data-src');
              lazyImage.classList.add('loaded');
              observer.unobserve(lazyImage);
            }
          }
        });
      });
      
      // Get all lazy images
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        img.classList.add('loaded');
      });
    }
  }
  
  /**
   * Initialize analytics tracking
   */
  function initAnalytics() {
    if (typeof gtag === 'undefined') return;
    
    // Track page view timing
    const timing = window.performance && window.performance.timing;
    if (timing) {
      window.addEventListener('load', function() {
        setTimeout(function() {
          const loadTime = timing.loadEventEnd - timing.navigationStart;
          gtag('event', 'timing_complete', {
            'name': 'page_load',
            'value': loadTime,
            'event_category': 'Performance'
          });
        }, 0);
      });
    }
    
    // Track user engagement
    document.addEventListener('click', function(e) {
      // Track CTA button clicks
      if (e.target.closest('.btn-primary')) {
        const button = e.target.closest('.btn-primary');
        const buttonText = button.textContent.trim();
        const section = getParentSection(button);
        
        gtag('event', 'cta_click', {
          'event_category': 'engagement',
          'event_label': buttonText,
          'section': section
        });
      }
      
      // Track outbound links
      if (e.target.closest('a[href^="http"]')) {
        const link = e.target.closest('a[href^="http"]');
        const href = link.getAttribute('href');
        
        // Only track external links
        if (href && !href.includes(window.location.hostname)) {
          gtag('event', 'outbound_link', {
            'event_category': 'engagement',
            'event_label': href
          });
        }
      }
    });
    
    // Helper to get parent section
    function getParentSection(element) {
      let current = element;
      while (current && current !== document.body) {
        if (current.tagName === 'SECTION') {
          return current.id || current.className.split(' ')[0];
        }
        current = current.parentElement;
      }
      return 'unknown';
    }
  }
  
  /**
   * Show validation error for a form field
   * @param {HTMLElement} input - The input element
   * @param {string} message - The error message
   */
  function showError(input, message) {
    input.classList.add('is-invalid');
    const feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains('form-feedback')) {
      feedback.textContent = message;
      feedback.style.display = 'block';
    }
  }
  
  /**
   * Validate email format
   * @param {string} email - The email to validate
   * @returns {boolean} - Whether the email is valid
   */
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }
  
  /**
   * Initialize page-specific functionality based on current URL
   */
  function initPageSpecific() {
    const path = window.location.pathname;
    
    // Home page specific initializations
    if (path === '/' || path.endsWith('index.html')) {
      initCounters();
    }
    
    // Services page
    else if (path.includes('services')) {
      initExpandableCards();
    }
    
    // Case studies page
    else if (path.includes('case-studies')) {
      if (path.endsWith('index.html') || path.endsWith('case-studies/')) {
        initCaseStudyFilters();
      }
    }
    
    // Contact page
    else if (path.includes('contact')) {
      // Contact form is handled by contact.js
    }
  }
  
  /**
   * Initialize counter animations
   */
  function initCounters() {
    const counterElements = document.querySelectorAll('.counter');
    
    if (!counterElements.length) return;
    
    // Only initialize counters when they come into view
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.closest('.metric').getAttribute('data-value'));
            animateCounter(counter, target);
            counterObserver.unobserve(counter);
          }
        });
      }, {
        threshold: 0.1 // Start animation when 10% of the element is visible
      });
      
      counterElements.forEach(counter => {
        counterObserver.observe(counter);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      counterElements.forEach(counter => {
        const target = parseInt(counter.closest('.metric').getAttribute('data-value'));
        animateCounter(counter, target);
      });
    }
  }
  
  /**
   * Animate a counter from 0 to target value
   * @param {HTMLElement} element - The counter element
   * @param {number} target - The target value
   */
  function animateCounter(element, target) {
    let count = 0;
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    const increment = target / totalFrames;
    
    // Only run animation if animations are enabled
    if (!config.animations) {
      element.textContent = target;
      return;
    }
    
    const animate = () => {
      count += increment;
      if (count >= target) {
        element.textContent = target;
        return;
      }
      
      element.textContent = Math.floor(count);
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  /**
   * Initialize expandable cards (for services page)
   */
  function initExpandableCards() {
    const cards = document.querySelectorAll('.feature-card');
    const toggles = document.querySelectorAll('.feature-link');
    
    toggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        const card = this.closest('.feature-card');
        const isExpanded = card.classList.contains('expanded');
        
        // Close all cards first
        cards.forEach(c => c.classList.remove('expanded'));
        toggles.forEach(t => {
          t.setAttribute('aria-expanded', 'false');
          if (t.querySelector('.link-text')) {
            t.querySelector('.link-text').textContent = 'Learn More';
          }
        });
        
        // Then expand this one if it wasn't already expanded
        if (!isExpanded) {
          card.classList.add('expanded');
          this.setAttribute('aria-expanded', 'true');
          if (this.querySelector('.link-text')) {
            this.querySelector('.link-text').textContent = 'Close';
          }
          
          // Scroll to the card if it's not fully visible
          const cardRect = card.getBoundingClientRect();
          const headerHeight = document.getElementById('header').offsetHeight;
          
          if (cardRect.top < headerHeight) {
            window.scrollTo({
              top: window.pageYOffset + cardRect.top - headerHeight - 20,
              behavior: config.animations ? 'smooth' : 'auto'
            });
          }
          
          // Track in analytics
          if (config.analyticsEnabled && typeof gtag !== 'undefined') {
            const serviceName = card.querySelector('h3')?.textContent || 'unknown';
            gtag('event', 'expand_service_card', {
              'event_category': 'engagement',
              'event_label': serviceName
            });
          }
        }
      });
    });
    
    // If URL has a hash, open that card
    const hash = window.location.hash;
    if (hash) {
      const targetCard = document.querySelector(hash);
      if (targetCard) {
        const toggle = targetCard.querySelector('.feature-link');
        if (toggle) {
          setTimeout(() => {
            toggle.click();
          }, 500);
        }
      }
    }
  }
  
  /**
   * Initialize case study filters
   */
  function initCaseStudyFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const caseStudies = document.querySelectorAll('.case-study-card');
    
    if (!filterButtons.length || !caseStudies.length) return;
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Update active state for buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        
        // Filter the case studies
        caseStudies.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
            setTimeout(() => {
              card.classList.remove('hidden');
            }, 10);
          } else {
            card.classList.add('hidden');
            setTimeout(() => {
              card.style.display = 'none';
            }, 300); // Match transition duration
          }
        });
        
        // Track in analytics
        if (config.analyticsEnabled && typeof gtag !== 'undefined') {
          gtag('event', 'filter_case_studies', {
            'event_category': 'engagement',
            'event_label': filter
          });
        }
      });
    });
  }
  
  // Public API
  return {
    init: init,
    openModal: openModal,
    closeModal: closeModal
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', Revelate.init);
