// Admin panel functionality for polls and contacts
document.addEventListener('DOMContentLoaded', function() {
    // Determine API endpoint based on environment
    const BASE_URL = window.location.hostname === 'localhost' ? 
                    'http://localhost:3000' : '';
    const API_URL = `${BASE_URL}/api`;
    const ADMIN_URL = `${BASE_URL}/admin`;
    
    console.log('Using Base URL:', BASE_URL);
    console.log('API URL:', API_URL);
    console.log('Admin URL:', ADMIN_URL);
    
    // References to UI elements
    const pollsList = document.getElementById('polls-list');
    const contactsList = document.getElementById('contacts-list');
    const refreshBtn = document.getElementById('refresh-btn');
    const exportBtn = document.getElementById('export-btn');
    const pollDataStatus = document.getElementById('poll-data-status');
    const pollSummary = document.getElementById('poll-summary');
    const pollResponses = document.getElementById('poll-responses');
    
    // Poll ID mapping to link admin portal with presentation polls
    // This ensures the admin portal correctly uses the same poll IDs as in the slides
    const pollIdMapping = {
        'slide-2-default': 'slide-2-default',       // Poll on 03-revenue-acceleration.html (What would you do with 5 extra hours per week?)
        'slide-5-student-skills': 'slide-5-student-skills' // Poll on 06-human-vs-automation.html (Skills to prioritize)
    };
    
    console.log('Admin UI using poll ID mapping:', pollIdMapping);
    
    // Initial data load
    loadAllData();
    
    // Add event listeners
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            // Clear current displays
            if (pollsList) pollsList.innerHTML = '<div class="status-message info"><span class="loading-spinner"></span> Loading polls...</div>';
            if (pollDataStatus) pollDataStatus.innerHTML = '<span class="loading-spinner"></span> Loading poll data...';
            if (pollDataStatus) pollDataStatus.style.display = 'block';
            
            // Reload all data
            loadAllData();
            showNotification('Refreshing data...', 'info');
        });
    }
    
    // Function to load all data at once 
    async function loadAllData() {
        try {
            // Call main data loading functions
            await loadPolls();
            await loadPollSummary();
            
            showNotification('Data loaded successfully', 'success');
        } catch (error) {
            console.error('Error loading data:', error);
            showNotification('Error loading data. Please check console.', 'error');
        }
    }
    
    // Automatically refresh data periodically
    setInterval(loadAllData, 30000); // Refresh every 30 seconds
    
    // Load all polls from the server
    async function loadPolls() {
        try {
            console.log('Fetching poll data from admin API...');
            
            if (!pollsList) {
                console.error('Poll list element not found in DOM');
                return;
            }
            
            // Clear and show loading indicator
            pollsList.innerHTML = '<div class="status-message info"><span class="loading-spinner"></span> Loading polls...</div>';
            
            // Get all poll data from the admin API endpoint
            const response = await fetch(`${ADMIN_URL}/polls`);
            
            if (!response.ok) {
                console.error('Error response:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error details:', errorText);
                throw new Error(`Failed to fetch polls: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Poll data received:', data);
            
            // Extract poll definitions
            const pollDefinitionsMap = data.pollDefinitions || {};
            
            // Convert to array format for display
            let polls = [];
            
            // Filter polls to only include the ones defined in our poll ID mapping
            // This ensures we only show the polls that are part of our presentation
            const validPollIds = Object.values(pollIdMapping);
            
            // Process each poll definition that is in our valid IDs list
            for (const pollId in pollDefinitionsMap) {
                if (validPollIds.includes(pollId)) {
                    polls.push(pollDefinitionsMap[pollId]);
                }
            }
            
            console.log('Displaying polls (filtered):', polls);
            
            // Store results data for reference in the view
            window.pollResults = data.polls || {};
            
            // Display the polls in the admin panel
            displayPolls(polls);
            
        } catch (error) {
            console.error('Error loading polls:', error);
            pollsList.innerHTML = '<div class="status-message error">Failed to load polls. Please refresh the page.</div>';
        }
    }
    
    // Load poll summary data
    async function loadPollSummary() {
        try {
            if (!pollDataStatus || !pollSummary || !pollResponses) {
                console.error('Poll summary elements not found in DOM');
                return;
            }
            
            // Get the same poll data that we used for the main poll list
            const response = await fetch(`${ADMIN_URL}/polls`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch poll data: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Hide loading status
            pollDataStatus.style.display = 'none';
            
            // Display poll summary
            displayPollSummary(data);
            
            // Display recent responses
            displayPollResponses(data);
            
            // Render chart
            renderPollChart(data);
            
        } catch (error) {
            console.error('Error loading poll summary:', error);
            pollDataStatus.className = 'status-message error';
            pollDataStatus.innerHTML = 'Error loading poll data. Please try refreshing the page.';
        }
    }
    
    // Display polls in the admin panel
    function displayPolls(polls) {
        if (!pollsList) return;
        
        // Clear current content
        pollsList.innerHTML = '';
        
        if (polls.length === 0) {
            pollsList.innerHTML = '<div class="empty-message">No polls found</div>';
            return;
        }
        
        console.log('Rendering poll cards for', polls.length, 'polls');
        
        polls.forEach(poll => {
            console.log('Processing poll:', poll);
            
            // Create poll card element
            const pollCard = document.createElement('div');
            pollCard.className = 'poll-card';
            
            // Get consistent poll ID
            const pollId = poll.pollId || poll.poll_id;
            pollCard.dataset.pollId = pollId;
            
            // Add active/inactive status
            const isActive = poll.isActive === true || poll.is_active === 1 || poll.is_active === true;
            if (isActive) {
                pollCard.classList.add('active');
            } else {
                pollCard.classList.add('inactive');
            }
            
            // Calculate total responses
            const responseCount = poll.responseCount || poll.response_count || 0;
            
            // Get poll results if available
            let pollResultsSummary = '';
            if (window.pollResults && window.pollResults[pollId]) {
                const results = window.pollResults[pollId];
                pollResultsSummary = '<p>Current votes: ';
                
                const optionVotes = [];
                for (const option in results) {
                    optionVotes.push(`${option}: ${results[option]}`);
                }
                
                if (optionVotes.length > 0) {
                    pollResultsSummary += optionVotes.join(', ');
                } else {
                    pollResultsSummary += 'None yet';
                }
                pollResultsSummary += '</p>';
            }
            
            // Add slide information based on poll ID
            let slideInfo = '';
            if (pollId === 'slide-2-default') {
                slideInfo = '<p><strong>Location:</strong> Slide 3 - "Revving Up Revenue"</p>';
            } else if (pollId === 'slide-5-student-skills') {
                slideInfo = '<p><strong>Location:</strong> Slide 6 - "Human vs Automation"</p>';
            }
                
            pollCard.innerHTML = `
                <div class="poll-header">
                    <h3>${poll.title || 'Untitled Poll'}</h3>
                    <div class="poll-status ${isActive ? 'active' : 'inactive'}">
                        ${isActive ? 'LIVE' : 'CLOSED'}
                    </div>
                </div>
                <div class="poll-info">
                    <p>ID: ${pollId}</p>
                    ${slideInfo}
                    <p>Responses: ${responseCount}</p>
                    <p>Created: ${formatDate(poll.created_at)}</p>
                    ${pollResultsSummary}
                </div>
                <div class="poll-actions">
                    <button class="toggle-status-btn ${isActive ? 'active' : 'inactive'}" data-poll-id="${pollId}" data-is-active="${isActive ? '1' : '0'}">
                        ${isActive ? 'Deactivate Poll' : 'Activate Poll'}
                    </button>
                    <button class="clear-results-btn" data-poll-id="${pollId}">
                        Clear Results
                    </button>
                    <button class="view-results-btn" data-poll-id="${pollId}">
                        View Results
                    </button>
                </div>`;
            
            // Add the poll card to the list
            pollsList.appendChild(pollCard);
            
            // Add event listeners to buttons
            attachPollCardEventListeners(pollCard, pollId, isActive);
        });
    }
    
    // Attach event listeners to poll card buttons
    function attachPollCardEventListeners(pollCard, pollId, isActive) {
        const toggleBtn = pollCard.querySelector('.toggle-status-btn');
        const clearBtn = pollCard.querySelector('.clear-results-btn');
        const viewBtn = pollCard.querySelector('.view-results-btn');
        
        // Ensure we have valid poll ID
        if (!pollId) {
            console.error('Missing poll ID for event listeners');
            return;
        }
        
        if (toggleBtn) {
            console.log(`Adding toggle listener for poll ${pollId}, current status: ${isActive}`);
            toggleBtn.addEventListener('click', function() {
                console.log(`Toggle button clicked for poll ${pollId}`);
                togglePollStatus(pollId, isActive);
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                console.log(`Clear button clicked for poll ${pollId}`);
                clearPollResults(pollId);
            });
        }
        
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                console.log(`View button clicked for poll ${pollId}`);
                viewPollResults(pollId);
            });
        }
    }
    
    // Display poll summary
    function displayPollSummary(data) {
        if (!pollSummary) return;
        
        // Get poll results
        const polls = data.polls || {};
        
        let summaryHTML = '<h4>Poll Results</h4>';
        
        if (Object.keys(polls).length === 0) {
            summaryHTML += '<p>No poll data available yet.</p>';
        } else {
            summaryHTML += '<table class="data-table">';
            summaryHTML += '<thead><tr><th>Poll ID</th><th>Option</th><th>Votes</th></tr></thead>';
            summaryHTML += '<tbody>';
            
            // Only include polls in our mapping
            const validPollIds = Object.values(pollIdMapping);
            
            Object.entries(polls).forEach(([pollId, results]) => {
                // Skip polls not in our mapping
                if (!validPollIds.includes(pollId)) return;
                
                let isFirstRow = true;
                const optionEntries = Object.entries(results);
                
                if (optionEntries.length === 0) {
                    // Handle empty results
                    summaryHTML += '<tr>';
                    summaryHTML += `<td>${pollId}</td>`;
                    summaryHTML += '<td colspan="2">No votes yet</td>';
                    summaryHTML += '</tr>';
                } else {
                    optionEntries.forEach(([option, votes]) => {
                        summaryHTML += '<tr>';
                        if (isFirstRow) {
                            summaryHTML += `<td rowspan="${optionEntries.length}">${pollId}</td>`;
                            isFirstRow = false;
                        }
                        summaryHTML += `<td>${option}</td>`;
                        summaryHTML += `<td>${votes}</td>`;
                        summaryHTML += '</tr>';
                    });
                }
            });
            
            summaryHTML += '</tbody></table>';
        }
        
        pollSummary.innerHTML = summaryHTML;
    }
    
    // Display poll responses
    function displayPollResponses(data) {
        if (!pollResponses) return;
        
        // Get responses
        const responses = data.responses || [];
        
        if (responses.length === 0) {
            pollResponses.innerHTML = '<p>No individual responses recorded yet.</p>';
            return;
        }
        
        let responsesHTML = '<h4>Recent Responses</h4>';
        responsesHTML += '<table class="data-table">';
        responsesHTML += '<thead><tr><th>Timestamp</th><th>Poll ID</th><th>User ID</th><th>Votes</th></tr></thead>';
        responsesHTML += '<tbody>';
        
        // Only include responses for polls in our mapping
        const validPollIds = Object.values(pollIdMapping);
        
        // Filter, sort, and take the most recent 10 responses
        const filteredResponses = responses.filter(response => 
            validPollIds.includes(response.pollId));
            
        const sortedResponses = [...filteredResponses].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp));
            
        const recentResponses = sortedResponses.slice(0, 10);
        
        recentResponses.forEach(response => {
            responsesHTML += '<tr>';
            responsesHTML += `<td>${formatDate(response.timestamp)}</td>`;
            responsesHTML += `<td>${response.pollId}</td>`;
            responsesHTML += `<td>${response.userId.substring(0, 8)}...</td>`;
            responsesHTML += `<td>${response.votes ? response.votes.join(', ') : ''}</td>`;
            responsesHTML += '</tr>';
        });
        
        responsesHTML += '</tbody></table>';
        responsesHTML += `<p>Total responses for these polls: ${filteredResponses.length}</p>`;
        
        pollResponses.innerHTML = responsesHTML;
    }
    
    // Render poll chart
    function renderPollChart(data) {
        const chartContainer = document.getElementById('poll-chart');
        if (!chartContainer) return;
        
        // Get poll results
        const polls = data.polls || {};
        
        let chartHTML = '<h4>Poll Results Visualization</h4>';
        
        if (Object.keys(polls).length === 0) {
            chartHTML += '<p>No poll data available to visualize.</p>';
            chartContainer.innerHTML = chartHTML;
            return;
        }
        
        // Only include polls in our mapping
        const validPollIds = Object.values(pollIdMapping);
        const filteredPolls = {};
        
        Object.entries(polls).forEach(([pollId, results]) => {
            if (validPollIds.includes(pollId)) {
                filteredPolls[pollId] = results;
            }
        });
        
        if (Object.keys(filteredPolls).length === 0) {
            chartHTML += '<p>No relevant poll data to visualize.</p>';
            chartContainer.innerHTML = chartHTML;
            return;
        }
        
        chartHTML += '<div style="display: flex; height: 250px; align-items: flex-end; gap: 10px;">';
        
        // Combine results for visualization
        const optionTotals = {};
        
        Object.values(filteredPolls).forEach(pollResults => {
            Object.entries(pollResults).forEach(([option, votes]) => {
                if (!optionTotals[option]) {
                    optionTotals[option] = 0;
                }
                optionTotals[option] += votes;
            });
        });
        
        // Find maximum votes for scaling
        const maxVotes = Math.max(...Object.values(optionTotals), 1);
        
        // Generate bar chart
        Object.entries(optionTotals).forEach(([option, votes]) => {
            const percentage = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
            
            chartHTML += `
                <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                    <div style="background: linear-gradient(to top, var(--racing-red), #ff6b6b); 
                                width: 50px; height: ${percentage}%; 
                                display: flex; align-items: flex-end; justify-content: center;
                                color: white; font-weight: bold; padding-bottom: 5px; border-radius: 5px 5px 0 0;">
                        ${votes}
                    </div>
                    <div style="margin-top: 10px; text-align: center; font-size: 0.9rem; font-weight: bold;">
                        ${option}
                    </div>
                </div>
            `;
        });
        
        chartHTML += '</div>';
        chartContainer.innerHTML = chartHTML;
    }
    
    // Toggle poll active/inactive status
    async function togglePollStatus(pollId, currentStatus) {
        try {
            // Convert to boolean to ensure proper data type
            const isCurrentlyActive = currentStatus === true || currentStatus === "1" || currentStatus === 1;
            
            // Ask for confirmation
            if (!confirm(`Are you sure you want to ${isCurrentlyActive ? 'deactivate' : 'activate'} this poll?`)) {
                return;
            }
            
            console.log(`Toggling poll status for poll ${pollId} from ${isCurrentlyActive} to ${!isCurrentlyActive}`);
            showNotification(`Updating poll status...`, 'info');
            
            console.log(`Using poll ID ${pollId} for status toggle API call`);
            
            const encodedPollId = encodeURIComponent(pollId);
            
            const response = await fetch(`${API_URL}/polls/${encodedPollId}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isActive: !isCurrentlyActive
                })
            });
            
            console.log('Toggle response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error details:', errorText);
                throw new Error(`Failed to update poll status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Toggle response data:', data);
            
            if (!data.success) {
                throw new Error(data.error || 'Unknown error');
            }
            
            // Reload data to show updated status
            loadAllData();
            
            // Try to broadcast the status change to all connected clients via localStorage
            try {
                // Use localStorage for cross-tab communication
                localStorage.setItem('pollUpdate', JSON.stringify({
                    pollId,
                    isActive: !isCurrentlyActive,
                    timestamp: Date.now()
                }));
                
                // Remove it after a short delay to prevent potential issues
                setTimeout(() => {
                    localStorage.removeItem('pollUpdate');
                }, 500);
                
                console.log(`Broadcast status change for poll ${pollId} to all tabs`);
            } catch (e) {
                console.warn('Unable to broadcast poll status change:', e);
            }
            
            showNotification(`Poll ${data.isActive ? 'activated' : 'deactivated'} successfully`, 'success');
        } catch (error) {
            console.error('Error toggling poll status:', error);
            showNotification(`Failed to update poll status: ${error.message}`, 'error');
        }
    }
    
    // Clear all responses for a poll
    async function clearPollResults(pollId) {
        try {
            // Ask for confirmation
            if (!confirm('Are you sure you want to clear all responses for this poll? This action cannot be undone.')) {
                return;
            }
            
            if (!pollId) {
                throw new Error('Invalid poll ID');
            }
            
            console.log(`Clearing poll responses for: ${pollId}`);
            showNotification(`Clearing responses for poll ${pollId}...`, 'info');
            
            // Add console tracing
            console.log('------ Detailed debug for clearPollResults ------');
            console.log('Poll ID:', pollId);
            console.log('Type of Poll ID:', typeof pollId);
            
            // Ensure the pollId is properly encoded for URLs
            const encodedPollId = encodeURIComponent(pollId);
            console.log('Encoded Poll ID:', encodedPollId);
            
            // Construct the API URL
            const url = `${API_URL}/polls/${encodedPollId}/responses`;
            console.log('Delete request to URL:', url);
            
            // Make the DELETE request
            console.log('Making DELETE request...');
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            console.log('Response received');
            console.log('Response status:', response.status);
            console.log('Response OK:', response.ok);
            
            if (!response.ok) {
                // Try to get error details
                let errorDetails = 'Unknown error';
                try {
                    const errorData = await response.text();
                    console.error('Error response text:', errorData);
                    errorDetails = errorData;
                } catch (e) {
                    console.error('Error getting response text:', e);
                }
                
                throw new Error(`Failed to clear poll responses: ${response.status} - ${errorDetails}`);
            }
            
            // Parse the response
            let data;
            try {
                const responseText = await response.text();
                console.log('Response text:', responseText);
                data = JSON.parse(responseText);
                console.log('Parsed response data:', data);
            } catch (e) {
                console.error('Error parsing response:', e);
                throw new Error('Invalid response format');
            }
            
            if (!data.success) throw new Error(data.error || 'Unknown error');
            
            console.log('Success! Reloading all data...');
            
            // Reload all data to show updated state
            loadAllData();
            
            // Broadcast poll result clearing to connected clients via localStorage
            try {
                localStorage.setItem('pollUpdate', JSON.stringify({
                    pollId,
                    cleared: true,
                    timestamp: Date.now()
                }));
                
                // Remove it after a short delay
                setTimeout(() => {
                    localStorage.removeItem('pollUpdate');
                }, 500);
                
                console.log(`Broadcast poll clearing for poll ${pollId} to all tabs`);
            } catch (e) {
                console.warn('Unable to broadcast poll clearing:', e);
            }
            
            showNotification(`Poll cleared: ${data.responsesDeleted} responses deleted`, 'success');
        } catch (error) {
            console.error('Error clearing poll results:', error);
            console.error('Error stack:', error.stack);
            showNotification(`Failed to clear poll results: ${error.message}`, 'error');
        }
    }
    
    // View detailed results for a poll
    async function viewPollResults(pollId) {
        try {
            console.log(`Viewing results for poll: ${pollId}`);
            
            if (!pollId) {
                throw new Error('Invalid poll ID');
            }
            
            const encodedPollId = encodeURIComponent(pollId);
            console.log(`Encoded poll ID: ${encodedPollId}`);
            
            const response = await fetch(`${API_URL}/polls/${encodedPollId}`);
            console.log(`Response status: ${response.status}`);
            
            if (!response.ok) throw new Error(`Failed to fetch poll data: ${response.status}`);
            
            const data = await response.json();
            
            if (!data.success) throw new Error('Invalid poll data');
            
            // Display results in a modal
            const modal = document.createElement('div');
            modal.className = 'modal';
            
            let resultsHTML = '';
            const results = data.results || {};
            
            // Calculate total votes
            let totalVotes = 0;
            for (const key in results) {
                totalVotes += results[key];
            }
            
            // Create results HTML
            for (const option in results) {
                const votes = results[option];
                const percentage = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
                
                resultsHTML += `
                    <div class="result-item">
                        <div class="result-header">
                            <div class="result-label">${option}</div>
                            <div class="result-count">${votes} votes (${percentage}%)</div>
                        </div>
                        <div class="result-bar">
                            <div class="result-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            }
            
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Poll Results: ${data.poll?.title || pollId}</h2>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="result-summary">
                            <p>Total votes: ${totalVotes}</p>
                            <p>Status: ${data.poll?.isActive ? 'Active' : 'Inactive'}</p>
                        </div>
                        <div class="results-list">
                            ${resultsHTML}
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listener to close button
            const closeBtn = modal.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    document.body.removeChild(modal);
                });
            }
            
            // Close when clicking outside the modal
            modal.addEventListener('click', function(event) {
                if (event.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        } catch (error) {
            console.error('Error viewing poll results:', error);
            showNotification('Failed to load poll results', 'error');
        }
    }
    
    // Load contacts from the server
    async function loadContacts() {
        const contactStatus = document.getElementById('contact-data-status');
        const contactSummary = document.getElementById('contact-summary');
        const contactSubmissions = document.getElementById('contact-submissions');
        
        if (!contactStatus || !contactSummary || !contactSubmissions) {
            console.warn('Contact UI elements not found');
            return;
        }
        
        try {
            console.log('Fetching contact data from /admin/contacts');
            const response = await fetch(`${ADMIN_URL}/contacts`);
            
            if (!response.ok) {
                console.error('Contact data fetch failed with status:', response.status);
                throw new Error(`Failed to fetch contact data: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Contact data received:', data);
            
            // Hide loading status
            contactStatus.style.display = 'none';
            
            // Display contact summary
            if (!data.submissions || data.submissions.length === 0) {
                contactSummary.innerHTML = '<h4>Contact Form Submissions</h4><p>No contact form submissions yet.</p>';
                contactSubmissions.innerHTML = '<p>No submissions to display.</p>';
                return;
            }
            
            // Display summary info
            contactSummary.innerHTML = `
                <h4>Contact Form Submissions</h4>
                <p>Total submissions: ${data.submissions.length}</p>
            `;
            
            // Display recent submissions
            let submissionsHTML = '<table class="data-table">';
            submissionsHTML += '<thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Major</th></tr></thead>';
            submissionsHTML += '<tbody>';
            
            // Sort by most recent
            const sortedSubmissions = [...data.submissions].sort((a, b) => {
                if (!a.timestamp) return 1;
                if (!b.timestamp) return -1;
                return new Date(b.timestamp) - new Date(a.timestamp);
            });
            
            // Show only the 10 most recent
            const recentSubmissions = sortedSubmissions.slice(0, 10);
            
            recentSubmissions.forEach(submission => {
                submissionsHTML += '<tr>';
                submissionsHTML += `<td>${formatDate(submission.timestamp)}</td>`;
                submissionsHTML += `<td>${submission.firstName} ${submission.lastName}</td>`;
                submissionsHTML += `<td>${submission.email}</td>`;
                submissionsHTML += `<td>${submission.major || ''}</td>`;
                submissionsHTML += '</tr>';
            });
            
            submissionsHTML += '</tbody></table>';
            contactSubmissions.innerHTML = submissionsHTML;
            
        } catch (error) {
            console.error('Error loading contact data:', error);
            contactStatus.className = 'status-message error';
            contactStatus.innerHTML = 'Error loading contact data: ' + error.message;
        }
    }
    
    // Helper function to format dates
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date)) return 'Invalid date';
            return date.toLocaleString();
        } catch (e) {
            console.warn('Error formatting date:', e);
            return 'Date error';
        }
    }
    
    // Display notification to the user
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});