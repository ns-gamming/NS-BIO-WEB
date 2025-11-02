import type { Express } from "express";
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

const ffInfoApiKey = process.env.FFINFO_API_KEY || '';

const REGION_API_MAP: Record<string, string> = {
  'IND': 'IN',
  'SG': 'SG',
  'PK': 'PK',
  'BD': 'BD',
  'TH': 'TH',
  'VN': 'VN',
  'BR': 'BR',
  'ID': 'ID',
  'MY': 'MY',
  'PH': 'PH',
  'US': 'US',
  'EU': 'EU',
  'ME': 'ME',
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

      const apiUrl = `https://api.ffinfo.freefireofficial.com/api/${apiRegion.toLowerCase()}/${uid}?key=${ffInfoApiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'NS-GAMMING-InfoBot/1.0',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ 
            error: `No account found for UID ${uid} in ${region} region` 
          });
        }
        return res.status(502).json({ 
          error: "Failed to fetch player info. Please try again later." 
        });
      }

      const data = await response.json();

      if (!data.basicInfo) {
        return res.status(502).json({ 
          error: "Invalid response from Free Fire API" 
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

    } catch (error) {
      console.error('FF Info Bot search error:', error);
      return res.status(500).json({ 
        error: "An error occurred while processing your request" 
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
