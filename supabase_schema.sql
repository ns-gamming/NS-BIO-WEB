-- ============================================================================
-- NS GAMMING - COMPREHENSIVE DATABASE SCHEMA FOR SUPABASE
-- Advanced User Tracking, AI Chat Storage & Analytics System
-- ============================================================================
-- Copy and paste this entire file into Supabase SQL Editor
-- This schema is designed for maximum detail tracking while maintaining performance
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- Main users table with comprehensive profile information
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash TEXT,
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    timezone VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    account_status VARCHAR(20) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- User preferences and settings
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'dark',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    privacy_settings JSONB DEFAULT '{}'::jsonb,
    display_preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SESSION TRACKING & ANALYTICS
-- ============================================================================

-- Comprehensive session tracking with device information
CREATE TABLE IF NOT EXISTS analytics_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    browser VARCHAR(100),
    os VARCHAR(100),
    device_type VARCHAR(50),
    device_info JSONB DEFAULT '{}'::jsonb,
    geolocation JSONB DEFAULT '{}'::jsonb,
    referrer TEXT,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    session_duration_seconds INTEGER,
    total_page_views INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_events INTEGER DEFAULT 0
);

-- Page views tracking with time spent
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    page_url TEXT NOT NULL,
    page_title VARCHAR(500),
    page_path VARCHAR(500),
    referrer TEXT,
    ip_address INET,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent_seconds INTEGER DEFAULT 0,
    scroll_depth_percentage INTEGER,
    exit_page BOOLEAN DEFAULT FALSE,
    bounce BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Detailed user events tracking (clicks, interactions, etc.)
CREATE TABLE IF NOT EXISTS user_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(100),
    event_action VARCHAR(100),
    event_label VARCHAR(255),
    element_id VARCHAR(255),
    element_class VARCHAR(255),
    element_text TEXT,
    element_tag VARCHAR(50),
    page_url TEXT,
    ip_address INET,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event_value NUMERIC,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Click tracking with precise element information
CREATE TABLE IF NOT EXISTS click_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    page_url TEXT NOT NULL,
    element_selector TEXT,
    element_id VARCHAR(255),
    element_class VARCHAR(255),
    element_text TEXT,
    element_html TEXT,
    click_x INTEGER,
    click_y INTEGER,
    ip_address INET,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Form submissions tracking
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    form_name VARCHAR(255) NOT NULL,
    form_id VARCHAR(255),
    page_url TEXT,
    form_data JSONB NOT NULL,
    ip_address INET,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- AI CHAT SYSTEM WITH FULL CONVERSATION TRACKING
-- ============================================================================

-- AI Chat sessions
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    browser VARCHAR(100),
    os VARCHAR(100),
    device_info JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    total_messages INTEGER DEFAULT 0,
    conversation_summary TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Individual chat messages with full context
CREATE TABLE IF NOT EXISTS ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_session_id UUID REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    message_role VARCHAR(20) NOT NULL CHECK (message_role IN ('user', 'assistant', 'system')),
    message_content TEXT NOT NULL,
    ip_address INET,
    page_url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_time_ms INTEGER,
    tokens_used INTEGER,
    model_version VARCHAR(50),
    sentiment VARCHAR(20),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- AI Chat topics and categorization
CREATE TABLE IF NOT EXISTS ai_chat_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_session_id UUID REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confidence_score NUMERIC(3,2)
);

