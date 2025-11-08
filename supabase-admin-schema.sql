
-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Sessions Table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  ip_address VARCHAR(100),
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for service role" ON admin_users;
DROP POLICY IF EXISTS "Enable insert access for service role" ON admin_users;
DROP POLICY IF EXISTS "Enable update access for service role" ON admin_users;
DROP POLICY IF EXISTS "Enable delete access for service role" ON admin_users;

DROP POLICY IF EXISTS "Enable read access for service role" ON admin_sessions;
DROP POLICY IF EXISTS "Enable insert access for service role" ON admin_sessions;
DROP POLICY IF EXISTS "Enable update access for service role" ON admin_sessions;
DROP POLICY IF EXISTS "Enable delete access for service role" ON admin_sessions;

-- Policies for admin_users (service role only)
CREATE POLICY "Enable read access for service role"
  ON admin_users FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Enable insert access for service role"
  ON admin_users FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Enable update access for service role"
  ON admin_users FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Enable delete access for service role"
  ON admin_users FOR DELETE
  USING (auth.role() = 'service_role');

-- Policies for admin_sessions (service role only)
CREATE POLICY "Enable read access for service role"
  ON admin_sessions FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Enable insert access for service role"
  ON admin_sessions FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Enable update access for service role"
  ON admin_sessions FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Enable delete access for service role"
  ON admin_sessions FOR DELETE
  USING (auth.role() = 'service_role');

-- Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_admin_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to run cleanup (requires pg_cron extension)
-- If pg_cron is not available, you can call this function manually or from your app
