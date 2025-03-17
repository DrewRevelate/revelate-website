// db/database.js

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Load environment variables
try {
  require('dotenv').config();
} catch (e) {
  console.log('dotenv not loaded, using process.env variables');
}

// Determine if we're running on Heroku
const isHeroku = process.env.DATABASE_URL ? true : false;

// Database connections
let db, runSqlScript;

if (isHeroku) {
  // PostgreSQL for Heroku
  console.log('Using PostgreSQL database on Heroku');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Heroku PostgreSQL
    }
  });

  // Export a query function instead of the db object
  db = {
    // Expose the pool for direct client connections needed in transactions
    client: pool,
    
    prepare: (sql) => {
      return {
        run: async (params = {}) => {
          try {
            const client = await pool.connect();
            try {
              return await client.query(sql, Object.values(params));
            } finally {
              client.release();
            }
          } catch (err) {
            console.error('Database error:', err);
            throw err;
          }
        },
        all: async (params = {}) => {
          try {
            const client = await pool.connect();
            try {
              const result = await client.query(sql, Object.values(params));
              return result.rows;
            } finally {
              client.release();
            }
          } catch (err) {
            console.error('Database error:', err);
            throw err;
          }
        },
        get: async (params = {}) => {
          try {
            const client = await pool.connect();
            try {
              const result = await client.query(sql, Object.values(params));
              return result.rows[0];
            } finally {
              client.release();
            }
          } catch (err) {
            console.error('Database error:', err);
            throw err;
          }
        }
      };
    },
    transaction: (callback) => {
      return async () => {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          await callback();
          await client.query('COMMIT');
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        } finally {
          client.release();
        }
      };
    },
    pragma: () => {} // No-op for PostgreSQL
  };

  // Function to run SQL scripts for PostgreSQL
  runSqlScript = async (filepath) => {
    console.log(`Running SQL script: ${filepath}`);
    const sql = fs.readFileSync(filepath, 'utf8');
    
    // Split by semicolons but keep CREATE statements together
    const statements = [];
    let currentStatement = '';
    let inCreateBlock = false;
    
    sql.split(';').forEach(stmt => {
      const trimmed = stmt.trim();
      if (!trimmed) return;
      
      if (trimmed.toUpperCase().startsWith('CREATE TABLE') || inCreateBlock) {
        inCreateBlock = true;
        currentStatement += trimmed + ';';
        if (trimmed.includes(');')) {
          // End of CREATE statement
          inCreateBlock = false;
          statements.push(currentStatement);
          currentStatement = '';
        }
      } else {
        statements.push(trimmed + ';');
      }
    });
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            // Convert SQLite syntax to PostgreSQL
            let pgStatement = statement
              .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY')
              .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/g, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
            
            await client.query(pgStatement);
          } catch (error) {
            console.error(`Error executing statement: ${statement.trim()}`);
            throw error;
          }
        }
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    
    console.log(`Executed SQL script: ${filepath}`);
  };

} else {
  // SQLite for local development
  console.log('Using SQLite database for local development');
  const sqlite3 = require('better-sqlite3');
  
  // Create the db directory if it doesn't exist
  const dbDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  // Database file path
  const dbPath = path.join(dbDir, 'presentation.db');
  
  // Initialize the database with verbose logging in development
  db = new sqlite3(dbPath, { 
    verbose: process.env.NODE_ENV === 'development' ? console.log : null 
  });
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Close database on process exit
  process.on('exit', () => {
    db.close();
  });
  
  // Utility function to run SQL scripts for SQLite
  runSqlScript = (filepath) => {
    console.log(`Running SQL script: ${filepath}`);
    const sql = fs.readFileSync(filepath, 'utf8');
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    db.transaction(() => {
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            db.prepare(statement.trim() + ';').run();
          } catch (error) {
            console.error(`Error executing statement: ${statement.trim()}`);
            throw error;
          }
        }
      }
    })();
    
    console.log(`Executed SQL script: ${filepath}`);
  };

  // Initialize schema if database is new
  if (!fs.existsSync(dbPath) || fs.statSync(dbPath).size === 0) {
    console.log('New database detected, initializing schema...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      runSqlScript(schemaPath);
      console.log('Schema initialized successfully');
    } else {
      console.error('Schema file not found:', schemaPath);
    }
  }
}

module.exports = {
  db,
  runSqlScript
};