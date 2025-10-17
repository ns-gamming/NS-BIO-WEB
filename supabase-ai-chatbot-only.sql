
-- ================================================
-- AI CHATBOT (AAPTI) - MINIMAL SCHEMA
-- Complete user memory & IP tracking
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

-- AI chat statistics
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
-- INDEXES FOR PERFORMANCE
-- ================================================

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

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_ip ON user_preferences(ip_address);

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_user_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_statistics ENABLE ROW LEVEL SECURITY;

-- Public read/write policies for AI chatbot (authenticated via API)
CREATE POLICY "Allow all operations on user_profiles" ON user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on ai_chat_sessions" ON ai_chat_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on ai_chat_messages" ON ai_chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on ai_chat_topics" ON ai_chat_topics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on ai_user_context" ON ai_user_context FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on user_preferences" ON user_preferences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow read on ai_chat_statistics" ON ai_chat_statistics FOR SELECT USING (true);
CREATE POLICY "Allow insert/update on ai_chat_statistics" ON ai_chat_statistics FOR ALL USING (true) WITH CHECK (true);
