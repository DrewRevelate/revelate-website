// db/migrations/unified_system.js
// Migration to unify the CRM and poll management systems

const { db, runSqlScript } = require('../database');
const fs = require('fs');
const path = require('path');

// Function to run the migration
async function runMigration() {
    try {
        console.log('Starting unified system migration...');
        
        // Determine if running on Heroku or locally
        const isHeroku = process.env.DATABASE_URL ? true : false;
        console.log(`Running in ${isHeroku ? 'Heroku/PostgreSQL' : 'Local/SQLite'} environment`);
        
        if (isHeroku) {
            // PostgreSQL version - use proper column checks
            const client = await db.client.connect();
            try {
                await client.query('BEGIN');
                
                // Helper function to add a column if it doesn't exist
                const addColumnIfNotExists = async (table, column, definition) => {
                    try {
                        const checkQuery = `
                            SELECT column_name 
                            FROM information_schema.columns 
                            WHERE table_name = '${table}' AND column_name = '${column}'
                        `;
                        const result = await client.query(checkQuery);
                        
                        if (result.rows.length === 0) {
                            // Column doesn't exist, add it
                            const alterQuery = `ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`;
                            await client.query(alterQuery);
                            console.log(`Added column ${column} to table ${table}`);
                        } else {
                            console.log(`Column ${column} already exists in table ${table}, skipping`);
                        }
                    } catch (error) {
                        console.error(`Error checking/adding column ${column} to table ${table}:`, error);
                        // Continue instead of failing
                    }
                };
                
                // Helper function to create index if it doesn't exist
                const createIndexIfNotExists = async (indexName, table, column) => {
                    try {
                        const checkQuery = `
                            SELECT indexname
                            FROM pg_indexes
                            WHERE indexname = '${indexName}'
                        `;
                        const result = await client.query(checkQuery);
                        
                        if (result.rows.length === 0) {
                            // Index doesn't exist, create it
                            const createQuery = `CREATE INDEX ${indexName} ON ${table}(${column})`;
                            await client.query(createQuery);
                            console.log(`Created index ${indexName} on ${table}(${column})`);
                        } else {
                            console.log(`Index ${indexName} already exists, skipping`);
                        }
                    } catch (error) {
                        console.error(`Error checking/creating index ${indexName}:`, error);
                        // Continue instead of failing
                    }
                };
                
                const createUniqueIndexIfNotExists = async (indexName, table, column) => {
                    try {
                        const checkQuery = `
                            SELECT indexname
                            FROM pg_indexes
                            WHERE indexname = '${indexName}'
                        `;
                        const result = await client.query(checkQuery);
                        
                        if (result.rows.length === 0) {
                            // Index doesn't exist, create it
                            const createQuery = `CREATE UNIQUE INDEX ${indexName} ON ${table}(${column})`;
                            await client.query(createQuery);
                            console.log(`Created unique index ${indexName} on ${table}(${column})`);
                        } else {
                            console.log(`Index ${indexName} already exists, skipping`);
                        }
                    } catch (error) {
                        console.error(`Error checking/creating unique index ${indexName}:`, error);
                        // Continue instead of failing
                    }
                };
                
                // Add columns to contact_submissions table
                await addColumnIfNotExists('contact_submissions', 'unique_id', 'TEXT');
                await addColumnIfNotExists('contact_submissions', 'ip_hash', 'TEXT');
                
                // Add columns to poll_responses table
                await addColumnIfNotExists('poll_responses', 'unique_id', 'TEXT');
                await addColumnIfNotExists('poll_responses', 'ip_hash', 'TEXT');
                await addColumnIfNotExists('poll_responses', 'contact_unique_id', 'TEXT');
                
                // Create indexes
                await createUniqueIndexIfNotExists('idx_contact_unique_id', 'contact_submissions', 'unique_id');
                await createUniqueIndexIfNotExists('idx_poll_unique_id', 'poll_responses', 'unique_id');
                await createIndexIfNotExists('idx_contact_ip_hash', 'contact_submissions', 'ip_hash');
                await createIndexIfNotExists('idx_poll_ip_hash', 'poll_responses', 'ip_hash');
                await createIndexIfNotExists('idx_poll_contact_unique_id', 'poll_responses', 'contact_unique_id');
                
                await client.query('COMMIT');
                console.log('PostgreSQL migration completed successfully');
            } catch (error) {
                await client.query('ROLLBACK');
                console.error('Error during PostgreSQL migration:', error);
                throw error;
            } finally {
                client.release();
            }
        } else {
            // SQLite version - SQLite supports "ADD COLUMN IF NOT EXISTS" in newer versions
            try {
                // SQLite Migration script - use try/catch for each statement
                const statements = [
                    // Add unique_id field to contact_submissions table
                    `ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS unique_id TEXT;`,
                    
                    // Add unique_id field to poll_responses table
                    `ALTER TABLE poll_responses ADD COLUMN IF NOT EXISTS unique_id TEXT;`,
                    
                    // Add ip_hash field to both tables for checking unique users
                    `ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS ip_hash TEXT;`,
                    `ALTER TABLE poll_responses ADD COLUMN IF NOT EXISTS ip_hash TEXT;`,
                    
                    // Add contact_unique_id field to poll_responses to link them
                    `ALTER TABLE poll_responses ADD COLUMN IF NOT EXISTS contact_unique_id TEXT;`,
                    
                    // Create indexes - these use IF NOT EXISTS
                    `CREATE UNIQUE INDEX IF NOT EXISTS idx_contact_unique_id ON contact_submissions(unique_id);`,
                    `CREATE UNIQUE INDEX IF NOT EXISTS idx_poll_unique_id ON poll_responses(unique_id);`,
                    `CREATE INDEX IF NOT EXISTS idx_contact_ip_hash ON contact_submissions(ip_hash);`,
                    `CREATE INDEX IF NOT EXISTS idx_poll_ip_hash ON poll_responses(ip_hash);`,
                    `CREATE INDEX IF NOT EXISTS idx_poll_contact_unique_id ON poll_responses(contact_unique_id);`
                ];
                
                db.transaction(() => {
                    for (const statement of statements) {
                        try {
                            db.prepare(statement).run();
                            console.log(`Executed: ${statement}`);
                        } catch (error) {
                            console.error(`Error executing statement: ${statement}`);
                            console.error(error);
                            // Continue with next statement instead of failing
                        }
                    }
                })();
                
                console.log('SQLite migration completed successfully');
            } catch (sqliteError) {
                console.error('SQLite migration error:', sqliteError);
                
                // Fallback to old method for older SQLite versions
                try {
                    console.log('Trying fallback migration method for SQLite...');
                    
                    const sqliteMigration = `
                    -- Add unique_id field to contact_submissions table
                    ALTER TABLE contact_submissions ADD COLUMN unique_id TEXT;
                    CREATE UNIQUE INDEX IF NOT EXISTS idx_contact_unique_id ON contact_submissions(unique_id);
                    
                    -- Add unique_id field to poll_responses table
                    ALTER TABLE poll_responses ADD COLUMN unique_id TEXT;
                    CREATE UNIQUE INDEX IF NOT EXISTS idx_poll_unique_id ON poll_responses(unique_id);
                    
                    -- Add ip_hash field to both tables for checking unique users
                    ALTER TABLE contact_submissions ADD COLUMN ip_hash TEXT;
                    ALTER TABLE poll_responses ADD COLUMN ip_hash TEXT;
                    CREATE INDEX IF NOT EXISTS idx_contact_ip_hash ON contact_submissions(ip_hash);
                    CREATE INDEX IF NOT EXISTS idx_poll_ip_hash ON poll_responses(ip_hash);
                    
                    -- Add contact_unique_id field to poll_responses to link them
                    ALTER TABLE poll_responses ADD COLUMN contact_unique_id TEXT;
                    CREATE INDEX IF NOT EXISTS idx_poll_contact_unique_id ON poll_responses(contact_unique_id);
                    `;
                    
                    // Create temporary migration file
                    const tempFilePath = path.join(__dirname, 'temp_migration.sql');
                    fs.writeFileSync(tempFilePath, sqliteMigration);
                    
                    // Run the migration script
                    await runSqlScript(tempFilePath);
                    
                    // Clean up temporary file
                    fs.unlinkSync(tempFilePath);
                    
                    console.log('SQLite fallback migration completed successfully');
                } catch (error) {
                    console.error('Error during fallback migration:', error);
                    throw error;
                }
            }
        }
        
        console.log('Unified system migration completed successfully');
        
        if (process.exitCode === undefined) {
            process.exit(0);
        }
    } catch (error) {
        console.error('Error during migration:', error);
        
        if (process.exitCode === undefined) {
            process.exit(1);
        } else {
            throw error;
        }
    }
}

// If running this file directly, execute the migration
if (require.main === module) {
    runMigration();
}

module.exports = {
    runMigration
};