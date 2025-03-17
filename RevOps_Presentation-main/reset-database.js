// reset-database.js - A simple script that directly resets the database
// Save this in your project root and run with: node reset-database.js

try {
    // Get direct database connection
    const sqlite3 = require('better-sqlite3');
    
    // Open database directly without using your wrapper
    const db = new sqlite3('./data/presentation.db');
    console.log('Connected to database directly');
    
    // Begin transaction for safety
    db.prepare('BEGIN TRANSACTION').run();
    
    try {
      // Delete all poll response data
      console.log('Clearing poll responses...');
      db.prepare('DELETE FROM poll_response_options').run();
      db.prepare('DELETE FROM poll_responses').run();
      
      // Delete all contact submissions
      console.log('Clearing contact submissions...');
      db.prepare('DELETE FROM contact_submissions').run();
      
      // Commit changes
      db.prepare('COMMIT').run();
      
      // Verify
      const pollResponseCount = db.prepare('SELECT COUNT(*) as count FROM poll_responses').get().count;
      const contactCount = db.prepare('SELECT COUNT(*) as count FROM contact_submissions').get().count;
      
      console.log(`Verification: ${pollResponseCount} poll responses, ${contactCount} contact submissions`);
      
      if (pollResponseCount === 0 && contactCount === 0) {
        console.log('SUCCESS: All data cleared');
      } else {
        console.log('WARNING: Some data remains. Check permissions and locks.');
      }
      
    } catch (error) {
      // Roll back if any errors
      db.prepare('ROLLBACK').run();
      throw error;
    } finally {
      // Close database connection
      db.close();
    }
    
  } catch (error) {
    console.error('ERROR:', error.message);
    console.error('Try stopping your server before running this script.');
  }