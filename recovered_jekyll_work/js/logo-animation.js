/**
 * Logo Animation Script
 * Handles the transformation of the RevOps logo text and animations
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get logo elements
    const logoTextContainer = document.querySelector('.logo-text-container');
    const logoText = document.getElementById('logo-text');
    
    // Make sure the elements exist
    if (!logoTextContainer || !logoText) {
        console.warn('Logo elements not found. Animation will not run.');
        return;
    }
    
    // Skip animation if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        // Just show the full text without animation
        logoText.innerText = 'Revelate Operations';
        logoTextContainer.classList.add('expanded');
        return;
    }
    
    // Start the animation sequence after 3 seconds
    setTimeout(function() {
        // Change text and expand container
        logoText.innerText = 'Revelate Operations';
        logoTextContainer.classList.add('expanded');
        
        // Add cosmic pulse effect after expansion is complete
        setTimeout(function() {
            logoText.classList.add('cosmic-pulse');
        }, 1000);
    }, 3000);
    
    // Reset animation on page visibility change (optional)
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // Reset logo if page becomes visible again
            if (logoTextContainer.classList.contains('expanded')) {
                // Only reset if animation has already run
                logoText.classList.remove('cosmic-pulse');
                logoTextContainer.classList.remove('expanded');
                logoText.innerText = 'RevOps';
                
                // Restart animation sequence
                setTimeout(function() {
                    logoText.innerText = 'Revelate Operations';
                    logoTextContainer.classList.add('expanded');
                    
                    setTimeout(function() {
                        logoText.classList.add('cosmic-pulse');
                    }, 1000);
                }, 1000);
            }
        }
    });
});
