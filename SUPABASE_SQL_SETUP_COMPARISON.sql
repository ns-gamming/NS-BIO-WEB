
-- Free Fire VS Battle (Comparison Tool) Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for comparison rate limiting (3 free comparisons per day)
CREATE TABLE IF NOT EXISTS ff_compare_rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT NOT NULL UNIQUE,
  compare_count INTEGER DEFAULT 0 NOT NULL,
  last_reset_date TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table for VIP access management
CREATE TABLE IF NOT EXISTS ff_compare_vip_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT NOT NULL UNIQUE,
  is_vip BOOLEAN DEFAULT FALSE NOT NULL,
  vip_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table for comparison history
CREATE TABLE IF NOT EXISTS ff_compare_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT NOT NULL,
  player1_uid TEXT NOT NULL,
  player1_region TEXT NOT NULL,
  player2_uid TEXT NOT NULL,
  player2_region TEXT NOT NULL,
  player1_score INTEGER NOT NULL,
  player2_score INTEGER NOT NULL,
  winner_uid TEXT NOT NULL,
  analysis TEXT NOT NULL,
  compared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table for user feedback on comparisons
CREATE TABLE IF NOT EXISTS ff_compare_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comparison_id UUID REFERENCES ff_compare_history(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful BOOLEAN,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_compare_rate_limits_ip ON ff_compare_rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_compare_vip_ip ON ff_compare_vip_access(ip_address);
CREATE INDEX IF NOT EXISTS idx_compare_history_ip ON ff_compare_history(ip_address);
CREATE INDEX IF NOT EXISTS idx_compare_feedback_comparison ON ff_compare_feedback(comparison_id);

-- Comments for documentation
COMMENT ON TABLE ff_compare_rate_limits IS 'Manages rate limiting - 3 comparisons per day per IP';
COMMENT ON TABLE ff_compare_vip_access IS 'VIP users with unlimited comparison access';
COMMENT ON TABLE ff_compare_history IS 'History of all player comparisons';
COMMENT ON TABLE ff_compare_feedback IS 'User feedback on comparison accuracy';
