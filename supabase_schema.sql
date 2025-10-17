
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
-- DROP ALL EXISTING TABLES (Clean slate)
-- ============================================================================
DROP TABLE IF EXISTS ai_chat_topics CASCADE;
DROP TABLE IF EXISTS ai_user_context CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS blog_shares CASCADE;
DROP TABLE IF EXISTS blog_feedback CASCADE;
DROP TABLE IF EXISTS feature_requests CASCADE;
DROP TABLE IF EXISTS bug_reports CASCADE;
DROP TABLE IF EXISTS user_feedback CASCADE;
DROP TABLE IF EXISTS cookie_preferences CASCADE;
DROP TABLE IF EXISTS user_consent CASCADE;
DROP TABLE IF EXISTS form_submissions CASCADE;
DROP TABLE IF EXISTS click_tracking CASCADE;
DROP TABLE IF EXISTS user_events CASCADE;
DROP TABLE IF EXISTS page_views CASCADE;
DROP TABLE IF EXISTS analytics_sessions CASCADE;
DROP TABLE IF EXISTS tool_rate_limits CASCADE;
DROP TABLE IF EXISTS tool_usage CASCADE;
DROP TABLE IF EXISTS visitor_stats CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS usage_logs CASCADE;
DROP TABLE IF EXISTS ff_bot_interactions CASCADE;

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- Main users table
CREATE TABLE users (
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

-- ============================================================================
-- SESSION TRACKING & ANALYTICS
-- ============================================================================

-- Comprehensive session tracking with device information
CREATE TABLE analytics_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(100) NOT NULL,
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
CREATE TABLE page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    page_url TEXT NOT NULL,
    page_title VARCHAR(500),
    page_path VARCHAR(500),
    referrer TEXT,
    ip_address VARCHAR(100),
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent_seconds INTEGER DEFAULT 0,
    scroll_depth_percentage INTEGER,
    exit_page BOOLEAN DEFAULT FALSE,
    bounce BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Detailed user events tracking (clicks, interactions, etc.)
CREATE TABLE user_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
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
    ip_address VARCHAR(100),
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event_value NUMERIC,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Click tracking with precise element information
CREATE TABLE click_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    page_url TEXT NOT NULL,
    element_selector TEXT,
    element_id VARCHAR(255),
    element_class VARCHAR(255),
    element_text TEXT,
    element_html TEXT,
    click_x INTEGER,
    click_y INTEGER,
    ip_address VARCHAR(100),
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Form submissions tracking
CREATE TABLE form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    form_name VARCHAR(255) NOT NULL,
    form_id VARCHAR(255),
    page_url TEXT,
    form_data JSONB NOT NULL,
    ip_address VARCHAR(100),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- AI CHAT SYSTEM WITH FULL CONVERSATION TRACKING
-- ============================================================================

-- User profiles for AI chat
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    age INTEGER,
    gender VARCHAR(20),
    ip_address VARCHAR(100),
    additional_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Chat sessions
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    ip_address VARCHAR(100),
    browser VARCHAR(100),
    os VARCHAR(100),
    device_info JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    message_count INTEGER DEFAULT 0,
    conversation_summary TEXT
);

-- Individual chat messages with full context
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id VARCHAR(255) UNIQUE NOT NULL,
    session_id VARCHAR(255) REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'assistant', 'system')),
    message_text TEXT NOT NULL,
    ip_address VARCHAR(100),
    page_url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_time_ms INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- AI Chat topics and categorization
CREATE TABLE ai_chat_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confidence_score NUMERIC(3,2)
);

