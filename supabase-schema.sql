
-- ================================================
-- ANALYTICS TABLES
-- ================================================

CREATE TABLE IF NOT EXISTS analytics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(100) NOT NULL,
  user_agent TEXT,
  device_info JSONB,
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
  metadata JSONB
);

-- ================================================
-- CHATBOT TABLES
-- ================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  gender VARCHAR(20),
  ip_address VARCHAR(100),
  additional_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id VARCHAR(255) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  message_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id VARCHAR(255) UNIQUE NOT NULL,
  session_id VARCHAR(255) REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'assistant')),
  message_text TEXT NOT NULL,
  ip_address VARCHAR(100),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- ================================================
-- FEEDBACK TABLES
-- ================================================

CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name VARCHAR(100) NOT NULL,
  tool_name VARCHAR(100),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  user_ip VARCHAR(100),
  user_agent TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_slug VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  feedback TEXT,
  user_ip VARCHAR(100),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_ip ON analytics_sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_feedback_page ON user_feedback(page_name);
CREATE INDEX IF NOT EXISTS idx_user_feedback_tool ON user_feedback(tool_name);
CREATE INDEX IF NOT EXISTS idx_blog_feedback_slug ON blog_feedback(blog_slug);
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
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_bot_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Service role has full access to everything
CREATE POLICY "Service role full access analytics_sessions" ON analytics_sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access page_views" ON page_views FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access user_events" ON user_events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access user_profiles" ON user_profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access chat_sessions" ON chat_sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access chat_messages" ON chat_messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access user_feedback" ON user_feedback FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access blog_feedback" ON blog_feedback FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access ff_bot_interactions" ON ff_bot_interactions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access usage_logs" ON usage_logs FOR ALL USING (auth.role() = 'service_role');

-- Public can insert their own data (backend will use service key)
CREATE POLICY "Public insert analytics_sessions" ON analytics_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert page_views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert user_events" ON user_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert user_profiles" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert chat_sessions" ON chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert chat_messages" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert user_feedback" ON user_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert blog_feedback" ON blog_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert ff_bot_interactions" ON ff_bot_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert usage_logs" ON usage_logs FOR INSERT WITH CHECK (true);
