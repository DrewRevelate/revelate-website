-- Initial database schema migration

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  interest VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP NOT NULL
);

-- Create assessments table
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
);