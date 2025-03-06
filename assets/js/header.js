document.addEventListener('DOMContentLoaded', function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        // Get the base URL from meta tag that we'll add to the head
        const baseUrlMeta = document.querySelector('meta[name="base-url"]');
        const baseUrl = baseUrlMeta ? baseUrlMeta.getAttribute('content') : '';
        
        headerPlaceholder.innerHTML = `
            <div class="container">
                <div class="header-inner">
                    <a href="${baseUrl}/" class="logo" aria-label="Revelate Operations Home">
                        <div class="logo-container">
                            <div class="logo-image">
                                <img src="${baseUrl}/assets/images/revelate-spiral-logo.png" alt="Revelate Logo">
                            </div>
                            <div class="logo-text">
                                <span class="logo-text-main">REVELATE</span>
                                <span class="logo-text-sub">OPERATIONS</span>
                            </div>
                        </div>
                    </a>
                    
                    <nav aria-label="Main navigation">
                        <button class="mobile-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="main-menu">
                            <span class="hamburger-icon"></span>
                        </button>
                        
                        <ul id="main-menu" class="nav-links">
                            <li class="nav-item"><a href="${baseUrl}/services/" class="nav-link">Services</a></li>
                            <li class="nav-item"><a href="${baseUrl}/approach/" class="nav-link">Our Approach</a></li>
                            <li class="nav-item"><a href="${baseUrl}/about/" class="nav-link">About Us</a></li>
                            <li class="nav-item"><a href="${baseUrl}/case-studies/" class="nav-link">Case Studies</a></li>
                            <li class="nav-item"><a href="${baseUrl}/contact/" class="nav-link">Contact</a></li>
                            <li class="nav-item"><a href="#" class="btn btn-primary nav-cta" id="portal-btn">Client Portal</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        `;
        
        // Highlight current page
        const currentPage = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (currentPage.includes(href) && href !== '/') {
                link.classList.add('active');
            }
        });
    }
});
