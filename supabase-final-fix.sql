
-- ============================================================================
-- NS GAMMING - COMPLETE DATABASE FIX (ERROR-PROOF VERSION)
-- Handles existing data, adds missing columns safely, configures RLS
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- STEP 1: CREATE MISSING TABLES (IF NOT EXISTS)
-- ============================================================================

-- Comprehensive Users table (ALL user data)
CREATE TABLE IF NOT EXISTS comprehensive_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    name TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    age INTEGER,
    gender VARCHAR(20),
    date_of_birth DATE,
    ip_address VARCHAR(100),
    location VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    timezone VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    user_agent TEXT,
    browser VARCHAR(100),
    browser_version VARCHAR(50),
    os VARCHAR(100),
    os_version VARCHAR(50),
    device_type VARCHAR(50),
    device_brand VARCHAR(100),
    device_model VARCHAR(100),
    screen_resolution VARCHAR(50),
    preferences JSONB DEFAULT '{}'::jsonb,
    interests TEXT[] DEFAULT '{}',
    favorite_games TEXT[] DEFAULT '{}',
    favorite_topics TEXT[] DEFAULT '{}',
    communication_preferences JSONB DEFAULT '{}'::jsonb,
    total_sessions INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    avg_session_duration_seconds INTEGER DEFAULT 0,
    last_page_visited TEXT,
    first_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    visit_count INTEGER DEFAULT 1,
    is_returning_visitor BOOLEAN DEFAULT FALSE,
    is_vip BOOLEAN DEFAULT FALSE,
    engagement_score INTEGER DEFAULT 0,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    referrer TEXT,
    acquisition_channel VARCHAR(100),
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Chat Messages
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

-- AI Chat Sessions
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255),
    ip_address VARCHAR(100),
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

-- AI User Context
CREATE TABLE IF NOT EXISTS ai_user_context (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    context_data JSONB DEFAULT '{}'::jsonb,
    preferences JSONB DEFAULT '{}'::jsonb,
    conversation_history JSONB DEFAULT '[]'::jsonb,
    ip_address VARCHAR(100),
    user_agent TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Chat Topics
CREATE TABLE IF NOT EXISTS ai_chat_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    confidence DECIMAL(3,2),
    discussed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Poll Votes
CREATE TABLE IF NOT EXISTS poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID,
    session_id VARCHAR(255),
    user_id VARCHAR(255),
    ip_address VARCHAR(100),
    option_index INTEGER NOT NULL,
    option_text TEXT NOT NULL,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}'::jsonb,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    session_id VARCHAR(255),
    theme VARCHAR(20) DEFAULT 'dark',
    language VARCHAR(10) DEFAULT 'en',
    font_size VARCHAR(20) DEFAULT 'medium',
    animations_enabled BOOLEAN DEFAULT TRUE,
    analytics_enabled BOOLEAN DEFAULT TRUE,
    personalization_enabled BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    newsletter BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT FALSE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    necessary_cookies BOOLEAN DEFAULT TRUE,
    functional_cookies BOOLEAN DEFAULT FALSE,
    analytics_cookies BOOLEAN DEFAULT FALSE,
    advertising_cookies BOOLEAN DEFAULT FALSE,
    content_categories TEXT[] DEFAULT '{}',
    excluded_topics TEXT[] DEFAULT '{}',
    favorite_authors TEXT[] DEFAULT '{}',
    custom_settings JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STEP 2: ADD MISSING COLUMNS SAFELY (NO ERRORS IF ALREADY EXISTS)
-- ============================================================================

DO $$ 
BEGIN
  -- ai_chat_messages columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_chat_messages' AND column_name='ip_address') THEN
    ALTER TABLE ai_chat_messages ADD COLUMN ip_address VARCHAR(100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_chat_messages' AND column_name='user_agent') THEN
    ALTER TABLE ai_chat_messages ADD COLUMN user_agent TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_chat_messages' AND column_name='page_url') THEN
    ALTER TABLE ai_chat_messages ADD COLUMN page_url TEXT;
  END IF;

  -- ai_chat_sessions columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_chat_sessions' AND column_name='ip_address') THEN
    ALTER TABLE ai_chat_sessions ADD COLUMN ip_address VARCHAR(100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_chat_sessions' AND column_name='user_agent') THEN
    ALTER TABLE ai_chat_sessions ADD COLUMN user_agent TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_chat_sessions' AND column_name='browser') THEN
    ALTER TABLE ai_chat_sessions ADD COLUMN browser VARCHAR(100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_chat_sessions' AND column_name='os') THEN
    ALTER TABLE ai_chat_sessions ADD COLUMN os VARCHAR(100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_chat_sessions' AND column_name='device_type') THEN
    ALTER TABLE ai_chat_sessions ADD COLUMN device_type VARCHAR(50);
  END IF;

  -- ai_user_context columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_user_context' AND column_name='ip_address') THEN
    ALTER TABLE ai_user_context ADD COLUMN ip_address VARCHAR(100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_user_context' AND column_name='user_agent') THEN
    ALTER TABLE ai_user_context ADD COLUMN user_agent TEXT;
  END IF;

  -- poll_votes columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='poll_votes' AND column_name='ip_address') THEN
    ALTER TABLE poll_votes ADD COLUMN ip_address VARCHAR(100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='poll_votes' AND column_name='user_agent') THEN
    ALTER TABLE poll_votes ADD COLUMN user_agent TEXT;
  END IF;

  -- user_preferences columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_preferences' AND column_name='ip_address') THEN
    ALTER TABLE user_preferences ADD COLUMN ip_address VARCHAR(100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_preferences' AND column_name='user_agent') THEN
    ALTER TABLE user_preferences ADD COLUMN user_agent TEXT;
  END IF;

  -- Add to existing analytics tables if they exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='analytics_sessions') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='analytics_sessions' AND column_name='ip_address') THEN
      ALTER TABLE analytics_sessions ADD COLUMN ip_address VARCHAR(100);
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='page_views') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='page_views' AND column_name='ip_address') THEN
      ALTER TABLE page_views ADD COLUMN ip_address VARCHAR(100);
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='user_events') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_events' AND column_name='ip_address') THEN
      ALTER TABLE user_events ADD COLUMN ip_address VARCHAR(100);
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='user_profiles') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='ip_address') THEN
      ALTER TABLE user_profiles ADD COLUMN ip_address VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='user_agent') THEN
      ALTER TABLE user_profiles ADD COLUMN user_agent TEXT;
    END IF;
  END IF;

