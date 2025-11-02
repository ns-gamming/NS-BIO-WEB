import type { Express } from "express";
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

const ffInfoApiKey = process.env.FFINFO_API_KEY || '';

const REGION_API_MAP: Record<string, string> = {
  'IND': 'in',
  'SG': 'sg',
  'PK': 'pk',
  'BD': 'bd',
  'TH': 'th',
  'VN': 'vn',
  'BR': 'br',
  'ID': 'id',
  'MY': 'my',
  'PH': 'ph',
  'US': 'us',
  'EU': 'eu',
  'ME': 'me',
};

const searchSchema = z.object({
  uid: z.string().regex(/^[0-9]{6,20}$/, 'UID must be 6-20 digits'),
  region: z.string().toUpperCase().refine(
    val => Object.keys(REGION_API_MAP).includes(val),
    'Invalid region code'
  ),
});

export function registerFfInfoBotRoutes(app: Express) {
  app.post("/api/ff-info-bot/search", async (req, res) => {
    try {
      if (!supabase) {
        return res.status(503).json({ 
          error: "❌ Database not configured. Please add SUPABASE_URL and SUPABASE_SERVICE_KEY to Replit Secrets." 
        });
      }

      if (!ffInfoApiKey) {
        return res.status(503).json({ 
          error: "❌ Free Fire API key not configured. Please add FFINFO_API_KEY to Replit Secrets (Tools > Secrets)." 
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
      
      const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
                       req.socket.remoteAddress || 
                       'unknown';
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

      // Free Fire Info API endpoint - correct official API format
      // Format: https://api.ffinfo.freefireofficial.com/api/{region}/{uid}?key={apikey}
      const apiUrl = `https://api.ffinfo.freefireofficial.com/api/${apiRegion}/${uid}?key=${ffInfoApiKey}`;
      
      console.log(`🔍 Fetching player info:`);
      console.log(`   Region: ${region} -> ${apiRegion}`);
      console.log(`   UID: ${uid}`);
      console.log(`   URL: ${apiUrl.replace(ffInfoApiKey, 'HIDDEN')}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
        signal: AbortSignal.timeout(15000),
      });

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
            error: "❌ API authentication failed. Please check FFINFO_API_KEY in Replit Secrets." 
          });
        }
        if (response.status === 500) {
          // Parse error for more details
          try {
            const errorData = JSON.parse(errorText);
            console.error('🔴 500 Error Details:', errorData);
            
            return res.status(502).json({ 
              error: `❌ Free Fire API error: ${errorData.error_id || 'REQUEST_ERROR'}. This could mean:\n• Invalid UID format\n• Wrong region\n• API key issue\n\nPlease verify your UID and region are correct.` 
            });
          } catch (e) {
            return res.status(502).json({ 
              error: `❌ Free Fire API server error (500). The API might be down or your UID/region might be incorrect.` 
            });
          }
        }
        return res.status(502).json({ 
          error: `❌ Free Fire API error (${response.status}). Please try again later.` 
        });
      }

      const data = await response.json();
      console.log('API Response Data:', JSON.stringify(data).substring(0, 200));

      if (!data || !data.basicInfo) {
        console.error('Invalid API response structure:', data);
        return res.status(502).json({ 
          error: "❌ Invalid response from Free Fire API. The player data is incomplete." 
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
          error: "⏱️ Request timeout. The Free Fire API is taking too long to respond. Please try again." 
        });
      }
      
      if (error.message?.includes('fetch')) {
        return res.status(503).json({ 
          error: "🌐 Network error. Unable to connect to Free Fire API. Please try again later." 
        });
      }
      
      return res.status(500).json({ 
        error: "❌ An unexpected error occurred. Please try again or contact support." 
      });
    }
  });

  app.get("/api/ff-info-bot/check-limit", async (req, res) => {
    try {
      if (!supabase) {
        return res.status(503).json({ error: "Database not configured" });
      }

      const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
                       req.socket.remoteAddress || 
                       'unknown';
      const today = new Date().toISOString().split('T')[0];

      const { data: rateLimit } = await supabase
        .from('ff_info_rate_limits')
        .select('*')
        .eq('ip_address', ipAddress)
        .single();

      let remainingSearches = 5;
      
      if (rateLimit) {
        if (rateLimit.last_reset_date === today) {
          remainingSearches = Math.max(0, 5 - rateLimit.search_count);
        }
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
  });
}
