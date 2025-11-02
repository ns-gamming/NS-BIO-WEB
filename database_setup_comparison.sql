-- Free Fire Comparison Tool Database Setup
-- Copy and paste these SQL statements to create the required tables in your production database

-- Table for VIP access management
CREATE TABLE IF NOT EXISTS ff_compare_vip_access (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  is_vip BOOLEAN DEFAULT FALSE NOT NULL,
  vip_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table for rate limiting (3 free comparisons per day)
CREATE TABLE IF NOT EXISTS ff_compare_rate_limits (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL UNIQUE,
  compare_count INTEGER DEFAULT 0 NOT NULL,
  last_reset_date TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table for comparison history
CREATE TABLE IF NOT EXISTS ff_compare_history (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  player1_uid TEXT NOT NULL,
  player1_region TEXT NOT NULL,
  player2_uid TEXT NOT NULL,
  player2_region TEXT NOT NULL,
  player1_score INTEGER NOT NULL,
  player2_score INTEGER NOT NULL,
  winner_uid TEXT NOT NULL,
  analysis TEXT NOT NULL,
  compared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table for comparison feedback
CREATE TABLE IF NOT EXISTS ff_compare_feedback (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_id TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  helpful BOOLEAN,
  ip_address TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ff_compare_vip_ip ON ff_compare_vip_access(ip_address);
CREATE INDEX IF NOT EXISTS idx_ff_compare_rate_ip ON ff_compare_rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_ff_compare_history_ip ON ff_compare_history(ip_address);
CREATE INDEX IF NOT EXISTS idx_ff_compare_history_compared_at ON ff_compare_history(compared_at);
CREATE INDEX IF NOT EXISTS idx_ff_compare_feedback_comparison ON ff_compare_feedback(comparison_id);

-- Optional: Add comments for documentation
COMMENT ON TABLE ff_compare_vip_access IS 'Stores VIP access status for unlimited comparisons';
COMMENT ON TABLE ff_compare_rate_limits IS 'Tracks free comparison usage (3 per day for non-VIP users)';
COMMENT ON TABLE ff_compare_history IS 'Stores all player comparisons with AI analysis results';
COMMENT ON TABLE ff_compare_feedback IS 'Stores user feedback on comparisons';
