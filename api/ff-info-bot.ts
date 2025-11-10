
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

const ffInfoApiKey = process.env.FFINFO_API_KEY || '';

const REGION_API_MAP: Record<string, string> = {
  'SG': 'sg',
  'IND': 'ind',
  'CIS': 'cis',
  'TH': 'th',
  'VN': 'vn',
  'TR': 'tr',
  'BR': 'br',
  'PK': 'ind',
  'BD': 'ind',
  'ME': 'cis',
  'ID': 'sg',
  'MY': 'sg',
  'PH': 'sg',
  'US': 'br',
  'EU': 'cis',
};

const searchSchema = z.object({
  uid: z.string().regex(/^[0-9]{6,20}$/, 'UID must be 6-20 digits'),
  region: z.string().toUpperCase().refine(
    val => Object.keys(REGION_API_MAP).includes(val),
    'Invalid region code'
  ),
});

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

  // Handle check-limit endpoint
  if (req.method === 'GET') {
    try {
      if (!supabase) {
        return res.status(503).json({ error: "Database not configured" });
      }

      const ipAddress = getClientIP(req);
      const today = new Date().toISOString().split('T')[0];

      const { data: rateLimit } = await supabase
        .from('ff_info_rate_limits')
        .select('*')
        .eq('ip_address', ipAddress)
        .single();

      let remainingSearches = 5;
      
      if (rateLimit && rateLimit.last_reset_date === today) {
        remainingSearches = Math.max(0, 5 - rateLimit.search_count);
      }

      return res.json({
        remainingSearches,
        totalSearches: rateLimit?.last_reset_date === today ? rateLimit.search_count : 0,
        dailyLimit: 5,
        limitReached: remainingSearches === 0,
      });
    } catch (error) {
      console.error('Check limit error:', error);
      return res.status(500).json({ error: "Error checking limit" });
    }
  }

  // Handle search endpoint
  if (req.method === 'POST') {
    try {
      if (!supabase) {
        return res.status(503).json({ 
          error: "❌ Database not configured. Please add SUPABASE_URL and SUPABASE_SERVICE_KEY to environment variables." 
        });
      }

      if (!ffInfoApiKey) {
        return res.status(503).json({ 
          error: "❌ Free Fire API key not configured. Please add FFINFO_API_KEY to environment variables." 
        });
      }

      const validation = searchSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: validation.error.errors[0].message 
        });
      }

      const { uid, region } = validation.data;
      const apiRegion = REGION_API_MAP[region];
      
      const ipAddress = getClientIP(req);
      const today = new Date().toISOString().split('T')[0];

      const { data: rateLimit, error: rateLimitError } = await supabase
        .from('ff_info_rate_limits')
        .select('*')
        .eq('ip_address', ipAddress)
        .single();

      if (rateLimitError && rateLimitError.code !== 'PGRST116') {
        console.error('Rate limit check error:', rateLimitError);
        return res.status(500).json({ error: "Error checking rate limit" });
      }

      let currentSearchCount = 0;
      
      if (rateLimit) {
        if (rateLimit.last_reset_date !== today) {
          await supabase
            .from('ff_info_rate_limits')
            .update({
              search_count: 0,
              last_reset_date: today,
              updated_at: new Date().toISOString(),
            })
            .eq('ip_address', ipAddress);
          currentSearchCount = 0;
        } else {
          currentSearchCount = rateLimit.search_count;
          if (currentSearchCount >= 5) {
            return res.status(429).json({ 
              error: "Daily limit reached (5 searches per day). Come back tomorrow! 🌟",
              remainingSearches: 0,
              limitReached: true
            });
          }
        }
      }

      const apiUrl = `https://api.ffinfo.freefireofficial.com/api/${apiRegion}/${uid}?key=${ffInfoApiKey}`;
      
      console.log(`🔍 Fetching player info: Region: ${region} -> ${apiRegion}, UID: ${uid}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      console.log(`📡 API Response Status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error Response:`, errorText);
        
        if (response.status === 404) {
          return res.status(404).json({ 
            error: `❌ No player found with UID ${uid} in ${region} region. Double-check your UID and region!` 
          });
        }
        if (response.status === 401 || response.status === 403) {
          return res.status(503).json({ 
            error: "❌ API authentication failed. Please check FFINFO_API_KEY." 
          });
        }
        return res.status(502).json({ 
          error: `❌ Free Fire API error (${response.status}). Please try again later.` 
        });
      }

      const responseText = await response.text();
      
      if (responseText.trim().startsWith('<') || responseText.includes('<!DOCTYPE')) {
        return res.status(504).json({ 
          error: "⏱️ Request timeout. Please try again." 
        });
      }
      
      const data = JSON.parse(responseText);

      if (!data || !data.basicInfo) {
        return res.status(502).json({ 
          error: "❌ Invalid response from Free Fire API." 
        });
      }

      const newCount = currentSearchCount + 1;

      if (rateLimit) {
        await supabase
          .from('ff_info_rate_limits')
          .update({
            search_count: newCount,
            updated_at: new Date().toISOString(),
          })
          .eq('ip_address', ipAddress);
      } else {
        await supabase
          .from('ff_info_rate_limits')
          .insert({
            ip_address: ipAddress,
            search_count: 1,
            last_reset_date: today,
          });
      }

      await supabase
        .from('ff_info_searches')
        .insert({
          ip_address: ipAddress,
          uid,
          region,
          search_date: today,
        });

      return res.json({
        success: true,
        data,
        searchInfo: {
          remainingSearches: 5 - newCount,
          totalSearches: newCount,
          dailyLimit: 5,
        }
      });

    } catch (error: any) {
      console.error('FF Info Bot search error:', error);
      
      if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        return res.status(504).json({ 
          error: "⏱️ Request timeout. Please try again." 
        });
      }
      
      return res.status(500).json({ 
        error: "❌ Something went wrong. Please try again." 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
