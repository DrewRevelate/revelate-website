// db/migrations/fix_heroku.js
// This script is intended to be run directly on Heroku to fix any database issues

const { Pool } = require('pg');

// Setup database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Heroku PostgreSQL
  }
});

async function fixDatabase() {
  let client;
  try {
    client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    
    // Check if table exists
    console.log('Checking if poll_definitions table exists...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'poll_definitions'
      );
    `);
    
    const tableExists = tableCheck.rows[0].exists;
    console.log(`poll_definitions table exists: ${tableExists}`);
    
    if (!tableExists) {
      console.log('Creating poll_definitions table...');
      await client.query(`
        CREATE TABLE poll_definitions (
          id SERIAL PRIMARY KEY,
          poll_id TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          is_active INTEGER DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('poll_definitions table created successfully');
    }
    
    // Check if is_active column exists
    console.log('Checking if is_active column exists in poll_definitions...');
    const columnCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'poll_definitions' AND column_name = 'is_active'
      );
    `);
    
    const columnExists = columnCheck.rows[0].exists;
    console.log(`is_active column exists: ${columnExists}`);
    
    if (!columnExists) {
      console.log('Adding is_active column to poll_definitions...');
      await client.query(`
        ALTER TABLE poll_definitions 
        ADD COLUMN is_active INTEGER DEFAULT 1;
      `);
      console.log('is_active column added successfully');
      
      console.log('Setting all existing polls to active...');
      await client.query(`
        UPDATE poll_definitions 
        SET is_active = 1;
      `);
      console.log('All polls set to active');
    } else {
      console.log('Ensuring is_active column is correctly formatted...');
      
      // Debug: Check what's in the is_active column
      const valueCheck = await client.query(`
        SELECT id, poll_id, is_active FROM poll_definitions;
      `);
      
      console.log('Current poll_definitions data:');
      valueCheck.rows.forEach(row => {
        console.log(`ID: ${row.id}, Poll ID: ${row.poll_id}, Is Active: ${row.is_active}, Type: ${typeof row.is_active}`);
      });
      
      // Fix column type
      console.log('Converting is_active to INTEGER type...');
      await client.query(`
        ALTER TABLE poll_definitions 
        ALTER COLUMN is_active TYPE INTEGER USING is_active::INTEGER;
      `);
      
      console.log('Setting NULL values to 1...');
      await client.query(`
        UPDATE poll_definitions 
        SET is_active = 1 
        WHERE is_active IS NULL;
      `);
      
      console.log('is_active column fixed');
    }
    
    // Finally, check if the actual poll IDs exist
    console.log('Checking if required polls exist...');
    const pollCheck = await client.query(`
      SELECT poll_id FROM poll_definitions 
      WHERE poll_id IN ('slide-2-default', 'slide-5-student-skills');
    `);
    
    const existingPolls = pollCheck.rows.map(row => row.poll_id);
    console.log(`Found polls: ${existingPolls.join(', ')}`);
    
    const requiredPolls = ['slide-2-default', 'slide-5-student-skills'];
    
    for (const pollId of requiredPolls) {
      if (!existingPolls.includes(pollId)) {
        console.log(`Creating missing poll: ${pollId}`);
        
        const title = pollId === 'slide-2-default' ? 'Time Management' : 'Sales Skills';
        const description = pollId === 'slide-2-default' ? 
          'What would you do with 5 extra hours per week?' : 
          'For your first sales role, which skills would you prioritize developing?';
        
        await client.query(`
          INSERT INTO poll_definitions (poll_id, title, description, is_active)
          VALUES ($1, $2, $3, 1);
        `, [pollId, title, description]);
        
        console.log(`Poll ${pollId} created successfully`);
      }
    }
    
    console.log('Database fix completed successfully');
  } catch (error) {
    console.error('Error fixing database:', error);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

fixDatabase();