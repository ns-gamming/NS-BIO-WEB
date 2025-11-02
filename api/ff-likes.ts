
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

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

    // Check if user is VIP (by IP or FF UID)
    const { data: vipUser, error: vipError } = await supabase
      .from('vip_users')
      .select('*')
      .or(`ip_address.eq.${ipString},ff_uid.eq.${uid}`)
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .single();

    if (vipError && vipError.code !== 'PGRST116') {
      console.error('Error checking VIP status:', vipError);
    }

    // If user is VIP with unlimited likes, skip rate limiting
    const isVIP = vipUser && vipUser.unlimited_likes && vipUser.is_active;

    // Check if user has already used the tool today (only if not VIP)
    if (!isVIP) {
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
    }

    // API key is secured on backend only - never sent to frontend
    const ffLikesApiKey = process.env.FF_LIKES_API_KEY || 'testkey12';
    const apiUrl = `https://likes.api.freefireofficial.com/api/${region}/${uid}?key=${ffLikesApiKey}`;
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
