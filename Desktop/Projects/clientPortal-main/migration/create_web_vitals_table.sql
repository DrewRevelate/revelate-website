-- Create web_vitals table for performance metrics tracking
CREATE TABLE IF NOT EXISTS web_vitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  value FLOAT NOT NULL,
  page_path TEXT NOT NULL,
  user_agent TEXT,
  unique_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_web_vitals_name ON web_vitals(name);
CREATE INDEX IF NOT EXISTS idx_web_vitals_page_path ON web_vitals(page_path);
CREATE INDEX IF NOT EXISTS idx_web_vitals_created_at ON web_vitals(created_at);

-- Add RLS policies
ALTER TABLE web_vitals ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can insert their own metrics
CREATE POLICY insert_own_metrics ON web_vitals 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Administrators can view all metrics
CREATE POLICY view_all_metrics ON web_vitals 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));

-- Create a function to aggregate metrics for reporting
CREATE OR REPLACE FUNCTION get_web_vitals_summary(
  time_period TEXT DEFAULT 'day',
  metric_name TEXT DEFAULT NULL
)
RETURNS TABLE (
  period TEXT,
  metric TEXT,
  avg_value FLOAT,
  p75_value FLOAT,
  p95_value FLOAT,
  count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH vitals AS (
    SELECT
      name,
      value,
      CASE
        WHEN time_period = 'hour' THEN date_trunc('hour', created_at)
        WHEN time_period = 'day' THEN date_trunc('day', created_at)
        WHEN time_period = 'week' THEN date_trunc('week', created_at)
        WHEN time_period = 'month' THEN date_trunc('month', created_at)
        ELSE date_trunc('day', created_at)
      END AS period_start,
      created_at
    FROM web_vitals
    WHERE 
      (metric_name IS NULL OR name = metric_name)
      AND created_at > NOW() - INTERVAL '30 days'
  )
  SELECT
    to_char(period_start, 'YYYY-MM-DD HH24:MI:SS') AS period,
    name AS metric,
    AVG(value) AS avg_value,
    percentile_cont(0.75) WITHIN GROUP (ORDER BY value) AS p75_value,
    percentile_cont(0.95) WITHIN GROUP (ORDER BY value) AS p95_value,
    COUNT(*) AS count
  FROM vitals
  GROUP BY period, name
  ORDER BY period, name;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_web_vitals_summary TO authenticated;