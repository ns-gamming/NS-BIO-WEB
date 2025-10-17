import type { Express, Request } from "express";
import { supabase } from './supabase-client';

function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0]) : req.socket.remoteAddress || 'unknown';
  return ip;
}

function getUserAgent(req: Request): string {
  return req.headers['user-agent'] || 'unknown';
}

export function registerChatbotRoutes(app: Express) {

  // Save or update user profile with comprehensive data
  app.post("/api/chat/profile", async (req, res) => {
    try {
      if (!supabase) {
        console.warn('Database not configured - profile will not be saved');
        return res.json({ success: true, profile: null, message: 'Database unavailable' });
      }

      const { userId, name, age, gender, email, phone, location, timezone, language, preferences, interests, additionalInfo } = req.body;
      const ipAddress = getClientIP(req);
      const userAgent = getUserAgent(req);

      const { data: existing } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      let data;
      const now = new Date().toISOString();

      if (existing) {
        const { data: updated, error } = await supabase
          .from('user_profiles')
          .update({
            name: name || existing.name,
            age: age || existing.age,
            gender: gender || existing.gender,
            email: email || existing.email,
            phone: phone || existing.phone,
            location: location || existing.location,
            timezone: timezone || existing.timezone,
            language: language || existing.language,
            ip_address: ipAddress,
            user_agent: userAgent,
            preferences: preferences || existing.preferences,
            interests: interests || existing.interests,
            additional_info: additionalInfo || existing.additional_info,
            last_interaction: now,
            updated_at: now
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        data = updated;
      } else {
        const { data: created, error } = await supabase
          .from('user_profiles')
          .insert([{
            user_id: userId,
            name,
            age,
            gender,
            email,
            phone,
            location,
            timezone,
            language: language || 'en',
            ip_address: ipAddress,
            user_agent: userAgent,
            preferences: preferences || {},
            interests: interests || [],
            additional_info: additionalInfo || {},
            first_interaction: now,
            last_interaction: now,
            total_messages: 0,
            total_sessions: 0,
            created_at: now,
            updated_at: now
          }])
          .select()
          .single();

        if (error) throw error;
        data = created;
      }

      res.json({ success: true, profile: data });
    } catch (error: any) {
      console.error('Error saving user profile:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Start new AI chat session with full tracking
  app.post("/api/chat/session/start", async (req, res) => {
    try {
      if (!supabase) {
        console.warn('Database not configured - session will not be saved');
        return res.json({ success: true, session: null, message: 'Database unavailable' });
      }

      const { userId, sessionId, deviceInfo, browser, os, deviceType } = req.body;
      const ipAddress = getClientIP(req);
      const userAgent = getUserAgent(req);
      const now = new Date().toISOString();

      // Close any active sessions for this user
      await supabase
        .from('ai_chat_sessions')
        .update({ is_active: false, ended_at: now })
        .eq('user_id', userId)
        .eq('is_active', true);

      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .insert([{
          session_id: sessionId,
          user_id: userId,
          ip_address: ipAddress,
          user_agent: userAgent,
          browser: browser || 'unknown',
          os: os || 'unknown',
          device_type: deviceType || 'desktop',
          device_info: deviceInfo || {},
          started_at: now,
          is_active: true,
          message_count: 0,
          topics_discussed: []
        }])
        .select()
        .single();

      if (error) throw error;

      // Update user profile session count
      await supabase.rpc('increment', {
        table_name: 'user_profiles',
        column_name: 'total_sessions',
        row_id: userId
      }).catch(() => {
        // Fallback if function doesn't exist
        supabase
          .from('user_profiles')
          .update({ 
            total_sessions: supabase.raw('total_sessions + 1'),
            last_interaction: now 
          })
          .eq('user_id', userId);
      });

      res.json({ success: true, session: data });
    } catch (error: any) {
      console.error('Error starting chat session:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Save chat message with comprehensive metadata
  app.post("/api/chat/message", async (req, res) => {
    try {
      if (!supabase) {
        console.warn('Database not configured - message will not be saved');
        return res.json({ success: true, message: null, warning: 'Database unavailable' });
      }

      const { sessionId, messageId, userId, senderType, messageText, sentiment, intent, entities, pageUrl, metadata } = req.body;
      const ipAddress = getClientIP(req);
      const userAgent = getUserAgent(req);
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('ai_chat_messages')
        .insert([{
          message_id: messageId,
          session_id: sessionId,
          user_id: userId,
          sender_type: senderType,
          message_text: messageText,
          ip_address: ipAddress,
          user_agent: userAgent,
          page_url: pageUrl,
          timestamp: now,
          sentiment: sentiment || null,
          intent: intent || null,
          entities: entities || [],
          metadata: metadata || {}
        }])
        .select()
        .single();

      if (error) throw error;

      // Update message count in session
      const { data: session } = await supabase
        .from('ai_chat_sessions')
        .select('message_count')
        .eq('session_id', sessionId)
        .single();

      if (session) {
        await supabase
          .from('ai_chat_sessions')
          .update({ message_count: (session.message_count || 0) + 1 })
          .eq('session_id', sessionId);
      }

      // Update user profile message count
      if (userId) {
        await supabase
          .from('user_profiles')
          .update({ 
            total_messages: supabase.raw('total_messages + 1'),
            last_interaction: now 
          })
          .eq('user_id', userId);
      }

      res.json({ success: true, message: data });
    } catch (error: any) {
      console.error('Error saving message:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Save AI detected topics
  app.post("/api/chat/topics", async (req, res) => {
    try {
      if (!supabase) {
        return res.json({ success: true, topics: [], message: 'Database unavailable' });
      }

      const { sessionId, userId, topics } = req.body;
      const now = new Date().toISOString();

      if (!topics || !Array.isArray(topics)) {
        return res.status(400).json({ success: false, error: 'Topics array required' });
      }

      const topicRecords = topics.map(t => ({
        session_id: sessionId,
        user_id: userId,
        topic: t.topic,
        category: t.category || null,
        subcategory: t.subcategory || null,
        confidence_score: t.confidence || 1.0,
        detected_at: now,
        frequency: 1
      }));

      const { data, error } = await supabase
        .from('ai_chat_topics')
        .insert(topicRecords)
        .select();

      if (error) throw error;

      // Update session topics
      const topicList = topics.map(t => t.topic);
      await supabase
        .from('ai_chat_sessions')
        .update({ 
          topics_discussed: supabase.raw(`topics_discussed || '${JSON.stringify(topicList)}'::jsonb`)
        })
        .eq('session_id', sessionId);

      res.json({ success: true, topics: data });
    } catch (error: any) {
      console.error('Error saving topics:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Save user context/memory
  app.post("/api/chat/context", async (req, res) => {
    try {
      if (!supabase) {
        return res.json({ success: true, context: null, message: 'Database unavailable' });
      }

      const { userId, sessionId, contextKey, contextValue, contextType, contextCategory, importance, isSensitive, expiresAt } = req.body;
      const ipAddress = getClientIP(req);
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('ai_user_context')
        .insert([{
          user_id: userId,
          session_id: sessionId,
          ip_address: ipAddress,
          context_key: contextKey,
          context_value: contextValue,
          context_type: contextType || 'general',
          context_category: contextCategory || 'conversation',
          importance: importance || 'medium',
          is_sensitive: isSensitive || false,
          expires_at: expiresAt || null,
          created_at: now,
          updated_at: now,
          access_count: 0,
          last_accessed: now
        }])
        .select()
        .single();

      if (error) throw error;

      res.json({ success: true, context: data });
    } catch (error: any) {
      console.error('Error saving context:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get user context/memory by IP or user ID
  app.get("/api/chat/context/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const ipAddress = getClientIP(req);

      // Get context by user ID or IP
      const { data, error } = await supabase
        .from('ai_user_context')
        .select('*')
        .or(`user_id.eq.${userId},ip_address.eq.${ipAddress}`)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Update access count and last accessed
      if (data && data.length > 0) {
        const contextIds = data.map(c => c.id);
        await supabase
          .from('ai_user_context')
          .update({ 
            access_count: supabase.raw('access_count + 1'),
            last_accessed: new Date().toISOString()
          })
          .in('id', contextIds);
      }

      res.json({ success: true, context: data || [] });
    } catch (error: any) {
      console.error('Error fetching context:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get chat history with full context
  app.get("/api/chat/history/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true })
        .limit(limit);

      if (error) throw error;

      res.json({ success: true, messages: data || [] });
    } catch (error: any) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get user profile with all data
  app.get("/api/chat/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      res.json({ success: true, profile: data || null });
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get user sessions history
  app.get("/api/chat/sessions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      res.json({ success: true, sessions: data || [] });
    } catch (error: any) {
      console.error('Error fetching chat sessions:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get complete user activity by IP
  app.get("/api/chat/activity/ip/:ip", async (req, res) => {
    try {
      const { ip } = req.params;

      const [profile, sessions, messages, context] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('ip_address', ip),
        supabase.from('ai_chat_sessions').select('*').eq('ip_address', ip).order('started_at', { ascending: false }).limit(10),
        supabase.from('ai_chat_messages').select('*').eq('ip_address', ip).order('timestamp', { ascending: false }).limit(50),
        supabase.from('ai_user_context').select('*').eq('ip_address', ip).order('created_at', { ascending: false }).limit(50)
      ]);

      res.json({ 
        success: true, 
        data: {
          profiles: profile.data || [],
          sessions: sessions.data || [],
          messages: messages.data || [],
          context: context.data || []
        }
      });
    } catch (error: any) {
      console.error('Error fetching activity by IP:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // End chat session
  app.post("/api/chat/session/end", async (req, res) => {
    try {
      const { sessionId, conversationSummary, userMood, sessionNotes } = req.body;
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .update({ 
          is_active: false, 
          ended_at: now,
          conversation_summary: conversationSummary || null,
          user_mood: userMood || null,
          session_notes: sessionNotes || null
        })
        .eq('session_id', sessionId)
        .select()
        .single();

      if (error) throw error;

      res.json({ success: true, session: data });
    } catch (error: any) {
      console.error('Error ending chat session:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
}