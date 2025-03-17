// routes/admin.js

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Poll = require('../models/poll');
const Contact = require('../models/contact');
const CRM = require('../models/crm');
const { execSync } = require('child_process');

// Admin dashboard page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin.html'));
});

// CRM dashboard page
router.get('/crm', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'admin-crm.html'));
});

// Unified CRM dashboard page
router.get('/unified', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'unified-admin.html'));
});

// Get all poll data for admin
router.get('/polls', async (req, res) => {
    try {
        // Get poll definitions
        console.log('Admin: fetching poll definitions');
        const pollDefinitions = await Poll.getAllPollDefinitions();
        console.log(`Admin: found ${pollDefinitions.length} poll definitions`);
        
        // Prepare results object
        const polls = {};
        
        // Track all poll definitions for client-side use
        const pollDefinitionsMap = {};
        pollDefinitions.forEach(poll => {
            pollDefinitionsMap[poll.poll_id] = {
                id: poll.id,
                pollId: poll.poll_id, 
                title: poll.title,
                description: poll.description,
                isActive: poll.is_active === 1,
                responseCount: poll.response_count || 0
            };
        });
        
        // Get results for each poll - use Promise.all for concurrency
        await Promise.all(pollDefinitions.map(async (poll) => {
            const results = await Poll.getPollResults(poll.poll_id);
            
            // Transform to simplified format
            const pollResults = {};
            results.forEach(result => {
                pollResults[result.option_id] = result.vote_count;
            });
            
            polls[poll.poll_id] = pollResults;
        }));
        
        // Get all responses
        const responses = await Poll.getAllResponses(100);
        
        // Transform to simplified format
        const formattedResponses = responses.map(response => ({
            id: response.id,
            pollId: response.poll_id,
            userId: response.user_id,
            timestamp: response.created_at,
            votes: response.selected_options ? response.selected_options.split(',') : []
        }));
        
        console.log('Admin: successfully prepared poll data with poll results and responses');
        
        res.json({
            polls,
            responses: formattedResponses,
            // Include poll definitions for the admin UI
            pollDefinitions: pollDefinitionsMap
        });
    } catch (error) {
        console.error('Error getting admin poll data:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch poll data' });
    }
});

// Get all contact form submissions for admin
router.get('/contacts', async (req, res) => {
    try {
        console.log('Admin: fetching contact submissions');
        const submissions = await Contact.getAllContactSubmissions(100);
        console.log(`Admin: found ${submissions ? submissions.length : 0} contact submissions`);
        
        if (!submissions || submissions.length === 0) {
            console.log('Admin: No contact submissions found, returning empty array');
            return res.json({
                submissions: []
            });
        }
        
        // Transform to simplified format
        const formattedSubmissions = submissions.map(submission => {
            // Debug log first submission
            if (submissions.indexOf(submission) === 0) {
                console.log('Admin: First submission raw data:', submission);
            }
            
            return {
                id: submission.id,
                firstName: submission.first_name,
                lastName: submission.last_name,
                email: submission.email,
                phone: submission.phone,
                major: submission.major,
                gradYear: submission.grad_year,
                careerGoals: submission.career_goals,
                timestamp: submission.created_at,
                userId: submission.user_id,
                status: submission.status || 'new',
                leadSource: submission.lead_source || 'presentation',
                leadScore: submission.lead_score || 0,
                notes: submission.notes || '',
                lastContactedAt: submission.last_contacted_at
            };
        });
        
        console.log(`Admin: successfully formatted ${formattedSubmissions.length} submissions`);
        
        if (formattedSubmissions.length > 0) {
            console.log('Admin: First formatted submission:', formattedSubmissions[0]);
        }
        
        res.json({
            submissions: formattedSubmissions
        });
    } catch (error) {
        console.error('Error getting admin contact data:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch contact data: ' + error.message });
    }
});

// CRM: Get filtered contacts with pagination
router.get('/crm/contacts', async (req, res) => {
    try {
        const { status, tag, search, sort, order, page, limit } = req.query;
        
        // Build filter object
        const filters = {};
        if (status) filters.status = status;
        if (tag) filters.tag = tag;
        if (search) filters.search = search;
        
        // Default sort to created_at if not specified
        const sortBy = sort || 'created_at';
        const sortOrder = order || 'DESC';
        const currentPage = parseInt(page) || 1;
        const contactsPerPage = parseInt(limit) || 20;
        
        const result = await CRM.getFilteredContacts(
            filters,
            sortBy,
            sortOrder,
            currentPage,
            contactsPerPage
        );
        
        res.json(result);
    } catch (error) {
        console.error('Error getting filtered contacts:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch contacts: ' + error.message
        });
    }
});

