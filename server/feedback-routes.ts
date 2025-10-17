import type { Express, Request } from "express";
import { supabase } from './supabase-client';

function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0]) : req.socket.remoteAddress || 'unknown';
  return ip;
}

export function registerFeedbackRoutes(app: Express) {

  // Submit page/tool feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      const { pageName, toolName, rating, feedbackText } = req.body;
      const userIp = getClientIP(req);
      const userAgent = req.headers['user-agent'] || 'unknown';

      if (!pageName || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: "Invalid feedback data" });
      }

      const { data, error } = await supabase
        .from('user_feedback')
        .insert([{
          page_name: pageName,
          tool_name: toolName || null,
          rating: rating,
          feedback_text: feedbackText || null,
          user_ip: userIp,
          user_agent: userAgent,
          submitted_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving feedback:', error);
        return res.status(500).json({ success: false, message: "Failed to save feedback" });
      }

      res.json({ success: true, feedback: data });
    } catch (error: any) {
      console.error('Error in feedback route:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Submit blog feedback
  app.post("/api/blog/:slug/feedback", async (req, res) => {
    try {
      const { slug } = req.params;
      const { rating, feedback } = req.body;
      const ipAddress = getClientIP(req);
      const userAgent = req.headers['user-agent'] || 'unknown';

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ 
          success: false, 
          error: "Valid rating (1-5) is required" 
        });
      }

      const { data, error } = await supabase
        .from('blog_feedback')
        .insert([{
          blog_slug: slug,
          rating,
          feedback_text: feedback || null,
          user_ip: ipAddress,
          user_agent: userAgent,
          submitted_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      res.json({ success: true, feedback: data });
    } catch (error: any) {
      console.error('Error saving blog feedback:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get feedback stats for a specific page/tool
  app.get("/api/feedback/stats/:pageName", async (req, res) => {
    try {
      const { pageName } = req.params;

      const { data, error } = await supabase
        .from('user_feedback')
        .select('rating')
        .eq('page_name', pageName);

      if (error) throw error;

      if (!data || data.length === 0) {
        return res.json({ 
          averageRating: 0, 
          totalFeedbacks: 0,
          ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
      }

      const totalFeedbacks = data.length;
      const averageRating = data.reduce((sum, item) => sum + item.rating, 0) / totalFeedbacks;

      const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      data.forEach(item => {
        if (item.rating >= 1 && item.rating <= 5) {
          ratings[item.rating as 1 | 2 | 3 | 4 | 5]++;
        }
      });

      res.json({ 
        averageRating: Math.round(averageRating * 10) / 10, 
        totalFeedbacks,
        ratings
      });
    } catch (error: any) {
      console.error('Error fetching feedback stats:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get feedback stats for a specific blog post
  app.get("/api/blog/:slug/feedback/stats", async (req, res) => {
    try {
      const { slug } = req.params;

      const { data, error } = await supabase
        .from('blog_feedback')
        .select('rating')
        .eq('blog_slug', slug);

      if (error) throw error;

      if (!data || data.length === 0) {
        return res.json({ 
          averageRating: 0, 
          totalFeedbacks: 0,
          ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
      }

      const totalFeedbacks = data.length;
      const averageRating = data.reduce((sum, item) => sum + item.rating, 0) / totalFeedbacks;

      const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      data.forEach(item => {
        if (item.rating >= 1 && item.rating <= 5) {
          ratings[item.rating as 1 | 2 | 3 | 4 | 5]++;
        }
      });

      res.json({ 
        averageRating: Math.round(averageRating * 10) / 10, 
        totalFeedbacks,
        ratings
      });
    } catch (error: any) {
      console.error('Error fetching blog feedback stats:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
}