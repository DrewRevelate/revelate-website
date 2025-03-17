// tools/backup-data.js

const fs = require('fs');
const path = require('path');
const { db } = require('../db/database');

// Ensure backups directory exists
const backupsDir = path.join(__dirname, '..', 'backups');
if (\!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
}

// Get current timestamp for the backup filename
const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
const backupFilename = `backup_${timestamp}.json`;
const backupPath = path.join(backupsDir, backupFilename);

// Function to get all data from the database
function getAllData() {
    const data = {
        poll_definitions: [],
        poll_options: [],
        poll_responses: [],
        poll_response_options: [],
        contact_submissions: []
    };
    
    // Get poll definitions
    const pollDefinitions = db.prepare('SELECT * FROM poll_definitions').all();
    data.poll_definitions = pollDefinitions;
    
    // Get poll options
    const pollOptions = db.prepare('SELECT * FROM poll_options').all();
    data.poll_options = pollOptions;
    
    // Get poll responses
    const pollResponses = db.prepare('SELECT * FROM poll_responses').all();
    data.poll_responses = pollResponses;
    
    // Get poll response options
    const pollResponseOptions = db.prepare('SELECT * FROM poll_response_options').all();
    data.poll_response_options = pollResponseOptions;
    
    // Get contact submissions
    const contactSubmissions = db.prepare('SELECT * FROM contact_submissions').all();
    data.contact_submissions = contactSubmissions;
    
    return data;
}

// Create the backup
try {
    const allData = getAllData();
    fs.writeFileSync(backupPath, JSON.stringify(allData, null, 2));
    console.log(`Backup created: ${backupPath}`);
} catch (error) {
    console.error('Error creating backup:', error);
    process.exit(1);
}
