import type { Express } from "express";
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

const ffInfoApiKey = process.env.FFINFO_API_KEY || '';
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const REGION_API_MAP: Record<string, string> = {
  'SG': 'sg', 'IND': 'ind', 'CIS': 'cis', 'TH': 'th', 'VN': 'vn', 'TR': 'tr', 'BR': 'br',
  'PK': 'ind', 'BD': 'ind', 'ME': 'cis', 'ID': 'sg', 'MY': 'sg', 'PH': 'sg', 'US': 'br', 'EU': 'cis',
};

const compareSchema = z.object({
  player1Uid: z.string().regex(/^[0-9]{6,20}$/, 'Player 1 UID must be 6-20 digits'),
  player1Region: z.string().toUpperCase().refine(
    val => Object.keys(REGION_API_MAP).includes(val),
    'Invalid region for Player 1'
  ),
  player2Uid: z.string().regex(/^[0-9]{6,20}$/, 'Player 2 UID must be 6-20 digits'),
  player2Region: z.string().toUpperCase().refine(
    val => Object.keys(REGION_API_MAP).includes(val),
    'Invalid region for Player 2'
  ),
});

async function fetchPlayerData(uid: string, region: string) {
  const apiRegion = REGION_API_MAP[region];
  const apiUrl = `https://api.ffinfo.freefireofficial.com/api/${apiRegion}/${uid}?key=${ffInfoApiKey}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch player data: ${response.status}`);
    }
    
    const responseText = await response.text();
    
    if (responseText.trim().startsWith('<') || responseText.includes('<!DOCTYPE')) {
      throw new Error('API timeout or invalid response');
    }
    
    return JSON.parse(responseText);
  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function analyzeWithGemini(player1Data: any, player2Data: any): Promise<{ player1Score: number, player2Score: number, analysis: string, winnerUid: string }> {
  if (!genAI) {
    throw new Error('Gemini AI not configured');
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `You are a Free Fire game expert analyst. Compare these two players and provide:
1. A score out of 100 for each player based on their overall performance
2. A detailed analysis (200-300 words) comparing:
   - Rank and rating points (BR and CS)
   - Level and experience
   - Achievements (likes, badges)
   - Guild participation
   - Account activity
3. Declare a clear winner

Player 1 (${player1Data.basicInfo.nickname}):
- Level: ${player1Data.basicInfo.level}
- BR Rank: ${player1Data.basicInfo.rank}, Points: ${player1Data.basicInfo.rankingPoints}
- CS Rank: ${player1Data.basicInfo.csRank}, Points: ${player1Data.basicInfo.csRankingPoints}
- Likes: ${player1Data.basicInfo.liked}
- Badges: ${player1Data.basicInfo.badgeCnt}
- Guild: ${player1Data.clanBasicInfo?.clanName || 'None'}

Player 2 (${player2Data.basicInfo.nickname}):
- Level: ${player2Data.basicInfo.level}
- BR Rank: ${player2Data.basicInfo.rank}, Points: ${player2Data.basicInfo.rankingPoints}
- CS Rank: ${player2Data.basicInfo.csRank}, Points: ${player2Data.basicInfo.csRankingPoints}
- Likes: ${player2Data.basicInfo.liked}
- Badges: ${player2Data.basicInfo.badgeCnt}
- Guild: ${player2Data.clanBasicInfo?.clanName || 'None'}

Format your response EXACTLY as JSON:
{
  "player1Score": <number 0-100>,
  "player2Score": <number 0-100>,
  "winnerUid": "<UID of winner>",
  "analysis": "<detailed comparison text>"
}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse Gemini response');
  }
  
  const analysis = JSON.parse(jsonMatch[0]);
  
  return {
    player1Score: Math.min(100, Math.max(0, analysis.player1Score)),
    player2Score: Math.min(100, Math.max(0, analysis.player2Score)),
    analysis: analysis.analysis,
    winnerUid: analysis.winnerUid,
  };
}

export function registerFfCompareRoutes(app: Express) {
  app.post("/api/ff-compare/compare", async (req, res) => {
    try {
      if (!supabase) {
        return res.status(503).json({ 
          error: "❌ Database not configured. Please add SUPABASE_URL and SUPABASE_SERVICE_KEY to Secrets." 
        });
      }

      if (!ffInfoApiKey) {
        return res.status(503).json({ 
          error: "❌ Free Fire API key not configured. Please add FFINFO_API_KEY to Secrets." 
        });
      }

      if (!geminiApiKey) {
        return res.status(503).json({ 
          error: "❌ Gemini API key not configured. Please add GEMINI_API_KEY to Secrets." 
        });
      }

      const validation = compareSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: validation.error.errors[0].message 
        });
      }

      const { player1Uid, player1Region, player2Uid, player2Region } = validation.data;
      
      const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
                       req.socket.remoteAddress || 
                       'unknown';
      const today = new Date().toISOString().split('T')[0];

      const { data: vipAccess } = await supabase
        .from('ff_compare_vip_access')
        .select('*')
        .eq('ip_address', ipAddress)
        .single();

      const isVip = vipAccess?.is_vip && (!vipAccess.vip_expires_at || new Date(vipAccess.vip_expires_at) > new Date());

      if (!isVip) {
        const { data: rateLimit, error: rateLimitError } = await supabase
          .from('ff_compare_rate_limits')
          .select('*')
          .eq('ip_address', ipAddress)
          .single();

        if (rateLimitError && rateLimitError.code !== 'PGRST116') {
          console.error('Rate limit check error:', rateLimitError);
          return res.status(500).json({ error: "Error checking rate limit" });
        }

        let currentCompareCount = 0;
        
        if (rateLimit) {
          if (rateLimit.last_reset_date !== today) {
            await supabase
              .from('ff_compare_rate_limits')
              .update({
                compare_count: 0,
                last_reset_date: today,
                updated_at: new Date().toISOString(),
              })
              .eq('ip_address', ipAddress);
            currentCompareCount = 0;
          } else {
            currentCompareCount = rateLimit.compare_count;
            if (currentCompareCount >= 3) {
              return res.status(429).json({ 
                error: "🚫 Daily limit reached (3 free comparisons). Upgrade to VIP for unlimited access! 💎",
                remainingCompares: 0,
                limitReached: true,
                needsVip: true,
              });
            }
          }
        }

        const newCount = currentCompareCount + 1;

        if (rateLimit) {
          await supabase
            .from('ff_compare_rate_limits')
            .update({
              compare_count: newCount,
              updated_at: new Date().toISOString(),
            })
            .eq('ip_address', ipAddress);
        } else {
          await supabase
            .from('ff_compare_rate_limits')
            .insert({
              ip_address: ipAddress,
              compare_count: 1,
              last_reset_date: today,
            });
        }
      }

      console.log(`🔍 Comparing players: ${player1Uid} (${player1Region}) vs ${player2Uid} (${player2Region})`);
      
      const [player1Data, player2Data] = await Promise.all([
        fetchPlayerData(player1Uid, player1Region),
        fetchPlayerData(player2Uid, player2Region),
      ]);

      if (!player1Data?.basicInfo || !player2Data?.basicInfo) {
        return res.status(502).json({ 
          error: "❌ Failed to fetch player data. Please verify UIDs and regions are correct." 
        });
      }

      const geminiResult = await analyzeWithGemini(player1Data, player2Data);

      const { data: historyEntry } = await supabase
        .from('ff_compare_history')
        .insert({
          ip_address: ipAddress,
          player1_uid: player1Uid,
          player1_region: player1Region,
          player2_uid: player2Uid,
          player2_region: player2Region,
          player1_score: geminiResult.player1Score,
          player2_score: geminiResult.player2Score,
          winner_uid: geminiResult.winnerUid,
          analysis: geminiResult.analysis,
        })
        .select()
        .single();

      const { data: updatedRateLimit } = await supabase
        .from('ff_compare_rate_limits')
        .select('*')
        .eq('ip_address', ipAddress)
        .single();

      return res.json({
        success: true,
        comparison: {
          id: historyEntry?.id,
          player1: player1Data,
          player2: player2Data,
          player1Score: geminiResult.player1Score,
          player2Score: geminiResult.player2Score,
          winnerUid: geminiResult.winnerUid,
          analysis: geminiResult.analysis,
        },
        limitInfo: {
          remainingCompares: isVip ? -1 : Math.max(0, 3 - (updatedRateLimit?.compare_count || 0)),
          totalCompares: isVip ? -1 : (updatedRateLimit?.compare_count || 0),
          dailyLimit: isVip ? -1 : 3,
          isVip,
        }
      });

    } catch (error: any) {
      console.error('FF Compare error:', error);
      
      if (error.name === 'AbortError' || error.message?.includes('timeout') || error.message?.includes('aborted')) {
        return res.status(504).json({ 
          error: "⏱️ Request timeout. The API is slow right now. Please try again in a moment." 
        });
      }
      
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        return res.status(503).json({ 
          error: "🌐 Network error. Unable to connect to Free Fire API. Check your internet and try again." 
        });
      }
      
      return res.status(500).json({ 
        error: "❌ Comparison failed. Please try again in a few seconds." 
      });
    }
  });

  app.get("/api/ff-compare/check-limit", async (req, res) => {
    try {
      if (!supabase) {
        return res.status(503).json({ error: "Database not configured" });
      }

      const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
                       req.socket.remoteAddress || 
                       'unknown';
      const today = new Date().toISOString().split('T')[0];

      const { data: vipAccess } = await supabase
        .from('ff_compare_vip_access')
        .select('*')
        .eq('ip_address', ipAddress)
        .single();

      const isVip = vipAccess?.is_vip && (!vipAccess.vip_expires_at || new Date(vipAccess.vip_expires_at) > new Date());

      if (isVip) {
        return res.json({
          remainingCompares: -1,
          totalCompares: -1,
          dailyLimit: -1,
          limitReached: false,
          isVip: true,
        });
      }

      const { data: rateLimit } = await supabase
        .from('ff_compare_rate_limits')
        .select('*')
        .eq('ip_address', ipAddress)
        .single();

      let remainingCompares = 3;
      
      if (rateLimit) {
        if (rateLimit.last_reset_date === today) {
          remainingCompares = Math.max(0, 3 - rateLimit.compare_count);
        }
      }

      return res.json({
        remainingCompares,
        totalCompares: rateLimit?.last_reset_date === today ? rateLimit.compare_count : 0,
        dailyLimit: 3,
        limitReached: remainingCompares === 0,
        isVip: false,
      });

    } catch (error) {
      console.error('Check limit error:', error);
      return res.status(500).json({ error: "Error checking limit" });
    }
  });

  app.post("/api/ff-compare/feedback", async (req, res) => {
    try {
      if (!supabase) {
        return res.status(503).json({ error: "Database not configured" });
      }

      const { comparisonId, rating, comment, helpful } = req.body;

      if (!comparisonId || !rating) {
        return res.status(400).json({ error: "Comparison ID and rating are required" });
      }

      const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
                       req.socket.remoteAddress || 
                       'unknown';

      await supabase
        .from('ff_compare_feedback')
        .insert({
          comparison_id: comparisonId,
          rating,
          comment: comment || null,
          helpful: helpful || null,
          ip_address: ipAddress,
        });

      return res.json({ success: true, message: "Thank you for your feedback!" });

    } catch (error) {
      console.error('Feedback error:', error);
      return res.status(500).json({ error: "Failed to submit feedback" });
    }
  });
}
