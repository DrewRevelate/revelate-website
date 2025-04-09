-- Create schema first
CREATE SCHEMA IF NOT EXISTS app;

-- Set up proper timestamps function if it doesn't exist
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add companies table
CREATE TABLE IF NOT EXISTS app.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  website TEXT,
  email_alias TEXT,
  crm TEXT,
  engagement_platform TEXT,
  finance_tools TEXT,
  primary_need TEXT,
  notes_link TEXT,
  photo_url TEXT,
  ltv TEXT,
  purchased_hours INTEGER DEFAULT 0,
  used_hours INTEGER DEFAULT 0,
  remaining_hours INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table if it doesn't exist already
CREATE TABLE IF NOT EXISTS app.profiles (
  id UUID PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company UUID REFERENCES app.companies(id),
  position TEXT,
  avatar_url TEXT,
  retainer_agreement BOOLEAN DEFAULT FALSE,
  hourly_agreement BOOLEAN DEFAULT FALSE,
  portal_access BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS app.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Planning',
  start_date DATE,
  target_end_date DATE,
  actual_end_date DATE,
  completion_percentage INTEGER DEFAULT 0,
  client_id UUID REFERENCES app.companies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS app.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  priority TEXT NOT NULL DEFAULT 'Medium',
  due_date TIMESTAMP WITH TIME ZONE,
  estimated_hours DECIMAL(6,2),
  actual_hours DECIMAL(6,2),
  project_id UUID REFERENCES app.projects(id),
  client_id UUID REFERENCES app.companies(id),
  requester TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meetings table if it doesn't exist
CREATE TABLE IF NOT EXISTS app.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Scheduled',
  meeting_link TEXT,
  recording_link TEXT,
  transcript_link TEXT,
  project_id UUID REFERENCES app.projects(id),
  client_id UUID REFERENCES app.companies(id),
  organizer_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS app.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Current',
  project_id UUID REFERENCES app.projects(id),
  client_id UUID REFERENCES app.companies(id),
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time_packages table if it doesn't exist
CREATE TABLE IF NOT EXISTS app.time_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  hours DECIMAL(8,2) NOT NULL,
  hours_used DECIMAL(8,2) DEFAULT 0,
  purchase_date DATE NOT NULL,
  expiration_date DATE,
  status TEXT NOT NULL DEFAULT 'Active',
  client_id UUID REFERENCES app.companies(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add schedule_links table
CREATE TABLE IF NOT EXISTS app.schedule_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  use_case TEXT,
  duration TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create triggers for all tables
CREATE TRIGGER set_timestamp_companies
BEFORE UPDATE ON app.companies
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON app.profiles
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_projects
BEFORE UPDATE ON app.projects
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_tasks
BEFORE UPDATE ON app.tasks
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_meetings
BEFORE UPDATE ON app.meetings
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_documents
BEFORE UPDATE ON app.documents
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_time_packages
BEFORE UPDATE ON app.time_packages
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_schedule_links
BEFORE UPDATE ON app.schedule_links
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Enable Row Level Security
ALTER TABLE app.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.time_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.schedule_links ENABLE ROW LEVEL SECURITY;

-- Create basic policies (you may want to refine these later)
CREATE POLICY "Allow all users to view companies"
  ON app.companies FOR SELECT
  USING (true);

CREATE POLICY "Allow all users to view profiles"
  ON app.profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow all users to view projects"
  ON app.projects FOR SELECT
  USING (true);

CREATE POLICY "Allow all users to view tasks"
  ON app.tasks FOR SELECT
  USING (true);

CREATE POLICY "Allow all users to view meetings"
  ON app.meetings FOR SELECT
  USING (true);

CREATE POLICY "Allow all users to view documents"
  ON app.documents FOR SELECT
  USING (true);

CREATE POLICY "Allow all users to view time_packages"
  ON app.time_packages FOR SELECT
  USING (true);

CREATE POLICY "Allow all users to view schedule_links"
  ON app.schedule_links FOR SELECT
  USING (true);
