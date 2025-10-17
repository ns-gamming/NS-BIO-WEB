
-- ================================================
-- NS GAMMING - COMPREHENSIVE DATABASE SCHEMA
-- Advanced User Tracking, AI Chat & Analytics
-- ================================================

-- ================================================
-- ANALYTICS TABLES
-- ================================================

CREATE TABLE IF NOT EXISTS analytics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(100) NOT NULL,
  user_agent TEXT,
  device_info JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
  page_url TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  element_id TEXT,
  element_text TEXT,
  element_tag TEXT,
  page_url TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- New: Click tracking table
CREATE TABLE IF NOT EXISTS click_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
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

-- New: Form submissions tracking
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
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

-- ================================================
-- CHATBOT TABLES (AI CHAT WITH FULL TRACKING)
-- ================================================

CREATE TABLE IF NOT EXISTS user_profiles (
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

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id VARCHAR(255) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  ip_address VARCHAR(100),
  browser VARCHAR(100),
  os VARCHAR(100),
  device_info JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  message_count INTEGER DEFAULT 0,
  conversation_summary TEXT
);

CREATE TABLE IF NOT EXISTS chat_messages (
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

-- New: AI chat topics and categorization
CREATE TABLE IF NOT EXISTS ai_chat_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  topic VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confidence_score NUMERIC(3,2)
);

-- New: AI user context for personalization
CREATE TABLE IF NOT EXISTS ai_user_context (
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

-- ================================================
-- FEEDBACK TABLES (ENHANCED)
-- ================================================

CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  page_name VARCHAR(100) NOT NULL,
  page_url TEXT,
  tool_name VARCHAR(100),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  feedback_category VARCHAR(100),
  user_ip VARCHAR(100),
  user_agent TEXT,
  device_info JSONB DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_resolved BOOLEAN DEFAULT FALSE,
  admin_response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS blog_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  blog_slug VARCHAR(255) NOT NULL,
  blog_title VARCHAR(500),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  feedback_text TEXT,
  was_helpful BOOLEAN,
  suggested_improvements TEXT,
  user_ip VARCHAR(100),
  user_agent TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- New: Feature requests
CREATE TABLE IF NOT EXISTS feature_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- New: Bug reports
CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- ================================================
-- PRIVACY & CONSENT (ADSENSE COMPLIANCE)
-- ================================================

-- New: User consent tracking
CREATE TABLE IF NOT EXISTS user_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
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

-- New: Cookie preferences
CREATE TABLE IF NOT EXISTS cookie_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  ip_address VARCHAR(100) NOT NULL,
  necessary_cookies BOOLEAN DEFAULT TRUE,
  functional_cookies BOOLEAN DEFAULT FALSE,
  analytics_cookies BOOLEAN DEFAULT FALSE,
  advertising_cookies BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ================================================
-- FREE FIRE BOT INTERACTION TRACKING
-- ================================================

CREATE TABLE IF NOT EXISTS ff_bot_interactions (
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

CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip VARCHAR(100) NOT NULL,
  uid VARCHAR(20) NOT NULL,
  region VARCHAR(10) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_ip ON analytics_sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_started_at ON analytics_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_timestamp ON user_events(timestamp DESC);

-- New: Click tracking indexes
CREATE INDEX IF NOT EXISTS idx_click_tracking_session_id ON click_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_click_tracking_clicked_at ON click_tracking(clicked_at DESC);

-- New: Form submission indexes
CREATE INDEX IF NOT EXISTS idx_form_submissions_session_id ON form_submissions(session_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_submitted_at ON form_submissions(submitted_at DESC);

-- Chat indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_ip ON chat_sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_started_at ON chat_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp DESC);

-- New: AI context indexes
CREATE INDEX IF NOT EXISTS idx_ai_user_context_user_id ON ai_user_context(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_user_context_session_id ON ai_user_context(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_user_context_key ON ai_user_context(context_key);

-- Feedback indexes
CREATE INDEX IF NOT EXISTS idx_user_feedback_page ON user_feedback(page_name);
CREATE INDEX IF NOT EXISTS idx_user_feedback_tool ON user_feedback(tool_name);
CREATE INDEX IF NOT EXISTS idx_user_feedback_submitted_at ON user_feedback(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_feedback_slug ON blog_feedback(blog_slug);
CREATE INDEX IF NOT EXISTS idx_blog_feedback_submitted_at ON blog_feedback(submitted_at DESC);

-- New: Feature request indexes
CREATE INDEX IF NOT EXISTS idx_feature_requests_status ON feature_requests(status);
CREATE INDEX IF NOT EXISTS idx_feature_requests_submitted_at ON feature_requests(submitted_at DESC);

-- New: Bug report indexes
CREATE INDEX IF NOT EXISTS idx_bug_reports_status ON bug_reports(status);
CREATE INDEX IF NOT EXISTS idx_bug_reports_reported_at ON bug_reports(reported_at DESC);

-- New: Privacy indexes
CREATE INDEX IF NOT EXISTS idx_user_consent_session_id ON user_consent(session_id);
CREATE INDEX IF NOT EXISTS idx_user_consent_type ON user_consent(consent_type);
CREATE INDEX IF NOT EXISTS idx_user_consent_active ON user_consent(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_cookie_preferences_session_id ON cookie_preferences(session_id);

-- FF Bot indexes
CREATE INDEX IF NOT EXISTS idx_ff_bot_ip ON ff_bot_interactions(user_ip);
CREATE INDEX IF NOT EXISTS idx_ff_bot_uid ON ff_bot_interactions(ff_uid);
CREATE INDEX IF NOT EXISTS idx_usage_logs_ip ON usage_logs(ip);
CREATE INDEX IF NOT EXISTS idx_usage_logs_date ON usage_logs(used_at);

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

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

-- ================================================
-- VIEWS FOR ANALYTICS
-- ================================================

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
  AVG(time_spent) as avg_time_spent
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

-- ================================================
-- COMPLETE! 
-- All tables ready for comprehensive tracking:
-- ✅ User tracking (clicks, events, sessions, IP, device)
-- ✅ AI chat with full context storage
-- ✅ Enhanced feedback system
-- ✅ Privacy/consent for AdSense compliance
-- ✅ Performance indexes
-- ✅ Analytics views
-- ================================================