-- User preferences for AI (to remember context)
CREATE TABLE IF NOT EXISTS ai_user_context (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID,
    ip_address INET,
    context_key VARCHAR(255) NOT NULL,
    context_value TEXT NOT NULL,
    context_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- ENHANCED FEEDBACK SYSTEM
-- ============================================================================

-- Page/Tool feedback with detailed tracking
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES analytics_sessions(session_id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    page_name VARCHAR(255) NOT NULL,
    page_url TEXT,
    tool_name VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    feedback_category VARCHAR(100),
    user_ip INET NOT NULL,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_resolved BOOLEAN DEFAULT FALSE,
    admin_response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Blog post feedback
CREATE TABLE IF NOT EXISTS blog_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES analytics_sessions(session_id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    blog_slug VARCHAR(255) NOT NULL,
    blog_title VARCHAR(500),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    was_helpful BOOLEAN,
    suggested_improvements TEXT,
    user_ip INET NOT NULL,
    user_agent TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Feature requests and suggestions
CREATE TABLE IF NOT EXISTS feature_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID,
    feature_title VARCHAR(255) NOT NULL,
    feature_description TEXT NOT NULL,
    category VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'submitted',
    votes INTEGER DEFAULT 0,
    ip_address INET,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Bug reports
CREATE TABLE IF NOT EXISTS bug_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID,
    bug_title VARCHAR(255) NOT NULL,
    bug_description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    page_url TEXT,
    browser VARCHAR(100),
    os VARCHAR(100),
    device_info JSONB,
    steps_to_reproduce TEXT,
    expected_behavior TEXT,
    actual_behavior TEXT,
    screenshot_url TEXT,
    status VARCHAR(50) DEFAULT 'open',
    ip_address INET,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- PRIVACY & CONSENT MANAGEMENT (ADSENSE COMPLIANCE)
-- ============================================================================

-- User consent tracking for GDPR/AdSense compliance
CREATE TABLE IF NOT EXISTS user_consent (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    consent_type VARCHAR(50) NOT NULL,
    consent_given BOOLEAN NOT NULL,
    consent_version VARCHAR(20),
    geo_location VARCHAR(100),
    browser VARCHAR(100),
    device_type VARCHAR(50),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Cookie consent preferences
CREATE TABLE IF NOT EXISTS cookie_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    necessary_cookies BOOLEAN DEFAULT TRUE,
    functional_cookies BOOLEAN DEFAULT FALSE,
    analytics_cookies BOOLEAN DEFAULT FALSE,
    advertising_cookies BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- BLOG & CONTENT ENGAGEMENT
-- ============================================================================

-- Blog posts (existing table - enhanced)
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT,
    read_time INTEGER NOT NULL,
    views INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    seo_title VARCHAR(255),
    seo_description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Blog shares tracking
CREATE TABLE IF NOT EXISTS blog_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_slug TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    session_id UUID,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- TOOLS & ENGAGEMENT
-- ============================================================================

-- Tool usage tracking
CREATE TABLE IF NOT EXISTS tool_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_name TEXT NOT NULL,
    session_id UUID REFERENCES analytics_sessions(session_id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    usage_count INTEGER DEFAULT 1,
    ip_address INET,
    input_data JSONB,
    output_data JSONB,
    execution_time_ms INTEGER,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Tool rate limiting
CREATE TABLE IF NOT EXISTS tool_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip INET NOT NULL,
    tool_name TEXT NOT NULL,
    session_id UUID,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- POLLS & ENGAGEMENT
-- ============================================================================

-- Polls table
CREATE TABLE IF NOT EXISTS polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    votes TEXT[] NOT NULL DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Poll votes tracking
CREATE TABLE IF NOT EXISTS poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    option_index INTEGER NOT NULL,
    session_id UUID,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET NOT NULL,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- VISITOR STATISTICS
-- ============================================================================

-- Daily visitor statistics
CREATE TABLE IF NOT EXISTS visitor_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE UNIQUE NOT NULL,
    unique_visitors INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    average_session_duration_seconds INTEGER,
    bounce_rate NUMERIC(5,2),
    top_pages JSONB DEFAULT '[]'::jsonb,
    top_referrers JSONB DEFAULT '[]'::jsonb,
    device_breakdown JSONB DEFAULT '{}'::jsonb,
    country_breakdown JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at);

-- Analytics sessions indexes
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_user_id ON analytics_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_ip ON analytics_sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_started_at ON analytics_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_active ON analytics_sessions(is_active) WHERE is_active = TRUE;

-- Page views indexes
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page_url ON page_views(page_url);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at DESC);

-- User events indexes
CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_occurred_at ON user_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_events_metadata ON user_events USING GIN (metadata);

-- Click tracking indexes
CREATE INDEX IF NOT EXISTS idx_click_tracking_session_id ON click_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_click_tracking_user_id ON click_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_click_tracking_clicked_at ON click_tracking(clicked_at DESC);

-- AI chat sessions indexes
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_session_id ON ai_chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user_id ON ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_ip ON ai_chat_sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_started_at ON ai_chat_sessions(started_at DESC);

-- AI chat messages indexes
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_chat_session_id ON ai_chat_messages(chat_session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session_id ON ai_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_user_id ON ai_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_timestamp ON ai_chat_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_role ON ai_chat_messages(message_role);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_metadata ON ai_chat_messages USING GIN (metadata);

-- AI user context indexes
CREATE INDEX IF NOT EXISTS idx_ai_user_context_user_id ON ai_user_context(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_user_context_session_id ON ai_user_context(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_user_context_key ON ai_user_context(context_key);

-- Feedback indexes
CREATE INDEX IF NOT EXISTS idx_user_feedback_session_id ON user_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_page_name ON user_feedback(page_name);
CREATE INDEX IF NOT EXISTS idx_user_feedback_submitted_at ON user_feedback(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_feedback_rating ON user_feedback(rating);

-- Blog feedback indexes
CREATE INDEX IF NOT EXISTS idx_blog_feedback_blog_slug ON blog_feedback(blog_slug);
CREATE INDEX IF NOT EXISTS idx_blog_feedback_submitted_at ON blog_feedback(submitted_at DESC);

-- Consent indexes
CREATE INDEX IF NOT EXISTS idx_user_consent_user_id ON user_consent(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consent_session_id ON user_consent(session_id);
CREATE INDEX IF NOT EXISTS idx_user_consent_type ON user_consent(consent_type);
CREATE INDEX IF NOT EXISTS idx_user_consent_active ON user_consent(is_active) WHERE is_active = TRUE;

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published) WHERE published = TRUE;
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Tool usage indexes
CREATE INDEX IF NOT EXISTS idx_tool_usage_tool_name ON tool_usage(tool_name);
CREATE INDEX IF NOT EXISTS idx_tool_usage_session_id ON tool_usage(session_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_used_at ON tool_usage(used_at DESC);

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================

-- Active sessions view
CREATE OR REPLACE VIEW active_sessions AS
SELECT 
    s.session_id,
    s.user_id,
    s.ip_address,
    s.browser,
    s.os,
    s.device_type,
    s.started_at,
    s.total_page_views,
    s.total_clicks,
    EXTRACT(EPOCH FROM (NOW() - s.started_at)) AS session_duration_seconds
FROM analytics_sessions s
WHERE s.is_active = TRUE
ORDER BY s.started_at DESC;

-- Daily active users view
CREATE OR REPLACE VIEW daily_active_users AS
SELECT 
    DATE(started_at) as date,
    COUNT(DISTINCT COALESCE(user_id::text, ip_address::text)) as unique_users,
    COUNT(*) as total_sessions
FROM analytics_sessions
GROUP BY DATE(started_at)
ORDER BY date DESC;

-- Popular pages view
CREATE OR REPLACE VIEW popular_pages AS
SELECT 
    page_url,
    COUNT(*) as views,
    COUNT(DISTINCT session_id) as unique_sessions,
    AVG(time_spent_seconds) as avg_time_spent
FROM page_views
WHERE viewed_at > NOW() - INTERVAL '7 days'
GROUP BY page_url
ORDER BY views DESC
LIMIT 20;

-- AI chat statistics view
CREATE OR REPLACE VIEW ai_chat_statistics AS
SELECT 
    DATE(started_at) as date,
    COUNT(DISTINCT id) as total_chat_sessions,
    COUNT(DISTINCT user_id) as unique_users,
    SUM(total_messages) as total_messages
FROM ai_chat_sessions
GROUP BY DATE(started_at)
ORDER BY date DESC;

-- ============================================================================
-- FUNCTIONS FOR AUTO-UPDATING
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (OPTIONAL - ENABLE IF NEEDED)
-- ============================================================================

-- Enable RLS on sensitive tables (uncomment to activate)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_consent ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- Example RLS policy for users to see only their own data
-- CREATE POLICY users_select_own ON users
--     FOR SELECT USING (auth.uid() = id);

-- ============================================================================
-- SAMPLE QUERIES FOR ANALYTICS
-- ============================================================================

-- Get user activity summary
-- SELECT 
--     u.username,
--     COUNT(DISTINCT s.session_id) as total_sessions,
--     COUNT(DISTINCT pv.id) as total_page_views,
--     COUNT(DISTINCT e.id) as total_events,
--     MAX(s.started_at) as last_visit
-- FROM users u
-- LEFT JOIN analytics_sessions s ON u.id = s.user_id
-- LEFT JOIN page_views pv ON s.session_id = pv.session_id
-- LEFT JOIN user_events e ON s.session_id = e.session_id
-- GROUP BY u.id, u.username
-- ORDER BY total_sessions DESC;

-- Get AI chat history for a user
-- SELECT 
--     cs.session_id,
--     cs.started_at,
--     cs.ip_address,
--     m.message_role,
--     m.message_content,
--     m.timestamp
-- FROM ai_chat_sessions cs
-- JOIN ai_chat_messages m ON cs.id = m.chat_session_id
-- WHERE cs.user_id = 'USER_ID_HERE'
-- ORDER BY cs.started_at DESC, m.timestamp ASC;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- This schema provides:
-- ✅ Complete user tracking (clicks, events, sessions, IP, device info)
-- ✅ AI chat history storage with full context
-- ✅ Enhanced feedback system across all pages
-- ✅ Privacy/consent management for AdSense compliance
-- ✅ Performance-optimized indexes
-- ✅ Analytics views for easy reporting
-- ============================================================================
