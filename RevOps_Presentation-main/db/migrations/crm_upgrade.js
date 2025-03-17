// db/migrations/crm_upgrade.js
// Migration to enhance the database with CRM features and connect polls to contacts

const { db, runSqlScript } = require('../database');
const fs = require('fs');
const path = require('path');

// Check if we're running on Heroku
const isHeroku = process.env.DATABASE_URL ? true : false;

async function applyMigration() {
  console.log('Applying CRM upgrade migrations...');

  // For PostgreSQL, we need to check if columns exist before adding them
  if (isHeroku) {
    // PostgreSQL
    const client = await db.client.connect();
    try {
      await client.query('BEGIN');

      // Add column if not exists - helper function
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
          throw error;
        }
      };

      // Add columns to contact_submissions table
      await addColumnIfNotExists('contact_submissions', 'user_id', 'TEXT');
      await addColumnIfNotExists('contact_submissions', 'status', "TEXT DEFAULT 'new'");
      await addColumnIfNotExists('contact_submissions', 'lead_source', "TEXT DEFAULT 'presentation'");
      await addColumnIfNotExists('contact_submissions', 'lead_score', 'INTEGER DEFAULT 0');
      await addColumnIfNotExists('contact_submissions', 'notes', 'TEXT');
      await addColumnIfNotExists('contact_submissions', 'last_contacted_at', 'TIMESTAMP');
      await addColumnIfNotExists('contact_submissions', 'assigned_to', 'TEXT');

      // Create tables - these commands use IF NOT EXISTS already
      const tableSqlStatements = [
        // Create a tags table for contact categorization
        `CREATE TABLE IF NOT EXISTS contact_tags (
          id SERIAL PRIMARY KEY,
          tag_name TEXT NOT NULL UNIQUE
        );`,
        
        // Create a junction table for contact-tag many-to-many relationship
        `CREATE TABLE IF NOT EXISTS contact_tag_mapping (
          id SERIAL PRIMARY KEY,
          contact_id INTEGER NOT NULL,
          tag_id INTEGER NOT NULL,
          FOREIGN KEY (contact_id) REFERENCES contact_submissions(id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES contact_tags(id) ON DELETE CASCADE,
          UNIQUE(contact_id, tag_id)
        );`,
        
        // Create a contact_interactions table for tracking engagement
        `CREATE TABLE IF NOT EXISTS contact_interactions (
          id SERIAL PRIMARY KEY,
          contact_id INTEGER NOT NULL,
          interaction_type TEXT NOT NULL,
          description TEXT,
          metadata TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (contact_id) REFERENCES contact_submissions(id) ON DELETE CASCADE
        );`,
        
        // Create admin users table for authentication
        `CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          name TEXT,
          email TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
      ];

      // Execute table creation statements
      for (const statement of tableSqlStatements) {
        try {
          await client.query(statement);
          console.log(`Executed: ${statement.substring(0, 80)}...`);
        } catch (error) {
          console.error(`Error executing statement: ${statement.substring(0, 80)}...`);
          console.error(error);
          // Continue with next statement instead of failing
        }
      }

      // Add indexes - these commands use IF NOT EXISTS already
      const indexSqlStatements = [
        `CREATE INDEX IF NOT EXISTS idx_contact_submissions_user_id ON contact_submissions(user_id);`,
        `CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);`,
        `CREATE INDEX IF NOT EXISTS idx_contact_interactions_contact_id ON contact_interactions(contact_id);`,
        `CREATE INDEX IF NOT EXISTS idx_contact_tag_mapping_contact_id ON contact_tag_mapping(contact_id);`
      ];

      // Execute index creation statements
      for (const statement of indexSqlStatements) {
        try {
          await client.query(statement);
          console.log(`Executed: ${statement}`);
        } catch (error) {
          console.error(`Error executing statement: ${statement}`);
          console.error(error);
          // Continue with next statement instead of failing
        }
      }
      
      await client.query('COMMIT');
      console.log('PostgreSQL migration completed successfully');
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('Migration failed, rolled back:', e);
      throw e;
    } finally {
      client.release();
    }
  } else {
    // SQLite version - SQLite has better handling of IF NOT EXISTS
    try {
      // List of statements to execute
      const statements = [
        // Add user_id to contact_submissions to link with poll responses
        `ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS user_id TEXT;`,
        
        // Add lead status and tracking fields to contact_submissions
        `ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';`,
        `ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS lead_source TEXT DEFAULT 'presentation';`,
        `ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0;`,
        `ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS notes TEXT;`,
        `ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP;`,
        `ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS assigned_to TEXT;`,
        
        // Create a tags table for contact categorization
        `CREATE TABLE IF NOT EXISTS contact_tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tag_name TEXT NOT NULL UNIQUE
        );`,
        
        // Create a junction table for contact-tag many-to-many relationship
        `CREATE TABLE IF NOT EXISTS contact_tag_mapping (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          contact_id INTEGER NOT NULL,
          tag_id INTEGER NOT NULL,
          FOREIGN KEY (contact_id) REFERENCES contact_submissions(id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES contact_tags(id) ON DELETE CASCADE,
          UNIQUE(contact_id, tag_id)
        );`,
        
        // Create a contact_interactions table for tracking engagement
        `CREATE TABLE IF NOT EXISTS contact_interactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          contact_id INTEGER NOT NULL,
          interaction_type TEXT NOT NULL,
          description TEXT,
          metadata TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (contact_id) REFERENCES contact_submissions(id) ON DELETE CASCADE
        );`,
        
        // Create admin users table for authentication
        `CREATE TABLE IF NOT EXISTS admin_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          name TEXT,
          email TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
        
        // Add indexes for performance
        `CREATE INDEX IF NOT EXISTS idx_contact_submissions_user_id ON contact_submissions(user_id);`,
        `CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);`,
        `CREATE INDEX IF NOT EXISTS idx_contact_interactions_contact_id ON contact_interactions(contact_id);`,
        `CREATE INDEX IF NOT EXISTS idx_contact_tag_mapping_contact_id ON contact_tag_mapping(contact_id);`
      ];

      db.transaction(() => {
        for (const statement of statements) {
          try {
            db.prepare(statement).run();
            console.log(`Executed: ${statement.substring(0, 80)}...`);
          } catch (error) {
            console.error(`Error executing statement: ${statement.substring(0, 80)}...`);
            console.error(error);
            // In SQLite we continue to the next statement rather than failing completely
          }
        }
      })();
      console.log('SQLite migration completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  applyMigration().then(() => {
    console.log('CRM upgrade migration completed');
    process.exit(0);
  }).catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}

module.exports = {
  applyMigration
};