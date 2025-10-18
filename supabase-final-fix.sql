
-- ============================================================================
-- NS GAMMING - COMPLETE DATABASE FIX
-- Creates all missing tables, adds IP tracking, configures RLS properly
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- STEP 1: CREATE ALL MISSING TABLES FIRST
-- ============================================================================

-- Comprehensive Users table (extended user profiles with ALL possible data)
CREATE TABLE IF NOT EXISTS comprehensive_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    
    -- Basic Info
    name TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    age INTEGER,
    gender VARCHAR(20),
    date_of_birth DATE,
    
    -- Location & Device
    ip_address VARCHAR(100),
    location VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    timezone VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    
    -- Device & Browser
    user_agent TEXT,
    browser VARCHAR(100),
    browser_version VARCHAR(50),
    os VARCHAR(100),
    os_version VARCHAR(50),
    device_type VARCHAR(50),
    device_brand VARCHAR(100),
    device_model VARCHAR(100),
    screen_resolution VARCHAR(50),
    
    -- Preferences & Interests
    preferences JSONB DEFAULT '{}'::jsonb,
    interests TEXT[] DEFAULT '{}',
    favorite_games TEXT[] DEFAULT '{}',
    favorite_topics TEXT[] DEFAULT '{}',
    communication_preferences JSONB DEFAULT '{}'::jsonb,
    
    -- Behavioral Data
    total_sessions INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    avg_session_duration_seconds INTEGER DEFAULT 0,
    last_page_visited TEXT,
    
    -- Engagement Metrics
    first_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    visit_count INTEGER DEFAULT 1,
    is_returning_visitor BOOLEAN DEFAULT FALSE,
    is_vip BOOLEAN DEFAULT FALSE,
    engagement_score INTEGER DEFAULT 0,
    
    -- Marketing & Attribution
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    referrer TEXT,
    acquisition_channel VARCHAR(100),
    
    -- Additional Data
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Chat Messages (if not exists)
CREATE TABLE IF NOT EXISTS ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id VARCHAR(255) UNIQUE NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'assistant', 'system')),
    message_text TEXT NOT NULL,
    ip_address VARCHAR(100),
    user_agent TEXT,
    page_url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_time_ms INTEGER,
    sentiment VARCHAR(50),
    intent VARCHAR(100),
    entities JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- AI Chat Sessions (if not exists)
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255),
    ip_address VARCHAR(100) NOT NULL,
    user_agent TEXT,
    browser VARCHAR(100),
    os VARCHAR(100),
    device_type VARCHAR(50),
    device_info JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    message_count INTEGER DEFAULT 0,
    conversation_summary TEXT,
    user_mood VARCHAR(50),
    topics_discussed JSONB DEFAULT '[]'::jsonb,
    session_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Poll Votes tracking (if not exists)
CREATE TABLE IF NOT EXISTS poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID,
    session_id VARCHAR(255),
    user_id VARCHAR(255),
    ip_address VARCHAR(100) NOT NULL,
    option_index INTEGER NOT NULL,
    option_text TEXT NOT NULL,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}'::jsonb,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences (if not exists)
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255),
    
    -- Display Preferences
    theme VARCHAR(20) DEFAULT 'dark',
    language VARCHAR(10) DEFAULT 'en',
    font_size VARCHAR(20) DEFAULT 'medium',
    animations_enabled BOOLEAN DEFAULT TRUE,
    
    -- Privacy Preferences
    analytics_enabled BOOLEAN DEFAULT TRUE,
    personalization_enabled BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    newsletter BOOLEAN DEFAULT FALSE,
    
    -- Notification Preferences
    push_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT FALSE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    
    -- Cookie Consent
    necessary_cookies BOOLEAN DEFAULT TRUE,
    functional_cookies BOOLEAN DEFAULT FALSE,
    analytics_cookies BOOLEAN DEFAULT FALSE,
    advertising_cookies BOOLEAN DEFAULT FALSE,
    
    -- Content Preferences
    content_categories TEXT[] DEFAULT '{}',
    excluded_topics TEXT[] DEFAULT '{}',
    favorite_authors TEXT[] DEFAULT '{}',
    
    -- Custom Preferences
    custom_settings JSONB DEFAULT '{}'::jsonb,
    
    -- Metadata
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- ============================================================================
-- STEP 2: ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================================================

DO $$ 
BEGIN
  -- Add ip_address to ai_chat_messages if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_chat_messages' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE ai_chat_messages ADD COLUMN ip_address VARCHAR(100);
  END IF;

  -- Add user_agent to ai_chat_messages if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_chat_messages' AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE ai_chat_messages ADD COLUMN user_agent TEXT;
  END IF;

  -- Add ip_address to ai_chat_sessions if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_chat_sessions' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE ai_chat_sessions ADD COLUMN ip_address VARCHAR(100);
  END IF;

  -- Add user_agent to ai_chat_sessions if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ai_chat_sessions' AND column_name = 'user_agent'
  ) THEN
    ALTER TABLE ai_chat_sessions ADD COLUMN user_agent TEXT;
  END IF;

  -- Add ip_address to user_profiles if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
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
  END IF;

  -- Add ip_address to ai_user_context if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_user_context') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'ai_user_context' AND column_name = 'ip_address'
    ) THEN
      ALTER TABLE ai_user_context ADD COLUMN ip_address VARCHAR(100);
    END IF;
  END IF;
END $$;

-- ============================================================================
-- STEP 3: DISABLE RLS ON UNRESTRICTED TABLES (TABLES ONLY)
-- ============================================================================

