-- NS GAMING Platform - Comprehensive Database Schema
-- This migration creates all required tables for analytics, privacy, and gaming features

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ANALYTICS TABLES (Fix existing errors)
-- ============================================================================

-- 1. Analytics Sessions Table
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  ip_address text NOT NULL,
  user_agent text,
  device_info jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 2. Page Views Table
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  page_url text NOT NULL,
  page_title text,
  referrer text,
  ip_address text,
  user_agent text,
  viewed_at timestamptz DEFAULT now(),
  time_spent_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 3. User Events Table
CREATE TABLE IF NOT EXISTS user_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  event_type text NOT NULL,
  element_id text,
  element_text text,
  element_tag text,
  page_url text NOT NULL,
  ip_address text,
  user_agent text,
  occurred_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PRIVACY & CONSENT TABLES (Fix existing errors)
-- ============================================================================

-- 4. User Consent Table
CREATE TABLE IF NOT EXISTS user_consent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  ip_address text NOT NULL,
  consent_type text NOT NULL,
  consent_given boolean NOT NULL,
  consent_version text DEFAULT '1.0',
  granted_at timestamptz DEFAULT now(),
  revoked_at timestamptz,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 5. Cookie Preferences Table
CREATE TABLE IF NOT EXISTS cookie_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  ip_address text NOT NULL,
  necessary_cookies boolean DEFAULT true,
  functional_cookies boolean DEFAULT false,
  analytics_cookies boolean DEFAULT false,
  advertising_cookies boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- GAMING PLATFORM TABLES (New features)
-- ============================================================================

-- 6. User Profiles Table (Extended profiles linked to auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_url text,
  level integer DEFAULT 1,
  xp integer DEFAULT 0,
  coins integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- 7. Games Catalog Table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  category text NOT NULL,
  difficulty text DEFAULT 'medium',
  thumbnail_url text,
  is_3d boolean DEFAULT false,
  is_active boolean DEFAULT true,
  play_count integer DEFAULT 0,
  average_rating numeric(3,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. Game Sessions Table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  session_data jsonb DEFAULT '{}',
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  score integer DEFAULT 0,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 9. Player Progress Table
CREATE TABLE IF NOT EXISTS player_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  current_level integer DEFAULT 1,
  highest_level integer DEFAULT 1,
  total_score integer DEFAULT 0,
  completion_percentage numeric(5,2) DEFAULT 0.00,
  save_data jsonb DEFAULT '{}',
  last_played_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, game_id)
);

-- 10. Achievements Table (Achievement definitions)
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  icon_url text,
  points integer DEFAULT 0,
  rarity text DEFAULT 'common',
  unlock_criteria jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 11. Player Achievements Table (User unlocked achievements)
