
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://zsithfxmjtyeummbchpy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzaXRoZnhtanR5ZXVtbWJjaHB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg1NTA5MSwiZXhwIjoyMDc1NDMxMDkxfQ.AmYPTMNFzWbRqg2CpT1F84vwYdASvG3boqk7P1_r0q0';

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const { data: existingUsage, error: checkError } = await supabase
      .from('usage_logs')
      .select('id')
      .eq('ip', ipString)
      .gte('used_at', today.toISOString())
      .limit(1);

    if (checkError) {
      console.error('Error checking usage:', checkError);
      return res.status(500).json({ 
        success: false, 
        message: "Database connection error. Please try again later." 
      });
    }

    if (existingUsage && existingUsage.length > 0) {
      return res.status(429).json({ 
        success: false, 
        message: "You've already used your free daily like. To get unlimited likes, contact @Nishantsarkar10k on Telegram to buy VIP access." 
      });
    }

    const apiUrl = `https://likes.api.freefireofficial.com/api/${region}/${uid}?key=testkey12`;
    const apiResponse = await fetch(apiUrl);
    const apiData = await apiResponse.json();

    if (apiData.status === 1 && apiData.response?.LikesGivenByAPI > 0) {
      const { error: insertError } = await supabase
        .from('usage_logs')
        .insert([{ 
          ip: ipString, 
          uid, 
          region, 
          used_at: new Date().toISOString() 
        }]);

      if (insertError) {
        console.error('Error logging usage:', insertError);
      }

      return res.json({
        success: true,
        player: apiData.response.PlayerNickname,
        uid: apiData.response.UID,
        level: apiData.response.PlayerLevel,
        likesBefore: apiData.response.LikesbeforeCommand,
        likesAdded: apiData.response.LikesGivenByAPI,
        likesAfter: apiData.response.LikesafterCommand,
      });
    } else {
      return res.json({
        success: false,
        message: apiData.message || "Unable to add likes at this time"
      });
    }

  } catch (error: any) {
    console.error('FF Likes API Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "An error occurred while processing your request" 
    });
  }
}
