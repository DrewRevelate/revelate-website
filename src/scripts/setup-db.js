/**
 * Database Setup Script for Revelate Website
 * Run with: npm run setup-db
 */

const db = require('../config/database');

async function setupDatabase() {
  console.log('Starting database setup...');
  
  try {
    // Initialize the database structure
    const result = await db.initDb();
    
    if (result.success) {
      console.log('Database setup completed successfully!');
    } else {
      console.error('Database setup failed:', result.error);
      process.exit(1);
    }
    
    // Exit the script
    process.exit(0);
  } catch (error) {
    console.error('Error during database setup:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();