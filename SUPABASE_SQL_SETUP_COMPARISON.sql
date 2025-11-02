
-- Free Fire VS Battle (Comparison Tool) Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: ff_compare_rate_limits
-- Purpose: Track daily comparison usage (3 free per IP)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ff_compare_rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT NOT NULL UNIQUE,
  compare_count INTEGER DEFAULT 0 NOT NULL CHECK (compare_count >= 0),
  last_reset_date TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE ff_compare_rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access
CREATE POLICY "Service role has full access to rate_limits"
  ON ff_compare_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to read only
CREATE POLICY "Authenticated users can read rate_limits"
  ON ff_compare_rate_limits
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- TABLE: ff_compare_vip_access
-- Purpose: Manage VIP users with unlimited comparisons
-- ============================================================================
CREATE TABLE IF NOT EXISTS ff_compare_vip_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT NOT NULL UNIQUE,
  is_vip BOOLEAN DEFAULT FALSE NOT NULL,
  vip_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  notes TEXT
);

-- Enable RLS
ALTER TABLE ff_compare_vip_access ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access
CREATE POLICY "Service role has full access to vip_access"
  ON ff_compare_vip_access
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to read only
CREATE POLICY "Authenticated users can read vip_access"
  ON ff_compare_vip_access
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- TABLE: ff_compare_history
-- Purpose: Store all player comparisons with results
-- ============================================================================
CREATE TABLE IF NOT EXISTS ff_compare_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT NOT NULL,
  player1_uid TEXT NOT NULL,
  player1_region TEXT NOT NULL,
  player2_uid TEXT NOT NULL,
  player2_region TEXT NOT NULL,
  player1_score INTEGER NOT NULL CHECK (player1_score >= 0 AND player1_score <= 100),
  player2_score INTEGER NOT NULL CHECK (player2_score >= 0 AND player2_score <= 100),
  winner_uid TEXT NOT NULL,
  analysis TEXT NOT NULL,
  compared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE ff_compare_history ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access
CREATE POLICY "Service role has full access to history"
  ON ff_compare_history
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to read only
CREATE POLICY "Authenticated users can read history"
  ON ff_compare_history
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- TABLE: ff_compare_feedback
-- Purpose: Collect user feedback on comparisons
-- ============================================================================
CREATE TABLE IF NOT EXISTS ff_compare_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comparison_id UUID NOT NULL REFERENCES ff_compare_history(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful BOOLEAN,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE ff_compare_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access
CREATE POLICY "Service role has full access to feedback"
  ON ff_compare_feedback
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Allow authenticated users to read only
CREATE POLICY "Authenticated users can read feedback"
  ON ff_compare_feedback
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- INDEXES for performance optimization
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_compare_rate_limits_ip 
  ON ff_compare_rate_limits(ip_address);

CREATE INDEX IF NOT EXISTS idx_compare_rate_limits_date 
  ON ff_compare_rate_limits(last_reset_date);

CREATE INDEX IF NOT EXISTS idx_compare_vip_ip 
  ON ff_compare_vip_access(ip_address);

CREATE INDEX IF NOT EXISTS idx_compare_vip_expires 
  ON ff_compare_vip_access(vip_expires_at) 
  WHERE is_vip = true;

CREATE INDEX IF NOT EXISTS idx_compare_history_ip 
  ON ff_compare_history(ip_address);

CREATE INDEX IF NOT EXISTS idx_compare_history_date 
  ON ff_compare_history(compared_at DESC);

CREATE INDEX IF NOT EXISTS idx_compare_history_winner 
  ON ff_compare_history(winner_uid);

CREATE INDEX IF NOT EXISTS idx_compare_feedback_comparison 
  ON ff_compare_feedback(comparison_id);

CREATE INDEX IF NOT EXISTS idx_compare_feedback_rating 
  ON ff_compare_feedback(rating);

-- ============================================================================
-- FUNCTIONS for automatic timestamp updates
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
DROP TRIGGER IF EXISTS update_ff_compare_rate_limits_updated_at ON ff_compare_rate_limits;
CREATE TRIGGER update_ff_compare_rate_limits_updated_at
  BEFORE UPDATE ON ff_compare_rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ff_compare_vip_access_updated_at ON ff_compare_vip_access;
CREATE TRIGGER update_ff_compare_vip_access_updated_at
  BEFORE UPDATE ON ff_compare_vip_access
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE COMMENTS for documentation
-- ============================================================================
COMMENT ON TABLE ff_compare_rate_limits IS 
  'Manages rate limiting - 3 free comparisons per day per IP address';

COMMENT ON TABLE ff_compare_vip_access IS 
  'VIP users with unlimited comparison access and optional expiration dates';

COMMENT ON TABLE ff_compare_history IS 
  'Complete history of all player comparisons with AI analysis results';

COMMENT ON TABLE ff_compare_feedback IS 
  'User feedback on comparison accuracy and helpfulness';

-- Column comments
COMMENT ON COLUMN ff_compare_rate_limits.compare_count IS 
  'Number of comparisons made today';

COMMENT ON COLUMN ff_compare_rate_limits.last_reset_date IS 
  'Date when counter was last reset (YYYY-MM-DD format)';

COMMENT ON COLUMN ff_compare_vip_access.vip_expires_at IS 
  'Optional expiration date for VIP access (NULL = permanent)';

COMMENT ON COLUMN ff_compare_history.analysis IS 
  'AI-generated analysis comparing the players';

COMMENT ON COLUMN ff_compare_feedback.helpful IS 
  'Whether user found the comparison helpful (true/false/null)';

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
-- Service role needs full access
GRANT ALL ON ff_compare_rate_limits TO service_role;
GRANT ALL ON ff_compare_vip_access TO service_role;
GRANT ALL ON ff_compare_history TO service_role;
GRANT ALL ON ff_compare_feedback TO service_role;

-- Authenticated users only need read access
GRANT SELECT ON ff_compare_rate_limits TO authenticated;
GRANT SELECT ON ff_compare_vip_access TO authenticated;
GRANT SELECT ON ff_compare_history TO authenticated;
GRANT SELECT ON ff_compare_feedback TO authenticated;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Free Fire Comparison Database Setup Complete!';
  RAISE NOTICE '📋 Tables created: ff_compare_rate_limits, ff_compare_vip_access, ff_compare_history, ff_compare_feedback';
  RAISE NOTICE '🔒 Row Level Security enabled with proper policies';
  RAISE NOTICE '⚡ Indexes created for optimal performance';
  RAISE NOTICE '🎯 Ready to use on Vercel deployment!';
END $$;
