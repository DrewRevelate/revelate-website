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

-- Add or modify fields in profiles table
ALTER TABLE app.profiles ADD COLUMN IF NOT EXISTS company UUID REFERENCES app.companies(id);
ALTER TABLE app.profiles ADD COLUMN IF NOT EXISTS retainer_agreement BOOLEAN DEFAULT FALSE;
ALTER TABLE app.profiles ADD COLUMN IF NOT EXISTS hourly_agreement BOOLEAN DEFAULT FALSE;
ALTER TABLE app.profiles ADD COLUMN IF NOT EXISTS portal_access BOOLEAN DEFAULT FALSE;

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

-- Create trigger for companies
CREATE TRIGGER set_timestamp_companies
BEFORE UPDATE ON app.companies
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Create trigger for schedule_links
CREATE TRIGGER set_timestamp_schedule_links
BEFORE UPDATE ON app.schedule_links
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Add RLS policies for new tables
ALTER TABLE app.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.schedule_links ENABLE ROW LEVEL SECURITY;

-- Companies RLS: Clients can see their own company, admins can see all
CREATE POLICY "Clients can view own company"
  ON app.companies FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM app.profiles WHERE company = app.companies.id
    )
  );

-- Schedule links RLS: All authenticated users can see schedule links
CREATE POLICY "All users can view schedule links"
  ON app.schedule_links FOR SELECT
  USING (auth.role() = 'authenticated');
