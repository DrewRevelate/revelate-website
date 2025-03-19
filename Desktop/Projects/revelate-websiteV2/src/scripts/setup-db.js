/**
 * Database Setup Script for Revelate Operations
 * Run this script to initialize the database tables
 */

const db = require('../config/database');

async function setupDatabase() {
  console.log('Starting database setup...');
  
  try {
    // Initialize database tables
    const result = await db.initDb();
    
    if (result.success) {
      console.log('✅ Database setup completed successfully!');
      process.exit(0);
    } else {
      console.error('❌ Database setup failed:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error during database setup:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
