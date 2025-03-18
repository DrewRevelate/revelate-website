/**
 * Revelate Operations - Database Configuration
 * Centralized database connection management
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get the database URL (Heroku might set it as DATABASE_URL or HEROKU_POSTGRESQL_*_URL)
const dbUrl = process.env.DATABASE_URL || process.env.HEROKU_POSTGRESQL_ROSE_URL;

// Create a connection pool
const pool = new Pool({
  connectionString: dbUrl,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // Required for Heroku PostgreSQL
  } : false
});

// Helper for executing queries
const query = async (text, params) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

module.exports = {
  query,
  pool,
  
  // Database initialization function
  async initDb() {
    try {
      // Create contacts table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          company VARCHAR(255),
          interest VARCHAR(50),
          message TEXT,
          created_at TIMESTAMP NOT NULL
        )
      `);
      
      console.log('Database tables created successfully');
      return { success: true };
    } catch (error) {
      console.error('Error initializing database:', error);
      return { success: false, error };
    }
  }
};