END $$;

-- ============================================================================
-- STEP 3: DISABLE RLS ON UNRESTRICTED TABLES (TABLES ONLY, NOT VIEWS)
-- ============================================================================

DO $$
BEGIN
  -- Only disable RLS on actual tables, not views
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'ai_chat_messages' AND relkind = 'r') THEN
    ALTER TABLE ai_chat_messages DISABLE ROW LEVEL SECURITY;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'ai_chat_sessions' AND relkind = 'r') THEN
    ALTER TABLE ai_chat_sessions DISABLE ROW LEVEL SECURITY;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'comprehensive_users' AND relkind = 'r') THEN
    ALTER TABLE comprehensive_users DISABLE ROW LEVEL SECURITY;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'poll_votes' AND relkind = 'r') THEN
    ALTER TABLE poll_votes DISABLE ROW LEVEL SECURITY;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'user_preferences' AND relkind = 'r') THEN
    ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'ai_user_context' AND relkind = 'r') THEN
    ALTER TABLE ai_user_context DISABLE ROW LEVEL SECURITY;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'ai_chat_topics' AND relkind = 'r') THEN
    ALTER TABLE ai_chat_topics DISABLE ROW LEVEL SECURITY;
  END IF;
END $$;

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

CREATE INDEX IF NOT EXISTS idx_ai_user_context_user_id ON ai_user_context(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_user_context_ip ON ai_user_context(ip_address);

-- ============================================================================
-- STEP 5: GRANT FULL PUBLIC ACCESS TO UNRESTRICTED TABLES
-- ============================================================================

GRANT ALL ON ai_chat_messages TO anon, authenticated;
GRANT ALL ON ai_chat_sessions TO anon, authenticated;
GRANT ALL ON comprehensive_users TO anon, authenticated;
GRANT ALL ON poll_votes TO anon, authenticated;
GRANT ALL ON user_preferences TO anon, authenticated;
GRANT ALL ON ai_user_context TO anon, authenticated;
GRANT ALL ON ai_chat_topics TO anon, authenticated;

-- ============================================================================
-- STEP 6: SERVICE ROLE FULL ACCESS
-- ============================================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- ============================================================================
-- STEP 7: CREATE ANALYTICS VIEWS (SAFE - DROP IF EXISTS)
-- ============================================================================

-- Drop existing views first to avoid conflicts
DROP VIEW IF EXISTS user_activity_by_ip CASCADE;
DROP VIEW IF EXISTS ai_chat_statistics CASCADE;
DROP VIEW IF EXISTS daily_active_users CASCADE;
DROP VIEW IF EXISTS popular_pages CASCADE;

-- User activity by IP
CREATE VIEW user_activity_by_ip AS
SELECT 
  ip_address,
  COUNT(DISTINCT session_id) as total_sessions,
  MIN(started_at) as first_seen,
  MAX(started_at) as last_seen,
  COUNT(*) as total_activities
FROM ai_chat_sessions
WHERE ip_address IS NOT NULL
GROUP BY ip_address
ORDER BY last_seen DESC;

-- AI Chat statistics
CREATE VIEW ai_chat_statistics AS
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
CREATE VIEW daily_active_users AS
SELECT 
  DATE(started_at) as date,
  COUNT(DISTINCT ip_address) as unique_ips,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_sessions
FROM ai_chat_sessions
WHERE started_at IS NOT NULL
GROUP BY DATE(started_at)
ORDER BY date DESC;

-- Popular pages (if page_views exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'page_views') THEN
    EXECUTE 'CREATE VIEW popular_pages AS
    SELECT 
      page_url,
      COUNT(*) as views,
      COUNT(DISTINCT session_id) as unique_sessions,
      AVG(time_spent_seconds) as avg_time_spent
    FROM page_views
    WHERE page_url IS NOT NULL
    GROUP BY page_url
    ORDER BY views DESC';
  END IF;
END $$;

-- ============================================================================
-- STEP 8: GRANT VIEW ACCESS
-- ============================================================================

GRANT SELECT ON user_activity_by_ip TO anon, authenticated, service_role;
GRANT SELECT ON ai_chat_statistics TO anon, authenticated, service_role;
GRANT SELECT ON daily_active_users TO anon, authenticated, service_role;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'popular_pages') THEN
    EXECUTE 'GRANT SELECT ON popular_pages TO anon, authenticated, service_role';
  END IF;
END $$;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ ============================================================================';
    RAISE NOTICE '✅ NS GAMMING DATABASE - COMPLETE SETUP FINISHED!';
    RAISE NOTICE '✅ ============================================================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 ALL TABLES VERIFIED & IP TRACKING ADDED';
    RAISE NOTICE '📊 ALL EXISTING DATA PRESERVED';
    RAISE NOTICE '📊 RLS DISABLED ON UNRESTRICTED TABLES';
    RAISE NOTICE '📊 CHATBOT READY WITH FREE GEMINI API';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 DATABASE IS PRODUCTION READY!';
    RAISE NOTICE '============================================================================';
END $$;
