
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://zsithfxmjtyeummbchpy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzaXRoZnhtanR5ZXVtbWJjaHB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg1NTA5MSwiZXhwIjoyMDc1NDMxMDkxfQ.AmYPTMNFzWbRqg2CpT1F84vwYdASvG3boqk7P1_r0q0';

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
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
        message: "Service temporarily unavailable. Please contact the administrator." 
      });
    }

    const { uid, region } = req.body;

    if (!uid || !region) {
      return res.status(400).json({ 
        success: false, 
        message: "UID and region are required" 
      });
    }

    if (!/^\d{8,11}$/.test(uid)) {
      return res.status(400).json({ 
        success: false, 
        message: "UID must be 8-11 digits" 
      });
    }

    const userIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.socket.remoteAddress || 
                   'unknown';
    
    const ipString = Array.isArray(userIP) ? userIP[0] : userIP.toString();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: existingUsage } = await supabase
      .from('ff_tool_usage')
      .select('*')
      .eq('ip_address', ipString)
      .eq('tool_type', 'likes')
      .gte('created_at', today.toISOString())
      .single();

    if (existingUsage) {
      return res.status(429).json({
        success: false,
        message: "You've already used this tool today. Please try again tomorrow!"
      });
    }

    const apiUrl = `https://hunterapi.net/api/ff-likes.php?uid=${uid}&region=${region}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    await supabase.from('ff_tool_usage').insert({
      ip_address: ipString,
      tool_type: 'likes',
      uid: uid,
      region: region
    });

    return res.status(200).json(data);

  } catch (error: any) {
    console.error('FF Likes API Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "An error occurred while processing your request" 
    });
  }
}
