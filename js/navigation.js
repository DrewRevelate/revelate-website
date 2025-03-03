/**
 * Navigation functionality for Revelate Operations website
 * Handles navigation menu initialization, mobile menu toggle, and active link highlighting
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu functionality
    initMobileMenu();
    
    // Highlight active navigation links
    highlightActiveLinks();
    
    // Handle scroll events for sticky navigation
    handleScrollEvents();
    
    // Initialize client portal modal
    initPortalModal();
});

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
            navLinks.classList.toggle('active');
            
            // Change icon based on state
            const icon = this.querySelector('i');
            if (expanded) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        });
        
        // Close mobile menu when clicking a link
        const navLinksArray = document.querySelectorAll('.nav-link');
        navLinksArray.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    const icon = mobileToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
}

/**
 * Highlight active navigation links based on current URL
 */
/**
 * Highlight active navigation links based on current URL
 */
function highlightActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // For home page
        if ((currentPath === '/' || currentPath.endsWith('index.html')) && 
            (linkHref === 'index.html' || linkHref === './')) {
            link.classList.add('active');
        } 
        // For other pages
        else if (linkHref && currentPath.includes(linkHref) && linkHref !== 'index.html') {
            link.classList.add('active');
        }
        // For directories like case-studies
        else if (currentPath.includes('case-studies') && 
                linkHref && linkHref.includes('case-studies')) {
            link.classList.add('active');
        }
    });
}

/**
 * Handle scroll events for sticky navigation
 */
function handleScrollEvents() {
    const navbar = document.getElementById('navbar');
    
    function handleNavbarScroll() {
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    // Call once on load to set initial state
    handleNavbarScroll();
    
    // Scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (scrollTopBtn) {
        function handleScrollToTopVisibility() {
            if (window.scrollY > 700) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
        
        window.addEventListener('scroll', handleScrollToTopVisibility);
        handleScrollToTopVisibility();
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Initialize client portal modal functionality
 */
function initPortalModal() {
    const portalBtn = document.getElementById('portal-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (portalBtn && loginModal) {
        portalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'flex';
            loginModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Focus the first input field
            setTimeout(() => {
                const firstInput = loginModal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        });
    }
    
    if (closeModal && loginModal) {
        closeModal.addEventListener('click', function() {
            closeLoginModal();
        });
    }
    
    // Close modal when clicking outside of it
    if (loginModal) {
        window.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
        
        // Close modal on escape key
        window.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && loginModal.style.display === 'flex') {
                closeLoginModal();
            }
        });
    }
    
    function closeLoginModal() {
        if (!loginModal) return;
        
        loginModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Add a fade-out animation
        loginModal.style.opacity = '0';
        setTimeout(() => {
            loginModal.style.display = 'none';
            loginModal.style.opacity = '1';
        }, 300);
    }
}
