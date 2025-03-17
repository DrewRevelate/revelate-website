// Main functionality for the presentation
document.addEventListener('DOMContentLoaded', function() {
    // Generate unique user ID for polling
    function generateUserId() {
        return Math.random().toString(36).substring(2, 10);
    }
    
    // Get or create user ID
    let userId;
    try {
        userId = localStorage.getItem('fullThrottleUserId');
        if (!userId) {
            userId = generateUserId();
            localStorage.setItem('fullThrottleUserId', userId);
        }
    } catch (error) {
        console.log("LocalStorage not available, using temporary ID");
        userId = generateUserId();
    }
    
    // Display user ID (with error handling)
    const userIdSpans = document.querySelectorAll('#userId span');
    if (userIdSpans.length > 0) {
        userIdSpans.forEach(span => {
            span.textContent = userId;
        });
    }
    
    // Add meta tag for mobile if not present
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
    }
    
    // Check if we're on a mobile device
    const isMobile = window.innerWidth <= 768 || 
                     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Apply mobile-specific body class if needed
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
    
    // Slide Navigation
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.nav-button.prev');
    const nextBtn = document.querySelector('.nav-button.next');
    const indicator = document.querySelector('.slide-indicator');
    const progressBar = document.querySelector('.progress-indicator');
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Update progress and indicator
    function updateProgress() {
        if (progressBar && indicator) {
            progressBar.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
            indicator.textContent = `Slide ${currentSlide + 1}/${totalSlides}`;
        }
    }
    
    // Show current slide
    function showSlide(index) {
        // Hide current slide
        slides[currentSlide].classList.remove('active');
        
        // Update current slide index
        currentSlide = index;
        
        // Handle loop
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        if (currentSlide >= totalSlides) currentSlide = 0;
        
        // Show new slide
        slides[currentSlide].classList.add('active');
        
        // Update progress indicator
        updateProgress();
        
        // Activate slide-specific animations
        if (currentSlide === 1) {
            // Activate speedometer on slide 2
            setTimeout(() => {
                const speedometerNeedle = document.querySelector('.speedometer-needle');
                if (speedometerNeedle) {
                    speedometerNeedle.classList.add('rev-animation');
                    
                    // Set up the interval for auto-revving every 30 seconds
                    if (window.speedometerInterval) {
                        clearInterval(window.speedometerInterval);
                    }
                    
                    window.speedometerInterval = setInterval(() => {
                        speedometerNeedle.classList.remove('rev-animation');
                        void speedometerNeedle.offsetWidth; // Force reflow to restart animation
                        speedometerNeedle.classList.add('rev-animation');
                    }, 30000);
                }
            }, 1000);
        } else {
            // Clear speedometer interval when leaving slide 2
            if (window.speedometerInterval) {
                clearInterval(window.speedometerInterval);
                window.speedometerInterval = null;
            }
        }
        
        // Dispatch custom event for slide change
        const event = new CustomEvent('slideChanged', {
            detail: { slideId: slides[currentSlide].id }
        });
        document.dispatchEvent(event);
    }
    
    // Button navigation
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                showSlide(currentSlide - 1);
            }
        });
        nextBtn.addEventListener('click', () => {
            if (currentSlide < totalSlides - 1) {
                showSlide(currentSlide + 1);
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === ' ') {
            if (currentSlide < totalSlides - 1) {
                showSlide(currentSlide + 1);
            }
        } else if (event.key === 'ArrowLeft') {
            if (currentSlide > 0) {
                showSlide(currentSlide - 1);
            }
        }
    });
    
    // Touch swipe navigation for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    // Track if we're scrolling vertically (don't trigger swipe)
    let isVerticalScroll = false;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isVerticalScroll = false;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        // Check if this is primarily a vertical scroll
        const currentY = e.changedTouches[0].screenY;
        const currentX = e.changedTouches[0].screenX;
        
        if (Math.abs(currentY - touchStartY) > Math.abs(currentX - touchStartX)) {
            isVerticalScroll = true;
        }
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        // Don't process swipe if we determined it was a vertical scroll
        if (isVerticalScroll) return;
        
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        // Calculate the horizontal and vertical distances
        const horizontalDist = touchEndX - touchStartX;
        const verticalDist = touchEndY - touchStartY;
        
        // Only process significant horizontal swipes
        if (Math.abs(horizontalDist) > 50 && Math.abs(horizontalDist) > Math.abs(verticalDist)) {
            // If we're in a poll option, button or other interactive element, don't navigate
            if (e.target.closest('.poll-option') || 
                e.target.closest('button') || 
                e.target.closest('a') || 
                e.target.closest('.specialty-item') ||
                e.target.closest('.timeline-point')) {
                return;
            }
            
            if (horizontalDist > 0) {
                // Swipe right - go back
                if (currentSlide > 0) {
                    showSlide(currentSlide - 1);
                }
            } else {
                // Swipe left - go forward
                if (currentSlide < totalSlides - 1) {
                    showSlide(currentSlide + 1);
                }
            }
        }
    }, { passive: true });

    
    // Initial setup
    updateProgress();
    
    // Poll functionality
    setupPolls();
    
    // Timeline functionality
    setupTimeline();
    
    // Hide keyboard instructions after 5 seconds
    const keyboardInstructions = document.querySelector('.keyboard-instructions');
    if (keyboardInstructions) {
        setTimeout(() => {
            keyboardInstructions.style.opacity = '0';
        }, 5000);
    }
    
    // Poll functionality
    function setupPolls() {
        // Determine the API URL based on the current environment
        const API_URL = window.location.hostname === 'localhost' ? 
            'http://localhost:3000/api' : 
            '/api'; // Use relative URL in production
        
        console.log('Using API URL:', API_URL);
        
        const polls = document.querySelectorAll('.poll-container');
        if (polls.length === 0) return;
        
        // Listen for storage events to detect poll updates from other tabs/clients
        window.addEventListener('storage', function(event) {
            // Check if it's our pollUpdate notification
            if (event.key === 'pollUpdate') {
                try {
                    const update = JSON.parse(event.newValue);
                    if (update && update.pollId) {
                        console.log('Detected poll update from another user for:', update.pollId);
                        
                        // Find all polls that match this ID and force an immediate refresh
                        polls.forEach(pollElement => {
                            const slideElement = pollElement.closest('.slide');
                            if (!slideElement) return;
                            
                            const clientPollId = slideElement.id + '-' + (pollElement.dataset.pollId || 'default');
                            // Map to the server-side poll ID
                            const serverPollId = pollIdMapping[clientPollId] || clientPollId;
                            
                            if (serverPollId === update.pollId) {
                                console.log(`Found matching poll for update: ${clientPollId} -> ${serverPollId}`);
                                
                                // Check if this is a status update from the admin panel
                                if (update.hasOwnProperty('isActive')) {
                                    console.log(`Admin toggled poll status to: ${update.isActive ? 'active' : 'inactive'}`);
                                    
                                    // Update the poll's active status immediately
                                    if (update.isActive) {
                                        pollElement.classList.remove('inactive');
                                        pollElement.classList.add('active');
                                    } else {
                                        pollElement.classList.remove('active');
                                        pollElement.classList.add('inactive');
                                    }
                                    
                                    // Update data attribute for future reference
                                    pollElement.dataset.active = update.isActive;
                                    
                                    // If the poll HTML was replaced with a placeholder, and is now active again, 
                                    // we need to restore it and reload the actual poll
                                    if (update.isActive && pollElement.dataset.originalHtml) {
                                        pollElement.innerHTML = pollElement.dataset.originalHtml;
                                        console.log('Restored original poll HTML');
                                        
                                        // Since we've restored the HTML, we need to re-initialize the poll
                                        // This will set up the event listeners for the poll options and buttons
                                        const options = pollElement.querySelectorAll('.poll-option');
                                        const submitBtn = pollElement.querySelector('.poll-submit');
                                        const skipBtn = pollElement.querySelector('.poll-skip');
                                        
                                        // Re-attach option click events
                                        options.forEach(option => {
                                            option.addEventListener('click', function() {
                                                // Allow single or multiple selection based on data-multiple attribute
                                                if (!pollElement.dataset.multiple) {
                                                    // Single selection mode
                                                    options.forEach(opt => {
                                                        opt.classList.remove('selected');
                                                    });
                                                }
                                                this.classList.toggle('selected');
                                            });
                                        });
                                        
                                        // Re-attach submit button event
                                        if (submitBtn) {
                                            submitBtn.addEventListener('click', async function() {
                                                // Get the selected options
                                                const selectedOptions = pollElement.querySelectorAll('.poll-option.selected');
                                                if (selectedOptions.length === 0) return;
                                                
                                                // Collect selected values
                                                const votes = [];
                                                selectedOptions.forEach(option => {
                                                    if (option.dataset.value) {
                                                        votes.push(option.dataset.value);
                                                    }
                                                });
                                                
                                                // Submit the vote - this will be handled by the original submitVotes function
                                                const refreshEvent = new CustomEvent('submitPollVote', { 
                                                    detail: { 
                                                        pollId: serverPollId,
                                                        votes: votes
                                                    }
                                                });
                                                document.dispatchEvent(refreshEvent);
                                            });
                                        }
                                        
                                        // Re-attach skip button event
                                        if (skipBtn) {
                                            skipBtn.addEventListener('click', function() {
                                                const refreshEvent = new CustomEvent('skipPollVote', { 
                                                    detail: { 
                                                        pollId: serverPollId
                                                    }
                                                });
                                                document.dispatchEvent(refreshEvent);
                                            });
                                        }
                                    }
                                }
                                
                                // Check if this is a poll clearing from the admin panel
                                if (update.cleared) {
                                    console.log('Admin cleared poll responses');
                                    
                                    // Reset the user's vote record for this poll
                                    try {
                                        let userVotes = {};
                                        const savedVotes = localStorage.getItem('fullThrottleUserVotes');
                                        if (savedVotes) {
                                            userVotes = JSON.parse(savedVotes);
                                            // Remove votes for this poll
                                            if (userVotes[serverPollId]) {
                                                delete userVotes[serverPollId];
                                                localStorage.setItem('fullThrottleUserVotes', JSON.stringify(userVotes));
                                                console.log('Cleared local vote record for poll:', serverPollId);
                                            }
                                        }
                                    } catch (e) {
                                        console.warn('Error updating local vote storage:', e);
                                    }
                                }
                                
                                // Force an immediate refresh of this poll
                                const refreshEvent = new CustomEvent('refreshPoll', { 
                                    detail: { pollId: serverPollId }
                                });
                                document.dispatchEvent(refreshEvent);
                            }
                        });
                    }
                } catch (e) {
                    console.error('Error processing poll update notification:', e);
                }
            }
        });
        
        // Setup polling update interval - check more frequently for truly real-time updates
        const POLL_UPDATE_INTERVAL = 1000; // 1 second for more immediate updates
        
        // Default poll data to use if server is unavailable
        const DEFAULT_POLL_DATA = {
            "slide-2-default": {
                "prospecting": 0,
                "client-meetings": 0,
                "learning": 0,
                "planning": 0,
                "personal": 0
            },
            "slide-5-student-skills": {
                "technical": 0,
                "relationship": 0,
                "strategic": 0,
                "execution": 0
            }
        };
        
        // Mapping of slide IDs to use correct poll IDs
        // This matches the actual poll IDs in the database with what's in the HTML
        // These two polls are defined in the seed.js file and should match exactly
        const pollIdMapping = {
            'slide-2-default': 'slide-2-default',       // Poll on 03-revenue-acceleration.html (What would you do with 5 extra hours per week?)
            'slide-5-student-skills': 'slide-5-student-skills' // Poll on 06-human-vs-automation.html (Skills to prioritize)
        };
        
        console.log('Poll ID mapping:', pollIdMapping);
        
        // Track user's votes to prevent duplicates
        let userVotes = {};
        try {
            const savedVotes = localStorage.getItem('fullThrottleUserVotes');
            if (savedVotes) {
                userVotes = JSON.parse(savedVotes);
            }
        } catch (error) {
            console.log("LocalStorage not available for votes tracking");
            userVotes = {};
        }
        
        // Set all polls to be collapsed by default
        polls.forEach(poll => {
            poll.classList.add('collapsed');
            
            // Add click handler to toggle collapsed state
            poll.addEventListener('click', function(event) {
                // Don't toggle if clicking on an option or button
                if (event.target.closest('.poll-option') || 
                    event.target.closest('.poll-submit') || 
                    event.target.closest('.poll-skip')) {
                    return;
                }
                
                // Toggle the collapsed/expanded state
                this.classList.toggle('collapsed');
                this.classList.toggle('expanded');
            });
        });
            
        polls.forEach(poll => {
            const slideElement = poll.closest('.slide');
            if (!slideElement) return;
            
            // Get the client-side poll ID
            const clientPollId = slideElement.id + '-' + (poll.dataset.pollId || 'default');
            
            // Map to the correct server-side poll ID
            const pollId = pollIdMapping[clientPollId] || clientPollId;
            
            console.log(`Poll mapping: ${clientPollId} -> ${pollId}`);
            const options = poll.querySelectorAll('.poll-option');
            const submitBtn = poll.querySelector('.poll-submit');
            const skipBtn = poll.querySelector('.poll-skip');
            const resultsDiv = poll.querySelector('.poll-results');
            
            if (!options.length || !submitBtn || !skipBtn || !resultsDiv) return;
            
            // When poll shows results or user has voted, automatically expand it
            // Check both server and client poll IDs for votes
            if (userVotes[pollId] || userVotes[clientPollId]) {
                // If user already voted, show results immediately
                poll.classList.remove('collapsed');
                poll.classList.add('expanded');
                poll.classList.add('voted');
                poll.classList.add('finalized');
                
                // Get votes from either the server poll ID or client poll ID
                const votes = userVotes[pollId] || userVotes[clientPollId];
                
                // Remove options completely and just show results
                const optionsContainer = poll.querySelector('.poll-options');
                if (optionsContainer) {
                    optionsContainer.style.display = 'none';
                }
                
                // Show the results
                resultsDiv.classList.add('show');
                
                // Replace the action buttons with a thank you message
                const actionsContainer = poll.querySelector('.poll-actions');
                if (actionsContainer) {
                    actionsContainer.innerHTML = '<div class="poll-submitted-message">Your response has been recorded. Thank you!</div>';
                }
            }
            
            // Function to fetch current poll data from server with fallback
            async function fetchPollData() {
                try {
                    const controller = new AbortController();
                    // Set a timeout to prevent hanging requests
                    const timeoutId = setTimeout(() => controller.abort(), 2000);
                    
                    // Get user ID for checking if they have voted
                    const userId = localStorage.getItem('fullThrottleUserId') || '';
                    
                    // Always use the server-mapped poll ID for API requests
                    console.log(`Fetching poll data for ${pollId}`);
                    const response = await fetch(`${API_URL}/polls/${pollId}?userId=${encodeURIComponent(userId)}`, {
                        signal: controller.signal,
                        headers: {
                            'Cache-Control': 'no-cache',  // Prevent caching for live updates
                            'Pragma': 'no-cache'
                        }
                    });
                    
                    clearTimeout(timeoutId);
                    
                    if (!response.ok) throw new Error('Failed to fetch poll data');
                    
                    const data = await response.json();
                    // Validate response structure
                    if (data && data.success && data.results) {
                        // Store poll active status for later use
                        if (data.poll) {
                            // Update poll container with active/inactive status
                            updatePollStatus(data.poll.isActive);
                        }
                        
                        // Check if user has already voted - this comes from the server
                        if (data.hasVoted && !poll.classList.contains('voted')) {
                            // User has voted but we didn't know from local storage
                            // Update local storage
                            userVotes[pollId] = true;
                            try {
                                localStorage.setItem('fullThrottleUserVotes', JSON.stringify(userVotes));
                            } catch (error) {
                                console.log("LocalStorage not available for votes tracking");
                            }
                            
                            // Hide options and show results
                            const optionsContainer = poll.querySelector('.poll-options');
                            if (optionsContainer) {
                                optionsContainer.style.display = 'none';
                            }
                            
                            // Show the results
                            resultsDiv.classList.add('show');
                            
                            // Replace the action buttons with a thank you message
                            const actionsContainer = poll.querySelector('.poll-actions');
                            if (actionsContainer) {
                                actionsContainer.innerHTML = '<div class="poll-submitted-message">Your response has been recorded. Thank you!</div>';
                            }
                            
                            // Mark poll as voted and finalized
                            poll.classList.add('voted');
                            poll.classList.add('finalized');
                            poll.classList.remove('collapsed');
                            poll.classList.add('expanded');
                        }
                        
                        return data.results;
                    } else {
                        throw new Error('Invalid response format');
                    }
                } catch (error) {
                    // Don't log abort errors as they're expected
                    if (error.name !== 'AbortError') {
                        console.error('Error fetching poll data:', error);
                    }
                    // Use default data as fallback
                    return DEFAULT_POLL_DATA[pollId] || {};
                }
            }
            
            // Function to update the poll container based on active status
            function updatePollStatus(isActive) {
                // If the status changed, update the UI
                if (poll.dataset.active !== String(isActive)) {
                    poll.dataset.active = isActive;
                    
                    if (isActive) {
                        // Poll is active - enable interaction
                        poll.classList.remove('inactive');
                        poll.classList.add('active');
                        
                        // Make sure the poll is expanded when active
                        if (slideElement.id === "slide-2" || slideElement.id === "slide-5") {
                            poll.classList.remove('collapsed');
                            poll.classList.add('expanded');
                        }
                        
                        submitBtn.disabled = false;
                        options.forEach(option => {
                            option.style.pointerEvents = 'auto';
                            option.style.opacity = '1';
                        });
                        
                        // Add or update "Live" status label
                        let statusLabel = poll.querySelector('.poll-status');
                        if (!statusLabel) {
                            statusLabel = document.createElement('div');
                            statusLabel.className = 'poll-status live';
                            statusLabel.textContent = 'LIVE';
                            poll.querySelector('.poll-header').appendChild(statusLabel);
                        } else {
                            statusLabel.className = 'poll-status live';
                            statusLabel.textContent = 'LIVE';
                        }
                    } else {
                        // Poll is inactive - disable interaction
                        poll.classList.remove('active');
                        poll.classList.add('inactive');
                        
                        // Collapse the poll when inactive
                        if (slideElement.id === "slide-2" || slideElement.id === "slide-5") {
                            poll.classList.add('collapsed');
                            poll.classList.remove('expanded');
                            
                            // Replace poll content with placeholder for inactive polls
                            const pollContent = `
                                <div class="poll-header">
                                    <h3>Poll is currently inactive</h3>
                                    <div class="poll-status closed">CLOSED</div>
                                </div>
                                <div class="poll-inactive-message">
                                    <p>This poll is not currently active. Please check back later.</p>
                                </div>
                            `;
                            
                            // Store the original HTML if we haven't done so yet
                            if (!poll.dataset.originalHtml) {
                                poll.dataset.originalHtml = poll.innerHTML;
                            }
                            
                            // Replace with condensed view
                            poll.innerHTML = pollContent;
                        } else {
                            // For other slides, just disable the poll
                            submitBtn.disabled = true;
                            options.forEach(option => {
                                option.style.pointerEvents = 'none';
                                option.style.opacity = '0.5';
                            });
                            
                            // Add or update "Closed" status label
                            let statusLabel = poll.querySelector('.poll-status');
                            if (!statusLabel) {
                                statusLabel = document.createElement('div');
                                statusLabel.className = 'poll-status closed';
                                statusLabel.textContent = 'CLOSED';
                                poll.querySelector('.poll-header').appendChild(statusLabel);
                            } else {
                                statusLabel.className = 'poll-status closed';
                                statusLabel.textContent = 'CLOSED';
                            }
                        }
                    }
                    
                    // If we're going from inactive to active and we stored original HTML, restore it
                    if (isActive && poll.dataset.originalHtml && (slideElement.id === "slide-2" || slideElement.id === "slide-5")) {
                        poll.innerHTML = poll.dataset.originalHtml;
                        
                        // Set up the event listeners again since we replaced the HTML
                        setupPollEventListeners();
                    }
                }
            }
            
            // Helper function to set up event listeners after HTML replacement
            function setupPollEventListeners() {
                const newOptions = poll.querySelectorAll('.poll-option');
                const newSubmitBtn = poll.querySelector('.poll-submit');
                const newSkipBtn = poll.querySelector('.poll-skip');
                
                // Toggle option selection
                newOptions.forEach(option => {
                    option.addEventListener('click', function() {
                        // Allow single or multiple selection based on data-multiple attribute
                        if (!poll.dataset.multiple) {
                            // Single selection mode
                            newOptions.forEach(opt => {
                                opt.classList.remove('selected');
                            });
                        }
                        this.classList.toggle('selected');
                    });
                });
                
                // Re-attach submit button handler
                if (newSubmitBtn) {
                    newSubmitBtn.addEventListener('click', async function() {
                        // Don't allow submissions if poll is inactive or already voted
                        if (poll.classList.contains('inactive') || userVotes[pollId]) {
                            return;
                        }
                        
                        const selectedOptions = poll.querySelectorAll('.poll-option.selected');
                        if (selectedOptions.length === 0) return;
                        
                        // Ensure poll is expanded when submitting
                        poll.classList.remove('collapsed');
                        poll.classList.add('expanded');
                        
                        // Show loading state
                        newSubmitBtn.disabled = true;
                        newSubmitBtn.textContent = 'Submitting...';
                        
                        // Collect selected values
                        const votes = [];
                        selectedOptions.forEach(option => {
                            if (option.dataset.value) {
                                votes.push(option.dataset.value);
                            }
                        });
                        
                        // Record user's vote to prevent duplicates
                        userVotes[pollId] = votes;
                        try {
                            localStorage.setItem('fullThrottleUserVotes', JSON.stringify(userVotes));
                        } catch (error) {
                            console.log("LocalStorage not available for votes tracking");
                        }
                        
                        // Submit votes to server
                        const updatedData = await submitVotes(pollId, votes);
                        
                        // Update and show results
                        const results = (updatedData && updatedData.results) ? updatedData.results : {};
                        updatePollResults(results);
                        
                        const resultsDiv = poll.querySelector('.poll-results');
                        if (resultsDiv) {
                            resultsDiv.classList.add('show');
                        }
                        
                        // Disable further voting after submission
                        newOptions.forEach(option => {
                            option.style.pointerEvents = 'none';
                            option.style.opacity = '0.7';
                        });
                        newSubmitBtn.disabled = true;
                        newSubmitBtn.textContent = 'Submitted';
                        newSubmitBtn.style.opacity = '0.5';
                        
                        // Mark this poll as voted
                        poll.classList.add('voted');
                    });
                }
                
                // Re-attach skip button handler
                if (newSkipBtn) {
                    newSkipBtn.addEventListener('click', async function() {
                        // Ensure poll is expanded when skipping
                        poll.classList.remove('collapsed');
                        poll.classList.add('expanded');
                        
                        const pollData = await fetchPollData();
                        // Ensure we have valid data to work with, even if empty
                        updatePollResults(pollData || {});
                        
                        const resultsDiv = poll.querySelector('.poll-results');
                        if (resultsDiv) {
                            resultsDiv.classList.add('show');
                        }
                        
                        // Disable further voting after skipping
                        newOptions.forEach(option => {
                            option.style.pointerEvents = 'none';
                            option.style.opacity = '0.7';
                        });
                        if (newSubmitBtn) {
                            newSubmitBtn.disabled = true;
                            newSubmitBtn.style.opacity = '0.5';
                        }
                    });
                }
            }
            
            // Function to update the poll visualization
            function updatePollResults(pollData) {
                const resultItems = poll.querySelectorAll('.poll-result-item');
                if (resultItems.length === 0) return;
                
                // Add a subtle visual pulse to the results when they update
                const resultsContainer = poll.querySelector('.poll-results');
                if (resultsContainer) {
                    // Add updating class for animation
                    resultsContainer.classList.add('updating');
                    setTimeout(() => {
                        resultsContainer.classList.remove('updating');
                    }, 500);
                    
                    // Flag as having new data
                    resultsContainer.setAttribute('data-updated', Date.now());
                    
                    // After animation completes, remove the data-updated attribute
                    setTimeout(() => {
                        resultsContainer.removeAttribute('data-updated');
                    }, 1500);
                }
                
                // Calculate total votes
                let totalVotes = 0;
                for (const key in pollData) {
                    totalVotes += pollData[key];
                }
                
                // Update each result item
                resultItems.forEach(item => {
                    const option = item.dataset.option;
                    if (!option) return;
                    
                    const votes = pollData[option] || 0;

                    // For percentages:
                    // - If there's only 1 vote total, show 100% for the voted option
                    // - For multiple votes, calculate the actual percentage 
                    // - If no votes yet, show 0%
                    let percentage;
                    if (totalVotes === 0) {
                        percentage = 0;
                    } else if (totalVotes === 1 && votes === 1) {
                        percentage = 100; // Single vote is 100%
                    } else {
                        percentage = Math.round((votes / totalVotes) * 100);
                    }
                    
                    const percentElement = item.querySelector('.poll-result-percentage');
                    const fillElement = item.querySelector('.poll-fill');
                    
                    if (percentElement) {
                        // Ensure we always display a valid percentage
                        percentElement.textContent = (isNaN(percentage) ? 0 : percentage) + '%';
                    }
                    
                    if (fillElement) {
                        // Ensure we always set a valid width
                        fillElement.style.width = (isNaN(percentage) ? 0 : percentage) + '%';
                    }
                });
            }
            
// Function to submit votes to server
async function submitVotes(pollId, selectedVotes) {
    try {
        // Get user ID for tracking responses
        const userId = localStorage.getItem('fullThrottleUserId') || 
                      sessionStorage.getItem('sessionId') || 
                      'anonymous';
        
        // Broadcast that a vote is being submitted to help any other tabs/clients update immediately
        try {
            // Use localStorage for a poor man's broadcast channel
            localStorage.setItem('pollUpdate', JSON.stringify({
                pollId,
                timestamp: Date.now()
            }));
            
            // Remove it immediately (after other tabs had a chance to see it)
            setTimeout(() => {
                localStorage.removeItem('pollUpdate');
            }, 500);
        } catch (e) {
            // Ignore errors in broadcast mechanism
        }
        
        const response = await fetch(`/api/polls/${pollId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'  // Prevent caching
            },
            body: JSON.stringify({ 
                votes: selectedVotes,
                userId,
                slideId: document.querySelector('.slide.active').id,
                userAgent: navigator.userAgent,
                screen: `${window.screen.width}x${window.screen.height}`
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit votes');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error submitting votes:', error);
        
        // Try to save to localStorage for later sync
        try {
            let pendingVotes = JSON.parse(localStorage.getItem('pendingPollVotes') || '[]');
            pendingVotes.push({
                pollId,
                votes: selectedVotes,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('pendingPollVotes', JSON.stringify(pendingVotes));
        } catch (storageError) {
            console.warn('Could not save pending votes to localStorage:', storageError);
        }
        
        // Return fallback results
        return { success: false, results: [] };
    }
}
            
            // Display initial results
            fetchPollData().then(pollData => {
                updatePollResults(pollData);
            });
            
            // Set up periodic updates for the results
            let updateInterval;
            
            // Track last poll data state to detect changes
            let lastPollData = null;
            let lastPollUpdate = 0;
            
            // Listen for forced poll refreshes (from other tabs/users)
            document.addEventListener('refreshPoll', function(e) {
                if (e.detail && e.detail.pollId === pollId) {
                    console.log('Force refreshing poll:', pollId);
                    
                    // Skip refresh if poll is inactive
                    if (poll.classList.contains('inactive')) {
                        console.log('Skipping refresh for inactive poll:', pollId);
                        return;
                    }
                    
                    // Immediately fetch and update with latest data
                    fetchPollData().then(pollData => {
                        if (pollData) {
                            updatePollResults(pollData);
                            lastPollData = pollData;
                            lastPollUpdate = Date.now();
                        }
                    });
                }
            });
            
            // Listen for poll vote submissions from restored HTML
            document.addEventListener('submitPollVote', function(e) {
                if (e.detail && e.detail.pollId === pollId) {
                    console.log('Processing vote submission from restored HTML:', e.detail);
                    
                    // Don't allow submissions if poll is inactive or already voted
                    if (poll.classList.contains('inactive') || userVotes[pollId]) {
                        return;
                    }
                    
                    const votes = e.detail.votes;
                    if (!votes || votes.length === 0) return;
                    
                    // Ensure poll is expanded when submitting
                    poll.classList.remove('collapsed');
                    poll.classList.add('expanded');
                    
                    // Show loading state on submit button
                    const submitBtn = poll.querySelector('.poll-submit');
                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.textContent = 'Submitting...';
                    }
                    
                    // Record user's vote to prevent duplicates
                    userVotes[pollId] = votes;
                    try {
                        localStorage.setItem('fullThrottleUserVotes', JSON.stringify(userVotes));
                    } catch (error) {
                        console.log("LocalStorage not available for votes tracking");
                    }
                    
                    // Submit votes to server
                    submitVotes(pollId, votes).then(updatedData => {
                        // Update and show results
                        const results = (updatedData && updatedData.results) ? updatedData.results : {};
                        updatePollResults(results);
                        
                        const resultsDiv = poll.querySelector('.poll-results');
                        if (resultsDiv) {
                            resultsDiv.classList.add('show');
                        }
                        
                        // Disable further voting after submission
                        const options = poll.querySelectorAll('.poll-option');
                        options.forEach(option => {
                            option.style.pointerEvents = 'none';
                            option.style.opacity = '0.7';
                        });
                        
                        if (submitBtn) {
                            submitBtn.disabled = true;
                            submitBtn.textContent = 'Submitted';
                            submitBtn.style.opacity = '0.5';
                        }
                        
                        // Mark this poll as voted
                        poll.classList.add('voted');
                    });
                }
            });
            
            // Listen for poll skip requests from restored HTML
            document.addEventListener('skipPollVote', function(e) {
                if (e.detail && e.detail.pollId === pollId) {
                    console.log('Processing skip request from restored HTML for poll:', pollId);
                    
                    // Ensure poll is expanded when skipping
                    poll.classList.remove('collapsed');
                    poll.classList.add('expanded');
                    
                    fetchPollData().then(pollData => {
                        // Ensure we have valid data to work with, even if empty
                        updatePollResults(pollData || {});
                        
                        // Remove the options container and replace with the results
                        const optionsContainer = poll.querySelector('.poll-options');
                        if (optionsContainer) {
                            optionsContainer.style.display = 'none';
                        }
                        
                        const resultsDiv = poll.querySelector('.poll-results');
                        if (resultsDiv) {
                            resultsDiv.classList.add('show');
                        }
                        
                        // Replace the action buttons with a message
                        const actionsContainer = poll.querySelector('.poll-actions');
                        if (actionsContainer) {
                            actionsContainer.innerHTML = '<div class="poll-submitted-message">You are viewing results without voting.</div>';
                        }
                        
                        // Mark this poll as skipped and finalized
                        poll.classList.add('skipped');
                        poll.classList.add('finalized');
                    });
                }
            });
            
            // Start updating when the slide becomes active
            document.addEventListener('slideChanged', function(e) {
                if (e.detail.slideId === slideElement.id) {
                    // Clear any existing interval
                    if (updateInterval) clearInterval(updateInterval);
                    
                    // Start new interval for active slide
                    updateInterval = setInterval(async () => {
                        // Skip update if poll is inactive
                        if (poll.classList.contains('inactive')) {
                            return;
                        }
                        
                        const pollData = await fetchPollData();
                        if (!pollData) return;
                        
                        // Check if poll data has changed by comparing with last known state
                        const currentDataStr = JSON.stringify(pollData);
                        const lastDataStr = JSON.stringify(lastPollData);
                        
                        // If data has changed or it's been more than 10 seconds since last update
                        const now = Date.now();
                        if (currentDataStr !== lastDataStr || (now - lastPollUpdate > 10000)) {
                            // Update with the new data
                            updatePollResults(pollData);
                            
                            // Update tracking variables
                            lastPollData = pollData;
                            lastPollUpdate = now;
                            
                            // Add a data-updated attribute for CSS animations
                            const resultsContainer = poll.querySelector('.poll-results');
                            if (resultsContainer) {
                                resultsContainer.setAttribute('data-updated', now);
                            }
                        }
                    }, POLL_UPDATE_INTERVAL);
                    
                    // Initial fetch when slide becomes active
                    fetchPollData().then(pollData => {
                        if (!pollData) return;
                        
                        // Skip update if poll is inactive
                        if (!poll.classList.contains('inactive')) {
                            // Ensure we have valid data to work with
                            updatePollResults(pollData);
                            
                            // Initialize tracking variables
                            lastPollData = pollData;
                            lastPollUpdate = Date.now();
                            
                            // Check if we should force a refresh to ensure poll options are hidden if needed
                            if (poll.classList.contains('voted') || poll.classList.contains('finalized')) {
                                // If the poll is already marked as voted or finalized, make sure options are hidden
                                const optionsContainer = poll.querySelector('.poll-options');
                                if (optionsContainer && optionsContainer.style.display !== 'none') {
                                    optionsContainer.style.display = 'none';
                                }
                                
                                // Make sure results are shown
                                const resultsDiv = poll.querySelector('.poll-results');
                                if (resultsDiv) {
                                    resultsDiv.classList.add('show');
                                }
                            }
                        }
                    });
                } else if (updateInterval) {
                    // Clear interval when leaving slide
                    clearInterval(updateInterval);
                }
            });
            
            // Toggle option selection
            options.forEach(option => {
                option.addEventListener('click', function() {
                    // Allow single or multiple selection based on data-multiple attribute
                    if (!poll.dataset.multiple) {
                        // Single selection mode
                        options.forEach(opt => {
                            opt.classList.remove('selected');
                        });
                    }
                    this.classList.toggle('selected');
                });
            });
            
            // Submit button handler
            submitBtn.addEventListener('click', async function() {
                // Don't allow submissions if poll is inactive
                if (poll.classList.contains('inactive')) {
                    return;
                }
                
                const selectedOptions = poll.querySelectorAll('.poll-option.selected');
                if (selectedOptions.length === 0) return;
                
                // Ensure poll is expanded when submitting
                poll.classList.remove('collapsed');
                poll.classList.add('expanded');
                
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
                
                // Collect selected values
                const votes = [];
                selectedOptions.forEach(option => {
                    if (option.dataset.value) {
                        votes.push(option.dataset.value);
                    }
                });
                
                // Record user's vote to prevent duplicates
                userVotes[pollId] = votes;
                try {
                    localStorage.setItem('fullThrottleUserVotes', JSON.stringify(userVotes));
                } catch (error) {
                    console.log("LocalStorage not available for votes tracking");
                }
                
                // Submit votes to server
                const updatedData = await submitVotes(pollId, votes);
                
                // Check if already voted (may happen if another tab submitted)
                if (updatedData && updatedData.alreadyVoted) {
                    console.log('This user already voted for this poll');
                }
                
                // Update and show results
                const results = (updatedData && updatedData.results) ? updatedData.results : {};
                updatePollResults(results);
                
                // Remove the options container and replace with the results
                const optionsContainer = poll.querySelector('.poll-options');
                if (optionsContainer) {
                    optionsContainer.style.display = 'none';
                }
                
                // Show the results
                resultsDiv.classList.add('show');
                
                // Replace the action buttons
                const actionsContainer = poll.querySelector('.poll-actions');
                if (actionsContainer) {
                    actionsContainer.innerHTML = '<div class="poll-submitted-message">Your response has been recorded. Thank you!</div>';
                }
                
                // Mark this poll as voted
                poll.classList.add('voted');
                poll.classList.add('finalized');
            }
            });
            
            // Skip button handler
            skipBtn.addEventListener('click', async function() {
                // Ensure poll is expanded when skipping
                poll.classList.remove('collapsed');
                poll.classList.add('expanded');
                
                const pollData = await fetchPollData();
                // Ensure we have valid data to work with, even if empty
                updatePollResults(pollData || {});
                
                // Remove the options container and replace with the results
                const optionsContainer = poll.querySelector('.poll-options');
                if (optionsContainer) {
                    optionsContainer.style.display = 'none';
                }
                
                // Show the results
                resultsDiv.classList.add('show');
                
                // Replace the action buttons
                const actionsContainer = poll.querySelector('.poll-actions');
                if (actionsContainer) {
                    actionsContainer.innerHTML = '<div class="poll-submitted-message">You are viewing results without voting.</div>';
                }
                
                // Mark this poll as skipped and finalized
                poll.classList.add('skipped');
                poll.classList.add('finalized');
            });
        });
    }
    
    // Timeline functionality
    function setupTimeline() {
        const timelinePoints = document.querySelectorAll('.timeline-point');
        if (timelinePoints.length === 0) return;
        
        const timelinePrev = document.querySelector('.timeline-nav.prev');
        const timelineNext = document.querySelector('.timeline-nav.next');
        const timelineDetailTitle = document.getElementById('timeline-detail-title');
        const timelineDetailContent = document.getElementById('timeline-detail-content');
        
        if (!timelinePrev || !timelineNext || !timelineDetailTitle || !timelineDetailContent) return;
        
        // Timeline point data
        const timelineData = {
            'analog': {
                title: 'Key Milestones: The Analog Era',
                content: `
                    <ul class="racing-list">
                        <li>1950s: Door-to-door sales with paper contracts</li>
                        <li>1960s: Rolodex invented for contact management</li>
                        <li>1970s: Physical filing cabinets for customer records</li>
                        <li>Physical catalogs and brochures dominated sales collateral</li>
                        <li>Face-to-face meetings were the primary sales channel</li>
                    </ul>
                `
            },
            'digital': {
                title: 'Key Milestones: Digital Databases',
                content: `
                    <ul class="racing-list">
                        <li>1987: ACT! launches first digital contact management</li>
                        <li>1990: Early database systems for customer tracking</li>
                        <li>1993: Siebel Systems founded for enterprise CRM</li>
                        <li>1995: First sales email tracking begins</li>
                        <li>Client-server architecture dominates business software</li>
                    </ul>
                `
            },
            'cloud': {
                title: 'Key Milestones: Cloud & SaaS',
                content: `
                    <ul class="racing-list">
                        <li>1999: Salesforce introduced cloud-based CRM</li>
                        <li>2006: HubSpot pioneers inbound marketing automation</li>
                        <li>2009-2010: Mobile CRM apps emerge</li>
                        <li>2012: Integration platforms connect sales tools</li>
                        <li>2015: Sales analytics becomes mainstream</li>
                    </ul>
                `
            },
            'ai': {
                title: 'Key Milestones: The AI & Intelligence Era',
                content: `
                    <ul class="racing-list">
                        <li>2018: Conversation Intelligence (Gong, Chorus) transforms sales coaching</li>
                        <li>2020: AI-powered lead scoring becomes mainstream</li>
                        <li>2021: Automated meeting scheduling eliminates scheduling tag</li>
                        <li>2022: Predictive analytics forecasts deals with increasing accuracy</li>
                        <li>2023+: AI assistants begin drafting emails and call summaries</li>
                    </ul>
                `
            }
        };
        
        let currentTimelinePointIndex = 0; // Start with Analog era
        
        function updateTimelineDetails(period) {
            if (timelineData[period]) {
                timelineDetailTitle.textContent = timelineData[period].title;
                timelineDetailContent.innerHTML = timelineData[period].content;
            }
        }
        
        // Update active timeline point styling
        function updateActiveTimelinePoint() {
            timelinePoints.forEach((point, index) => {
                if (index === currentTimelinePointIndex) {
                    point.classList.add('active');
                } else {
                    point.classList.remove('active');
                }
            });
        }
        
        // Initialize with AI era
        if (timelinePoints[currentTimelinePointIndex] && 
            timelinePoints[currentTimelinePointIndex].dataset.period) {
            updateTimelineDetails(timelinePoints[currentTimelinePointIndex].dataset.period);
            updateActiveTimelinePoint();
        } else {
            updateTimelineDetails('ai'); // Fallback
        }
        
        // Timeline point click handler
        timelinePoints.forEach((point, index) => {
            if (point.dataset.period) {
                point.addEventListener('click', function() {
                    currentTimelinePointIndex = index;
                    updateTimelineDetails(this.dataset.period);
                    updateActiveTimelinePoint();
                });
            }
        });
        
        // Timeline navigation
        timelinePrev.addEventListener('click', function() {
            currentTimelinePointIndex = (currentTimelinePointIndex - 1 + timelinePoints.length) % timelinePoints.length;
            const period = timelinePoints[currentTimelinePointIndex].dataset.period;
            if (period) {
                updateTimelineDetails(period);
                updateActiveTimelinePoint();
            }
        });
        
        timelineNext.addEventListener('click', function() {
            currentTimelinePointIndex = (currentTimelinePointIndex + 1) % timelinePoints.length;
            const period = timelinePoints[currentTimelinePointIndex].dataset.period;
            if (period) {
                updateTimelineDetails(period);
                updateActiveTimelinePoint();
            }
        });
    }
});