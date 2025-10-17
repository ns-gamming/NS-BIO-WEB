import type { Express, Request } from "express";
import { supabase } from './supabase-client';

function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0]) : req.socket.remoteAddress || 'unknown';
  return ip;
}

export function registerAnalyticsRoutes(app: Express) {
  
  // Check if session exists
  app.get("/api/analytics/session/:sessionId/check", async (req, res) => {
    try {
      const { sessionId } = req.params;

      const { data, error } = await supabase
        .from('analytics_sessions')
        .select('session_id')
        .eq('session_id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      res.json({ exists: !!data });
    } catch (error: any) {
      console.error('Error checking session:', error);
      res.status(500).json({ exists: false, error: error.message });
    }
  });

  app.post("/api/analytics/session", async (req, res) => {
    try {
      const { sessionId, deviceInfo } = req.body;
      const ipAddress = getClientIP(req);
      const userAgent = req.headers['user-agent'] || 'unknown';

      // Check if session already exists
      const { data: existing } = await supabase
        .from('analytics_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (existing) {
        // Update existing session to active
        const { data: updated, error } = await supabase
          .from('analytics_sessions')
          .update({ 
            is_active: true,
            user_agent: userAgent,
            device_info: deviceInfo || {}
          })
          .eq('session_id', sessionId)
          .select()
          .single();

        if (error) throw error;
        return res.json({ success: true, session: updated });
      }

      const { data, error } = await supabase
        .from('analytics_sessions')
        .insert([{
          session_id: sessionId,
          ip_address: ipAddress,
          user_agent: userAgent,
          device_info: deviceInfo || {},
          started_at: new Date().toISOString(),
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;

      res.json({ success: true, session: data });
    } catch (error: any) {
      console.error('Error creating analytics session:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const { sessionId, pageUrl, pageTitle, referrer } = req.body;

      const { data, error } = await supabase
        .from('page_views')
        .insert([{
          session_id: sessionId,
          page_url: pageUrl,
          page_title: pageTitle,
          referrer: referrer || null,
          viewed_at: new Date().toISOString(),
          time_spent: 0
        }])
        .select()
        .single();

      if (error) throw error;

      res.json({ success: true, pageView: data });
    } catch (error: any) {
      console.error('Error logging page view:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/analytics/event", async (req, res) => {
    try {
      const { sessionId, eventType, elementId, elementText, elementTag, pageUrl, metadata } = req.body;

      const { data, error } = await supabase
        .from('user_events')
        .insert([{
          session_id: sessionId,
          event_type: eventType,
          element_id: elementId || null,
          element_text: elementText || null,
          element_tag: elementTag || null,
          page_url: pageUrl,
          timestamp: new Date().toISOString(),
          metadata: metadata || {}
        }])
        .select()
        .single();

      if (error) throw error;

      res.json({ success: true, event: data });
    } catch (error: any) {
      console.error('Error logging event:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.patch("/api/analytics/session/:sessionId/end", async (req, res) => {
    try {
      const { sessionId } = req.params;

      const { data, error } = await supabase
        .from('analytics_sessions')
        .update({ 
          ended_at: new Date().toISOString(),
          is_active: false
        })
        .eq('session_id', sessionId)
        .select()
        .single();

      if (error) throw error;

      res.json({ success: true, session: data });
    } catch (error: any) {
      console.error('Error ending session:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.patch("/api/analytics/pageview/:pageViewId/time", async (req, res) => {
    try {
      const { pageViewId } = req.params;
      const { timeSpent } = req.body;

      const { data, error } = await supabase
        .from('page_views')
        .update({ time_spent: timeSpent })
        .eq('id', pageViewId)
        .select()
        .single();

      if (error) throw error;

      res.json({ success: true, pageView: data });
    } catch (error: any) {
      console.error('Error updating time spent:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