// CRM: Get all tags
router.get('/crm/tags', async (req, res) => {
    try {
        const tags = await CRM.getAllTags();
        res.json({ success: true, tags });
    } catch (error) {
        console.error('Error getting tags:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch tags' });
    }
});

// CRM: Get contact details with all related data
router.get('/crm/contacts/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const contactDetails = await CRM.getContactDetails(contactId);
        
        if (!contactDetails) {
            return res.status(404).json({ success: false, error: 'Contact not found' });
        }
        
        res.json({ success: true, contact: contactDetails });
    } catch (error) {
        console.error(`Error getting contact details for ${req.params.id}:`, error);
        res.status(500).json({ success: false, error: 'Failed to fetch contact details' });
    }
});

// CRM: Update contact status
router.post('/crm/contacts/:id/status', async (req, res) => {
    try {
        const contactId = req.params.id;
        const { status, notes } = req.body;
        
        if (!status) {
            return res.status(400).json({ success: false, error: 'Status is required' });
        }
        
        const updatedContact = await CRM.updateContactStatus(contactId, status, notes);
        
        if (!updatedContact) {
            return res.status(404).json({ success: false, error: 'Contact not found or update failed' });
        }
        
        // Add interaction record for this status change
        await CRM.addContactInteraction(
            contactId,
            'status_change',
            `Status changed to: ${status}`,
            { previousNotes: updatedContact.notes, newNotes: notes }
        );
        
        res.json({ success: true, contact: updatedContact });
    } catch (error) {
        console.error(`Error updating contact status for ${req.params.id}:`, error);
        res.status(500).json({ success: false, error: 'Failed to update contact status' });
    }
});

// CRM: Add tag to contact
router.post('/crm/contacts/:id/tags', async (req, res) => {
    try {
        const contactId = req.params.id;
        const { tagName } = req.body;
        
        if (!tagName) {
            return res.status(400).json({ success: false, error: 'Tag name is required' });
        }
        
        const result = await CRM.addTagToContact(contactId, tagName);
        
        if (!result) {
            return res.status(500).json({ success: false, error: 'Failed to add tag' });
        }
        
        // Add interaction record
        await CRM.addContactInteraction(
            contactId,
            'tag_added',
            `Tag added: ${tagName}`
        );
        
        // Return updated tags
        const tags = await CRM.getTagsForContact(contactId);
        res.json({ success: true, tags });
    } catch (error) {
        console.error(`Error adding tag to contact ${req.params.id}:`, error);
        res.status(500).json({ success: false, error: 'Failed to add tag' });
    }
});

// CRM: Remove tag from contact
router.delete('/crm/contacts/:contactId/tags/:tagId', async (req, res) => {
    try {
        const { contactId, tagId } = req.params;
        
        const result = await CRM.removeTagFromContact(contactId, tagId);
        
        if (!result) {
            return res.status(404).json({ success: false, error: 'Tag not found or already removed' });
        }
        
        // Add interaction record
        await CRM.addContactInteraction(
            contactId,
            'tag_removed',
            `Tag removed: ID ${tagId}`
        );
        
        // Return updated tags
        const tags = await CRM.getTagsForContact(contactId);
        res.json({ success: true, tags });
    } catch (error) {
        console.error(`Error removing tag ${req.params.tagId} from contact ${req.params.contactId}:`, error);
        res.status(500).json({ success: false, error: 'Failed to remove tag' });
    }
});

// CRM: Add interaction to contact
router.post('/crm/contacts/:id/interactions', async (req, res) => {
    try {
        const contactId = req.params.id;
        const { interactionType, description, metadata } = req.body;
        
        if (!interactionType || !description) {
            return res.status(400).json({ success: false, error: 'Interaction type and description are required' });
        }
        
        const interactionId = await CRM.addContactInteraction(
            contactId,
            interactionType,
            description,
            metadata || {}
        );
        
        if (!interactionId) {
            return res.status(500).json({ success: false, error: 'Failed to add interaction' });
        }
        
        // Get all interactions to return
        const interactions = await CRM.getContactInteractions(contactId);
        res.json({ success: true, interactions });
    } catch (error) {
        console.error(`Error adding interaction to contact ${req.params.id}:`, error);
        res.status(500).json({ success: false, error: 'Failed to add interaction' });
    }
});

