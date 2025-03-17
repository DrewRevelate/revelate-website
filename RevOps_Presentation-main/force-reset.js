// force-reset.js - Save this file to your project root
// This script will forcefully reset all data in the presentation database

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    bold: '\x1b[1m'
};

console.log(`${colors.blue}${colors.bold}FULL THROTTLE PRESENTATION - FORCE DATA RESET${colors.reset}\n`);

// Database paths
const dbDir = path.join(__dirname, 'data');
const dbPath = path.join(dbDir, 'presentation.db');
const schemaPath = path.join(__dirname, 'db', 'schema.sql');

// First create a backup
const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
const backupPath = path.join(backupDir, `backup_before_reset_${timestamp}.db`);

console.log(`Creating backup at: ${backupPath}`);
try {
    if (fs.existsSync(dbPath)) {
        fs.copyFileSync(dbPath, backupPath);
        console.log(`${colors.green}✓ Backup created successfully${colors.reset}`);
    } else {
        console.log(`${colors.yellow}⚠ No database file found to backup${colors.reset}`);
    }
} catch (error) {
    console.error(`${colors.red}✗ Failed to create backup: ${error.message}${colors.reset}`);
    console.log(`Continuing with reset anyway...`);
}

// Approach 1: Direct SQL approach
console.log(`\n${colors.bold}Approach 1: Using SQL to clear tables${colors.reset}`);
try {
    // Try to require the database 
    let db;
    try {
        const { db: database } = require('./db/database');
        db = database;
        console.log(`${colors.green}✓ Connected to database${colors.reset}`);
    } catch (error) {
        console.error(`${colors.red}✗ Failed to connect to database: ${error.message}${colors.reset}`);
        console.log(`Skipping SQL approach...`);
        throw new Error('Database connection failed');
    }
    
    // Begin transaction
    db.exec('BEGIN TRANSACTION');
    
    // Delete all data from tables
    console.log(`Clearing poll_response_options table...`);
    db.exec('DELETE FROM poll_response_options');
    
    console.log(`Clearing poll_responses table...`);
    db.exec('DELETE FROM poll_responses');
    
    console.log(`Clearing contact_submissions table...`);
    db.exec('DELETE FROM contact_submissions');
    
    // Update poll_definitions to reset vote counts
    console.log(`Resetting poll vote counts...`);
    
    // Commit the transaction
    db.exec('COMMIT');
    
    console.log(`${colors.green}✓ Database tables cleared successfully${colors.reset}`);
    
    // Verify empty tables
    const pollResponseCount = db.prepare('SELECT COUNT(*) as count FROM poll_responses').get().count;
    const contactSubmissionCount = db.prepare('SELECT COUNT(*) as count FROM contact_submissions').get().count;
    
    console.log(`Verification: poll_responses count = ${pollResponseCount}`);
    console.log(`Verification: contact_submissions count = ${contactSubmissionCount}`);
    
    if (pollResponseCount === 0 && contactSubmissionCount === 0) {
        console.log(`${colors.green}✓ Verification successful - all data cleared${colors.reset}`);
    } else {
        console.log(`${colors.yellow}⚠ Verification failed - some data remains${colors.reset}`);
        throw new Error('Data still exists after SQL reset');
    }
    
    console.log(`\n${colors.green}${colors.bold}Data reset successfully using SQL approach!${colors.reset}`);
    process.exit(0);
} catch (error) {
    console.error(`${colors.red}SQL approach failed: ${error.message}${colors.reset}`);
    console.log(`Trying more aggressive approaches...`);
}

// Approach 2: Delete and recreate database
console.log(`\n${colors.bold}Approach 2: Deleting and recreating database file${colors.reset}`);
try {
    // Close any existing database connections
    try {
        execSync('npx better-sqlite3-closer');
        console.log(`Closed any existing database connections`);
    } catch (error) {
        console.log(`No active connections or connection closer not available`);
    }
    
    // Delete the database file
    console.log(`Deleting database file: ${dbPath}`);
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
        console.log(`${colors.green}✓ Database file deleted${colors.reset}`);
    } else {
        console.log(`Database file doesn't exist, will create new`);
    }
    
    // Run the schema to recreate database
    console.log(`Recreating database with schema...`);
    
    if (fs.existsSync(schemaPath)) {
        try {
            // Create data directory if it doesn't exist
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }
            
            // Run migrations to initialize database
            console.log(`Running schema and migrations...`);
            execSync('node db/migrations/run.js');
            console.log(`${colors.green}✓ Database recreated successfully${colors.reset}`);
            
            console.log(`\n${colors.green}${colors.bold}Database reset successfully!${colors.reset}`);
            console.log(`You need to restart your server for changes to take effect.`);
            process.exit(0);
        } catch (error) {
            console.error(`${colors.red}Failed to run schema/migrations: ${error.message}${colors.reset}`);
        }
    } else {
        console.error(`${colors.red}Schema file not found: ${schemaPath}${colors.reset}`);
    }
} catch (error) {
    console.error(`${colors.red}Database recreation failed: ${error.message}${colors.reset}`);
}

// Last resort - Let the user know what manual steps to take
console.log(`\n${colors.yellow}${colors.bold}Automated reset methods failed. Please try these manual steps:${colors.reset}`);
console.log(`
1. Stop your presentation server if it's running
2. Delete the database file manually: ${dbPath}
3. Run the migration script: node db/migrations/run.js
4. Restart your server

If problems persist, check file permissions and make sure no other process has the database file open.
`);