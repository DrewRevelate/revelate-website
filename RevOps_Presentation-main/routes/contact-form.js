// routes/contact-form.js

const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const CRM = require('../models/crm');

// Handle contact form submission
router.post('/submit', async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        
        // Get user ID from client (for connecting with poll responses)
        const userId = req.body.userId || req.cookies.fullThrottleUserId || null;
        
        // Prepare form data
        const formData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone || null,
            major: req.body.major || null,
            gradYear: req.body.gradYear || null,
            careerGoals: req.body.careerGoals || null,
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            userAgent: req.headers['user-agent'],
            screen: req.body.screen || null,
            sessionId: req.body.sessionId || req.cookies.sessionId || null,
            userId: userId
        };
        
        // Save the contact submission
        const result = await Contact.saveContactSubmission(formData);
        
        if (result && result.id) {
            // Create initial CRM interaction record
            await CRM.addContactInteraction(
                result.id,
                'form_submission',
                'Contact form submitted',
                {
                    source: req.body.source || 'presentation',
                    formData: req.body
                }
            );
            
            // If we have a user ID, set a tag for poll responses
            if (userId) {
                // Check if there are any poll responses for this user
                const existingContact = await CRM.getContactByUserId(userId);
                
                if (!existingContact) {
                    // Update the contact with the userId if it's not already set
                    if (!formData.userId) {
                        await CRM.updateContactWithUserId(result.id, userId);
                    }
                    
                    // Check for poll responses
                    const pollResponses = await CRM.getPollResponsesForContact(result.id);
                    
                    if (pollResponses && pollResponses.length > 0) {
                        // Add tag to indicate poll participation
                        await CRM.addTagToContact(result.id, 'poll-participant');
                        
                        // Add interaction for poll linking
                        await CRM.addContactInteraction(
                            result.id,
                            'poll_linking',
                            `Linked ${pollResponses.length} poll responses`,
                            { pollCount: pollResponses.length }
                        );
                    }
                }
            }
            
            // Set cookie with user ID for future identification
            if (userId) {
                res.cookie('fullThrottleUserId', userId, {
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                    httpOnly: true,
                    sameSite: 'strict'
                });
            }
            
            return res.status(200).json({
                success: true,
                id: result.id,
                message: 'Contact form submitted successfully'
            });
        } else {
            throw new Error('Failed to save contact form');
        }
    } catch (error) {
        console.error('Error in contact form submission:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while processing your submission'
        });
    }
});

module.exports = router;