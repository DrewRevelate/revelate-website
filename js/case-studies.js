/**
 * Case Studies JavaScript - Improved version
 * Handles filtering, pagination, and other functionality specific to the case studies listing page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait for components to be loaded
    const initCaseStudies = () => {
        // Delay initialization to ensure components are loaded
        setTimeout(initializeCaseStudiesPage, 300);
    };
    
    // Handle case when components might already be loaded
    if (document.readyState === 'complete' || 
        (document.querySelector('#nav-placeholder')?.children.length > 0 && 
         document.querySelector('#footer-placeholder')?.children.length > 0)) {
        initCaseStudies();
    } else {
        // Listen for all components loaded event
        document.addEventListener('allComponentsLoaded', initCaseStudies);
    }
    
    function initializeCaseStudiesPage() {
        // Get elements
        const filterButtons = document.querySelectorAll('.filter-btn');
        const caseStudyCards = document.querySelectorAll('.case-study-card');
        const paginationNumbers = document.querySelectorAll('.pagination-number');
        const prevButton = document.querySelector('.pagination-btn:first-child');
        const nextButton = document.querySelector('.pagination-btn:last-child');
        
        // Define constants
        const itemsPerPage = 6; // Number of case studies per page
        let currentFilter = 'all'; // Default filter
        let currentPage = 1; // Default page
        
        // Initialize if elements exist
        if (!filterButtons.length || !caseStudyCards.length) {
            console.warn('Case studies elements not found');
            return;
        }
        
        /**
         * CASE STUDY FILTERING
         * Filters case studies based on category
         */
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Set active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                currentFilter = filterValue;
                
                // Reset to first page when changing filters
                currentPage = 1;
                
                // Filter items
                filterCaseStudies();
                
                // Update pagination
                updatePagination();
                
                // Update URL parameter
                updateUrlParameter('category', filterValue === 'all' ? null : filterValue);
            });
        });
        
        /**
         * FILTERING FUNCTION
         * Applies current filter to case study cards
         */
        function filterCaseStudies() {
            caseStudyCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const matchesFilter = currentFilter === 'all' || category === currentFilter;
                
                // Add or remove hidden class based on filter
                if (matchesFilter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
                
                // Always hide initially, pagination will show the appropriate cards
                card.style.display = 'none';
            });
            
            // Show cards for current page
            showCardsForCurrentPage();
        }
        
        /**
         * PAGINATION
         * Handles pagination for case studies
         */
        function updatePagination() {
            // Get visible cards (not hidden by filter)
            const visibleCards = Array.from(caseStudyCards).filter(
                card => !card.classList.contains('hidden')
            );
            
            // Calculate total pages
            const totalPages = Math.max(1, Math.ceil(visibleCards.length / itemsPerPage));
            
            // Update visibility of pagination numbers
            if (paginationNumbers.length) {
                // Ensure current page is valid
                currentPage = Math.min(currentPage, totalPages);
                
                // Update active page number
                paginationNumbers.forEach((num, index) => {
                    const pageNum = index + 1;
                    
                    // Show/hide page numbers based on total pages
                    if (pageNum <= totalPages) {
                        num.style.display = '';
                        num.classList.toggle('active', pageNum === currentPage);
                    } else {
                        num.style.display = 'none';
                    }
                });
            }
            
            // Enable/disable prev/next buttons
            if (prevButton) prevButton.disabled = currentPage === 1;
            if (nextButton) nextButton.disabled = currentPage === totalPages;
        }
        
        /**
         * SHOW CARDS FOR CURRENT PAGE
         * Displays the appropriate cards for the current page and filter
         */
        function showCardsForCurrentPage() {
            // Get visible cards (not hidden by filter)
            const visibleCards = Array.from(caseStudyCards).filter(
                card => !card.classList.contains('hidden')
            );
            
            // Calculate start and end indices for current page
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            
            // Show/hide cards based on pagination
            visibleCards.forEach((card, index) => {
                if (index >= startIndex && index < endIndex) {
                    card.style.display = 'flex';
                    // Add animation class if not already animated
                    if (!card.classList.contains('animated')) {
                        setTimeout(() => {
                            card.classList.add('animated', 'fade-in');
                        }, index * 100); // Stagger animation
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        /**
         * PAGE NAVIGATION
         * Set up click handlers for pagination
         */
        if (paginationNumbers.length) {
            // Initial pagination
            updatePagination();
            showCardsForCurrentPage();
            
            // Add click handlers to pagination numbers
            paginationNumbers.forEach((num, index) => {
                num.addEventListener('click', function() {
                    currentPage = index + 1;
                    updatePagination();
                    showCardsForCurrentPage();
                    
                    // Scroll to top of case studies
                    const casesSection = document.querySelector('.case-studies-listing');
                    if (casesSection) {
                        casesSection.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
            
            // Add click handlers to prev/next buttons
            if (prevButton) {
                prevButton.addEventListener('click', function() {
                    if (currentPage > 1) {
                        currentPage--;
                        updatePagination();
                        showCardsForCurrentPage();
                        
                        // Scroll to top of case studies
                        const casesSection = document.querySelector('.case-studies-listing');
                        if (casesSection) {
                            casesSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            }
            
            if (nextButton) {
                nextButton.addEventListener('click', function() {
                    const visibleCards = Array.from(caseStudyCards).filter(
                        card => !card.classList.contains('hidden')
                    );
                    const totalPages = Math.max(1, Math.ceil(visibleCards.length / itemsPerPage));
                    
                    if (currentPage < totalPages) {
                        currentPage++;
                        updatePagination();
                        showCardsForCurrentPage();
                        
                        // Scroll to top of case studies
                        const casesSection = document.querySelector('.case-studies-listing');
                        if (casesSection) {
                            casesSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            }
        }
        
        /**
         * ANIMATION ON SCROLL
         * Adds animation to case study cards as they come into view
         */
        function isElementInViewport(el, threshold = 0) {
            if (!el) return false;
            
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // If threshold is set, element must be at least that % in view
            const visiblePart = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const thresholdPixels = threshold * rect.height;
            
            return (
                visiblePart >= thresholdPixels && 
                rect.top < windowHeight && 
                rect.bottom > 0
            );
        }
        
        function animateOnScroll() {
            caseStudyCards.forEach(card => {
                if (card.style.display !== 'none' && 
                    isElementInViewport(card, 0.2) && 
                    !card.classList.contains('animated')) {
                    card.classList.add('animated', 'fade-in');
                }
            });
        }
        
        // Initial check for elements in viewport
        animateOnScroll();
        
        // Check on scroll
        window.addEventListener('scroll', animateOnScroll);
        
        /**
         * URL PARAMETER HANDLING
         * Allows direct linking to specific filters
         */
        function getUrlParameter(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }
        
        function updateUrlParameter(key, value) {
            const urlParams = new URLSearchParams(window.location.search);
            
            if (value === null) {
                urlParams.delete(key);
            } else {
                urlParams.set(key, value);
            }
            
            const newUrl = window.location.pathname + 
                           (urlParams.toString() ? '?' + urlParams.toString() : '');
            
            window.history.replaceState({}, '', newUrl);
        }
        
        function handleUrlParameters() {
            const category = getUrlParameter('category');
            
            if (category) {
                const targetButton = Array.from(filterButtons).find(btn => 
                    btn.getAttribute('data-filter') === category
                );
                
                if (targetButton) {
                    // Simulate click to apply the filter
                    targetButton.click();
                }
            }
        }
        
        // Handle URL parameters on page load
        handleUrlParameters();
    }
});