// CRM: Get poll responses for a contact
router.get('/crm/contacts/:id/poll-responses', async (req, res) => {
    try {
        const contactId = req.params.id;
        const pollResponses = await CRM.getPollResponsesForContact(contactId);
        
        res.json({ success: true, pollResponses });
    } catch (error) {
        console.error(`Error getting poll responses for contact ${req.params.id}:`, error);
        res.status(500).json({ success: false, error: 'Failed to fetch poll responses' });
    }
});

// CRM: Link user ID to contact
router.post('/crm/contacts/:id/link-user', async (req, res) => {
    try {
        const contactId = req.params.id;
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ success: false, error: 'User ID is required' });
        }
        
        const updatedContact = await CRM.updateContactWithUserId(contactId, userId);
        
        if (!updatedContact) {
            return res.status(404).json({ success: false, error: 'Contact not found or update failed' });
        }
        
        res.json({ success: true, contact: updatedContact });
    } catch (error) {
        console.error(`Error linking user ID to contact ${req.params.id}:`, error);
        res.status(500).json({ success: false, error: 'Failed to link user ID' });
    }
});

// Export polls as CSV
router.get('/export/polls', (req, res) => {
    try {
        // Execute the export script
        execSync('node tools/export-data.js');
        
        // Find the most recent export file
        const exportsDir = path.join(__dirname, '..', 'exports');
        const files = fs.readdirSync(exportsDir)
            .filter(file => file.startsWith('poll_results_'))
            .sort()
            .reverse();
            
        if (files.length === 0) {
            throw new Error('No export files found');
        }
        
        // Send the file
        const filePath = path.join(exportsDir, files[0]);
        res.download(filePath);
    } catch (error) {
        console.error('Error exporting polls:', error);
        res.status(500).send('Error exporting polls. Please try again.');
    }
});

// Export poll responses as CSV
router.get('/export/responses', (req, res) => {
    try {
        // Execute the export script
        execSync('node tools/export-data.js');
        
        // Find the most recent export file
        const exportsDir = path.join(__dirname, '..', 'exports');
        const files = fs.readdirSync(exportsDir)
            .filter(file => file.startsWith('poll_responses_'))
            .sort()
            .reverse();
            
        if (files.length === 0) {
            throw new Error('No export files found');
        }
        
        // Send the file
        const filePath = path.join(exportsDir, files[0]);
        res.download(filePath);
    } catch (error) {
        console.error('Error exporting poll responses:', error);
        res.status(500).send('Error exporting poll responses. Please try again.');
    }
});

// Export contacts as CSV
router.get('/export/contacts', (req, res) => {
    try {
        // Execute the export script
        execSync('node tools/export-data.js');
        
        // Find the most recent export file
        const exportsDir = path.join(__dirname, '..', 'exports');
        const files = fs.readdirSync(exportsDir)
            .filter(file => file.startsWith('contact_submissions_'))
            .sort()
            .reverse();
            
        if (files.length === 0) {
            throw new Error('No export files found');
        }
        
        // Send the file
        const filePath = path.join(exportsDir, files[0]);
        res.download(filePath);
    } catch (error) {
        console.error('Error exporting contacts:', error);
        res.status(500).send('Error exporting contacts. Please try again.');
    }
});

// Delete individual poll response
router.delete('/poll-responses/:responseId', async (req, res) => {
    try {
        const responseId = req.params.responseId;
        console.log(`Attempting to delete poll response with ID: ${responseId}`);
        
        // Check if the response exists
        const response = await Poll.getPollResponseById(responseId);
        
        if (!response) {
            console.log(`Poll response not found with ID: ${responseId}`);
            return res.status(404).json({ 
                success: false, 
                error: 'Poll response not found' 
            });
        }
        
        // Get the poll ID before deleting (we need this to clear localStorage in the client)
        const pollId = response.poll_id;
        console.log(`Found poll_id for response: ${pollId}`);
        
        // Delete the response
        const result = await Poll.deletePollResponse(responseId);
        
        if (!result) {
            console.log(`Failed to delete poll response with ID: ${responseId}`);
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to delete poll response' 
            });
        }
        
        console.log(`Successfully deleted poll response with ID: ${responseId}`);
        res.json({ 
            success: true, 
            message: 'Poll response deleted successfully',
            responseId,
            pollId  // Include the poll ID in the response
        });
    } catch (error) {
        console.error('Error deleting poll response:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to delete poll response: ' + error.message 
        });
    }
});

