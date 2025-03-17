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
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Change hamburger icon based on state
            if (expanded) {
                // Mobile menu is closing
                document.body.style.overflow = '';
            } else {
                // Mobile menu is opening
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Close mobile menu when clicking a link
        const navLinksArray = document.querySelectorAll('.nav-links a');
        navLinksArray.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
                if (mobileToggle) {
                    mobileToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(event.target) && 
                !mobileToggle.contains(event.target)) {
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/**
 * Highlight active navigation links based on current URL
 */
function highlightActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (!linkHref) return;
        
        // For home page
        if ((currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '') && 
            (linkHref === 'index.html' || linkHref === './')) {
            link.classList.add('active');
        } 
        // For case studies directory
        else if (currentPath.includes('case-studies/') && 
                 linkHref && linkHref.includes('case-studies')) {
            link.classList.add('active');
        }
        // For other pages
        else if (linkHref && currentPath.endsWith(linkHref)) {
            link.classList.add('active');
        }
    });
}

/**
 * Handle scroll events for sticky navigation and back-to-top button
 */
function handleScrollEvents() {
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('back-to-top');
    
    function handleHeaderScroll() {
        if (window.scrollY > 50 && header) {
            header.classList.add('scrolled');
        } else if (header) {
            header.classList.remove('scrolled');
        }
        
        if (backToTopBtn) {
            if (window.scrollY > 600) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }
    
    // Call once on page load
    handleHeaderScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Add click event to back-to-top button
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
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
    
    if (!portalBtn || !loginModal) return;
    
    // Open modal when clicking portal button
    portalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openLoginModal();
    });
    
    // Close modal when clicking close button
    if (closeModal) {
        closeModal.addEventListener('click', closeLoginModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            closeLoginModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal.style.display === 'flex') {
            closeLoginModal();
        }
    });
    
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const email = document.getElementById('email-login');
            const password = document.getElementById('password-login');
            let isValid = true;
            
            // Reset previous validation
            email.classList.remove('is-invalid');
            password.classList.remove('is-invalid');
            document.querySelectorAll('.form-feedback').forEach(feedback => {
                feedback.textContent = '';
            });
            
            // Validate email
            if (!email.value.trim()) {
                email.classList.add('is-invalid');
                email.nextElementSibling.textContent = 'Email is required';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                email.classList.add('is-invalid');
                email.nextElementSibling.textContent = 'Please enter a valid email';
                isValid = false;
            }
            
            // Validate password
            if (!password.value.trim()) {
                password.classList.add('is-invalid');
                password.nextElementSibling.textContent = 'Password is required';
                isValid = false;
            }
            
            if (isValid) {
                // Simulate login (in production this would call an API)
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
                
                setTimeout(() => {
                    // Show success and redirect (in production)
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                    setTimeout(() => {
                        closeLoginModal();
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        loginForm.reset();
                    }, 1000);
                }, 1500);
            }
        });
    }
    
    function openLoginModal() {
        loginModal.style.display = 'flex';
        loginModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Focus the first input
        setTimeout(() => {
            const firstInput = loginModal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }
    
    function closeLoginModal() {
        document.body.style.overflow = ''; // Restore scrolling
        
        // Add fade-out animation
        loginModal.style.opacity = '0';
        setTimeout(() => {
            loginModal.style.display = 'none';
            loginModal.style.opacity = '1';
            loginModal.setAttribute('aria-hidden', 'true');
        }, 300);
    }
}
