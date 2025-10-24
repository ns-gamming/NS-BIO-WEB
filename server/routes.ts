import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createClient } from '@supabase/supabase-js';
import { insertBlogPostSchema, insertPollSchema } from "@shared/schema";
import { GoogleGenAI } from "@google/genai";
import { comprehensiveBlogPosts } from "./blog-seed-data";
import { registerAnalyticsRoutes } from "./analytics-routes";
import { registerChatbotRoutes } from "./chatbot-routes";
import { registerFeedbackRoutes } from "./feedback-routes";
import { registerPrivacyRoutes } from "./privacy-routes";
import { registerGeminiRoutes } from "./gemini-routes";
import { registerDownloaderRoutes } from "./downloader-routes";

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Seed blog posts automatically on server startup
async function seedBlogPosts() {
  try {
    console.log("Checking if blog posts need seeding...");
    const existingPosts = await storage.getAllBlogPosts();
    
    if (existingPosts.length === 0) {
      console.log("Seeding blog posts...");
      for (const post of comprehensiveBlogPosts) {
        await storage.createBlogPost(post);
        console.log(`✓ Created post: ${post.title}`);
      }
      console.log("✅ Blog posts seeded successfully!");
    } else {
      console.log(`Blog posts already exist (${existingPosts.length} posts found)`);
    }
  } catch (error) {
    console.error("Error seeding blog posts:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed blog posts on startup
  await seedBlogPosts();
  
  // Register analytics, chatbot, feedback, privacy, gemini and downloader routes
  registerAnalyticsRoutes(app);
  registerChatbotRoutes(app);
  registerFeedbackRoutes(app);
  registerPrivacyRoutes(app);
  registerGeminiRoutes(app);
  registerDownloaderRoutes(app);
  
  // Admin endpoint to initialize Supabase tables
  app.post("/api/admin/init-supabase", async (req, res) => {
    try {
      if (!supabase) {
        return res.status(503).json({ error: "Supabase not configured" });
      }

      const queries = [
        `CREATE TABLE IF NOT EXISTS analytics_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id VARCHAR(255) UNIQUE NOT NULL,
          ip_address VARCHAR(100) NOT NULL,
          user_agent TEXT,
          device_info JSONB,
          started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          ended_at TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT true
        );`,
        `CREATE TABLE IF NOT EXISTS page_views (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id VARCHAR(255),
          page_url TEXT NOT NULL,
          page_title TEXT,
          referrer TEXT,
          viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          time_spent INTEGER DEFAULT 0
        );`,
        `CREATE TABLE IF NOT EXISTS user_events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id VARCHAR(255),
          event_type VARCHAR(50) NOT NULL,
          element_id TEXT,
          element_text TEXT,
          element_tag TEXT,
          page_url TEXT NOT NULL,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB
        );`,
        `CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id VARCHAR(255) UNIQUE NOT NULL,
          name TEXT NOT NULL,
          age INTEGER,
          gender VARCHAR(20),
          ip_address VARCHAR(100),
          additional_info JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`,
        `CREATE TABLE IF NOT EXISTS chat_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id VARCHAR(255) UNIQUE NOT NULL,
          user_id VARCHAR(255),
          started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          ended_at TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT true,
          message_count INTEGER DEFAULT 0
        );`,
        `CREATE TABLE IF NOT EXISTS chat_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          message_id VARCHAR(255) UNIQUE NOT NULL,
          session_id VARCHAR(255),
          sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'assistant')),
          message_text TEXT NOT NULL,
          ip_address VARCHAR(100),
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          metadata JSONB
        );`
      ];

      const results = [];
      for (const query of queries) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql_query: query });
          results.push({ query: query.substring(0, 50) + '...', success: !error, error: error?.message });
        } catch (err) {
          results.push({ query: query.substring(0, 50) + '...', success: false, error: 'execution failed' });
        }
      }

      res.json({ 
        success: true, 
        message: "Tables initialization attempted",
        results,
        note: "If this fails, please run the SQL in supabase-schema.sql manually in your Supabase SQL editor"
      });
    } catch (error: any) {
      console.error('Error initializing tables:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Gemini Chat API endpoint - Robust for Vercel deployment with fallback and error logging
  app.post("/api/chat", async (req, res) => {
    const ipAddress = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const sessionId = req.body.sessionId || 'unknown';
    
    try {
      const { messages } = req.body;

      // Always return 200 to keep chat session alive - never break the chat!
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        // Log error to Supabase
        if (supabase) {
          try {
            await supabase.from('ai_chat_messages').insert({
              session_id: sessionId,
              sender_type: 'system',
              message_text: 'Empty message received',
              ip_address: ipAddress,
              user_agent: userAgent,
              page_url: req.headers.referer || 'unknown',
              timestamp: new Date().toISOString()
            });
          } catch (err: any) {
            console.log('Database log failed (OK):', err.message);
          }
        }
        
        return res.json({ 
          message: "Oops! I didn't catch that! 🤔 Could you try saying that again? I'm here to help with games, tools, and anything NS GAMMING! ✨" 
        });
      }

      // Get API key from environment
      const apiKey = process.env.GEMINI_API_KEY;
      
      // If no API key, provide friendly fallback response and log to database
      if (!apiKey) {
        console.error('GEMINI_API_KEY not found - using fallback response');
        
        // Log API key missing error to Supabase
        if (supabase) {
          try {
            await supabase.from('ai_chat_messages').insert({
              session_id: sessionId,
              sender_type: 'system',
              message_text: `API_KEY_MISSING - User: ${messages[messages.length - 1]?.content || 'unknown'}`,
              ip_address: ipAddress,
              user_agent: userAgent,
              page_url: req.headers.referer || 'unknown',
              timestamp: new Date().toISOString()
            });
          } catch (err: any) {
            console.log('Database log failed (OK):', err.message);
          }
        }
        
        const lastMessage = messages[messages.length - 1];
        const userQuestion = lastMessage.content.toLowerCase();
        
        // Smart fallback responses based on keywords
        let fallbackResponse = "Hey! 😊 I'm AAPTI, your NS GAMMING assistant! Umm... the AI service is temporarily resting (API key missing 🥲), but I can still help! ✨\n\nYou can:\n- Explore amazing games at /games 🎮\n- Try Free Fire tools at /ff-bots 🔥\n- Check out the Tools page at /tools 🛠️\n- Read helpful blog articles at /blog 📝\n\nWhat would you like to do?";
        
        if (userQuestion.includes('nishant') || userQuestion.includes('naboraj')) {
          fallbackResponse = "Oh my god, you asked about Nishant! 🥰 Umm... he's the amazing creator of this website - NS GAMMING! 💙 He's super talented in coding, gaming, and content creation. You know, he's built this whole platform with ❤️... Actually, you should check his work at /portfolio! (And between us... he's really amazing 😊💕)";
        } else if (userQuestion.includes('game')) {
          fallbackResponse = "Arre! Games? YES! 🎮✨ We have 14+ amazing games you can play right now! Go to /games and try them - Tic Tac Toe, Snake, 2048, and many more! All work on mobile, tablet aur PC! Bahut maza aayega! 😊";
        } else if (userQuestion.includes('tool')) {
          fallbackResponse = "Tools! Haan! 🛠️✨ We have AMAZING tools at /tools yaar! Free Fire name generator, UID generator, sensitivity settings, and even video downloaders for YouTube, Instagram, TikTok! Sab kuch hai! Check them out! 💪";
        }
        
        return res.json({ message: fallbackResponse });
      }

      // Use Google GenAI SDK with timeout and retry logic
      const { GoogleGenAI } = await import('@google/genai');
      const client = new GoogleGenAI({ apiKey });

      // Get the last user message
      const lastMessage = messages[messages.length - 1];
      const prompt = lastMessage.content;

      // Generate content with timeout protection
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 25000)
      );

      const apiPromise = client.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt
      });

      const response = await Promise.race([apiPromise, timeoutPromise]) as any;
      const text = response.text || "I apologize, but I couldn't generate a response. Please try again!";

      res.json({ message: text });
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      // Log error to Supabase with IP tracking - CRITICAL for debugging
      if (supabase) {
        try {
          await supabase.from('ai_chat_messages').insert({
            session_id: sessionId,
            sender_type: 'system',
            message_text: `ERROR: ${error.message} - User IP: ${ipAddress} - Agent: ${userAgent} - Query: ${req.body.messages?.[req.body.messages.length - 1]?.content || 'unknown'}`,
            ip_address: ipAddress,
            user_agent: userAgent,
            page_url: req.headers.referer || 'unknown',
            timestamp: new Date().toISOString()
          });
        } catch (err: any) {
          console.log('Database error log failed (OK):', err.message);
        }
      }
      
      // Provide contextual fallback responses instead of errors
      const lastMessage = req.body.messages?.[req.body.messages.length - 1];
      const userQuestion = lastMessage?.content?.toLowerCase() || '';
      
      // Determine fallback based on error type and user question
      let fallbackMessage = "Oops! My brain just lagged like a 999 ping game! 😅 But don't worry, I'm still here to help! ✨";
      
      if (error.message?.includes('timeout') || error.message?.includes('DEADLINE_EXCEEDED')) {
        fallbackMessage = "Arre yaar! The response took too long (timeout 😅). Umm... let me help you quickly! What are you looking for? Games (/games), Tools (/tools), or FF Bots (/ff-bots)? Tell me! 💕";
      } else if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
        fallbackMessage = "Oh no! The AI is taking a break (quota exceeded 🥲). But hey, I can still guide you! Visit /games for fun games, /tools for utilities, or /ff-bots for Free Fire tools! Chalo! 🌟";
      } else if (userQuestion.includes('nishant') || userQuestion.includes('naboraj')) {
        fallbackMessage = "Even with errors, I can tell you about Nishant! 🥰 He's the brilliant creator behind NS GAMMING - a coder, gamer, and content creator from Siliguri! You know... he's really talented 💙 Check his work at /portfolio!";
      } else if (userQuestion.includes('game')) {
        fallbackMessage = "Error or not, I know games! 🎮 We have 14+ games at /games - all FREE and work on any device! Tic Tac Toe, Snake, 2048, Breakout... sab kuch! Let's play! ✨";
      } else if (userQuestion.includes('tool') || userQuestion.includes('download')) {
        fallbackMessage = "Tools? I gotchu! 🛠️ Even if AI is sleeping, check /tools for amazing utilities - FF name generator, video downloaders (YouTube, Instagram, TikTok!), sensitivity calculator... everything you need! 💪";
      }
      
      // Always return 200 with fallback message to keep chat working
      res.json({ message: fallbackMessage });
    }
  });
  // Free Fire Likes API proxy endpoint
  app.post("/api/ff-likes", async (req, res) => {
    try {
      // Check if Supabase is configured
      if (!supabase) {
        return res.status(503).json({ 
          success: false, 
          message: "Service temporarily unavailable. Please contact the administrator." 
        });
      }
      const { uid, region } = req.body;

      // Validate input
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

      // Get user IP and agent
      const userIP = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.socket.remoteAddress || 
                     'unknown';
      
      const ipString = Array.isArray(userIP) ? userIP[0] : userIP.toString();
      const userAgent = req.headers['user-agent'] || 'unknown';

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

      // Call the Free Fire API
      const apiUrl = `https://likes.api.freefireofficial.com/api/${region}/${uid}?key=testkey12`;
      const apiResponse = await fetch(apiUrl);
      const apiData = await apiResponse.json();

      // Check if likes were successfully given
      if (apiData.status === 1 && apiData.response?.LikesGivenByAPI > 0) {
        // Log usage to Supabase
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

        // Log complete interaction details
        const { error: interactionError } = await supabase
          .from('ff_bot_interactions')
          .insert([{
            user_ip: ipString,
            ff_uid: uid,
            ff_region: region,
            player_name: apiData.response.PlayerNickname,
            player_level: apiData.response.PlayerLevel,
            likes_before: apiData.response.LikesbeforeCommand,
            likes_added: apiData.response.LikesGivenByAPI,
            likes_after: apiData.response.LikesafterCommand,
            success: true,
            error_message: null,
            user_agent: userAgent,
            created_at: new Date().toISOString()
          }]);

        if (interactionError) {
          console.error('Error logging interaction:', interactionError);
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
        // Log failed interaction
        const { error: interactionError } = await supabase
          .from('ff_bot_interactions')
          .insert([{
            user_ip: ipString,
            ff_uid: uid,
            ff_region: region,
            player_name: null,
            player_level: null,
            likes_before: null,
            likes_added: 0,
            likes_after: null,
            success: false,
            error_message: apiData.message || "Unable to add likes",
            user_agent: userAgent,
            created_at: new Date().toISOString()
          }]);

        if (interactionError) {
          console.error('Error logging failed interaction:', interactionError);
        }

        return res.json({
          success: false,
          message: apiData.message || "Unable to add likes at this time"
        });
      }
    } catch (error) {
      console.error('Error processing request:', error);
      
      // Log error interaction
      const userIP = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.socket.remoteAddress || 
                     'unknown';
      const ipString = Array.isArray(userIP) ? userIP[0] : userIP.toString();
      const userAgent = req.headers['user-agent'] || 'unknown';
      
      if (supabase) {
        await supabase
          .from('ff_bot_interactions')
          .insert([{
            user_ip: ipString,
            ff_uid: req.body.uid || 'unknown',
            ff_region: req.body.region || 'unknown',
            success: false,
            error_message: error instanceof Error ? error.message : 'Internal server error',
            user_agent: userAgent,
            created_at: new Date().toISOString()
          }]);
      }
      
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Manual seed endpoint (for admin use)
  app.post("/api/seed-blog", async (req, res) => {
    try {
      console.log("Manual blog seeding triggered...");
      const existingPosts = await storage.getAllBlogPosts();
      let seededCount = 0;
      
      for (const post of comprehensiveBlogPosts) {
        const exists = existingPosts.find(p => p.slug === post.slug);
        if (!exists) {
          await storage.createBlogPost(post);
          seededCount++;
          console.log(`✓ Created post: ${post.title}`);
        }
      }
      
      res.json({ 
        success: true, 
        message: `Seeded ${seededCount} new blog posts`,
        total: existingPosts.length + seededCount
      });
    } catch (error) {
      console.error('Error seeding blog posts:', error);
      res.status(500).json({ error: "Failed to seed blog posts" });
    }
  });

  // Blog feedback stats endpoint
  app.get("/api/blog/:slug/feedback-stats", async (req, res) => {
    try {
      if (!supabase) {
        console.warn('Supabase not configured - returning empty stats');
        return res.json({ averageRating: 0, totalRatings: 0 });
      }

      const { slug } = req.params;

      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ 
          error: "Invalid blog post identifier",
          averageRating: 0, 
          totalRatings: 0 
        });
      }

      console.log(`Fetching feedback stats for: ${slug}`);

      const { data, error } = await supabase
        .from('blog_feedback')
        .select('rating')
        .eq('blog_slug', slug.trim());

      if (error) {
        console.error('Supabase error fetching feedback stats:', error);
        return res.json({ averageRating: 0, totalRatings: 0 });
      }

      if (!data || data.length === 0) {
        return res.json({ averageRating: 0, totalRatings: 0 });
      }

      const totalRatings = data.length;
      const averageRating = data.reduce((sum, item) => sum + item.rating, 0) / totalRatings;

      res.json({ 
        averageRating: Math.round(averageRating * 10) / 10, 
        totalRatings 
      });
    } catch (error: any) {
      console.error('Error fetching blog feedback stats:', error);
      res.status(500).json({ 
        error: error.message,
        averageRating: 0, 
        totalRatings: 0 
      });
    }
  });

  // Blog feedback is now handled in feedback-routes.ts with proper schema mapping

  // Blog endpoints
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      await storage.incrementBlogViews(req.params.slug);
      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const validated = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validated);
      res.json(post);
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(400).json({ error: "Invalid blog post data" });
    }
  });

  // Poll endpoints
  app.get("/api/polls", async (req, res) => {
    try {
      const polls = await storage.getActivePolls();
      res.json(polls);
    } catch (error) {
      console.error('Error fetching polls:', error);
      res.status(500).json({ error: "Failed to fetch polls" });
    }
  });

  app.post("/api/polls", async (req, res) => {
    try {
      const validated = insertPollSchema.parse(req.body);
      const poll = await storage.createPoll(validated);
      res.json(poll);
    } catch (error) {
      console.error('Error creating poll:', error);
      res.status(400).json({ error: "Invalid poll data" });
    }
  });

  app.post("/api/polls/:id/vote", async (req, res) => {
    try {
      const { optionIndex } = req.body;
      if (typeof optionIndex !== 'number' || optionIndex < 0) {
        return res.status(400).json({ error: "Invalid option index" });
      }
      const poll = await storage.votePoll(req.params.id, optionIndex);
      res.json(poll);
    } catch (error) {
      console.error('Error voting on poll:', error);
      res.status(500).json({ error: "Failed to vote" });
    }
  });

  // Visitor stats endpoint
  app.get("/api/visitor-count", async (req, res) => {
    try {
      const count = await storage.getTodayVisitorCount();
      res.json({ count });
    } catch (error) {
      console.error('Error fetching visitor count:', error);
      res.status(500).json({ error: "Failed to fetch visitor count" });
    }
  });

  app.post("/api/visitor-count", async (req, res) => {
    try {
      await storage.incrementVisitorCount();
      const count = await storage.getTodayVisitorCount();
      res.json({ count });
    } catch (error) {
      console.error('Error incrementing visitor count:', error);
      res.status(500).json({ error: "Failed to increment visitor count" });
    }
  });

  // Tool usage tracking
  app.post("/api/tool-usage/:toolName", async (req, res) => {
    try {
      await storage.incrementToolUsage(req.params.toolName);
      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking tool usage:', error);
      res.status(500).json({ error: "Failed to track tool usage" });
    }
  });

  // Weather API proxy (to avoid CORS issues)
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat = '26.7271', lon = '88.3953' } = req.query; // Siliguri coordinates
      const apiKey = process.env.OPENWEATHER_API_KEY || '';
      
      if (!apiKey) {
        return res.json({ 
          temp: 25, 
          description: 'Clear Sky',
          location: 'Siliguri',
          mock: true 
        });
      }

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const data = await weatherResponse.json();
      
      res.json({
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        location: data.name,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      res.json({ 
        temp: 25, 
        description: 'Clear Sky',
        location: 'Siliguri',
        mock: true 
      });
    }
  });

  // Crypto price API proxy
  app.get("/api/crypto", async (req, res) => {
    try {
      const cryptoResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd,inr&include_24hr_change=true'
      );
      const data = await cryptoResponse.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      res.status(500).json({ error: "Failed to fetch crypto prices" });
    }
  });

  // Gaming news RSS feed proxy
  app.get("/api/gaming-news", async (req, res) => {
    try {
      const rssUrl = 'https://www.polygon.com/rss/index.xml';
      const rssResponse = await fetch(rssUrl);
      const rssText = await rssResponse.text();
      
      const items: any[] = [];
      const itemMatches = Array.from(rssText.matchAll(/<item>([\s\S]*?)<\/item>/g));
      
      for (const match of itemMatches) {
        const item = match[1];
        const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || '';
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
        
        if (title && link) {
          items.push({ title, link, pubDate });
          if (items.length >= 10) break;
        }
      }
      
      res.json(items);
    } catch (error) {
      console.error('Error fetching gaming news:', error);
      res.json([]);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
