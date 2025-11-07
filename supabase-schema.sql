
-- Analytics Tables
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(100) NOT NULL,
  user_agent TEXT,
  device_info JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  page_url TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  event_type VARCHAR(50) NOT NULL,
  element_id TEXT,
  element_text TEXT,
  element_tag TEXT,
  page_url TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Chat Tables
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id VARCHAR(255),
  ip_address VARCHAR(100),
  user_agent TEXT,
  browser VARCHAR(100),
  os VARCHAR(100),
  device_type VARCHAR(50),
  device_info JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  topics_discussed TEXT[],
  conversation_summary TEXT,
  user_mood VARCHAR(50),
  session_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'assistant', 'system', 'error')),
  message_text TEXT NOT NULL,
  ip_address VARCHAR(100),
  user_agent TEXT,
  page_url TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) UNIQUE NOT NULL,
  name TEXT,
  age INTEGER,
  gender VARCHAR(20),
  email VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  timezone VARCHAR(100),
  language VARCHAR(10) DEFAULT 'en',
  ip_address VARCHAR(100),
  user_agent TEXT,
  preferences JSONB,
  interests TEXT[],
  additional_info JSONB,
  first_interaction TIMESTAMP WITH TIME ZONE,
  last_interaction TIMESTAMP WITH TIME ZONE,
  total_messages INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_user_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255),
  session_id VARCHAR(255),
  ip_address VARCHAR(100),
  context_key VARCHAR(255) NOT NULL,
  context_value TEXT NOT NULL,
  context_type VARCHAR(50),
  context_category VARCHAR(100),
  importance VARCHAR(20) DEFAULT 'medium',
  is_sensitive BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  access_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_chat_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255),
  user_id VARCHAR(255),
  topic VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  confidence_score DECIMAL(3,2) DEFAULT 1.0,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  frequency INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Free Fire Bot Tables
CREATE TABLE IF NOT EXISTS ff_bot_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_ip VARCHAR(100) NOT NULL,
  ff_uid VARCHAR(50),
  ff_region VARCHAR(10),
  player_name VARCHAR(255),
  player_level INTEGER,
  likes_before INTEGER,
  likes_added INTEGER,
  likes_after INTEGER,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip VARCHAR(100) NOT NULL,
  uid VARCHAR(50),
  region VARCHAR(10),
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vip_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address VARCHAR(100),
  ff_uid VARCHAR(50),
  telegram_username VARCHAR(100),
  unlimited_likes BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ff_info_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address VARCHAR(100) UNIQUE NOT NULL,
  daily_searches INTEGER DEFAULT 0,
  last_search TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  search_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog & Feedback Tables
CREATE TABLE IF NOT EXISTS blog_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_slug VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  user_ip VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url VARCHAR(500) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  category VARCHAR(100),
  user_ip VARCHAR(100),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_session_id ON ai_chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session_id ON ai_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ff_bot_interactions_ip ON ff_bot_interactions(user_ip);
CREATE INDEX IF NOT EXISTS idx_usage_logs_ip ON usage_logs(ip);
CREATE INDEX IF NOT EXISTS idx_blog_feedback_slug ON blog_feedback(blog_slug);
