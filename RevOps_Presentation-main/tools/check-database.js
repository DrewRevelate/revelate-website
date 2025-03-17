// tools/check-database.js

/**
 * Database Check Utility
 * 
 * This script verifies the database setup and reports any issues.
 * Run this if you're having database problems.
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { db, runSqlScript } = require('../db/database');

// Load environment variables if available
try {
  require('dotenv').config();
} catch (e) {
  console.log('dotenv not loaded, using process.env variables');
}

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    bold: '\x1b[1m'
};

console.log(`${colors.blue}${colors.bold}Full Throttle Revenue - Database Check Utility${colors.reset}\n`);

// Determine if we're running on Heroku or locally
const isHeroku = process.env.DATABASE_URL ? true : false;

// Check Heroku PostgreSQL database
async function checkHerokuDatabase() {
    console.log(`${colors.blue}${colors.bold}Checking Heroku PostgreSQL Database${colors.reset}\n`);
    
    // Create PostgreSQL client
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    
    try {
        const client = await pool.connect();
        console.log(`${colors.green}✓ Successfully connected to PostgreSQL${colors.reset}`);
        
        try {
            // Check tables
            const tablesQuery = `
                SELECT tablename FROM pg_catalog.pg_tables 
                WHERE schemaname = 'public'
            `;
            const tablesResult = await client.query(tablesQuery);
            
            console.log('\nChecking database tables...');
            
            if (tablesResult.rows.length === 0) {
                console.log(`${colors.red}✗ No tables found in database${colors.reset}`);
                
                // Try initializing schema
                console.log(`${colors.yellow}Attempting to initialize schema...${colors.reset}`);
                const schemaPath = path.join(__dirname, '..', 'db', 'schema-pg.sql');
                
                if (fs.existsSync(schemaPath)) {
                    try {
                        await runSqlScript(schemaPath);
                        console.log(`${colors.green}✓ Schema initialized${colors.reset}`);
                    } catch (schemaError) {
                        console.error(`${colors.red}Error initializing schema: ${schemaError.message}${colors.reset}`);
                    }
                }
            } else {
                console.log(`${colors.green}✓ Found ${tablesResult.rows.length} tables${colors.reset}`);
                
                for (const row of tablesResult.rows) {
                    const tableName = row.tablename;
                    console.log(`${colors.green}✓ Table '${tableName}' exists${colors.reset}`);
                    
                    // Get row count
                    const countResult = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
                    const count = parseInt(countResult.rows[0].count);
                    console.log(`  - Contains ${count} rows`);
                    
                    // Show sample data for certain tables
                    if (tableName === 'poll_definitions' && count > 0) {
                        const pollsResult = await client.query('SELECT poll_id, title FROM poll_definitions LIMIT 2');
                        console.log(`  - Example polls: ${pollsResult.rows.map(p => `${p.poll_id} (${p.title})`).join(', ')}`);
                    }
                    
                    if (tableName === 'poll_options' && count > 0) {
                        const optionsResult = await client.query('SELECT option_id, option_text FROM poll_options LIMIT 3');
                        if (optionsResult.rows.length > 0) {
                            console.log(`  - Example options: ${optionsResult.rows.map(o => o.option_id).join(', ')}`);
                        }
                    }
                    
                    if (tableName === 'contact_submissions' && count > 0) {
                        const contactsResult = await client.query('SELECT id, first_name, last_name, email FROM contact_submissions LIMIT 2');
                        if (contactsResult.rows.length > 0) {
                            console.log(`  - Example contacts: ${contactsResult.rows.map(c => `${c.first_name} ${c.last_name} (${c.email})`).join(', ')}`);
                        }
                    }
                }
            }
            
            // Report status
            console.log(`\n${colors.blue}${colors.bold}Heroku Database Check Summary:${colors.reset}`);
            console.log(`${colors.green}✓ PostgreSQL connection successful${colors.reset}`);
            console.log(`${colors.green}✓ Database URL is configured${colors.reset}`);
            
            // If we got this far without errors, the database is working
            console.log(`${colors.green}✓ Database appears to be working correctly${colors.reset}`);
            
        } finally {
            client.release();
        }
    } catch (error) {
        console.error(`\n${colors.red}Error connecting to PostgreSQL: ${error.message}${colors.reset}`);
        console.error(`${colors.red}Stack trace: ${error.stack}${colors.reset}`);
        
        console.log(`\n${colors.yellow}Troubleshooting suggestions:${colors.reset}`);
        console.log('1. Check if the DATABASE_URL environment variable is set correctly');
        console.log('2. Verify that the PostgreSQL addon is provisioned on Heroku');
        console.log('3. Check if your IP is allowed to connect to the Heroku PostgreSQL instance');
        console.log('4. Ensure the pg npm package is installed: npm install pg');
    } finally {
        await pool.end();
    }
}

// Check SQLite database (for local development)
function checkSqliteDatabase() {
    console.log(`${colors.blue}${colors.bold}Checking SQLite Database${colors.reset}\n`);
    
    // Check database file exists
    const dbPath = path.join(__dirname, '..', 'data', 'presentation.db');
    console.log(`Checking database file: ${dbPath}`);
    
    if (fs.existsSync(dbPath)) {
        console.log(`${colors.green}✓ Database file exists${colors.reset}`);
        
        // Check file size to ensure it's not empty
        const stats = fs.statSync(dbPath);
        if (stats.size > 0) {
            console.log(`${colors.green}✓ Database file size: ${(stats.size / 1024).toFixed(2)} KB${colors.reset}`);
        } else {
            console.log(`${colors.red}✗ Database file is empty (0 bytes)${colors.reset}`);
        }
    } else {
        console.log(`${colors.red}✗ Database file does not exist${colors.reset}`);
    }
    
    // Check database tables
    console.log('\nChecking database tables...');
    
    try {
        // Check if tables exist
        const tables = [
            'poll_definitions',
            'poll_options',
            'poll_responses',
            'poll_response_options',
            'contact_submissions'
        ];
        
        for (const table of tables) {
            const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`);
            const result = stmt.get(table);
            
            if (result) {
                console.log(`${colors.green}✓ Table '${table}' exists${colors.reset}`);
                
                // Check row count
                const countStmt = db.prepare(`SELECT COUNT(*) as count FROM ${table}`);
                const { count } = countStmt.get();
                console.log(`  - Contains ${count} rows`);
            } else {
                console.log(`${colors.red}✗ Table '${table}' does not exist${colors.reset}`);
            }
        }
        
        // Report overall status
        console.log(`\n${colors.blue}${colors.bold}SQLite Database Check Summary:${colors.reset}`);
        console.log(`${colors.green}✓ Database appears to be working correctly${colors.reset}`);
        
    } catch (error) {
        console.error(`\n${colors.red}Error testing database: ${error.message}${colors.reset}`);
        console.error(`${colors.red}Stack trace: ${error.stack}${colors.reset}`);
    }
}

// Run the appropriate check based on environment
if (isHeroku) {
    checkHerokuDatabase().catch(console.error);
} else {
    checkSqliteDatabase();
}