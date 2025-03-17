// db/seed.js
// Seeds the database with initial poll data and test contacts

const Poll = require('../models/poll');
const Contact = require('../models/contact');
const { db } = require('./database');

// Function to run the seed directly
async function runSeed() {
    await seedAll();
    console.log('Database seeded successfully');
    process.exit(0);
}

// If this file is run directly (not imported), run the seed
if (require.main === module) {
    runSeed().catch(err => {
        console.error('Error seeding database:', err);
        process.exit(1);
    });
}

async function seedPolls() {
    console.log('Seeding polls...');
    
    try {
        // Poll 1: Revenue Acceleration (slide-2) - "What would you do with 5 extra hours per week?"
        await Poll.ensurePollDefinitionExists(
            'slide-2-default',
            'Time Management',
            'What would you do with 5 extra hours per week?',
            [
                { id: 'prospecting', text: 'More prospecting' },
                { id: 'client-meetings', text: 'Additional client meetings' },
                { id: 'learning', text: 'Learning new skills' },
                { id: 'planning', text: 'Strategic planning' },
                { id: 'personal', text: 'Personal time' }
            ]
        );
        
        // Poll 2: Human vs Automation (slide-5) - "Skills to prioritize"
        await Poll.ensurePollDefinitionExists(
            'slide-5-student-skills',
            'Sales Skills',
            'For your first sales role, which skills would you prioritize developing?',
            [
                { id: 'technical', text: 'Technical skills' },
                { id: 'relationship', text: 'Relationship-building skills' },
                { id: 'strategic', text: 'Strategic skills' },
                { id: 'execution', text: 'Execution skills' }
            ]
        );
        
        console.log('Seed polls created successfully');
    } catch (error) {
        console.error('Error seeding polls:', error);
        throw error;
    }
}

// Add a sample contact submission for testing
async function seedContacts() {
    console.log('Seeding sample contacts...');
    
    try {
        // Check if we already have contacts
        const contacts = await Contact.getAllContactSubmissions(1);
        if (contacts && contacts.length > 0) {
            console.log('Contacts already exist, skipping seed');
            return;
        }
        
        // Add a sample contact
        await Contact.saveContactSubmission({
            firstName: "Test",
            lastName: "Student",
            email: "test.student@example.com",
            phone: "555-123-4567",
            major: "Business Administration",
            gradYear: "2026",
            careerGoals: "Interested in sales and RevOps positions",
            sessionId: "seed-contact-" + Date.now(),
            userAgent: "Seed Script",
            screen: "1920x1080"
        });
        
        console.log('Sample contact added successfully');
    } catch (error) {
        console.error('Error seeding contacts:', error);
        throw error;
    }
}

// Add sample poll responses
async function seedPollResponses() {
    console.log('Seeding sample poll responses...');
    
    try {
        // Poll 1: Time Management (slide 2)
        await Poll.savePollResponse(
            'slide-2-default',
            'seed-user-1',
            ['prospecting', 'client-meetings'],
            { slideId: 'slide-2' }
        );
        
        await Poll.savePollResponse(
            'slide-2-default',
            'seed-user-2',
            ['learning'],
            { slideId: 'slide-2' }
        );
        
        // Poll 2: Sales Skills (slide 5)
        await Poll.savePollResponse(
            'slide-5-student-skills',
            'seed-user-1',
            ['technical', 'relationship'],
            { slideId: 'slide-5' }
        );
        
        await Poll.savePollResponse(
            'slide-5-student-skills',
            'seed-user-2',
            ['strategic'],
            { slideId: 'slide-5' }
        );
        
        console.log('Sample poll responses added successfully');
    } catch (error) {
        console.error('Error seeding poll responses:', error);
        throw error;
    }
}

// Run all seed functions
async function seedAll() {
    try {
        await seedPolls();
        await seedContacts();
        await seedPollResponses();
        console.log('All seed data added successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
        throw error;
    }
}

module.exports = {
    seedPolls,
    seedContacts,
    seedPollResponses,
    seedAll
};