// tools/export-data.js

const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const { db } = require('../db/database');

// Ensure exports directory exists
const exportsDir = path.join(__dirname, '..', 'exports');
if (\!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
}

// Get current timestamp for the export filenames
const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');

// Export poll results
function exportPollResults() {
    const csvPath = path.join(exportsDir, `poll_results_${timestamp}.csv`);
    
    // Get poll definitions
    const polls = db.prepare('SELECT * FROM poll_definitions').all();
    
    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
        path: csvPath,
        header: [
            { id: 'poll_id', title: 'Poll ID' },
            { id: 'title', title: 'Poll Title' },
            { id: 'option_id', title: 'Option ID' },
            { id: 'option_text', title: 'Option Text' },
            { id: 'vote_count', title: 'Votes' }
        ]
    });
    
    // Get results for each poll
    const records = [];
    for (const poll of polls) {
        const stmt = db.prepare(`
            SELECT po.option_id, po.option_text, COUNT(pro.id) as vote_count
            FROM poll_options po
            LEFT JOIN poll_response_options pro ON po.id = pro.poll_option_id
            WHERE po.poll_definition_id = ?
            GROUP BY po.id
            ORDER BY po.display_order
        `);
        
        const results = stmt.all(poll.id);
        
        for (const result of results) {
            records.push({
                poll_id: poll.poll_id,
                title: poll.title,
                option_id: result.option_id,
                option_text: result.option_text,
                vote_count: result.vote_count
            });
        }
    }
    
    // Write CSV
    return csvWriter.writeRecords(records)
        .then(() => {
            console.log(`Poll results exported to ${csvPath}`);
            return csvPath;
        });
}

// Export contact submissions
function exportContactSubmissions() {
    const csvPath = path.join(exportsDir, `contact_submissions_${timestamp}.csv`);
    
    // Get contact submissions
    const submissions = db.prepare('SELECT * FROM contact_submissions').all();
    
    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
        path: csvPath,
        header: [
            { id: 'id', title: 'ID' },
            { id: 'first_name', title: 'First Name' },
            { id: 'last_name', title: 'Last Name' },
            { id: 'email', title: 'Email' },
            { id: 'phone', title: 'Phone' },
            { id: 'major', title: 'Major' },
            { id: 'grad_year', title: 'Graduation Year' },
            { id: 'career_goals', title: 'Career Goals' },
            { id: 'created_at', title: 'Timestamp' }
        ]
    });
    
    // Write CSV
    return csvWriter.writeRecords(submissions)
        .then(() => {
            console.log(`Contact submissions exported to ${csvPath}`);
            return csvPath;
        });
}

// Run exports
Promise.all([
    exportPollResults(),
    exportContactSubmissions()
])
.then(() => {
    console.log('All exports completed successfully');
})
.catch(error => {
    console.error('Error during export:', error);
    process.exit(1);
});
