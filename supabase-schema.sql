
-- ================================================
-- DROP EXISTING TABLES (if needed for clean slate)
-- ================================================
-- Uncomment these lines if you want to start fresh:
-- DROP TABLE IF EXISTS mouse_movements CASCADE;
-- DROP TABLE IF EXISTS form_interactions CASCADE;
-- DROP TABLE IF EXISTS error_logs CASCADE;
-- DROP TABLE IF EXISTS performance_metrics CASCADE;
-- DROP TABLE IF EXISTS user_interactions CASCADE;
-- DROP TABLE IF EXISTS user_events CASCADE;
-- DROP TABLE IF EXISTS page_views CASCADE;
-- DROP TABLE IF EXISTS analytics_sessions CASCADE;
-- DROP TABLE IF EXISTS chat_messages CASCADE;
-- DROP TABLE IF EXISTS chat_sessions CASCADE;
-- DROP TABLE IF EXISTS user_profiles CASCADE;
-- DROP TABLE IF EXISTS blog_feedback CASCADE;
-- DROP TABLE IF EXISTS user_feedback CASCADE;
-- DROP TABLE IF EXISTS ff_bot_interactions CASCADE;
-- DROP TABLE IF EXISTS usage_logs CASCADE;

-- ================================================
-- ANALYTICS TABLES (ENHANCED)
-- ================================================

CREATE TABLE IF NOT EXISTS analytics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(100) NOT NULL,
  user_agent TEXT,
  device_info JSONB,
  geo_location JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  total_events INTEGER DEFAULT 0,
  total_page_views INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
  page_url TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  ip_address VARCHAR(100),
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0,
  scroll_depth INTEGER DEFAULT 0,
  metadata JSONB
);

CREATE TABLE IF NOT EXISTS user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  element_id TEXT,
  element_text TEXT,
  element_tag TEXT,
  element_class TEXT,
  page_url TEXT NOT NULL,
  ip_address VARCHAR(100),
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  mouse_position JSONB,
  viewport_size JSONB
);

CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL,
  target_element TEXT,
  page_url TEXT NOT NULL,
  ip_address VARCHAR(100),
  duration_ms INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

CREATE TABLE IF NOT EXISTS mouse_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
  page_url TEXT NOT NULL,
  mouse_path JSONB,
  clicks INTEGER DEFAULT 0,
  scroll_events INTEGER DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS form_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
  form_id TEXT,
  field_name TEXT,
  interaction_type VARCHAR(50),
  field_value_length INTEGER,
  time_spent_seconds INTEGER,
  ip_address VARCHAR(100),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
  error_type VARCHAR(100),
  error_message TEXT,
  stack_trace TEXT,
  page_url TEXT,
  ip_address VARCHAR(100),
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
  page_url TEXT NOT NULL,
  load_time_ms INTEGER,
  dom_ready_ms INTEGER,
  first_paint_ms INTEGER,
  network_speed VARCHAR(20),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- CHATBOT TABLES (ENHANCED)
-- ================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  gender VARCHAR(20),
  ip_address VARCHAR(100),
  user_agent TEXT,
  additional_info JSONB,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id VARCHAR(255) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  ip_address VARCHAR(100),
  user_agent TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  message_count INTEGER DEFAULT 0,
  session_duration_seconds INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id VARCHAR(255) UNIQUE NOT NULL,
  session_id VARCHAR(255) REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'assistant')),
  message_text TEXT NOT NULL,
  ip_address VARCHAR(100),
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  response_time_ms INTEGER,
  metadata JSONB,
  sentiment_score DECIMAL(3,2),
  message_length INTEGER
);

-- ================================================
-- FEEDBACK TABLES (ENHANCED)
-- ================================================

CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  page_name VARCHAR(100) NOT NULL,
  tool_name VARCHAR(100),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  user_ip VARCHAR(100),
  user_agent TEXT,
  device_info JSONB,
  page_url TEXT,
  referrer TEXT,
  time_on_page INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

CREATE TABLE IF NOT EXISTS blog_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  blog_slug VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  feedback TEXT,
  user_ip VARCHAR(100),
  user_agent TEXT,
  device_info JSONB,
  time_spent_reading INTEGER,
  scroll_percentage INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- ================================================
-- FREE FIRE BOT INTERACTION TRACKING (ENHANCED)
-- ================================================

