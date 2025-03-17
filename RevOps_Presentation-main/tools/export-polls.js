/**
 * Contact Form Export Utility for Full Throttle Revenue Presentation
 * 
 * This script exports contact form submissions to a CSV file for follow-up.
 */

const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');

// Data file paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const CONTACT_DATA_FILE = path.join(DATA_DIR, 'contact_submissions.json');
const EXPORT_DIR = path.join(__dirname, '..', 'exports');

// Create export directory if it doesn't exist
if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

// Current date for filename
const currentDate = new Date().toISOString().slice(0, 10);

try {
    // Read contact data
    if (!fs.existsSync(CONTACT_DATA_FILE)) {
        console.error('Contact data file not found. Run the presentation server first to collect data.');
        process.exit(1);
    }
    
    const contactData = JSON.parse(fs.readFileSync(CONTACT_DATA_FILE));
    
    if (!contactData.submissions || contactData.submissions.length === 0) {
        console.log('No contact form submissions found to export.');
        process.exit(0);
    }
    
    console.log(`Found ${contactData.submissions.length} contact form submissions to export.`);
    
    // Define headers based on the first submission (assuming all have the same structure)
    const firstSubmission = contactData.submissions[0];
    const headers = Object.keys(firstSubmission).map(key => ({
        id: key,
        title: key.charAt(0).toUpperCase() + key.slice(1) // Capitalize first letter
    }));
    
    // Create CSV writer
    const outputPath = path.join(EXPORT_DIR, `contact-submissions-${currentDate}.csv`);
    const csvWriter = createObjectCsvWriter({
        path: outputPath,
        header: headers
    });
    
    // Write data to CSV
    await csvWriter.writeRecords(contactData.submissions);
    
    console.log(`Contact form submissions exported to: ${outputPath}`);
    
} catch (error) {
    console.error('Error exporting contact data:', error);
    process.exit(1);
}