-- User preferences for AI (to remember context)
CREATE TABLE ai_user_context (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    ip_address VARCHAR(100),
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
CREATE TABLE user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    page_name VARCHAR(100) NOT NULL,
    page_url TEXT,
    tool_name VARCHAR(100),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    feedback_category VARCHAR(100),
    user_ip VARCHAR(100) NOT NULL,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_resolved BOOLEAN DEFAULT FALSE,
    admin_response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Blog post feedback
CREATE TABLE blog_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    blog_slug VARCHAR(255) NOT NULL,
    blog_title VARCHAR(500),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    feedback_text TEXT,
    was_helpful BOOLEAN,
    suggested_improvements TEXT,
    user_ip VARCHAR(100) NOT NULL,
    user_agent TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Feature requests and suggestions
CREATE TABLE feature_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    feature_title VARCHAR(255) NOT NULL,
    feature_description TEXT NOT NULL,
    category VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'submitted',
    votes INTEGER DEFAULT 0,
    ip_address VARCHAR(100),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Bug reports
CREATE TABLE bug_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    bug_title VARCHAR(255) NOT NULL,
    bug_description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    page_url TEXT,
    browser VARCHAR(100),
    os VARCHAR(100),
    device_info JSONB DEFAULT '{}'::jsonb,
    steps_to_reproduce TEXT,
    expected_behavior TEXT,
    actual_behavior TEXT,
    screenshot_url TEXT,
    status VARCHAR(50) DEFAULT 'open',
    ip_address VARCHAR(100),
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- PRIVACY & CONSENT MANAGEMENT (ADSENSE COMPLIANCE)
-- ============================================================================

-- User consent tracking for GDPR/AdSense compliance
CREATE TABLE user_consent (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address VARCHAR(100) NOT NULL,
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
CREATE TABLE cookie_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address VARCHAR(100) NOT NULL,
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

-- Blog posts
CREATE TABLE blog_posts (
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
CREATE TABLE blog_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_slug TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    session_id VARCHAR(255),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(100),
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- TOOLS & ENGAGEMENT
-- ============================================================================

-- Tool usage tracking
CREATE TABLE tool_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_name TEXT NOT NULL,
    session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    usage_count INTEGER DEFAULT 1,
    ip_address VARCHAR(100),
    input_data JSONB,
    output_data JSONB,
    execution_time_ms INTEGER,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Tool rate limiting
CREATE TABLE tool_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip VARCHAR(100) NOT NULL,
    tool_name TEXT NOT NULL,
    session_id VARCHAR(255),
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- POLLS & ENGAGEMENT
-- ============================================================================

-- Polls table
CREATE TABLE polls (
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

-- ============================================================================
-- VISITOR STATISTICS
-- ============================================================================

-- Daily visitor statistics
CREATE TABLE visitor_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TEXT NOT NULL UNIQUE,
    count INTEGER DEFAULT 0 NOT NULL,
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
-- FREE FIRE BOT INTERACTION TRACKING
-- ============================================================================

CREATE TABLE ff_bot_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_ip VARCHAR(100) NOT NULL,
    ff_uid VARCHAR(20) NOT NULL,
    ff_region VARCHAR(10) NOT NULL,
    player_name TEXT,
    player_level INTEGER,
    likes_before INTEGER,
    likes_added INTEGER,
    likes_after INTEGER,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip VARCHAR(100) NOT NULL,
    uid VARCHAR(20) NOT NULL,
    region VARCHAR(10) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login ON users(last_login_at);

-- Analytics sessions indexes
CREATE INDEX idx_analytics_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX idx_analytics_sessions_user_id ON analytics_sessions(user_id);
CREATE INDEX idx_analytics_sessions_ip ON analytics_sessions(ip_address);
CREATE INDEX idx_analytics_sessions_started_at ON analytics_sessions(started_at DESC);
CREATE INDEX idx_analytics_sessions_active ON analytics_sessions(is_active) WHERE is_active = TRUE;

-- Page views indexes
CREATE INDEX idx_page_views_session_id ON page_views(session_id);
CREATE INDEX idx_page_views_user_id ON page_views(user_id);
CREATE INDEX idx_page_views_page_url ON page_views(page_url);
CREATE INDEX idx_page_views_viewed_at ON page_views(viewed_at DESC);

-- User events indexes
CREATE INDEX idx_user_events_session_id ON user_events(session_id);
CREATE INDEX idx_user_events_user_id ON user_events(user_id);
CREATE INDEX idx_user_events_type ON user_events(event_type);
CREATE INDEX idx_user_events_occurred_at ON user_events(occurred_at DESC);
CREATE INDEX idx_user_events_metadata ON user_events USING GIN (metadata);

-- Click tracking indexes
CREATE INDEX idx_click_tracking_session_id ON click_tracking(session_id);
CREATE INDEX idx_click_tracking_user_id ON click_tracking(user_id);
CREATE INDEX idx_click_tracking_clicked_at ON click_tracking(clicked_at DESC);

-- Form submission indexes
CREATE INDEX idx_form_submissions_session_id ON form_submissions(session_id);
CREATE INDEX idx_form_submissions_submitted_at ON form_submissions(submitted_at DESC);

-- Chat indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_ip ON chat_sessions(ip_address);
CREATE INDEX idx_chat_sessions_started_at ON chat_sessions(started_at DESC);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp DESC);

-- AI context indexes
CREATE INDEX idx_ai_user_context_user_id ON ai_user_context(user_id);
CREATE INDEX idx_ai_user_context_session_id ON ai_user_context(session_id);
CREATE INDEX idx_ai_user_context_key ON ai_user_context(context_key);

-- Feedback indexes
CREATE INDEX idx_user_feedback_session_id ON user_feedback(session_id);
CREATE INDEX idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX idx_user_feedback_page_name ON user_feedback(page_name);
CREATE INDEX idx_user_feedback_submitted_at ON user_feedback(submitted_at DESC);
CREATE INDEX idx_user_feedback_rating ON user_feedback(rating);

-- Blog feedback indexes
CREATE INDEX idx_blog_feedback_blog_slug ON blog_feedback(blog_slug);
CREATE INDEX idx_blog_feedback_submitted_at ON blog_feedback(submitted_at DESC);

-- Feature request indexes
CREATE INDEX idx_feature_requests_status ON feature_requests(status);
CREATE INDEX idx_feature_requests_submitted_at ON feature_requests(submitted_at DESC);

-- Bug report indexes
CREATE INDEX idx_bug_reports_status ON bug_reports(status);
CREATE INDEX idx_bug_reports_reported_at ON bug_reports(reported_at DESC);

-- Consent indexes
CREATE INDEX idx_user_consent_user_id ON user_consent(user_id);
CREATE INDEX idx_user_consent_session_id ON user_consent(session_id);
CREATE INDEX idx_user_consent_type ON user_consent(consent_type);
CREATE INDEX idx_user_consent_active ON user_consent(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_cookie_preferences_session_id ON cookie_preferences(session_id);

-- Blog posts indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published ON blog_posts(published) WHERE published = TRUE;
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Tool usage indexes
CREATE INDEX idx_tool_usage_tool_name ON tool_usage(tool_name);
CREATE INDEX idx_tool_usage_session_id ON tool_usage(session_id);
CREATE INDEX idx_tool_usage_used_at ON tool_usage(used_at DESC);

-- FF Bot indexes
CREATE INDEX idx_ff_bot_ip ON ff_bot_interactions(user_ip);
CREATE INDEX idx_ff_bot_uid ON ff_bot_interactions(ff_uid);
CREATE INDEX idx_usage_logs_ip ON usage_logs(ip);
CREATE INDEX idx_usage_logs_date ON usage_logs(used_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_user_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_bot_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Service role has full access to everything
CREATE POLICY "Service role full access analytics_sessions" ON analytics_sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access page_views" ON page_views FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access user_events" ON user_events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access click_tracking" ON click_tracking FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access form_submissions" ON form_submissions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access user_profiles" ON user_profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access chat_sessions" ON chat_sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access chat_messages" ON chat_messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access ai_chat_topics" ON ai_chat_topics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access ai_user_context" ON ai_user_context FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access user_feedback" ON user_feedback FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access blog_feedback" ON blog_feedback FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access feature_requests" ON feature_requests FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access bug_reports" ON bug_reports FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access user_consent" ON user_consent FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access cookie_preferences" ON cookie_preferences FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access ff_bot_interactions" ON ff_bot_interactions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access usage_logs" ON usage_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access blog_shares" ON blog_shares FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access tool_usage" ON tool_usage FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access tool_rate_limits" ON tool_rate_limits FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access polls" ON polls FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access visitor_stats" ON visitor_stats FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access users" ON users FOR ALL USING (auth.role() = 'service_role');

-- Public can insert their own data (backend will use service key)
CREATE POLICY "Public insert analytics_sessions" ON analytics_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert page_views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert user_events" ON user_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert click_tracking" ON click_tracking FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert form_submissions" ON form_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert user_profiles" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert chat_sessions" ON chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert chat_messages" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert ai_chat_topics" ON ai_chat_topics FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert ai_user_context" ON ai_user_context FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert user_feedback" ON user_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert blog_feedback" ON blog_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert feature_requests" ON feature_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert bug_reports" ON bug_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert user_consent" ON user_consent FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert cookie_preferences" ON cookie_preferences FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert ff_bot_interactions" ON ff_bot_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert usage_logs" ON usage_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert blog_shares" ON blog_shares FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert tool_usage" ON tool_usage FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert tool_rate_limits" ON tool_rate_limits FOR INSERT WITH CHECK (true);

-- Public read access for blog posts and polls
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public read polls" ON polls FOR SELECT USING (active = true);

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================

CREATE OR REPLACE VIEW daily_active_users AS
SELECT 
  DATE(started_at) as date,
  COUNT(DISTINCT ip_address) as unique_users,
  COUNT(*) as total_sessions
FROM analytics_sessions
GROUP BY DATE(started_at)
ORDER BY date DESC;

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

CREATE OR REPLACE VIEW ai_chat_statistics AS
SELECT 
  DATE(started_at) as date,
  COUNT(DISTINCT id) as total_chat_sessions,
  COUNT(DISTINCT user_id) as unique_users,
  SUM(message_count) as total_messages
FROM chat_sessions
GROUP BY DATE(started_at)
ORDER BY date DESC;

-- ============================================================================
-- FUNCTIONS FOR AUTO-UPDATING
-- ============================================================================

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

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_requests_updated_at BEFORE UPDATE ON feature_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- This schema provides:
-- ✅ Complete user tracking (clicks, events, sessions, IP, device info)
-- ✅ AI chat history storage with full context and user memory
-- ✅ Enhanced feedback system across all pages
-- ✅ Privacy/consent management for AdSense compliance
-- ✅ Performance-optimized indexes
-- ✅ Row Level Security (RLS) policies enabled
-- ✅ Analytics views for easy reporting
-- ============================================================================