CREATE TABLE IF NOT EXISTS ff_bot_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  user_ip VARCHAR(100) NOT NULL,
  user_agent TEXT,
  ff_uid VARCHAR(20) NOT NULL,
  ff_region VARCHAR(10) NOT NULL,
  player_name TEXT,
  player_level INTEGER,
  likes_before INTEGER,
  likes_added INTEGER,
  likes_after INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  request_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  response_timestamp TIMESTAMP WITH TIME ZONE,
  response_time_ms INTEGER,
  metadata JSONB
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  ip VARCHAR(100) NOT NULL,
  user_agent TEXT,
  uid VARCHAR(20) NOT NULL,
  region VARCHAR(10) NOT NULL,
  device_info JSONB,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_ip ON analytics_sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_started ON analytics_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_page_views_ip ON page_views(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_timestamp ON user_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_events_ip ON user_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_interactions_session_id ON user_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_ip ON user_profiles(ip_address);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_ip ON chat_sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_chat_messages_ip ON chat_messages(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_feedback_page ON user_feedback(page_name);
CREATE INDEX IF NOT EXISTS idx_user_feedback_tool ON user_feedback(tool_name);
CREATE INDEX IF NOT EXISTS idx_user_feedback_session ON user_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_timestamp ON user_feedback(submitted_at);
CREATE INDEX IF NOT EXISTS idx_blog_feedback_slug ON blog_feedback(blog_slug);
CREATE INDEX IF NOT EXISTS idx_blog_feedback_session ON blog_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_blog_feedback_timestamp ON blog_feedback(submitted_at);
CREATE INDEX IF NOT EXISTS idx_ff_bot_ip ON ff_bot_interactions(user_ip);
CREATE INDEX IF NOT EXISTS idx_ff_bot_uid ON ff_bot_interactions(ff_uid);
CREATE INDEX IF NOT EXISTS idx_ff_bot_timestamp ON ff_bot_interactions(request_timestamp);
CREATE INDEX IF NOT EXISTS idx_usage_logs_ip ON usage_logs(ip);
CREATE INDEX IF NOT EXISTS idx_usage_logs_date ON usage_logs(used_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_session ON usage_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_mouse_movements_session ON mouse_movements(session_id);
CREATE INDEX IF NOT EXISTS idx_form_interactions_session ON form_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_session ON error_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_session ON performance_metrics(session_id);

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_bot_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mouse_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role full access analytics_sessions" ON analytics_sessions;
DROP POLICY IF EXISTS "Service role full access page_views" ON page_views;
DROP POLICY IF EXISTS "Service role full access user_events" ON user_events;
DROP POLICY IF EXISTS "Service role full access user_interactions" ON user_interactions;
DROP POLICY IF EXISTS "Service role full access user_profiles" ON user_profiles;
DROP POLICY IF EXISTS "Service role full access chat_sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Service role full access chat_messages" ON chat_messages;
DROP POLICY IF EXISTS "Service role full access user_feedback" ON user_feedback;
DROP POLICY IF EXISTS "Service role full access blog_feedback" ON blog_feedback;
DROP POLICY IF EXISTS "Service role full access ff_bot_interactions" ON ff_bot_interactions;
DROP POLICY IF EXISTS "Service role full access usage_logs" ON usage_logs;
DROP POLICY IF EXISTS "Service role full access mouse_movements" ON mouse_movements;
DROP POLICY IF EXISTS "Service role full access form_interactions" ON form_interactions;
DROP POLICY IF EXISTS "Service role full access error_logs" ON error_logs;
DROP POLICY IF EXISTS "Service role full access performance_metrics" ON performance_metrics;

DROP POLICY IF EXISTS "Public insert analytics_sessions" ON analytics_sessions;
DROP POLICY IF EXISTS "Public insert page_views" ON page_views;
DROP POLICY IF EXISTS "Public insert user_events" ON user_events;
DROP POLICY IF EXISTS "Public insert user_interactions" ON user_interactions;
DROP POLICY IF EXISTS "Public insert user_profiles" ON user_profiles;
DROP POLICY IF EXISTS "Public insert chat_sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Public insert chat_messages" ON chat_messages;
DROP POLICY IF EXISTS "Public insert user_feedback" ON user_feedback;
DROP POLICY IF EXISTS "Public insert blog_feedback" ON blog_feedback;
DROP POLICY IF EXISTS "Public insert ff_bot_interactions" ON ff_bot_interactions;
DROP POLICY IF EXISTS "Public insert usage_logs" ON usage_logs;
DROP POLICY IF EXISTS "Public insert mouse_movements" ON mouse_movements;
DROP POLICY IF EXISTS "Public insert form_interactions" ON form_interactions;
DROP POLICY IF EXISTS "Public insert error_logs" ON error_logs;
DROP POLICY IF EXISTS "Public insert performance_metrics" ON performance_metrics;

-- Service role has full access to everything
CREATE POLICY "Service role full access analytics_sessions" ON analytics_sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access page_views" ON page_views FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access user_events" ON user_events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access user_interactions" ON user_interactions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access user_profiles" ON user_profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access chat_sessions" ON chat_sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access chat_messages" ON chat_messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access user_feedback" ON user_feedback FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access blog_feedback" ON blog_feedback FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access ff_bot_interactions" ON ff_bot_interactions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access usage_logs" ON usage_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access mouse_movements" ON mouse_movements FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access form_interactions" ON form_interactions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access error_logs" ON error_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access performance_metrics" ON performance_metrics FOR ALL USING (auth.role() = 'service_role');

-- Public can insert their own data (backend will use service key)
CREATE POLICY "Public insert analytics_sessions" ON analytics_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert page_views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert user_events" ON user_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert user_interactions" ON user_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert user_profiles" ON user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert chat_sessions" ON chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert chat_messages" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert user_feedback" ON user_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert blog_feedback" ON blog_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert ff_bot_interactions" ON ff_bot_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert usage_logs" ON usage_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert mouse_movements" ON mouse_movements FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert form_interactions" ON form_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert error_logs" ON error_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert performance_metrics" ON performance_metrics FOR INSERT WITH CHECK (true);
