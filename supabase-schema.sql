
-- ================================================
-- NS GAMMING - COMPREHENSIVE DATABASE SCHEMA
-- Advanced User Tracking, AI Chat & Analytics
-- ================================================

-- ================================================
-- USERS & ANALYTICS TABLES
-- ================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  username VARCHAR(100),
  ip_address VARCHAR(100),
  user_agent TEXT,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_visits INTEGER DEFAULT 0,
  is_vip BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS analytics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(100) NOT NULL,
  user_agent TEXT,
  browser VARCHAR(100),
  os VARCHAR(100),
  device_type VARCHAR(50),
  device_info JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  page_count INTEGER DEFAULT 0,
  event_count INTEGER DEFAULT 0
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
  ip_address VARCHAR(100),
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

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
-- AI CHATBOT TABLES (AAPTI) - COMPREHENSIVE USER MEMORY
-- ================================================

-- User profiles with complete tracking
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) UNIQUE NOT NULL,
  name TEXT,
  age INTEGER,
  gender VARCHAR(20),
  email VARCHAR(255),
  phone VARCHAR(20),
  location VARCHAR(255),
  timezone VARCHAR(100),
  language VARCHAR(50) DEFAULT 'en',
  ip_address VARCHAR(100),
  user_agent TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  additional_info JSONB DEFAULT '{}'::jsonb,
  first_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_messages INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Chat sessions with full context
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id VARCHAR(255) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
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

-- Individual chat messages with complete context
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id VARCHAR(255) UNIQUE NOT NULL,
  session_id VARCHAR(255) REFERENCES ai_chat_sessions(session_id) ON DELETE CASCADE,
  user_id VARCHAR(255) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
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

-- AI detected topics and conversation categorization
CREATE TABLE IF NOT EXISTS ai_chat_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES ai_chat_sessions(session_id) ON DELETE CASCADE,
  user_id VARCHAR(255) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  topic VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confidence_score NUMERIC(3,2),
  frequency INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- User context and memory for personalization
CREATE TABLE IF NOT EXISTS ai_user_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  session_id VARCHAR(255) REFERENCES ai_chat_sessions(session_id) ON DELETE CASCADE,
  ip_address VARCHAR(100),
  context_key VARCHAR(255) NOT NULL,
  context_value TEXT NOT NULL,
  context_type VARCHAR(50),
  context_category VARCHAR(100),
  importance VARCHAR(20) DEFAULT 'medium',
  is_sensitive BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  access_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- User preferences for personalized experience
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  ip_address VARCHAR(100),
  preference_key VARCHAR(255) NOT NULL,
  preference_value TEXT NOT NULL,
  preference_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, preference_key)
);

-- AI chat statistics view
CREATE TABLE IF NOT EXISTS ai_chat_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TEXT NOT NULL UNIQUE,
  total_sessions INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  avg_session_duration_seconds INTEGER,
  avg_messages_per_session NUMERIC(10,2),
  top_topics JSONB DEFAULT '[]'::jsonb,
  user_satisfaction_score NUMERIC(3,2),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ================================================
-- LEGACY CHAT TABLES (for backward compatibility)
-- ================================================

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
  is_active BOOLEAN DEFAULT TRUE,
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

-- ================================================
-- FEEDBACK TABLES
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
-- PRIVACY & CONSENT
-- ================================================

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
-- BLOG & CONTENT
-- ================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author VARCHAR(255),
  category VARCHAR(100),
  tags JSONB DEFAULT '[]'::jsonb,
  featured_image TEXT,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS blog_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_slug VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  ip_address VARCHAR(100),
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- FREE FIRE BOT TRACKING
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
-- TOOLS & UTILITIES
-- ================================================

CREATE TABLE IF NOT EXISTS tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name VARCHAR(255) NOT NULL,
  user_ip VARCHAR(100),
  session_id VARCHAR(255),
  input_data JSONB DEFAULT '{}'::jsonb,
  output_data JSONB DEFAULT '{}'::jsonb,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  execution_time_ms INTEGER,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS tool_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_ip VARCHAR(100) NOT NULL,
  tool_name VARCHAR(255) NOT NULL,
  usage_count INTEGER DEFAULT 1,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reset_at TIMESTAMP WITH TIME ZONE,
  is_blocked BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ================================================
-- POLLS & ENGAGEMENT
-- ================================================

CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL,
  ip_address VARCHAR(100),
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- STATISTICS & VIEWS
-- ================================================

CREATE TABLE IF NOT EXISTS visitor_stats (
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

CREATE TABLE IF NOT EXISTS daily_active_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TEXT NOT NULL UNIQUE,
  unique_users INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_page_views INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS popular_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  unique_sessions INTEGER DEFAULT 0,
  avg_time_spent INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- User & Analytics indexes
CREATE INDEX IF NOT EXISTS idx_users_ip ON users(ip_address);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_ip ON analytics_sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_started ON analytics_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_ip ON page_views(ip_address);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_ip ON user_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_timestamp ON user_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_click_tracking_session_id ON click_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_click_tracking_ip ON click_tracking(ip_address);
CREATE INDEX IF NOT EXISTS idx_form_submissions_session_id ON form_submissions(session_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_ip ON form_submissions(ip_address);

-- AI Chat indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_ip ON user_profiles(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_session_id ON ai_chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user_id ON ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_ip ON ai_chat_sessions(ip_address);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_started ON ai_chat_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session_id ON ai_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_user_id ON ai_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_ip ON ai_chat_messages(ip_address);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_timestamp ON ai_chat_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_chat_topics_session_id ON ai_chat_topics(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_topics_user_id ON ai_chat_topics(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_topics_topic ON ai_chat_topics(topic);
CREATE INDEX IF NOT EXISTS idx_ai_user_context_user_id ON ai_user_context(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_user_context_session_id ON ai_user_context(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_user_context_ip ON ai_user_context(ip_address);
CREATE INDEX IF NOT EXISTS idx_ai_user_context_key ON ai_user_context(context_key);
CREATE INDEX IF NOT EXISTS idx_ai_user_context_category ON ai_user_context(c