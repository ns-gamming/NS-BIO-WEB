
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0]) : 'unknown';
  return ip;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    if (!supabase) {
      return res.status(503).json({ 
        success: false, 
        message: "Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY." 
      });
    }

    const { pageName, toolName, rating, feedbackText } = req.body;
    const userIp = getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (!pageName || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Invalid feedback data" });
    }

    const { data, error } = await supabase
      .from('user_feedback')
      .insert([{
        page_name: pageName,
        tool_name: toolName || null,
        rating: rating,
        feedback_text: feedbackText || null,
        user_ip: userIp,
        user_agent: userAgent,
        submitted_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving feedback:', error);
      return res.status(500).json({ success: false, message: "Failed to save feedback" });
    }

    res.json({ success: true, feedback: data });
  } catch (error: any) {
    console.error('Error in feedback route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
