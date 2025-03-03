/**
 * Case Studies JavaScript
 * Handles filtering, pagination, and animations for case studies pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize filtering functionality
    initFilters();
    
    // Initialize pagination if needed
    if (document.querySelector('.pagination-number')) {
        initPagination();
    }
    
    // Initialize animations
    initAnimations();
    
    // Process URL parameters
    processUrlParams();
});

/**
 * Initialize filtering functionality for case studies
 */
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    
    if (filterButtons.length === 0 || caseStudyCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter case studies
            caseStudyCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === filterValue) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
            
            // Update URL parameter without page reload
            const url = new URL(window.location);
            if (filterValue === 'all') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', filterValue);
            }
            window.history.replaceState({}, '', url);
            
            // Reset to first page when filtering
            if (document.querySelector('.pagination-number')) {
                updateActivePage(1);
            }
        });
    });
}

/**
 * Initialize pagination for case studies listing
 */
function initPagination() {
    const paginationNumbers = document.querySelectorAll('.pagination-number');
    const prevButton = document.querySelector('.pagination-prev');
    const nextButton = document.querySelector('.pagination-next');
    const itemsPerPage = 6; // Adjust as needed
    
    function updateActivePage(pageNumber) {
        // Update active pagination number
        paginationNumbers.forEach(num => {
            num.classList.toggle('active', parseInt(num.getAttribute('data-page')) === pageNumber);
        });
        
        // Enable/disable prev/next buttons
        if (prevButton) {
            prevButton.disabled = pageNumber === 1;
        }
        
        if (nextButton) {
            nextButton.disabled = pageNumber === paginationNumbers.length;
        }
        
        // Show only items for current page
        const visibleCards = Array.from(document.querySelectorAll('.case-study-card:not(.hidden)'));
        
        visibleCards.forEach((card, index) => {
            const startIndex = (pageNumber - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage - 1;
            
            if (index >= startIndex && index <= endIndex) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update URL parameter without page reload
        const url = new URL(window.location);
        url.searchParams.set('page', pageNumber);
        window.history.replaceState({}, '', url);
    }
    
    // Add click handlers to pagination numbers
    paginationNumbers.forEach(num => {
        num.addEventListener('click', function() {
            updateActivePage(parseInt(this.getAttribute('data-page')));
        });
    });
    
    // Add click handlers to prev/next buttons
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            const activePage = document.querySelector('.pagination-number.active');
            const currentPage = parseInt(activePage.getAttribute('data-page'));
            if (currentPage > 1) {
                updateActivePage(currentPage - 1);
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const activePage = document.querySelector('.pagination-number.active');
            const currentPage = parseInt(activePage.getAttribute('data-page'));
            if (currentPage < paginationNumbers.length) {
                updateActivePage(currentPage + 1);
            }
        });
    }
    
    // Initialize with first page
    updateActivePage(1);
}

/**
 * Initialize animations for case studies
 */
function initAnimations() {
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    
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
            if (isElementInViewport(card, 0.15) && !card.classList.contains('animated')) {
                card.classList.add('animated');
            }
        });
    }
    
    // Check initially and on scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
}

/**
 * Process URL parameters for filtering and pagination
 */
function processUrlParams() {
    const params = new URLSearchParams(window.location.search);
    
    // Handle category filter
    const category = params.get('category');
    if (category) {
        const filterButton = document.querySelector(`.filter-btn[data-filter="${category}"]`);
        if (filterButton) {
            filterButton.click();
        }
    }
    
    // Handle pagination
    const page = params.get('page');
    if (page) {
        const pageButton = document.querySelector(`.pagination-number[data-page="${page}"]`);
        if (pageButton) {
            pageButton.click();
        }
    }
}