// Unified contacts endpoint - includes poll responses
router.get('/unified/contacts', async (req, res) => {
    try {
        const { status, search, sort, order, page, limit } = req.query;
        
        // Build filter object
        const filters = {};
        if (status) filters.status = status;
        if (search) filters.search = search;
        
        // Default sort to created_at if not specified
        const sortBy = sort || 'created_at';
        const sortOrder = order || 'DESC';
        const currentPage = parseInt(page) || 1;
        const contactsPerPage = parseInt(limit) || 20;
        
        // Get filtered contacts with pagination
        const result = await CRM.getFilteredContacts(
            filters,
            sortBy,
            sortOrder,
            currentPage,
            contactsPerPage
        );
        
        // Get poll responses for each contact
        const contacts = result.contacts;
        const contactsWithPolls = await Promise.all(contacts.map(async (contact) => {
            // Get poll responses for this contact
            const pollResponses = await CRM.getPollResponsesForContact(contact.id);
            
            // Format the contact object in a more friendly way for the client
            return {
                id: contact.id,
                firstName: contact.first_name,
                lastName: contact.last_name,
                email: contact.email,
                phone: contact.phone,
                major: contact.major,
                gradYear: contact.grad_year,
                careerGoals: contact.career_goals,
                timestamp: contact.created_at,
                userId: contact.user_id,
                status: contact.status || 'new',
                unique_id: contact.unique_id,
                ip_hash: contact.ip_hash,
                pollResponses
            };
        }));
        
        res.json({
            contacts: contactsWithPolls,
            totalCount: result.totalCount,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        });
    } catch (error) {
        console.error('Error getting unified contacts:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch contacts: ' + error.message
        });
    }
});

// Submit a poll response for a contact
router.post('/poll-responses', async (req, res) => {
    try {
        const { contactId, pollId, selectedOption } = req.body;
        
        if (!contactId || !pollId || !selectedOption) {
            return res.status(400).json({ 
                success: false, 
                error: 'Contact ID, poll ID, and selected option are required' 
            });
        }
        
        // Get the contact
        const contact = await Contact.getContactSubmissionById(contactId);
        if (!contact) {
            return res.status(404).json({ 
                success: false, 
                error: 'Contact not found' 
            });
        }
        
        // Submit the poll response
        const response = await Poll.savePollResponse(
            pollId, 
            contact.user_id || contact.unique_id, 
            [selectedOption],
            {
                slideId: null,
                userAgent: 'Admin UI',
                ipAddress: contact.ip_address,
                screenSize: null
            }
        );
        
        res.json({
            success: true,
            message: 'Poll response submitted successfully',
            response
        });
    } catch (error) {
        console.error('Error submitting poll response:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to submit poll response: ' + error.message 
        });
    }
});

// Export CRM data with all relationships
router.get('/export/crm', async (req, res) => {
    try {
        // Get all contacts with their related data
        const contacts = await Contact.getAllContactSubmissions();
        const pollResponses = await Poll.getAllResponses();
        const tags = await CRM.getAllTags();
        
        // Create a map of user_id to poll responses
        const userPollResponses = {};
        for (const response of pollResponses) {
            if (!response.user_id) continue;
            
            if (!userPollResponses[response.user_id]) {
                userPollResponses[response.user_id] = [];
            }
            
            userPollResponses[response.user_id].push(response);
        }
        
        // Create a complete CRM export with relationships
        const crmData = {
            contacts,
            pollResponses,
            tags,
            userPollResponses,
            exportDate: new Date().toISOString(),
            meta: {
                totalContacts: contacts.length,
                totalPollResponses: pollResponses.length,
                totalTags: tags.length
            }
        };
        
        // Save the data to a file
        const filename = `crm_export_${new Date().toISOString().slice(0,10)}.json`;
        const filePath = path.join(__dirname, '..', 'exports', filename);
        fs.writeFileSync(filePath, JSON.stringify(crmData, null, 2));
        
        // Send the file
        res.download(filePath);
    } catch (error) {
        console.error('Error exporting CRM data:', error);
        res.status(500).json({ success: false, error: 'Failed to export CRM data' });
    }
});

module.exports = router;