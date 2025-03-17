// routes/api.js

const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');
const Contact = require('../models/contact');

// Get all poll definitions
router.get('/polls', async (req, res) => {
    try {
        const polls = await Poll.getAllPollDefinitions();
        res.json({ success: true, polls });
    } catch (error) {
        console.error('Error getting polls:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch polls' });
    }
});

// Get a specific poll with its options and results
router.get('/polls/:pollId', async (req, res) => {
    try {
        const pollId = req.params.pollId;
        const pollDefinition = await Poll.getPollDefinitionByPollId(pollId);
        
        if (!pollDefinition) {
            return res.status(404).json({ success: false, error: 'Poll not found' });
        }
        
        const options = await Poll.getPollOptionsByPollId(pollId);
        const results = await Poll.getPollResults(pollId);
        
        // Get user ID from query parameter if provided
        const userId = req.query.userId || '';
        let hasVoted = false;
        
        // Check if this user has already voted for this poll
        if (userId) {
            // Check if user has voted for this poll
            const existingVote = await Poll.checkExistingVote(pollDefinition.id, userId);
            hasVoted = !!existingVote;
        }
        
        // Format results into a more accessible format for client-side usage
        const formattedResults = {};
        results.forEach(result => {
            formattedResults[result.option_id] = result.vote_count;
        });
        
        res.json({
            success: true,
            poll: {
                id: pollDefinition.id,
                pollId: pollDefinition.poll_id,
                title: pollDefinition.title,
                description: pollDefinition.description,
                isActive: pollDefinition.is_active === 1
            },
            results: formattedResults,
            hasVoted: hasVoted
        });
    } catch (error) {
        console.error('Error getting poll:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch poll' });
    }
});

// Submit a poll response
router.post('/polls/:pollId', async (req, res) => {
    try {
        console.log(`Received poll response for pollId: ${req.params.pollId}`);
        const pollId = req.params.pollId;
        const userId = req.body.userId || 'anonymous';
        const votes = req.body.votes || [];
        
        // Additional metadata
        const metadata = {
            slideId: req.body.slideId,
            userAgent: req.body.userAgent,
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            screenSize: req.body.screen
        };
        
        console.log(`Processing vote from user ${userId} for poll ${pollId} with options: ${JSON.stringify(votes)}`);
        const result = await Poll.savePollResponse(pollId, userId, votes, metadata);
        
        // Log the success and response details
        console.log(`Successfully saved poll response. Response ID: ${result.responseId}`);
        if (result.results) {
            console.log(`Updated poll results:`, result.results);
        }
        
        res.json({
            success: true,
            results: result.results || {}
        });
    } catch (error) {
        console.error('Error submitting poll response:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to submit poll response',
            message: error.message
        });
    }
});

// Submit a contact form
router.post('/contact', async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ success: false, error: `Missing required field: ${field}` });
            }
        }
        
        // Add IP address to form data
        const formData = {
            ...req.body,
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        };
        
        const result = await Contact.saveContactSubmission(formData);
        
        res.json({
            success: true,
            id: result.id
        });
    } catch (error) {
        console.error('Error saving contact form:', error);
        res.status(500).json({ success: false, error: 'Failed to save contact form' });
    }
});

// Get pending submissions count (for admin notifications)
router.get('/pending-submissions', async (req, res) => {
    try {
        // Get counts from the database
        const pollResponses = await Poll.getAllResponses(1000);
        const contactSubmissions = await Contact.getAllContactSubmissions(1000);
        
        const pendingPollResponses = pollResponses ? pollResponses.length : 0;
        const pendingContactSubmissions = contactSubmissions ? contactSubmissions.length : 0;
        
        res.json({
            success: true,
            counts: {
                pollResponses: pendingPollResponses,
                contactSubmissions: pendingContactSubmissions
            }
        });
    } catch (error) {
        console.error('Error getting pending submissions count:', error);
        res.status(500).json({ success: false, error: 'Failed to get pending submissions count' });
    }
});

