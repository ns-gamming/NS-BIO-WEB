
-- ============================================================================
-- NS GAMMING - FINAL FIX SQL SCRIPT
-- Fixes RLS policies, adds IP tracking, ensures chatbot works perfectly
-- ============================================================================

-- ============================================================================
-- STEP 1: DISABLE RLS ON UNRESTRICTED TABLES (TABLES ONLY, NOT VIEWS)
-- ============================================================================

ALTER TABLE ai_chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions DISABLE ROW LEVEL SECURITY;
-- ai_chat_statistics is a VIEW, not a table - skip it
ALTER TABLE comprehensive_users DISABLE ROW LEVEL SECURITY;
-- daily_active_users is a VIEW, not a table - skip it
ALTER TABLE poll_votes DISABLE ROW LEVEL SECURITY;
-- popular_pages is a VIEW, not a table - skip it
-- user_activity_by_ip is a VIEW, not a table - skip it
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: DROP ALL EXISTING POLICIES ON UNRESTRICTED TABLES
-- ============================================================================

DROP POLICY IF EXISTS "Service role full access ai_chat_messages" ON ai_chat_messages;
DROP POLICY IF EXISTS "Public insert ai_chat_messages" ON ai_chat_messages;
DROP POLICY IF EXISTS "Service role full access ai_chat_sessions" ON ai_chat_sessions;
DROP POLICY IF EXISTS "Public insert ai_chat_sessions" ON ai_chat_sessions;
-- ai_chat_statistics is a view - no policies to drop
DROP POLICY IF EXISTS "Service role full access comprehensive_users" ON comprehensive_users;
DROP POLICY IF EXISTS "Public insert comprehensive_users" ON comprehensive_users;
DROP POLICY IF EXISTS "Service role full access poll_votes" ON poll_votes;
DROP POLICY IF EXISTS "Public insert poll_votes" ON poll_votes;
DROP POLICY IF EXISTS "Service role full access user_preferences" ON user_preferences;
DROP POLICY IF EXISTS "Public insert user_preferences" ON user_preferences;

-- ============================================================================
-- STEP 3: ENSURE ALL REQUIRED COLUMNS EXIST
-- ============================================================================

