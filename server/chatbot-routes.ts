
import type { Express, Request } from "express";
import { supabase } from './supabase-client';

function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0]) : req.socket.remoteAddress || 'unknown';
  return ip;
}

export function registerChatbotRoutes(app: Express) {
  
  // Save or update user profile
  app.post("/api/chat/profile", async (req, res) => {
    try {
      const { userId, name, age, gender, additionalInfo } = req.body;
      const ipAddress = getClientIP(req);

      const { data: existing } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      let data;
      if (existing) {
        const { data: updated, error } = await supabase
          .from('user_profiles')
          .update({
            name,
            age,
            gender,
            ip_address: ipAddress,
            additional_info: additionalInfo || {},
            updated_at: new Date().toISOString()
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
            ip_address: ipAddress,
            additional_info: additionalInfo || {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
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

  // Start new chat session
  app.post("/api/chat/session/start", async (req, res) => {
    try {
      const { userId, sessionId } = req.body;

      // Close any active sessions for this user
      await supabase
        .from('chat_sessions')
        .update({ is_active: false, ended_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_active', true);

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{
          session_id: sessionId,
          user_id: userId,
          started_at: new Date().toISOString(),
          is_active: true,
          message_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      res.json({ success: true, session: data });
    } catch (error: any) {
      console.error('Error starting chat session:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Save chat message
  app.post("/api/chat/message", async (req, res) => {
    try {
      const { sessionId, messageId, senderType, messageText, metadata } = req.body;
      const ipAddress = getClientIP(req);

      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          message_id: messageId,
          session_id: sessionId,
          sender_type: senderType,
          message_text: messageText,
          ip_address: ipAddress,
          timestamp: new Date().toISOString(),
          metadata: metadata || {}
        }])
        .select()
        .single();

      if (error) throw error;

      // Update message count
      const { data: session } = await supabase
        .from('chat_sessions')
        .select('message_count')
        .eq('session_id', sessionId)
        .single();

      if (session) {
        await supabase
          .from('chat_sessions')
          .update({ message_count: (session.message_count || 0) + 1 })
          .eq('session_id', sessionId);
      }

      res.json({ success: true, message: data });
    } catch (error: any) {
      console.error('Error saving message:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get chat history
  app.get("/api/chat/history/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const { data, error } = await supabase
        .from('chat_messages')
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

  // Get user profile
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

  // Get user sessions
  app.get("/api/chat/sessions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      res.json({ success: true, sessions: data || [] });
    } catch (error: any) {
      console.error('Error fetching chat sessions:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
