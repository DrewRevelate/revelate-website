/**
 * Components.js - Handles loading shared components with path awareness
 * This script loads navigation and footer components from separate HTML files
 * and adjusts paths based on the current page location
 */

document.addEventListener('DOMContentLoaded', function() {
    // Detect current path depth and calculate base path
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(segment => segment !== '');
    
    // Calculate basePath based on depth (for proper relative navigation)
    let basePath = '';
    
    // If the path ends with a file (contains a dot), we don't count that segment
    const depth = pathSegments.length > 0 && pathSegments[pathSegments.length - 1].includes('.') ? 
                  pathSegments.length - 1 : 
                  pathSegments.length;
    
    // For each directory level, we need to go up one level
    if (depth > 0) {
        basePath = '../'.repeat(depth);
    }
    
    // Store the basePath in a global variable for other scripts to use
    window.siteBasePath = basePath;
    
    // Load components with correct paths
    loadComponent('nav-placeholder', basePath + 'components/navigation.html');
    loadComponent('footer-placeholder', basePath + 'components/footer.html');
    
    // Function to load a component into a placeholder
    function loadComponent(placeholderId, componentPath) {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;
        
        fetch(componentPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load component: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                // Process the HTML to adjust relative paths based on current depth
                const processedHtml = processComponentPaths(html, basePath);
                placeholder.innerHTML = processedHtml;
                
                // Execute any scripts within the loaded component
                const scripts = placeholder.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    
                    // Copy all attributes
                    Array.from(script.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    
                    // Copy the content with basePath available to the script
                    const scriptContent = script.textContent.replace(/\$\{basePath\}/g, basePath);
                    newScript.textContent = scriptContent;
                    
                    // Replace the old script with the new one
                    script.parentNode.replaceChild(newScript, script);
                });
                
                // Trigger event that component is loaded
                document.dispatchEvent(new CustomEvent('componentLoaded', { 
                    detail: { id: placeholderId, basePath: basePath } 
                }));
                
                // Fix mobile menu if we're in the navigation component
                if (placeholderId === 'nav-placeholder') {
                    initializeMobileMenu();
                }
                
                // Initialize modal functionality if we're in the footer component
                if (placeholderId === 'footer-placeholder') {
                    initializeModalFunctionality();
                }
            })
            .catch(error => {
                console.error(`Error loading component ${componentPath}:`, error);
                placeholder.innerHTML = `<div class="error">Failed to load component</div>`;
            });
    }
    
    // Process HTML content to update paths
    function processComponentPaths(html, basePath) {
        // If we're at root, no need to process
        if (basePath === '') return html;
        
        // Update relative URLs that aren't anchors, absolute paths, or external
        return html
            // src attributes
            .replace(/src="(?!http|\/|#)([^"]+)"/g, `src="${basePath}$1"`)
            // href attributes
            .replace(/href="(?!http|\/|#)([^"]+)"/g, `href="${basePath}$1"`)
            // Add basePath variable for scripts to use
            .replace(/\$\{basePath\}/g, basePath);
    }
    
    // Initialize mobile menu functionality
    function initializeMobileMenu() {
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
    
    // Initialize modal functionality
    function initializeModalFunctionality() {
        const portalBtn = document.getElementById('portal-btn');
        const loginModal = document.getElementById('login-modal');
        const closeModal = document.querySelector('.close-modal');
        const loginForm = document.getElementById('login-form');
        
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
        
        // Handle login form submission
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Basic validation logic
                let isValid = true;
                const email = document.getElementById('email-login');
                const password = document.getElementById('password-login');
                const emailFeedback = email.nextElementSibling;
                const passwordFeedback = password.nextElementSibling;
                
                // Reset previous validation
                email.classList.remove('is-invalid');
                password.classList.remove('is-invalid');
                emailFeedback.textContent = '';
                passwordFeedback.textContent = '';
                
                // Email validation
                if (!email.value.trim()) {
                    email.classList.add('is-invalid');
                    emailFeedback.textContent = 'Email is required';
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                    email.classList.add('is-invalid');
                    emailFeedback.textContent = 'Please enter a valid email address';
                    isValid = false;
                }
                
                // Password validation
                if (!password.value) {
                    password.classList.add('is-invalid');
                    passwordFeedback.textContent = 'Password is required';
                    isValid = false;
                }
                
                if (isValid) {
                    // Simulate login success
                    alert('This would normally log you into the client portal. Feature coming soon!');
                    closeLoginModal();
                    loginForm.reset();
                }
            });
        }
    }
});
