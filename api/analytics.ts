
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://zsithfxmjtyeummbchpy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzaXRoZnhtanR5ZXVtbWJjaHB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg1NTA5MSwiZXhwIjoyMDc1NDMxMDkxfQ.AmYPTMNFzWbRqg2CpT1F84vwYdASvG3boqk7P1_r0q0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0]) : 'unknown';
  return ip;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const path = req.url?.split('?')[0] || '';
    
    // Handle different analytics endpoints
    if (path.includes('/session') && req.method === 'POST') {
      const { sessionId, userAgent, referrer, utmParams } = req.body;
      const ipAddress = getClientIP(req);

      const { data, error } = await supabase
        .from('analytics_sessions')
        .insert([{
          session_id: sessionId,
          ip_address: ipAddress,
          user_agent: userAgent,
          referrer: referrer || null,
          utm_source: utmParams?.source || null,
          utm_medium: utmParams?.medium || null,
          utm_campaign: utmParams?.campaign || null,
          started_at: new Date().toISOString(),
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      return res.json({ success: true, session: data });
    }

    if (path.includes('/pageview') && req.method === 'POST') {
      const { sessionId, pageUrl, pageTitle } = req.body;
      const ipAddress = getClientIP(req);

      const { data, error } = await supabase
        .from('page_views')
        .insert([{
          session_id: sessionId,
          page_url: pageUrl,
          page_title: pageTitle,
          ip_address: ipAddress,
          viewed_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return res.json({ success: true, pageView: data });
    }

    if (path.includes('/event') && req.method === 'POST') {
      const { sessionId, eventType, eventData } = req.body;
      const ipAddress = getClientIP(req);

      const { data, error } = await supabase
        .from('user_events')
        .insert([{
          session_id: sessionId,
          event_type: eventType,
          event_category: eventData?.category || null,
          event_action: eventData?.action || null,
          event_label: eventData?.label || null,
          page_url: eventData?.pageUrl || null,
          ip_address: ipAddress,
          occurred_at: new Date().toISOString(),
          metadata: eventData || {}
        }])
        .select()
        .single();

      if (error) throw error;
      return res.json({ success: true, event: data });
    }

    return res.status(404).json({ success: false, message: 'Endpoint not found' });
  } catch (error: any) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
