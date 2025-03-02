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
});