// Toggle poll status (admin function)
router.post('/polls/:pollId/status', async (req, res) => {
    try {
        console.log(`=== TOGGLE POLL STATUS REQUEST RECEIVED ===`);
        console.log(`Original URL: ${req.originalUrl}`);
        console.log(`Path: ${req.path}`);
        console.log(`Params: ${JSON.stringify(req.params)}`);
        console.log(`Body: ${JSON.stringify(req.body)}`);
        
        const pollId = req.params.pollId;
        const isActive = req.body.isActive === true; // Ensure boolean
        
        console.log(`Request to set poll ${pollId} to status: ${isActive ? 'active' : 'inactive'}`);
        
        // Check if poll exists
        const pollDefinition = await Poll.getPollDefinitionByPollId(pollId);
        if (!pollDefinition) {
            console.error(`Poll not found for status update: ${pollId}`);
            return res.status(404).json({ 
                success: false, 
                error: `Poll not found: ${pollId}` 
            });
        }
        
        console.log(`Found poll definition for status update: ID=${pollDefinition.id}, current status=${pollDefinition.is_active === 1 ? 'active' : 'inactive'}`);
        
        try {
            const result = await Poll.updatePollStatus(pollId, isActive);
            console.log(`Status update result:`, result);
            
            if (result && result.success) {
                res.json({
                    success: true,
                    pollId,
                    isActive,
                    message: `Poll ${isActive ? 'activated' : 'deactivated'} successfully`
                });
            } else {
                // Handle case where update didn't actually change anything
                console.error(`Poll status update didn't make any changes`);
                res.status(400).json({
                    success: false,
                    error: `Failed to update poll status: No changes made`
                });
            }
        } catch (updateError) {
            console.error('Error in updatePollStatus call:', updateError);
            console.error('Error stack:', updateError.stack);
            
            // More detailed error response
            return res.status(500).json({
                success: false,
                error: `Database error while updating poll status: ${updateError.message}`,
                details: String(updateError)
            });
        }
    } catch (error) {
        console.error('Error in poll status update endpoint:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false, 
            error: `Failed to update poll status: ${error.message}`,
            details: String(error)
        });
    }
});

// Clear poll responses (admin function)
router.delete('/polls/:pollId/responses', async (req, res) => {
    try {
        console.log(`=== DELETE REQUEST RECEIVED ===`);
        console.log(`Original URL: ${req.originalUrl}`);
        console.log(`Path: ${req.path}`);
        console.log(`Params: ${JSON.stringify(req.params)}`);
        console.log(`Route: /polls/:pollId/responses`);
        console.log(`Received request to clear poll responses for poll ID: "${req.params.pollId}"`);
        
        const pollId = req.params.pollId;
        
        if (!pollId) {
            console.error('Missing poll ID in request');
            return res.status(400).json({ 
                success: false, 
                error: 'Missing poll ID parameter' 
            });
        }
        
        // Try to find the poll first
        console.log(`Looking up poll definition for ID: "${pollId}"`);
        const pollDefinition = await Poll.getPollDefinitionByPollId(pollId);
        console.log(`Poll definition lookup result:`, pollDefinition);
        
        if (!pollDefinition) {
            console.error(`Poll not found with ID: "${pollId}"`);
            return res.status(404).json({ 
                success: false, 
                error: `Poll not found: ${pollId}` 
            });
        }
        
        console.log(`Clearing responses for poll: "${pollId}" (definition ID: ${pollDefinition.id})`);
        const result = await Poll.clearPollResponses(pollId);
        console.log(`Cleared responses result:`, result);
        
        res.json({
            success: true,
            pollId,
            responsesDeleted: result.responsesDeleted || 0,
            message: `Cleared all responses for poll ${pollId}`
        });
    } catch (error) {
        console.error('Error clearing poll responses:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false, 
            error: `Failed to clear poll responses: ${error.message}` 
        });
    }
});

module.exports = router;