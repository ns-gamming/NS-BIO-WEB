
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0]) : 'unknown';
  return ip;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.url?.split('?')[0] || '';
  
  // Health check endpoint
  if (path === '/api' || path === '/api/') {
    return res.json({ 
      status: 'ok', 
      message: 'NS GAMMING API is running',
      timestamp: new Date().toISOString()
    });
  }

  // Visitor count endpoints
  if (path === '/api/visitor-count' && req.method === 'GET') {
    try {
      if (!supabase) {
        return res.json({ count: 0 });
      }
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('visitor_stats')
        .select('count')
        .eq('date', today)
        .single();
      
      return res.json({ count: data?.count || 0 });
    } catch (error) {
      return res.json({ count: 0 });
    }
  }

  if (path === '/api/visitor-count' && req.method === 'POST') {
    try {
      if (!supabase) {
        return res.json({ count: 0 });
      }
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('visitor_stats')
        .upsert({ 
          date: today, 
          count: 1,
          unique_visitors: 1 
        }, { 
          onConflict: 'date',
          ignoreDuplicates: false 
        })
        .select()
        .single();
      
      return res.json({ count: data?.count || 1 });
    } catch (error) {
      return res.json({ count: 1 });
    }
  }

  // Blog endpoints
  if (path.startsWith('/api/blog')) {
    return res.status(200).json({ 
      message: 'Blog API endpoint - use dedicated blog routes' 
    });
  }

  // Default fallback
  return res.status(404).json({ 
    error: 'Not found',
    path: path,
    message: 'This API endpoint does not exist'
  });
}
