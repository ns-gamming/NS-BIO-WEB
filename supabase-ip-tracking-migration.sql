
-- ============================================================================
-- IP TRACKING MIGRATION - Add IP and User Agent columns to all tables
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Add user_agent to page_views if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='page_views' AND column_name='user_agent'
  ) THEN
    ALTER TABLE page_views ADD COLUMN user_agent TEXT;
  END IF;
END $$;

-- Add ip_address to user_events if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='user_events' AND column_name='ip_address'
  ) THEN
    ALTER TABLE user_events ADD COLUMN ip_address VARCHAR(100);
  END IF;
END $$;

-- Add user_agent to user_events if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='user_events' AND column_name='user_agent'
  ) THEN
    ALTER TABLE user_events ADD COLUMN user_agent TEXT;
  END IF;
END $$;

-- Add occurred_at to user_events if not exists (for consistency)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='user_events' AND column_name='occurred_at'
  ) THEN
    ALTER TABLE user_events ADD COLUMN occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Add session_id to user_feedback if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='user_feedback' AND column_name='session_id'
  ) THEN
    ALTER TABLE user_feedback ADD COLUMN session_id VARCHAR(255);
  END IF;
END $$;

-- Add session_id to blog_feedback if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='blog_feedback' AND column_name='session_id'
  ) THEN
    ALTER TABLE blog_feedback ADD COLUMN session_id VARCHAR(255);
  END IF;
END $$;

-- Create indexes for better query performance on IP addresses
CREATE INDEX IF NOT EXISTS idx_page_views_ip ON page_views(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_events_ip ON user_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_feedback_ip ON user_feedback(user_ip);
CREATE INDEX IF NOT EXISTS idx_blog_feedback_ip ON blog_feedback(user_ip);
CREATE INDEX IF NOT EXISTS idx_ff_bot_ip_created ON ff_bot_interactions(user_ip, created_at DESC);

-- Create a view to see all user activity by IP
CREATE OR REPLACE VIEW user_activity_by_ip AS
SELECT 
  ip_address,
  COUNT(*) as total_events,
  MIN(started_at) as first_seen,
  MAX(started_at) as last_seen,
  COUNT(DISTINCT session_id) as session_count
FROM analytics_sessions
GROUP BY ip_address
ORDER BY total_events DESC;

-- Create a view for comprehensive user tracking
CREATE OR REPLACE VIEW comprehensive_user_tracking AS
SELECT 
  s.session_id,
  s.ip_address,
  s.user_agent,
  s.browser,
  s.os,
  s.device_type,
  s.started_at,
  s.ended_at,
  COUNT(DISTINCT pv.id) as page_views,
  COUNT(DISTINCT ue.id) as total_events,
  COALESCE(fb.feedback_count, 0) as feedbacks_given,
  COALESCE(ff.ff_uses, 0) as ff_bot_uses
FROM analytics_sessions s
LEFT JOIN page_views pv ON s.session_id = pv.session_id
LEFT JOIN user_events ue ON s.session_id = ue.session_id
LEFT JOIN (
  SELECT session_id, COUNT(*) as feedback_count 
  FROM user_feedback 
  WHERE session_id IS NOT NULL 
  GROUP BY session_id
) fb ON s.session_id = fb.session_id
LEFT JOIN (
  SELECT user_ip, COUNT(*) as ff_uses 
  FROM ff_bot_interactions 
  GROUP BY user_ip
) ff ON s.ip_address = ff.user_ip
GROUP BY s.session_id, s.ip_address, s.user_agent, s.browser, s.os, s.device_type, 
         s.started_at, s.ended_at, fb.feedback_count, ff.ff_uses
ORDER BY s.started_at DESC;

-- Grant necessary permissions
GRANT SELECT ON user_activity_by_ip TO authenticated;
GRANT SELECT ON comprehensive_user_tracking TO authenticated;

COMMENT ON VIEW user_activity_by_ip IS 'Summary of user activity grouped by IP address';
COMMENT ON VIEW comprehensive_user_tracking IS 'Complete user tracking with all activities per session';
