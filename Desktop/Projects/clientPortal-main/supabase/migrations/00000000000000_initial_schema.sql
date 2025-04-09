-- Enable Row Level Security
-- Commented out JWT secret line that was causing issues
-- -- -- ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create schema for application
CREATE SCHEMA IF NOT EXISTS app;

-- Set up proper timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create profiles table (extending the auth.users table)
CREATE TABLE IF NOT EXISTS app.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  position TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS app.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Planning',
  start_date DATE,
  target_end_date DATE,
  actual_end_date DATE,
  completion_percentage INTEGER DEFAULT 0,
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
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
  assigned_by UUID REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meetings table
CREATE TABLE IF NOT EXISTS app.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Scheduled',
  meeting_link TEXT,
  meeting_id TEXT,
  passcode TEXT,
  dial_in TEXT,
  recording_link TEXT,
  transcript_link TEXT,
  project_id UUID REFERENCES app.projects(id),
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  organizer_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meeting_attendees junction table
CREATE TABLE IF NOT EXISTS app.meeting_attendees (
  meeting_id UUID REFERENCES app.meetings(id),
  user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'Pending',
  PRIMARY KEY (meeting_id, user_id)
);

-- Create documents table
CREATE TABLE IF NOT EXISTS app.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'Current',
  requires_signature BOOLEAN DEFAULT FALSE,
  signature_status TEXT,
  project_id UUID REFERENCES app.projects(id),
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time_packages table
CREATE TABLE IF NOT EXISTS app.time_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  hours DECIMAL(8,2) NOT NULL,
  hours_used DECIMAL(8,2) DEFAULT 0,
  purchase_date DATE NOT NULL,
  expiration_date DATE,
  status TEXT NOT NULL DEFAULT 'Active',
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time_entries table
CREATE TABLE IF NOT EXISTS app.time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  hours DECIMAL(6,2) NOT NULL,
  date DATE NOT NULL,
  task_id UUID REFERENCES app.tasks(id),
  project_id UUID REFERENCES app.projects(id),
  time_package_id UUID REFERENCES app.time_packages(id) NOT NULL,
  consultant_id UUID REFERENCES auth.users(id) NOT NULL,
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meeting_notes table
CREATE TABLE IF NOT EXISTS app.meeting_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  meeting_id UUID REFERENCES app.meetings(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_updates table
CREATE TABLE IF NOT EXISTS app.project_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  project_id UUID REFERENCES app.projects(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task_comments table
CREATE TABLE IF NOT EXISTS app.task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  task_id UUID REFERENCES app.tasks(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS app.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_entity_id UUID,
  related_entity_type TEXT,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create update triggers
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

CREATE TRIGGER set_timestamp_time_entries
BEFORE UPDATE ON app.time_entries
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_meeting_notes
BEFORE UPDATE ON app.meeting_notes
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_project_updates
BEFORE UPDATE ON app.project_updates
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_task_comments
BEFORE UPDATE ON app.task_comments
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Set up Row Level Security (RLS) policies

-- Profiles: User can read their own profile, admins can read all
ALTER TABLE app.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON app.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON app.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Projects: Clients can view their own projects, admins can view all
ALTER TABLE app.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own projects"
  ON app.projects FOR SELECT
  USING (auth.uid() = client_id);

-- Tasks: Clients can view their own tasks, admins can view all
ALTER TABLE app.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own tasks"
  ON app.tasks FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can create tasks"
  ON app.tasks FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Meetings: Attendees can view their meetings, admins can view all
ALTER TABLE app.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own meetings"
  ON app.meetings FOR SELECT
  USING (auth.uid() = client_id);

ALTER TABLE app.meeting_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view meetings they attend"
  ON app.meeting_attendees FOR SELECT
  USING (auth.uid() = user_id);

-- Documents: Clients can view their own documents, admins can view all
ALTER TABLE app.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own documents"
  ON app.documents FOR SELECT
  USING (auth.uid() = client_id);

-- Time packages: Clients can view their own time packages, admins can view all
ALTER TABLE app.time_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own time packages"
  ON app.time_packages FOR SELECT
  USING (auth.uid() = client_id);

-- Time entries: Clients can view entries for their time packages, admins can view all
ALTER TABLE app.time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own time entries"
  ON app.time_entries FOR SELECT
  USING (auth.uid() = client_id);

-- Other tables with similar policies
ALTER TABLE app.meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.notifications ENABLE ROW LEVEL SECURITY;

-- Fixed policy with proper type casting
CREATE POLICY "Users can view own meeting notes"
  ON app.meeting_notes FOR SELECT
  USING (
    auth.uid() IN (
      SELECT client_id FROM app.meetings WHERE id::text = meeting_id::text
    ) OR
    auth.uid() IN (
      SELECT user_id FROM app.meeting_attendees WHERE meeting_id::text = app.meeting_notes.meeting_id::text
    )
  );

CREATE POLICY "Users can view project updates for their projects"
  ON app.project_updates FOR SELECT
  USING (
    auth.uid() IN (
      SELECT client_id FROM app.projects WHERE id = project_id
    )
  );

CREATE POLICY "Users can view task comments for their tasks"
  ON app.task_comments FOR SELECT
  USING (
    auth.uid() IN (
      SELECT client_id FROM app.tasks WHERE id = task_id
    )
  );

CREATE POLICY "Users can view own notifications"
  ON app.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON app.notifications FOR UPDATE
  USING (auth.uid() = user_id);
