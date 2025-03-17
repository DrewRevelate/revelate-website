// tools/setup-database.js

/**
 * Database Setup Utility
 * 
 * This script initializes the database with the required schema and initial data.
 * Run this when setting up the presentation for the first time.
 */

const path = require('path');
const fs = require('fs');
const { db, runSqlScript } = require('../db/database');
const Poll = require('../models/poll');

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    bold: '\x1b[1m'
};

console.log(`${colors.blue}${colors.bold}Full Throttle Revenue - Database Setup Utility${colors.reset}\n`);

// Create database directories if they don't exist
const dirs = [
    path.join(__dirname, '..', 'data'),
    path.join(__dirname, '..', 'exports'),
    path.join(__dirname, '..', 'backups')
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`${colors.green}✓ Created directory: ${dir}${colors.reset}`);
    } else {
        console.log(`${colors.green}✓ Directory exists: ${dir}${colors.reset}`);
    }
});

// Check for schema file
const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
if (!fs.existsSync(schemaPath)) {
    console.log(`${colors.red}✗ Schema file not found at: ${schemaPath}${colors.reset}`);
    console.log(`${colors.yellow}Please check that the schema.sql file exists in the db directory.${colors.reset}`);
    process.exit(1);
}

// Create migrations table if it doesn't exist
try {
    const createMigrationsTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    createMigrationsTable.run();
    console.log(`${colors.green}✓ Migrations table created/verified${colors.reset}`);
} catch (error) {
    console.error(`${colors.red}Error creating migrations table: ${error.message}${colors.reset}`);
    process.exit(1);
}

// Run migrations
try {
    const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');
    if (fs.existsSync(migrationsDir)) {
        // Get list of migrations that have been run
        const getMigrationsRun = db.prepare('SELECT name FROM migrations');
        const migrationsRun = new Set(getMigrationsRun.all().map(m => m.name));
        
        // Get migration files
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Ensure migrations run in order
        
        if (migrationFiles.length === 0) {
            console.log(`${colors.yellow}No migration files found in: ${migrationsDir}${colors.reset}`);
        } else {
            console.log(`Found ${migrationFiles.length} migration files`);
            
            // Run migrations that haven't been run yet
            let migrationsApplied = 0;
            for (const migrationFile of migrationFiles) {
                if (!migrationsRun.has(migrationFile)) {
                    console.log(`${colors.blue}Running migration: ${migrationFile}${colors.reset}`);
                    
                    try {
                        // Begin transaction
                        db.exec('BEGIN TRANSACTION');
                        
                        // Run the migration script
                        runSqlScript(path.join(migrationsDir, migrationFile));
                        
                        // Record that the migration has been run
                        const insertMigration = db.prepare('INSERT INTO migrations (name) VALUES (?)');
                        insertMigration.run(migrationFile);
                        
                        // Commit the transaction
                        db.exec('COMMIT');
                        
                        migrationsApplied++;
                        console.log(`${colors.green}✓ Successfully ran migration: ${migrationFile}${colors.reset}`);
                    } catch (error) {
                        // Rollback on error
                        db.exec('ROLLBACK');
                        console.error(`${colors.red}Error running migration ${migrationFile}: ${error.message}${colors.reset}`);
                        process.exit(1);
                    }
                } else {
                    console.log(`Migration already applied: ${migrationFile}`);
                }
            }
            
            console.log(`${colors.green}✓ Applied ${migrationsApplied} new migrations${colors.reset}`);
        }
    } else {
        console.log(`${colors.yellow}Migrations directory not found: ${migrationsDir}${colors.reset}`);
    }
} catch (error) {
    console.error(`${colors.red}Error running migrations: ${error.message}${colors.reset}`);
}

// Ensure poll definitions exist
console.log("\nCreating/verifying poll definitions...");
try {
    // Create default polls if they don't exist
    Poll.ensurePollDefinitionExists('slide-2-default', 'Extra Time Usage', 'What would you do with 5 extra hours per week?', [
        { id: 'prospecting', text: 'More prospecting' },
        { id: 'client-meetings', text: 'Additional client meetings' },
        { id: 'learning', text: 'Learning new skills' },
        { id: 'planning', text: 'Strategic planning' },
        { id: 'personal', text: 'Personal time/life balance' }
    ]);
    
    Poll.ensurePollDefinitionExists('slide-5-student-skills', 'Skill Prioritization', 'For your first sales job, which skills would you prioritize developing?', [
        { id: 'technical', text: 'Technical skills (CRM, automation tools, data analysis)' },
        { id: 'relationship', text: 'Relationship-building skills (communication, empathy, trust)' },
        { id: 'strategic', text: 'Strategic skills (industry knowledge, competitive analysis)' },
        { id: 'execution', text: 'Execution skills (organization, time management, follow-through)' }
    ]);
    
    console.log(`${colors.green}✓ Poll definitions created/verified${colors.reset}`);
    
    // Verify the poll definitions
    const polls = Poll.getAllPollDefinitions();
    console.log(`Found ${polls.length} poll definitions:`);
    polls.forEach(poll => {
        const options = Poll.getPollOptions(poll.id);
        console.log(`  - ${poll.poll_id}: "${poll.title}" with ${options.length} options`);
    });
} catch (error) {
    console.error(`${colors.red}Error ensuring poll definitions: ${error.message}${colors.reset}`);
}

console.log(`\n${colors.blue}${colors.bold}Database Setup Complete${colors.reset}`);
console.log(`\nYou can now:
1. Start the server with: ${colors.green}npm start${colors.reset}
2. Access the presentation at: ${colors.green}http://localhost:3000${colors.reset}
3. Access the admin dashboard at: ${colors.green}http://localhost:3000/admin${colors.reset}`);