/**
 * Case Studies JavaScript
 * Handles filtering, pagination, and other functionality specific to the case studies listing page
 */

document.addEventListener('DOMContentLoaded', function() {
    /**
     * CASE STUDY FILTERING
     * Filters case studies based on category
     */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    
    if (filterButtons.length && caseStudyCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Set active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter items
                caseStudyCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
                
                // Reset pagination to first page when filtering
                updatePagination(1);
            });
        });
    }
    
    /**
     * PAGINATION
     * Handles pagination for case studies
     */
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    const prevButton = document.querySelector('.pagination-btn:first-child');
    const nextButton = document.querySelector('.pagination-btn:last-child');
    const itemsPerPage = 6; // Change this value to adjust items per page
    
    function updatePagination(currentPage) {
        // Update pagination numbers
        paginationNumbers.forEach(num => {
            num.classList.remove('active');
            if (parseInt(num.textContent) === currentPage) {
                num.classList.add('active');
            }
        });
        
        // Enable/disable prev/next buttons
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === paginationNumbers.length;
        
        // Show/hide items based on current page
        const visibleCards = Array.from(caseStudyCards).filter(card => !card.classList.contains('hidden'));
        
        visibleCards.forEach((card, index) => {
            const shouldShow = index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage;
            card.style.display = shouldShow ? 'flex' : 'none';
        });
    }
    
    if (paginationNumbers.length) {
        // Initial pagination
        updatePagination(1);
        
        // Add click handlers to pagination numbers
        paginationNumbers.forEach(num => {
            num.addEventListener('click', function() {
                updatePagination(parseInt(this.textContent));
            });
        });
        
        // Add click handlers to prev/next buttons
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                const currentPage = Array.from(paginationNumbers).findIndex(num => num.classList.contains('active')) + 1;
                if (currentPage > 1) {
                    updatePagination(currentPage - 1);
                }
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                const currentPage = Array.from(paginationNumbers).findIndex(num => num.classList.contains('active')) + 1;
                if (currentPage < paginationNumbers.length) {
                    updatePagination(currentPage + 1);
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
            if (isElementInViewport(card, 0.2) && !card.classList.contains('animated')) {
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
    function handleUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            const targetButton = Array.from(filterButtons).find(btn => 
                btn.getAttribute('data-filter') === category
            );
            
            if (targetButton) {
                targetButton.click();
            }
        }
    }
    
    handleUrlParameters();
});
