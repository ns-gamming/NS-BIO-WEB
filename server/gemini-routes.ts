import type { Express } from "express";

export function registerGeminiRoutes(app: Express) {
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages, contextInfo } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: 'Gemini API key not configured',
          message: 'Please contact the administrator to configure the AI service.'
        });
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: contextInfo }]
              },
              ...messages.map((msg: any) => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
              }))
            ],
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
        const errorData = await response.json();
        return res.status(response.status).json({
          error: 'Gemini API error',
          details: errorData
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  });
}
