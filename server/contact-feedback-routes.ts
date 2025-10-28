import type { Express, Request } from "express";
import { supabase } from './supabase-client';

function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0]) : req.socket.remoteAddress || 'unknown';
  return ip;
}

//In-memory storage as fallback when Supabase is not configured
const inMemoryFeedback: Array<{
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  rating: number;
  userIp: string | null;
  userAgent: string | null;
  submittedAt: Date;
}> = [];

export function registerContactFeedbackRoutes(app: Express) {
  
  // Submit contact feedback
  app.post("/api/contact/feedback", async (req, res) => {
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

      const feedbackData = {
        name,
        email,
        subject: subject || null,
        message,
        rating,
        user_ip: userIp,
        user_agent: userAgent,
        submitted_at: new Date().toISOString()
      };

      // Try Supabase first, fall back to in-memory
      if (supabase) {
        const { data, error } = await supabase
          .from('contact_feedback')
          .insert([feedbackData])
          .select()
          .single();

        if (error) {
          console.error('Supabase error, using in-memory storage:', error);
          // Fallback to in-memory
          const feedback = {
            id: Math.random().toString(36).substring(7),
            ...feedbackData,
            userIp,
            userAgent,
            submittedAt: new Date()
          };
          inMemoryFeedback.push(feedback);
          return res.json({ success: true, feedback, storage: 'memory' });
        }

        return res.json({ success: true, feedback: data, storage: 'supabase' });
      } else {
        // Use in-memory storage
        const feedback = {
          id: Math.random().toString(36).substring(7),
          name,
          email,
          subject,
          message,
          rating,
          userIp,
          userAgent,
          submittedAt: new Date()
        };
        inMemoryFeedback.push(feedback);
        return res.json({ success: true, feedback, storage: 'memory' });
      }
    } catch (error: any) {
      console.error('Error in contact feedback route:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get all contact feedback (admin only)
  app.get("/api/contact/feedback/all", async (req, res) => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('contact_feedback')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (error) throw error;
        return res.json({ success: true, feedback: data, storage: 'supabase' });
      } else {
        // Return in-memory feedback
        const sorted = [...inMemoryFeedback].sort((a, b) => 
          b.submittedAt.getTime() - a.submittedAt.getTime()
        );
        return res.json({ success: true, feedback: sorted, storage: 'memory' });
      }
    } catch (error: any) {
      console.error('Error fetching contact feedback:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get feedback statistics
  app.get("/api/contact/feedback/stats", async (req, res) => {
    try {
      let allRatings: { rating: number }[] = [];

      if (supabase) {
        const { data, error } = await supabase
          .from('contact_feedback')
          .select('rating');

        if (error) throw error;
        allRatings = data || [];
      } else {
        allRatings = inMemoryFeedback.map(f => ({ rating: f.rating }));
      }

      if (!allRatings || allRatings.length === 0) {
        return res.json({ 
          averageRating: 0, 
          totalFeedbacks: 0,
          ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
      }

      const totalFeedbacks = allRatings.length;
      const averageRating = allRatings.reduce((sum: number, item: any) => sum + item.rating, 0) / totalFeedbacks;

      const ratings: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      allRatings.forEach((item: any) => {
        if (item.rating >= 1 && item.rating <= 5) {
          ratings[item.rating]++;
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
