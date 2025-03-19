/**
 * Revelate Operations - Enhanced Database Configuration
 * Optimized database connection management for performance and reliability
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get the database URL (Heroku might set it as DATABASE_URL or HEROKU_POSTGRESQL_*_URL)
const dbUrl = process.env.DATABASE_URL || process.env.HEROKU_POSTGRESQL_ROSE_URL;

// Create an optimized connection pool
const pool = new Pool({
  connectionString: dbUrl,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // Required for Heroku PostgreSQL
  } : false,
  max: process.env.NODE_ENV === 'production' ? 20 : 10, // Max connections based on environment
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection not established
});

// Enhanced query helper with better error handling and performance tracking
const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const start = Date.now();
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    
    // Log query performance in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query', { 
        text, 
        duration, 
        rows: res.rowCount,
        // Only log params in development for security
        params: process.env.NODE_ENV === 'production' ? '[REDACTED]' : params
      });
    }
    
    // Flag slow queries for optimization
    if (duration > 500) {
      console.warn(`⚠️ Slow query detected [${duration}ms]: ${text.substring(0, 100)}...`);
    }
    
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    // Return client to pool
    client.release();
  }
};

// Monitor the connection pool events
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

// Test the connection with enhanced error handling
(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected successfully at:', res.rows[0].now);
  } catch (err) {
    console.error('Database connection error:', err.stack);
    // Implement retry logic for initial connection
    if (process.env.NODE_ENV === 'production') {
      console.log('Retrying database connection in 5 seconds...');
      setTimeout(async () => {
        try {
          const res = await pool.query('SELECT NOW()');
          console.log('Database connected successfully at:', res.rows[0].now);
        } catch (retryErr) {
          console.error('Database retry connection failed:', retryErr.stack);
        }
      }, 5000);
    }
  }
})();

// Enhanced database initialization with expanded schema
const initDb = async () => {
  try {
    // Create contacts table with enhanced fields for marketing attribution
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        interest VARCHAR(50),
        message TEXT,
        utm_source VARCHAR(100),
        utm_medium VARCHAR(100),
        utm_campaign VARCHAR(100),
        utm_term VARCHAR(100),
        utm_content VARCHAR(100),
        referrer VARCHAR(255),
        ip_address VARCHAR(50),
        user_agent TEXT,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP
      )
    `);
    
    // Add indexes for better query performance
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes 
          WHERE tablename = 'contacts' AND indexname = 'idx_contacts_email'
        ) THEN
          CREATE INDEX idx_contacts_email ON contacts(email);
        END IF;
        
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes 
          WHERE tablename = 'contacts' AND indexname = 'idx_contacts_created_at'
        ) THEN
          CREATE INDEX idx_contacts_created_at ON contacts(created_at);
        END IF;
        
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes 
          WHERE tablename = 'contacts' AND indexname = 'idx_contacts_status'
        ) THEN
          CREATE INDEX idx_contacts_status ON contacts(status);
        END IF;
      END
      $$;
    `);
    
    // Create subscribers table for newsletter
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        subscribed_at TIMESTAMP NOT NULL DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true,
        utm_source VARCHAR(100),
        utm_medium VARCHAR(100),
        utm_campaign VARCHAR(100),
        ip_address VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    // Add index for subscribers
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes 
          WHERE tablename = 'subscribers' AND indexname = 'idx_subscribers_email'
        ) THEN
          CREATE UNIQUE INDEX idx_subscribers_email ON subscribers(email);
        END IF;
      END
      $$;
    `);
    
    console.log('✅ Database tables and indexes created successfully');
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error };
  }
};

module.exports = {
  query,
  pool,
  initDb
};