/**
 * Components.js - Handles loading shared components
 * This script loads navigation and footer components from separate HTML files
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load shared components 
    // Detect if we're in a subdirectory by checking URL path
    const pathSegments = window.location.pathname.split('/').filter(segment => segment !== '');
    const basePath = pathSegments.length > 1 ? '../'.repeat(pathSegments.length - 1) : './';
    
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
                placeholder.innerHTML = html;
                
                // Execute any scripts within the loaded component
                const scripts = placeholder.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    
                    // Copy all attributes
                    Array.from(script.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    
                    // Copy the content
                    newScript.textContent = script.textContent;
                    
                    // Replace the old script with the new one
                    script.parentNode.replaceChild(newScript, script);
                });
                
                // Trigger event that component is loaded
                document.dispatchEvent(new CustomEvent('componentLoaded', { 
                    detail: { id: placeholderId } 
                }));
            })
            .catch(error => {
                console.error(`Error loading component ${componentPath}:`, error);
                placeholder.innerHTML = `<div class="error">Failed to load component</div>`;
            });
    }
});
