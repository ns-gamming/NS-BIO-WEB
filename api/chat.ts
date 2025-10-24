
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  const { messages, sessionId } = req.body;

  try {
    // Log incoming request to Supabase (non-blocking)
    if (supabase) {
      supabase.from('ai_chat_messages').insert({
        session_id: sessionId || 'unknown',
        sender_type: 'user',
        message_text: messages[messages.length - 1]?.content || 'unknown',
        ip_address: ipAddress,
        user_agent: userAgent,
        page_url: req.headers.referer || 'unknown',
        timestamp: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.log('DB log failed (OK):', error.message);
      });
    }

    // Check if API key exists
    if (!GEMINI_API_KEY) {
      const fallbackMessage = "Hey! 😊 I'm AAPTI! The AI service is temporarily unavailable, but I can still help! ✨\n\nExplore:\n- Games at /games 🎮\n- Free Fire tools at /ff-bots 🔥\n- Utility tools at /tools 🛠️\n- Blog articles at /blog 📝\n\nNeed help? Contact Nishant: https://wa.me/918900653250 💙";
      
      // Log API key missing error
      if (supabase) {
        supabase.from('ai_chat_messages').insert({
          session_id: sessionId || 'unknown',
          sender_type: 'error',
          message_text: `API_KEY_MISSING - User: ${messages[messages.length - 1]?.content}`,
          ip_address: ipAddress,
          user_agent: userAgent,
          page_url: req.headers.referer || 'unknown',
          timestamp: new Date().toISOString()
        }).then(({ error }) => {
          if (error) console.log('Error log failed:', error.message);
        });
      }

      return res.status(200).json({ message: fallbackMessage });
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          })),
          generationConfig: {
            temperature: 1.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    // Log AI response to Supabase (non-blocking)
    if (supabase) {
      supabase.from('ai_chat_messages').insert({
        session_id: sessionId || 'unknown',
        sender_type: 'assistant',
        message_text: aiMessage,
        ip_address: ipAddress,
        user_agent: userAgent,
        page_url: req.headers.referer || 'unknown',
        timestamp: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.log('AI response log failed (OK):', error.message);
      });
    }

    return res.status(200).json({ message: aiMessage });

  } catch (error: any) {
    console.error('Chat API error:', error);

    // Log error to Supabase
    if (supabase) {
      supabase.from('ai_chat_messages').insert({
        session_id: sessionId || 'unknown',
        sender_type: 'error',
        message_text: `ERROR: ${error.message} - User: ${messages[messages.length - 1]?.content}`,
        ip_address: ipAddress,
        user_agent: userAgent,
        page_url: req.headers.referer || 'unknown',
        timestamp: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.log('Error log failed:', error.message);
      });
    }

    // Return friendly error message
    const errorMessage = "Oops! 😅 Something went wrong, but don't worry! Try again or explore:\n- Games 🎮\n- Tools 🛠️\n- Blog 📝\n\nContact: https://wa.me/918900653250";
    return res.status(200).json({ message: errorMessage });
  }
}