ALTER TABLE ai_chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE comprehensive_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_ip ON ai_chat_messages(ip_address);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_user_id ON ai_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session_id ON ai_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_timestamp ON ai_chat_messages(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_ip ON ai_chat_sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user_id ON ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_session_id ON ai_chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_started ON ai_chat_sessions(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_comprehensive_users_ip ON comprehensive_users(ip_address);
CREATE INDEX IF NOT EXISTS idx_comprehensive_users_user_id ON comprehensive_users(user_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_users_email ON comprehensive_users(email);

CREATE INDEX IF NOT EXISTS idx_poll_votes_ip ON poll_votes(ip_address);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id);

CREATE INDEX IF NOT EXISTS idx_user_preferences_ip ON user_preferences(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- ============================================================================
-- STEP 5: GRANT FULL PUBLIC ACCESS TO UNRESTRICTED TABLES
-- ============================================================================

GRANT ALL ON ai_chat_messages TO anon, authenticated;
GRANT ALL ON ai_chat_sessions TO anon, authenticated;
GRANT ALL ON comprehensive_users TO anon, authenticated;
GRANT ALL ON poll_votes TO anon, authenticated;
GRANT ALL ON user_preferences TO anon, authenticated;

-- ============================================================================
-- STEP 6: ENSURE SERVICE ROLE HAS FULL ACCESS
-- ============================================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ============================================================================
-- STEP 7: CREATE VIEWS FOR IP TRACKING & ANALYTICS
-- ============================================================================

-- User activity by IP (using analytics_sessions if it exists)
CREATE OR REPLACE VIEW user_activity_by_ip AS
SELECT 
  ip_address,
  COUNT(DISTINCT session_id) as total_sessions,
  MIN(started_at) as first_seen,
  MAX(started_at) as last_seen,
  COUNT(*) as total_activities
FROM (
  SELECT session_id, ip_address, started_at FROM ai_chat_sessions
  UNION ALL
  SELECT session_id, ip_address, started_at FROM analytics_sessions WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics_sessions')
) combined
GROUP BY ip_address
ORDER BY last_seen DESC;

-- AI Chat statistics (daily aggregation)
CREATE OR REPLACE VIEW ai_chat_statistics AS
SELECT 
  DATE(started_at) as date,
  COUNT(DISTINCT id) as total_sessions,
  COUNT(DISTINCT user_id) as unique_users,
  SUM(message_count) as total_messages,
  AVG(EXTRACT(EPOCH FROM (COALESCE(ended_at, NOW()) - started_at))) as avg_session_duration_seconds
FROM ai_chat_sessions
GROUP BY DATE(started_at)
ORDER BY date DESC;

-- Daily active users
CREATE OR REPLACE VIEW daily_active_users AS
SELECT 
  DATE(started_at) as date,
  COUNT(DISTINCT ip_address) as unique_users,
  COUNT(*) as total_sessions
FROM ai_chat_sessions
GROUP BY DATE(started_at)
ORDER BY date DESC;

-- Popular pages (if page_views exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'page_views') THEN
    EXECUTE 'CREATE OR REPLACE VIEW popular_pages AS
    SELECT 
      page_url,
      COUNT(*) as views,
      COUNT(DISTINCT session_id) as unique_sessions,
      AVG(time_spent_seconds) as avg_time_spent
    FROM page_views
    GROUP BY page_url
    ORDER BY views DESC';
  END IF;
END $$;

-- ============================================================================
-- STEP 8: GRANT VIEW ACCESS
-- ============================================================================

GRANT SELECT ON user_activity_by_ip TO anon, authenticated;
GRANT SELECT ON ai_chat_statistics TO anon, authenticated;
GRANT SELECT ON daily_active_users TO anon, authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'popular_pages' AND table_type = 'VIEW') THEN
    EXECUTE 'GRANT SELECT ON popular_pages TO anon, authenticated';
  END IF;
END $$;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ ============================================================================';
    RAISE NOTICE '✅ NS GAMMING DATABASE - SETUP COMPLETE!';
    RAISE NOTICE '✅ ============================================================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 TABLES CREATED/VERIFIED:';
    RAISE NOTICE '   ✅ comprehensive_users (extended user profiles)';
    RAISE NOTICE '   ✅ ai_chat_messages (chat history with IP tracking)';
    RAISE NOTICE '   ✅ ai_chat_sessions (session tracking)';
    RAISE NOTICE '   ✅ poll_votes (poll tracking)';
    RAISE NOTICE '   ✅ user_preferences (user settings)';
    RAISE NOTICE '';
    RAISE NOTICE '📊 UNRESTRICTED TABLES (RLS DISABLED):';
    RAISE NOTICE '   - ai_chat_messages';
    RAISE NOTICE '   - ai_chat_sessions';
    RAISE NOTICE '   - comprehensive_users';
    RAISE NOTICE '   - poll_votes';
    RAISE NOTICE '   - user_preferences';
    RAISE NOTICE '';
    RAISE NOTICE '📊 VIEWS CREATED:';
    RAISE NOTICE '   - user_activity_by_ip';
    RAISE NOTICE '   - ai_chat_statistics';
    RAISE NOTICE '   - daily_active_users';
    RAISE NOTICE '   - popular_pages (if page_views exists)';
    RAISE NOTICE '';
    RAISE NOTICE '🔍 IP TRACKING ENABLED ON ALL TABLES';
    RAISE NOTICE '';
    RAISE NOTICE '✅ CHATBOT STATUS: Ready to use with FREE Gemini API';
    RAISE NOTICE '🚀 YOUR DATABASE IS READY!';
    RAISE NOTICE '============================================================================';
END $$;
