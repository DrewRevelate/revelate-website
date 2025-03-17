/**
 * Data Reset Utility for Full Throttle Revenue Presentation
 * 
 * This script resets all presentation data but creates a backup first.
 * Use with caution as it will delete all collected data.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Data file paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const POLL_DATA_FILE = path.join(DATA_DIR, 'poll_data.json');
const CONTACT_DATA_FILE = path.join(DATA_DIR, 'contact_submissions.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// First create a backup
console.log('Creating backup before reset...');
try {
    execSync('node tools/backup-data.js');
    console.log('Backup created successfully.');
} catch (error) {
    console.error('Error creating backup:', error.message);
    const proceed = askForConfirmation('Do you want to proceed with reset without a backup? (y/n): ');
    if (!proceed) {
        console.log('Reset canceled.');
        process.exit(0);
    }
}

// Reset poll data
console.log('Resetting poll data...');
const pollData = {
    polls: {
        // Slide 2 poll - what would you do with extra time
        "slide-2-default": {
            "prospecting": 0,
            "client-meetings": 0,
            "learning": 0,
            "planning": 0,
            "personal": 0
        },
        // Slide 5 poll - skills priority
        "slide-5-student-skills": {
            "technical": 0,
            "relationship": 0,
            "strategic": 0,
            "execution": 0
        }
    },
    responses: []
};

fs.writeFileSync(POLL_DATA_FILE, JSON.stringify(pollData, null, 2));

// Reset contact data
console.log('Resetting contact form submissions...');
const contactData = {
    submissions: []
};

fs.writeFileSync(CONTACT_DATA_FILE, JSON.stringify(contactData, null, 2));

console.log('Data reset complete. All poll and contact data has been reset to default values.');

// Helper function to ask for confirmation (simplified version)
function askForConfirmation(question) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise(resolve => {
        readline.question(question, answer => {
            readline.close();
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
    });
}