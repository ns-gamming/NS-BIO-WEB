-- ============================================================
-- NS GAMMING - FREE FIRE INFO BOT DATABASE SETUP
-- ============================================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard
-- 2. Go to SQL Editor
-- 3. Copy and paste this ENTIRE file
-- 4. Click "Run" to execute
-- ============================================================

-- Create ff_info_searches table to track all searches
CREATE TABLE IF NOT EXISTS ff_info_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  uid TEXT NOT NULL,
  region TEXT NOT NULL,
  search_date TEXT NOT NULL,
  searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create ff_info_rate_limits table to manage daily search limits (5 per day per IP)
CREATE TABLE IF NOT EXISTS ff_info_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  search_count INTEGER DEFAULT 0 NOT NULL,
  last_reset_date TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ff_info_searches_ip_date 
  ON ff_info_searches(ip_address, search_date);

CREATE INDEX IF NOT EXISTS idx_ff_info_searches_uid 
  ON ff_info_searches(uid);

CREATE INDEX IF NOT EXISTS idx_ff_info_rate_limits_ip 
  ON ff_info_rate_limits(ip_address);

-- Add comments for documentation
COMMENT ON TABLE ff_info_searches IS 'Tracks all Free Fire player info searches';
COMMENT ON TABLE ff_info_rate_limits IS 'Manages rate limiting - 5 searches per day per IP address';

COMMENT ON COLUMN ff_info_searches.ip_address IS 'User IP address';
COMMENT ON COLUMN ff_info_searches.uid IS 'Free Fire player UID searched';
COMMENT ON COLUMN ff_info_searches.region IS 'Free Fire region (SG, IN, BR, etc.)';
COMMENT ON COLUMN ff_info_searches.search_date IS 'Date of search in YYYY-MM-DD format';
COMMENT ON COLUMN ff_info_searches.searched_at IS 'Exact timestamp of search';

COMMENT ON COLUMN ff_info_rate_limits.ip_address IS 'User IP address (unique)';
COMMENT ON COLUMN ff_info_rate_limits.search_count IS 'Number of searches performed today';
COMMENT ON COLUMN ff_info_rate_limits.last_reset_date IS 'Last date the counter was reset (YYYY-MM-DD)';
COMMENT ON COLUMN ff_info_rate_limits.updated_at IS 'Last update timestamp';

-- ============================================================
-- Setup Complete! ✅
-- Your Free Fire Info Bot database is ready to use.
-- 
-- Next Steps:
-- 1. Set environment variables in Replit Secrets:
--    - SUPABASE_URL=your_supabase_url
--    - SUPABASE_SERVICE_KEY=your_service_role_key
--    - FFINFO_API_KEY=your_free_fire_api_key
-- 2. Test the Info Bot page at /ff-info-bot
-- ============================================================
