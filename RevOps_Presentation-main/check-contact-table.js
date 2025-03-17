// Save this as check-contact-table.js and run with: node check-contact-table.js

const { db } = require('./db/database');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    bold: '\x1b[1m'
};

console.log(`${colors.blue}${colors.bold}Checking Contact Submissions Table${colors.reset}\n`);

// Check if table exists
try {
    const tableCheck = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='contact_submissions'"
    ).get();
    
    if (tableCheck) {
        console.log(`${colors.green}✓ contact_submissions table exists${colors.reset}`);
        
        // Check table structure
        const columns = db.prepare("PRAGMA table_info(contact_submissions)").all();
        console.log(`\nTable has ${columns.length} columns:`);
        columns.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`);
        });
        
        // Check for data
        const count = db.prepare("SELECT COUNT(*) as count FROM contact_submissions").get();
        console.log(`\nFound ${count.count} contact submissions in the database`);
        
        if (count.count > 0) {
            // Get a sample submission
            const sample = db.prepare("SELECT * FROM contact_submissions LIMIT 1").get();
            console.log(`\n${colors.green}Sample submission:${colors.reset}`);
            console.log(JSON.stringify(sample, null, 2));
            
            // Test the transformation as it would happen in the route
            const transformed = {
                id: sample.id,
                firstName: sample.first_name,
                lastName: sample.last_name,
                email: sample.email,
                phone: sample.phone,
                major: sample.major,
                gradYear: sample.grad_year,
                careerGoals: sample.career_goals,
                timestamp: sample.created_at
            };
            
            console.log(`\n${colors.green}Transformed for admin dashboard:${colors.reset}`);
            console.log(JSON.stringify(transformed, null, 2));
            
            // Verify timestamps are in the right format
            console.log(`\nTimestamp format: ${sample.created_at}`);
            try {
                const date = new Date(sample.created_at);
                console.log(`Parses to: ${date.toLocaleString()}`);
            } catch (e) {
                console.log(`${colors.red}Error parsing timestamp: ${e.message}${colors.reset}`);
            }
        } else {
            console.log(`\n${colors.yellow}The table exists but has no data.${colors.reset}`);
            console.log("Let's insert a test submission to see if the admin dashboard can display it.");
            
            // Insert test data
            const insert = db.prepare(`
                INSERT INTO contact_submissions 
                (first_name, last_name, email, phone, major, grad_year, career_goals, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            const now = new Date().toISOString();
            const result = insert.run(
                "Test", "User", "test@example.com", "555-123-4567", 
                "Business", "2025", "RevOps Career", now
            );
            
            console.log(`${colors.green}✓ Inserted test submission with ID ${result.lastInsertRowid}${colors.reset}`);
            console.log("Now check the admin dashboard to see if it appears!");
        }
    } else {
        console.log(`${colors.red}✗ contact_submissions table does not exist${colors.reset}`);
        console.log(`\nThis could be caused by:`);
        console.log(`1. Migration files not being run`);
        console.log(`2. Database file being missing or corrupted`);
        console.log(`3. Table being named differently`);
        
        // Check all tables
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        console.log(`\nExisting tables in database:`);
        tables.forEach(table => {
            console.log(`  - ${table.name}`);
        });
    }
} catch (error) {
    console.error(`${colors.red}Error checking contact_submissions table: ${error.message}${colors.reset}`);
    console.error(error.stack);
}