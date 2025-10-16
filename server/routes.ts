import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createClient } from '@supabase/supabase-js';
import { insertBlogPostSchema, insertPollSchema } from "@shared/schema";
import { GoogleGenAI } from "@google/genai";

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function registerRoutes(app: Express): Promise<Server> {
  // Gemini Chat API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      // Convert messages to Gemini format
      const contents = messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));

      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: contents,
      });

      const text = response.text || "I apologize, but I couldn't generate a response. Please try again!";

      res.json({ message: text });
    } catch (error) {
      console.error('Gemini API error:', error);
      res.status(500).json({ 
        error: "Failed to generate response. Please try again!" 
      });
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

      // Get user IP (handle both direct and proxied requests)
      const userIP = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.socket.remoteAddress || 
                     'unknown';
      
      const ipString = Array.isArray(userIP) ? userIP[0] : userIP.toString();

      // Check if user has already used the tool today
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
    } catch (error) {
      console.error('Error processing request:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

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
