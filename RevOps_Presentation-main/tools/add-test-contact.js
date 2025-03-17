// tools/add-test-contact.js
// Adds a test contact directly to the database

const { Pool } = require('pg');
const Contact = require('../models/contact');

// Load environment variables
try {
    require('dotenv').config();
} catch (e) {
    console.log('dotenv not loaded, using process.env variables');
}

async function addTestContact() {
    console.log('Adding test contact submission...');

    try {
        // Create a sample contact
        const result = await Contact.saveContactSubmission({
            firstName: "Test",
            lastName: "Student",
            email: "test.student" + Date.now() + "@example.com",
            phone: "555-123-4567",
            major: "Business Administration",
            gradYear: "2026",
            careerGoals: "Interested in sales and RevOps positions",
            sessionId: "test-contact-" + Date.now(),
            userAgent: "Heroku Test Script",
            screen: "1920x1080"
        });

        console.log('Test contact added successfully!');
        console.log('Contact ID:', result.id);
        return result;
    } catch (error) {
        console.error('Error adding test contact:', error);
        throw error;
    }
}

// Check if running directly
if (require.main === module) {
    addTestContact()
        .then(result => {
            console.log('Test complete with result:', result);
            process.exit(0);
        })
        .catch(error => {
            console.error('Test failed:', error);
            process.exit(1);
        });
}

module.exports = { addTestContact };