-- Add ip_address to all chat tables if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_chat_messages' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE ai_chat_messages ADD COLUMN ip_address VARCHAR(100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_chat_messages' AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE ai_chat_messages ADD COLUMN user_agent TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_chat_sessions' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE ai_chat_sessions ADD COLUMN ip_address VARCHAR(100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_chat_sessions' AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE ai_chat_sessions ADD COLUMN user_agent TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN ip_address VARCHAR(100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN user_agent TEXT;
  END IF;

  -- Add ip_address to ai_user_context if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_user_context' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE ai_user_context ADD COLUMN ip_address VARCHAR(100);
  END IF;

  -- Add ip_address to comprehensive_users if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'comprehensive_users' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE comprehensive_users ADD COLUMN ip_address VARCHAR(100);
  END IF;

  -- Add ip_address to poll_votes if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'poll_votes' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE poll_votes ADD COLUMN ip_address VARCHAR(100);
  END IF;

  -- Add ip_address to user_preferences if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_preferences' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE user_preferences ADD COLUMN ip_address VARCHAR(100);
  END IF;
END $$;

-- ============================================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE (IP TRACKING)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_ip ON ai_chat_messages(ip_address);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_user_id ON ai_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session_id ON ai_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_timestamp ON ai_chat_messages(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_ip ON ai_chat_sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user_id ON ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_session_id ON ai_chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_started ON ai_chat_sessions(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_profiles_ip ON user_profiles(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_ai_user_context_ip ON ai_user_context(ip_address);
CREATE INDEX IF NOT EXISTS idx_ai_user_context_user_id ON ai_user_context(user_id);

CREATE INDEX IF NOT EXISTS idx_comprehensive_users_ip ON comprehensive_users(ip_address);
CREATE INDEX IF NOT EXISTS idx_comprehensive_users_user_id ON comprehensive_users(user_id);

CREATE INDEX IF NOT EXISTS idx_poll_votes_ip ON poll_votes(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_preferences_ip ON user_preferences(ip_address);

-- ============================================================================
-- STEP 5: GRANT FULL PUBLIC ACCESS TO UNRESTRICTED TABLES
-- ============================================================================

-- Grant all operations on unrestricted tables
GRANT ALL ON ai_chat_messages TO anon, authenticated;
GRANT ALL ON ai_chat_sessions TO anon, authenticated;
GRANT ALL ON comprehensive_users TO anon, authenticated;
GRANT ALL ON poll_votes TO anon, authenticated;
GRANT ALL ON user_preferences TO anon, authenticated;

-- Grant select on views (views don't need RLS, but users need SELECT permission)
GRANT SELECT ON ai_chat_statistics TO anon, authenticated;
GRANT SELECT ON daily_active_users TO anon, authenticated;
GRANT SELECT ON popular_pages TO anon, authenticated;
GRANT SELECT ON user_activity_by_ip TO anon, authenticated;

-- ============================================================================
-- STEP 6: ENSURE SERVICE ROLE HAS FULL ACCESS TO ALL TABLES
-- ============================================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ============================================================================
-- STEP 7: CREATE/UPDATE VIEWS FOR IP TRACKING
-- ============================================================================

-- User activity by IP (comprehensive view)
CREATE OR REPLACE VIEW user_activity_by_ip AS
SELECT 
  ip_address,
  COUNT(DISTINCT session_id) as total_sessions,
  COUNT(DISTINCT DATE(started_at)) as unique_days,
  MIN(started_at) as first_seen,
  MAX(started_at) as last_seen,
  COUNT(*) as total_activities,
  JSONB_AGG(DISTINCT browser) FILTER (WHERE browser IS NOT NULL) as browsers_used,
  JSONB_AGG(DISTINCT os) FILTER (WHERE os IS NOT NULL) as os_used,
  JSONB_AGG(DISTINCT device_type) FILTER (WHERE device_type IS NOT NULL) as devices_used
FROM analytics_sessions
GROUP BY ip_address
ORDER BY last_seen DESC;

-- AI Chat activity by IP
CREATE OR REPLACE VIEW ai_chat_activity_by_ip AS
SELECT 
  s.ip_address,
  COUNT(DISTINCT s.session_id) as total_chat_sessions,
  COUNT(DISTINCT s.user_id) as unique_users,
  COUNT(DISTINCT m.id) as total_messages,
  MIN(s.started_at) as first_chat,
  MAX(s.started_at) as last_chat,
  AVG(s.message_count) as avg_messages_per_session
FROM ai_chat_sessions s
LEFT JOIN ai_chat_messages m ON s.session_id = m.session_id
GROUP BY s.ip_address
ORDER BY last_chat DESC;

-- Complete user tracking view (combines everything)
CREATE OR REPLACE VIEW complete_user_tracking AS
SELECT 
  COALESCE(a.ip_address, c.ip_address) as ip_address,
  a.total_sessions as analytics_sessions,
  c.total_chat_sessions,
  c.total_messages as chat_messages,
  a.first_seen as first_analytics,
  c.first_chat,
  a.last_seen as last_analytics,
  c.last_chat,
  a.browsers_used,
  a.os_used,
  a.devices_used
FROM user_activity_by_ip a
FULL OUTER JOIN ai_chat_activity_by_ip c ON a.ip_address = c.ip_address
ORDER BY GREATEST(COALESCE(a.last_seen, '1900-01-01'::timestamp), COALESCE(c.last_chat, '1900-01-01'::timestamp)) DESC;

-- ============================================================================
-- STEP 8: GRANT VIEW ACCESS
-- ============================================================================

GRANT SELECT ON ai_chat_activity_by_ip TO anon, authenticated;
GRANT SELECT ON complete_user_tracking TO anon, authenticated;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ ============================================================================';
    RAISE NOTICE '✅ NS GAMMING DATABASE - FINAL FIX COMPLETE!';
    RAISE NOTICE '✅ ============================================================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 UNRESTRICTED TABLES (RLS DISABLED):';
    RAISE NOTICE '   - ai_chat_messages';
    RAISE NOTICE '   - ai_chat_sessions';
    RAISE NOTICE '   - comprehensive_users';
    RAISE NOTICE '   - poll_votes';
    RAISE NOTICE '   - user_preferences';
    RAISE NOTICE '';
    RAISE NOTICE '📊 UNRESTRICTED VIEWS (NO RLS NEEDED):';
    RAISE NOTICE '   - ai_chat_statistics';
    RAISE NOTICE '   - daily_active_users';
    RAISE NOTICE '   - popular_pages';
    RAISE NOTICE '   - user_activity_by_ip';
    RAISE NOTICE '';
    RAISE NOTICE '🔍 IP TRACKING ENABLED ON:';
    RAISE NOTICE '   - All chat messages (ai_chat_messages.ip_address)';
    RAISE NOTICE '   - All chat sessions (ai_chat_sessions.ip_address)';
    RAISE NOTICE '   - User profiles (user_profiles.ip_address)';
    RAISE NOTICE '   - User context (ai_user_context.ip_address)';
    RAISE NOTICE '   - Poll votes (poll_votes.ip_address)';
    RAISE NOTICE '   - User preferences (user_preferences.ip_address)';
    RAISE NOTICE '';
    RAISE NOTICE '📈 NEW VIEWS CREATED:';
    RAISE NOTICE '   - ai_chat_activity_by_ip (chat activity per IP)';
    RAISE NOTICE '   - complete_user_tracking (everything per IP)';
    RAISE NOTICE '';
    RAISE NOTICE '✅ CHATBOT STATUS:';
    RAISE NOTICE '   - Uses FREE Gemini model (gemini-1.5-flash)';
    RAISE NOTICE '   - Works even if database fails';
    RAISE NOTICE '   - Stores ALL user data when database available';
    RAISE NOTICE '   - IP tracking in every message & session';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 YOUR CHATBOT IS READY TO USE!';
    RAISE NOTICE '============================================================================';
END $$;
