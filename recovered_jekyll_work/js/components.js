/**
 * Components.js - Handles loading shared components with path awareness
 * This script loads navigation and footer components from separate HTML files
 * and adjusts paths based on the current page location
 */

document.addEventListener('DOMContentLoaded', function() {
    // Detect current path depth and calculate base path
    const calculateBasePath = () => {
        const path = window.location.pathname;
        // Handle potential trailing slash
        const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
        const pathSegments = normalizedPath.split('/').filter(segment => segment !== '');
        
        // Calculate basePath based on depth (for proper relative navigation)
        let basePath = '';
        
        // If the path ends with a file (contains a dot), we don't count that segment
        const depth = pathSegments.length > 0 && 
                      pathSegments[pathSegments.length - 1].includes('.') ? 
                      pathSegments.length - 1 : 
                      pathSegments.length;
        
        // For each directory level, we need to go up one level
        if (depth > 0) {
            basePath = '../'.repeat(depth);
        }
        
        return basePath;
    };
    
    const basePath = calculateBasePath();
    
    // Store the basePath in a global variable for other scripts to use
    window.siteBasePath = basePath;
    
    // Load components with correct paths
    const componentsToLoad = [
        { id: 'nav-placeholder', path: 'components/navigation.html' },
        { id: 'footer-placeholder', path: 'components/footer.html' }
    ];
    
    // Keep track of loaded components
    let loadedComponents = 0;
    const requiredComponents = componentsToLoad.length;
    
    // Process HTML content to update paths
    const processComponentPaths = (html, basePath) => {
        // If we're at root, no need to process
        if (basePath === '') return html;
        
        // Update relative URLs that aren't anchors, absolute paths, or external
        return html
            // src attributes
            .replace(/src="(?!http|\/|#|\$\{basePath\})([^"]+)"/g, `src="${basePath}$1"`)
            // href attributes
            .replace(/href="(?!http|\/|#|\$\{basePath\})([^"]+)"/g, `href="${basePath}$1"`)
            // Add basePath variable for scripts to use
            .replace(/\$\{basePath\}/g, basePath);
    };
    
    // Function to load a component into a placeholder
    const loadComponent = ({ id, path }) => {
        const placeholder = document.getElementById(id);
        if (!placeholder) {
            console.warn(`Component placeholder #${id} not found`);
            onComponentLoaded(); // Count as loaded even if not found
            return;
        }
        
        const componentPath = basePath + path;
        
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
                executeComponentScripts(placeholder, basePath);
                
                // Trigger event that component is loaded
                document.dispatchEvent(new CustomEvent('componentLoaded', { 
                    detail: { id, basePath } 
                }));
                
                onComponentLoaded();
            })
            .catch(error => {
                console.error(`Error loading component ${componentPath}:`, error);
                placeholder.innerHTML = `<div class="error">Failed to load component</div>`;
                onComponentLoaded(); // Count as loaded even if error
            });
    };
    
    // Execute scripts within a loaded component
    const executeComponentScripts = (container, basePath) => {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            
            // Copy all attributes
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            
            // Copy the content with basePath available to the script
            const scriptContent = oldScript.textContent.replace(/\$\{basePath\}/g, basePath);
            newScript.textContent = scriptContent;
            
            // Replace the old script with the new one
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    };
    
    // Called when a component is loaded (successfully or not)
    const onComponentLoaded = () => {
        loadedComponents++;
        
        // If all components are loaded, initialize functionality
        if (loadedComponents >= requiredComponents) {
            initializeSite();
        }
    };
    
    // Load all components
    componentsToLoad.forEach(loadComponent);
    
    // Initialize site functionality after all components are loaded
    function initializeSite() {
        // Initialize mobile menu
        initializeMobileMenu();
        
        // Initialize modal functionality
        initializeModalFunctionality();
        
        // Dispatch event that all components are loaded
        document.dispatchEvent(new CustomEvent('allComponentsLoaded', { 
            detail: { basePath } 
        }));
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
                if (icon) {
                    if (expanded) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    } else {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    }
                }
            });
            
            // Close mobile menu when clicking a link
            const navLinksArray = navLinks.querySelectorAll('.nav-link');
            navLinksArray.forEach(link => {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('active');
                    if (mobileToggle) {
                        mobileToggle.setAttribute('aria-expanded', 'false');
                        const icon = mobileToggle.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
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
                
                if (!email || !password) return;
                
                const emailFeedback = email.nextElementSibling;
                const passwordFeedback = password.nextElementSibling;
                
                // Reset previous validation
                email.classList.remove('is-invalid');
                password.classList.remove('is-invalid');
                
                if (emailFeedback) emailFeedback.textContent = '';
                if (passwordFeedback) passwordFeedback.textContent = '';
                
                // Email validation
                if (!email.value.trim()) {
                    email.classList.add('is-invalid');
                    if (emailFeedback) emailFeedback.textContent = 'Email is required';
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                    email.classList.add('is-invalid');
                    if (emailFeedback) emailFeedback.textContent = 'Please enter a valid email address';
                    isValid = false;
                }
                
                // Password validation
                if (!password.value) {
                    password.classList.add('is-invalid');
                    if (passwordFeedback) passwordFeedback.textContent = 'Password is required';
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
