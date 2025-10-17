
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const { slug, rating, feedback } = req.body;
    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (!slug || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        error: "Valid slug and rating (1-5) are required" 
      });
    }

    const { data, error } = await supabase
      .from('blog_feedback')
      .insert({
        blog_slug: slug,
        rating: parseInt(rating),
        feedback_text: feedback || null,
        user_ip: ipAddress,
        user_agent: userAgent,
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving blog feedback:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, feedback: data });
  } catch (error: any) {
    console.error('Error in blog feedback route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