CREATE TABLE IF NOT EXISTS player_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  progress_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- 12. Inventory Items Table (Item catalog)
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  item_type text NOT NULL,
  rarity text DEFAULT 'common',
  icon_url text,
  price integer DEFAULT 0,
  is_purchasable boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 13. Player Inventory Table (User's items)
CREATE TABLE IF NOT EXISTS player_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid REFERENCES inventory_items(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  acquired_at timestamptz DEFAULT now(),
  equipped boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- 14. Leaderboards Table
CREATE TABLE IF NOT EXISTS leaderboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  score integer NOT NULL,
  rank integer,
  achieved_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 15. Game Feedback Table (Ratings and reviews)
CREATE TABLE IF NOT EXISTS game_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, game_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_created_at ON analytics_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_event_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON user_events(created_at);

-- Privacy indexes
CREATE INDEX IF NOT EXISTS idx_user_consent_session_id ON user_consent(session_id);
CREATE INDEX IF NOT EXISTS idx_user_consent_ip_address ON user_consent(ip_address);
CREATE INDEX IF NOT EXISTS idx_cookie_preferences_session_id ON cookie_preferences(session_id);

-- Gaming indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category);
CREATE INDEX IF NOT EXISTS idx_games_is_active ON games(is_active);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_id ON game_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON game_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_player_progress_user_id ON player_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_player_progress_game_id ON player_progress(game_id);
CREATE INDEX IF NOT EXISTS idx_achievements_game_id ON achievements(game_id);
CREATE INDEX IF NOT EXISTS idx_player_achievements_user_id ON player_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_player_achievements_achievement_id ON player_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_player_inventory_user_id ON player_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_player_inventory_item_id ON player_inventory(item_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_game_id ON leaderboards(game_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_user_id ON leaderboards(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_score ON leaderboards(score DESC);
CREATE INDEX IF NOT EXISTS idx_game_feedback_game_id ON game_feedback(game_id);
CREATE INDEX IF NOT EXISTS idx_game_feedback_user_id ON game_feedback(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_feedback ENABLE ROW LEVEL SECURITY;

-- Analytics tables - Allow service role full access, public can insert
CREATE POLICY "Service role has full access to analytics_sessions" ON analytics_sessions
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public can insert analytics_sessions" ON analytics_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role has full access to page_views" ON page_views
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public can insert page_views" ON page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role has full access to user_events" ON user_events
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public can insert user_events" ON user_events
  FOR INSERT WITH CHECK (true);

-- Privacy tables - Allow public access for consent management
CREATE POLICY "Service role has full access to user_consent" ON user_consent
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public can manage consent" ON user_consent
  FOR ALL WITH CHECK (true);

CREATE POLICY "Service role has full access to cookie_preferences" ON cookie_preferences
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public can manage cookie preferences" ON cookie_preferences
  FOR ALL WITH CHECK (true);

-- User Profiles - Users can only see/modify their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Games - Public read, service role can write
CREATE POLICY "Anyone can view active games" ON games
  FOR SELECT USING (is_active = true);
CREATE POLICY "Service role has full access to games" ON games
  FOR ALL USING (auth.role() = 'service_role');

-- Game Sessions - Users can only see/modify their own sessions
CREATE POLICY "Users can view own game sessions" ON game_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own game sessions" ON game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own game sessions" ON game_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Player Progress - Users can only see/modify their own progress
CREATE POLICY "Users can view own progress" ON player_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON player_progress
  FOR ALL USING (auth.uid() = user_id);

-- Achievements - Public read, service role can write
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);
CREATE POLICY "Service role has full access to achievements" ON achievements
  FOR ALL USING (auth.role() = 'service_role');

-- Player Achievements - Users can only see/modify their own achievements
CREATE POLICY "Users can view own achievements" ON player_achievements
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can unlock achievements" ON player_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Inventory Items - Public read, service role can write
CREATE POLICY "Anyone can view inventory items" ON inventory_items
  FOR SELECT USING (true);
CREATE POLICY "Service role has full access to inventory_items" ON inventory_items
  FOR ALL USING (auth.role() = 'service_role');

-- Player Inventory - Users can only see/modify their own inventory
CREATE POLICY "Users can view own inventory" ON player_inventory
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own inventory" ON player_inventory
  FOR ALL USING (auth.uid() = user_id);

-- Leaderboards - Public read, users can insert their own scores
CREATE POLICY "Anyone can view leaderboards" ON leaderboards
  FOR SELECT USING (true);
CREATE POLICY "Users can submit own scores" ON leaderboards
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role has full access to leaderboards" ON leaderboards
  FOR ALL USING (auth.role() = 'service_role');

-- Game Feedback - Public read, users can manage their own feedback
CREATE POLICY "Anyone can view game feedback" ON game_feedback
  FOR SELECT USING (true);
CREATE POLICY "Users can manage own feedback" ON game_feedback
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_progress_updated_at BEFORE UPDATE ON player_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_inventory_updated_at BEFORE UPDATE ON player_inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_feedback_updated_at BEFORE UPDATE ON game_feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
