-- ============================================================================
-- NS GAMMING - COMPLETE UPDATED DATABASE SCHEMA FOR SUPABASE
-- This SQL creates ALL tables needed for the application
-- Copy and paste this entire file into Supabase SQL Editor
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- SECTION 1: DISABLE RLS ON ALL UNRESTRICTED TABLES
-- ============================================================================
-- Based on your list, these tables should have RLS disabled (Unrestricted)

ALTER TABLE IF EXISTS ai_chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_chat_statistics DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS comprehensive_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS daily_active_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS poll_votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS popular_pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_activity_by_ip DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_preferences DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTION 2: CREATE MISSING TABLES (that don't exist yet)
-- ============================================================================

-- AI Chat Statistics (aggregated analytics for AI chat)
CREATE TABLE IF NOT EXISTS ai_chat_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    total_sessions INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    avg_session_duration_seconds INTEGER DEFAULT 0,
    avg_messages_per_session NUMERIC(10,2) DEFAULT 0,
    top_topics JSONB DEFAULT '[]'::jsonb,
    top_intents JSONB DEFAULT '[]'::jsonb,
    sentiment_breakdown JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Poll Votes tracking (who voted for what)
CREATE TABLE IF NOT EXISTS poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    user_id VARCHAR(255),
    ip_address VARCHAR(100) NOT NULL,
    option_index INTEGER NOT NULL,
    option_text TEXT NOT NULL,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}'::jsonb,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences (detailed preference tracking)
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- AI Chat Statistics indexes
CREATE INDEX IF NOT EXISTS idx_ai_chat_statistics_date ON ai_chat_statistics(date DESC);

-- Comprehensive Users indexes
CREATE INDEX IF NOT EXISTS idx_comprehensive_users_user_id ON comprehensive_users(user_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_users_email ON comprehensive_users(email);
CREATE INDEX IF NOT EXISTS idx_comprehensive_users_ip ON comprehensive_users(ip_address);
CREATE INDEX IF NOT EXISTS idx_comprehensive_users_last_visit ON comprehensive_users(last_visit DESC);
CREATE INDEX IF NOT EXISTS idx_comprehensive_users_is_vip ON comprehensive_users(is_vip) WHERE is_vip = TRUE;
CREATE INDEX IF NOT EXISTS idx_comprehensive_users_country ON comprehensive_users(country);

-- Poll Votes indexes
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_session_id ON poll_votes(session_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user_id ON poll_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_ip ON poll_votes(ip_address);
CREATE INDEX IF NOT EXISTS idx_poll_votes_voted_at ON poll_votes(voted_at DESC);

-- User Preferences indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_session_id ON user_preferences(session_id);

-- ============================================================================
-- SECTION 4: CREATE/UPDATE VIEWS FOR ANALYTICS
-- ============================================================================

-- Create view for user activity by IP (if not exists)
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

-- Daily active users view (aggregated)
CREATE OR REPLACE VIEW daily_active_users AS
SELECT 
    DATE(started_at) as date,
    COUNT(DISTINCT ip_address) as unique_users,
    COUNT(DISTINCT session_id) as total_sessions,
    COUNT(DISTINCT CASE WHEN is_active THEN session_id END) as active_sessions,
    AVG(session_duration_seconds) as avg_session_duration
FROM analytics_sessions
GROUP BY DATE(started_at)
ORDER BY date DESC;

-- Popular pages view
CREATE OR REPLACE VIEW popular_pages AS
SELECT 
    page_url,
    COUNT(*) as total_views,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT ip_address) as unique_visitors,
    AVG(time_spent_seconds) as avg_time_spent,
    MAX(viewed_at) as last_viewed
FROM page_views
GROUP BY page_url
ORDER BY total_views DESC;

-- ============================================================================
-- SECTION 5: UPDATE RLS POLICIES (Service role has full access)
-- ============================================================================

-- Ensure service role has full access to new tables
DROP POLICY IF EXISTS "Service role full access ai_chat_statistics" ON ai_chat_statistics;
CREATE POLICY "Service role full access ai_chat_statistics" ON ai_chat_statistics FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access comprehensive_users" ON comprehensive_users;
CREATE POLICY "Service role full access comprehensive_users" ON comprehensive_users FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access poll_votes" ON poll_votes;
CREATE POLICY "Service role full access poll_votes" ON poll_votes FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access user_preferences" ON user_preferences;
CREATE POLICY "Service role full access user_preferences" ON user_preferences FOR ALL USING (auth.role() = 'service_role');

-- Allow public insert for tracking tables
DROP POLICY IF EXISTS "Public insert poll_votes" ON poll_votes;
CREATE POLICY "Public insert poll_votes" ON poll_votes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert user_preferences" ON user_preferences;
CREATE POLICY "Public insert user_preferences" ON user_preferences FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert comprehensive_users" ON comprehensive_users;
CREATE POLICY "Public insert comprehensive_users" ON comprehensive_users FOR INSERT WITH CHECK (true);

-- ============================================================================
-- SECTION 6: GRANT PERMISSIONS
-- ============================================================================

-- Grant all privileges to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Grant select on views to authenticated users
GRANT SELECT ON user_activity_by_ip TO authenticated;
GRANT SELECT ON daily_active_users TO authenticated;
GRANT SELECT ON popular_pages TO authenticated;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Database schema updated successfully!';
    RAISE NOTICE '📊 Tables created/updated: ai_chat_statistics, comprehensive_users, poll_votes, user_preferences';
    RAISE NOTICE '👁️ Views created: user_activity_by_ip, daily_active_users, popular_pages';
    RAISE NOTICE '🔒 RLS policies configured for service_role access';
    RAISE NOTICE '🚀 Your NS GAMMING database is ready to use!';
END $$;
