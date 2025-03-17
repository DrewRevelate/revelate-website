/**
 * Poll Data Export Utility for Full Throttle Revenue Presentation
 * 
 * This script exports poll data to CSV files for analysis in spreadsheet software.
 */

const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');

// Data file paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const POLL_DATA_FILE = path.join(DATA_DIR, 'poll_data.json');
const EXPORT_DIR = path.join(__dirname, '..', 'exports');

// Create export directory if it doesn't exist
if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

// Current date for filename
const currentDate = new Date().toISOString().slice(0, 10);

try {
    // Read poll data
    if (!fs.existsSync(POLL_DATA_FILE)) {
        console.error('Poll data file not found. Run the presentation server first to collect data.');
        process.exit(1);
    }
    
    const pollData = JSON.parse(fs.readFileSync(POLL_DATA_FILE));
    
    // Export poll results summary
    console.log('Exporting poll results summary...');
    
    const resultsPath = path.join(EXPORT_DIR, `poll-results-${currentDate}.csv`);
    const resultsCsvWriter = createObjectCsvWriter({
        path: resultsPath,
        header: [
            { id: 'pollId', title: 'Poll ID' },
            { id: 'option', title: 'Option' },
            { id: 'votes', title: 'Votes' }
        ]
    });
    
    const resultsData = [];
    Object.entries(pollData.polls).forEach(([pollId, results]) => {
        Object.entries(results).forEach(([option, votes]) => {
            resultsData.push({
                pollId,
                option,
                votes
            });
        });
    });
    
    await resultsCsvWriter.writeRecords(resultsData);
    console.log(`Poll results exported to: ${resultsPath}`);
    
    // Export individual responses
    if (pollData.responses && pollData.responses.length > 0) {
        console.log('Exporting individual poll responses...');
        
        const responsesPath = path.join(EXPORT_DIR, `poll-responses-${currentDate}.csv`);
        const responsesCsvWriter = createObjectCsvWriter({
            path: responsesPath,
            header: [
                { id: 'timestamp', title: 'Timestamp' },
                { id: 'pollId', title: 'Poll ID' },
                { id: 'userId', title: 'User ID' },
                { id: 'votes', title: 'Votes' },
                { id: 'userAgent', title: 'User Agent' },
                { id: 'screen', title: 'Screen Size' }
            ]
        });
        
        const responsesData = pollData.responses.map(response => ({
            timestamp: response.timestamp,
            pollId: response.pollId,
            userId: response.userId,
            votes: Array.isArray(response.votes) ? response.votes.join(', ') : response.votes,
            userAgent: response.userAgent || '',
            screen: response.screen || ''
        }));
        
        await responsesCsvWriter.writeRecords(responsesData);
        console.log(`Poll responses exported to: ${responsesPath}`);
    } else {
        console.log('No individual poll responses found to export.');
    }
    
    console.log('Poll data export complete.');
    
} catch (error) {
    console.error('Error exporting poll data:', error);
    process.exit(1);
}