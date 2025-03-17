// db/migrations/schema.js
// Initializes the database schema for both SQLite and PostgreSQL

const { db, runSqlScript } = require('../database');
const fs = require('fs');
const path = require('path');

// Check if we're running on Heroku
const isHeroku = process.env.DATABASE_URL ? true : false;

async function applySchema() {
  console.log('Applying database schema...');
  
  try {
    // Get the schema file path
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error(`Schema file not found: ${schemaPath}`);
      process.exit(1);
    }
    
    // Read the schema file
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    if (isHeroku) {
      // Convert SQLite schema to PostgreSQL
      console.log('Converting schema for PostgreSQL and applying to Heroku database...');
      
      const pgSchemaSQL = schemaSQL
        .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY')
        .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/g, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      
      // Create a temporary file with the PostgreSQL schema
      const tempFilePath = path.join(__dirname, 'temp_pg_schema.sql');
      fs.writeFileSync(tempFilePath, pgSchemaSQL);
      
      // Run the schema script
      await runSqlScript(tempFilePath);
      
      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);
    } else {
      // SQLite - use the existing schema file
      console.log('Applying schema to SQLite database...');
      await runSqlScript(schemaPath);
    }
    
    console.log('Schema applied successfully');
    return true;
  } catch (error) {
    console.error('Error applying schema:', error);
    return false;
  }
}

// Run the schema application if this file is executed directly
if (require.main === module) {
  applySchema().then(success => {
    if (success) {
      console.log('Database schema initialization completed');
      process.exit(0);
    } else {
      console.error('Database schema initialization failed');
      process.exit(1);
    }
  }).catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });
}

module.exports = {
  applySchema
};