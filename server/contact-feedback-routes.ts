
import type { Express, Request } from "express";
import { supabase } from './supabase-client';

function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0]) : req.socket.remoteAddress || 'unknown';
  return ip;
}

export function registerContactFeedbackRoutes(app: Express) {
  
  // Submit contact feedback
  app.post("/api/contact/feedback", async (req, res) => {
    if (!supabase) {
      return res.json({ success: true, message: 'Feedback received (database unavailable)' });
    }

    try {
      const { name, email, subject, message, rating } = req.body;
      const userIp = getClientIP(req);
      const userAgent = req.headers['user-agent'] || 'unknown';

      if (!name || !email || !message || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid feedback data. All fields except subject are required." 
        });
      }

      console.log(`Contact feedback received from IP: ${userIp} by ${name}`);

      const { data, error } = await supabase
        .from('contact_feedback')
        .insert([{
          name: name,
          email: email,
          subject: subject || null,
          message: message,
          rating: rating,
          user_ip: userIp,
          user_agent: userAgent,
          submitted_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving contact feedback:', error);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to save feedback" 
        });
      }

      res.json({ success: true, feedback: data });
    } catch (error: any) {
      console.error('Error in contact feedback route:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get all contact feedback (admin only - you can add authentication later)
  app.get("/api/contact/feedback/all", async (req, res) => {
    if (!supabase) {
      return res.json({ success: false, message: 'Database unavailable' });
    }

    try {
      const { data, error } = await supabase
        .from('contact_feedback')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      res.json({ success: true, feedback: data });
    } catch (error: any) {
      console.error('Error fetching contact feedback:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get feedback statistics
  app.get("/api/contact/feedback/stats", async (req, res) => {
    if (!supabase) {
      return res.json({ 
        averageRating: 0, 
        totalFeedbacks: 0, 
        ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        message: 'Database unavailable' 
      });
    }

    try {
      const { data, error } = await supabase
        .from('contact_feedback')
        .select('rating');

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
      console.error('Error fetching contact feedback stats:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
