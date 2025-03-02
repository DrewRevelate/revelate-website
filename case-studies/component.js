/**
 * Components.js for subdirectories
 * This version adjusts paths for components in subdirectories
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load shared components with relative paths for subdirectories
    loadComponent('nav-placeholder', '../components/navigation.html');
    loadComponent('footer-placeholder', '../components/footer.html');
    
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
                // For subdirectories, we need to adjust relative paths in the HTML
                const adjustedHtml = html.replace(/href="([^http].*?)"/g, (match, url) => {
                    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('http')) {
                        return match; // Leave absolute, anchor, and external URLs alone
                    }
                    // Add ../ prefix to relative URLs
                    return `href="../${url}"`;
                }).replace(/src="([^http].*?)"/g, (match, url) => {
                    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('http')) {
                        return match; // Leave absolute, anchor, and external URLs alone
                    }
                    // Add ../ prefix to relative URLs
                    return `src="../${url}"`;
                });
                
                placeholder.innerHTML = adjustedHtml;
                
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
