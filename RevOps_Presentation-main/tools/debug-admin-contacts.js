// tools/debug-admin-contacts.js
// Debug the admin contacts endpoint directly

const { Pool } = require('pg');
const Contact = require('../models/contact');

// Load environment variables
try {
    require('dotenv').config();
} catch (e) {
    console.log('dotenv not loaded, using process.env variables');
}

async function debugAdminContacts() {
    console.log('Debugging admin contacts endpoint...');
    
    try {
        // Step 1: Check if we're on Heroku
        console.log('Environment check:');
        console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
        
        // Step 2: Direct database query to count contacts
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        
        try {
            const client = await pool.connect();
            try {
                console.log('\nDirect database query:');
                const result = await client.query('SELECT COUNT(*) as count FROM contact_submissions');
                console.log('- Database shows contact count:', result.rows[0].count);
                
                if (parseInt(result.rows[0].count) > 0) {
                    const contactsResult = await client.query('SELECT * FROM contact_submissions LIMIT 10');
                    console.log('- First contact row:', contactsResult.rows[0]);
                }
            } finally {
                client.release();
            }
        } finally {
            await pool.end();
        }
        
        // Step 3: Try the model function
        console.log('\nTrying model function getAllContactSubmissions:');
        const submissions = await Contact.getAllContactSubmissions(100);
        console.log('- Model function returned submissions:', submissions);
        console.log('- Number of submissions:', submissions ? submissions.length : 0);
        
        if (submissions && submissions.length > 0) {
            console.log('- First submission:', submissions[0]);
        } else {
            console.log('- No submissions returned from model function');
        }
        
        console.log('\nDebug complete');
    } catch (error) {
        console.error('Error in debug process:', error);
    }
}

// Run if directly invoked
if (require.main === module) {
    debugAdminContacts()
        .then(() => console.log('Debug complete'))
        .catch(console.error);
}

module.exports = { debugAdminContacts };