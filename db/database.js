/**
 * Revelate Operations - Database Configuration
 * Centralized database connection management
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // Required for Heroku PostgreSQL
  } : false
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error', err.stack);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  
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
      
      // Create assessments table
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