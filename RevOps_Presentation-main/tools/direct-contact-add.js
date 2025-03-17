// tools/direct-contact-add.js
// Adds a contact directly using PostgreSQL client

const { Pool } = require('pg');

// Load environment variables
try {
    require('dotenv').config();
} catch (e) {
    console.log('dotenv not loaded, using process.env variables');
}

async function addDirectContact() {
    if (!process.env.DATABASE_URL) {
        console.log('Not running on Heroku, skipping direct contact add');
        return;
    }

    console.log('Adding contact directly via PostgreSQL...');
    
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    
    try {
        const client = await pool.connect();
        
        try {
            // Add a test contact using direct SQL
            const now = new Date().toISOString();
            const email = `test.direct.${Date.now()}@example.com`;
            
            const result = await client.query(`
                INSERT INTO contact_submissions 
                (first_name, last_name, email, phone, major, grad_year, career_goals, 
                session_id, user_agent, ip_address, screen_size, created_at) 
                VALUES 
                ('Direct', 'Test', $1, '555-555-5555', 'Business', '2026', 'RevOps Careers',
                'direct-test', 'Direct Test', '127.0.0.1', '1920x1080', NOW())
                RETURNING id
            `, [email]);
            
            if (result.rows && result.rows.length > 0) {
                console.log('Contact added successfully with ID:', result.rows[0].id);
            } else {
                console.log('Contact added but no ID returned');
            }
            
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error adding contact directly:', error);
    } finally {
        await pool.end();
    }
}

// Run if directly executed
if (require.main === module) {
    addDirectContact()
        .then(() => console.log('Done'))
        .catch(console.error);
}

module.exports = { addDirectContact };