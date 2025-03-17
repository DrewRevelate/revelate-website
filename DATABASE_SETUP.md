# Revelate Operations - Database Setup

This guide explains how to set up and configure the PostgreSQL database for the Revelate Operations website. The website now uses PostgreSQL instead of Google Sheets for storing contact form submissions and assessment data.

## Local Development Setup

1. **Install PostgreSQL** (if not already installed):
   ```
   # macOS (using Homebrew)
   brew install postgresql
   
   # Start PostgreSQL service
   brew services start postgresql
   ```

2. **Create a local database**:
   ```
   # Connect to PostgreSQL
   psql postgres
   
   # Create database
   CREATE DATABASE revelate;
   
   # Create a user (optional)
   CREATE USER revelateuser WITH PASSWORD 'yourpassword';
   
   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE revelate TO revelateuser;
   
   # Exit
   \q
   ```

3. **Update .env file** with your local database connection information:
   ```
   DATABASE_URL=postgres://revelateuser:yourpassword@localhost:5432/revelate
   ```

4. **Initialize database tables**:
   ```
   npm run setup-db
   ```

## Heroku PostgreSQL Setup

The website is configured to use Heroku's PostgreSQL add-on in production.

1. **Add PostgreSQL to your Heroku app**:
   ```
   heroku addons:create heroku-postgresql:hobby-dev
   ```

2. **Verify the database URL was added**:
   ```
   heroku config | grep DATABASE_URL
   ```

3. **Initialize database tables on Heroku**:
   ```
   heroku run npm run setup-db
   ```

## Database Schema

The website uses two main tables:

### Contacts Table
Stores information from the contact form:

```sql
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
```

### Assessments Table
Stores information from the RevOps assessment:

```sql
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
```

## Connecting to the Database

### From the command line:
```
# Local database
psql revelate

# Heroku database
heroku pg:psql
```

### Query Examples:
```sql
-- View all contacts
SELECT * FROM contacts ORDER BY created_at DESC;

-- View all assessments
SELECT * FROM assessments ORDER BY created_at DESC;

-- Get overall score statistics
SELECT 
  AVG(overall_score) as average_score,
  MIN(overall_score) as min_score,
  MAX(overall_score) as max_score
FROM assessments;
```

## Backup and Restore

### Creating a backup:
```
# Local database
pg_dump revelate > revelate_backup.sql

# Heroku database
heroku pg:backups:capture
heroku pg:backups:download
```

### Restoring from backup:
```
# Local database
psql revelate < revelate_backup.sql

# Heroku database (replace BACKUP_URL with actual URL)
heroku pg:backups:restore BACKUP_URL DATABASE_URL
```