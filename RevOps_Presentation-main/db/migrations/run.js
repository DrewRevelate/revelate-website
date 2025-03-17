// db/migrations/run.js
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Get the migration file to run
const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error('Please specify a migration file to run');
  process.exit(1);
}

const filePath = path.resolve(__dirname, migrationFile);
if (!fs.existsSync(filePath)) {
  console.error(`Migration file not found: ${filePath}`);
  process.exit(1);
}

// Setup database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Heroku PostgreSQL
  }
});

async function runMigration() {
  let client;
  try {
    client = await pool.connect();
    console.log(`Running migration: ${migrationFile}`);
    
    // Read the migration file
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Execute the migration
    await client.query(sql);
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

runMigration();
