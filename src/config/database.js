/**
 * Revelate Operations - Database Configuration
 * Centralized database connection management with connection pooling and retries
 */

const { Pool } = require('pg');
const logger = require('../utils/logger');

// Get the database URL from environment variables
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  logger.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Configure SSL based on environment
const sslConfig = process.env.NODE_ENV === 'production' 
  ? { 
      rejectUnauthorized: false // Required for Heroku PostgreSQL
    } 
  : false;

// Configure connection pool with optimal settings
const pool = new Pool({
  connectionString: dbUrl,
  ssl: sslConfig,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
});

// Listen for connection errors
pool.on('error', (err, client) => {
  logger.error('Unexpected database error:', err);
});

// Connection test that retries on failure
async function testConnection(retries = 5, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await pool.query('SELECT NOW() as time');
      logger.info(`Database connected successfully at: ${result.rows[0].time}`);
      return true;
    } catch (error) {
      logger.error(`Database connection attempt ${attempt} failed:`, error.message);
      
      if (attempt < retries) {
        logger.info(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        logger.error('All database connection attempts failed');
        return false;
      }
    }
  }
}

// Helper for executing queries with logging and error handling
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    logger.debug('Executed query', { 
      query: text.substring(0, 80) + (text.length > 80 ? '...' : ''),
      duration: `${duration}ms`,
      rows: res.rowCount 
    });
    
    return res;
  } catch (error) {
    logger.error('Database query error:', { 
      query: text.substring(0, 100),
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Database initialization function
async function initDb() {
  try {
    // Sessions table for express-session with pg
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid varchar NOT NULL COLLATE "default" PRIMARY KEY,
        sess json NOT NULL,
        expire timestamp(6) NOT NULL
      )
    `);
    
    // Create index on expiration
    await pool.query(`
      CREATE INDEX IF NOT EXISTS IDX_session_expire 
      ON sessions (expire)
    `);
    
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
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP,
        status VARCHAR(50) DEFAULT 'new',
        notes TEXT,
        ip_address VARCHAR(50)
      )
    `);
    
    // Create assessments table with additional tracking fields
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        job_title VARCHAR(255),
        industry VARCHAR(100),
        company_size VARCHAR(50),
        
        crm_implementation INTEGER,
        system_integration INTEGER,
        data_quality INTEGER,
        
        analytics_capabilities INTEGER,
        revenue_attribution INTEGER,
        data_driven_decisions INTEGER,
        
        sales_process INTEGER,
        lead_process INTEGER,
        retention_process INTEGER,
        
        team_alignment INTEGER,
        revenue_forecasting INTEGER,
        revops_leadership INTEGER,
        
        data_infrastructure_score DECIMAL(5,2),
        analytics_score DECIMAL(5,2),
        process_score DECIMAL(5,2),
        team_score DECIMAL(5,2),
        overall_score DECIMAL(5,2),
        maturity_level VARCHAR(50),
        
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP,
        status VARCHAR(50) DEFAULT 'new',
        notes TEXT,
        ip_address VARCHAR(50),
        user_agent TEXT,
        referrer VARCHAR(255)
      )
    `);
    
    // Create users table for admin users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `);
    
    logger.info('Database tables created/verified successfully');
    return { success: true };
  } catch (error) {
    logger.error('Error initializing database:', error);
    return { success: false, error };
  }
}

// Test the connection when the module is loaded
testConnection().catch(err => {
  logger.error('Initial database connection test failed:', err);
});

module.exports = {
  query,
  pool,
  initDb,
  testConnection
};