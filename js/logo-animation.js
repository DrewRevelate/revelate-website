document.addEventListener('DOMContentLoaded', function() {
  // Get logo elements
  const logoTextContainer = document.querySelector('.logo-text-container');
  const logoText = document.getElementById('logo-text');
  
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
});
