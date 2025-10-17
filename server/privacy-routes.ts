import type { Express, Request } from "express";
import { supabase } from "./supabase-client";

function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

export function registerPrivacyRoutes(app: Express) {

  app.post("/api/privacy/consent", async (req, res) => {
    try {
      const { sessionId, consentType, consentGiven, preferences } = req.body;
      const ipAddress = getClientIP(req);
      const userAgent = req.headers['user-agent'] || 'unknown';

      const browser = userAgent.includes('Firefox') ? 'Firefox' :
                     userAgent.includes('Edg') ? 'Edge' :
                     userAgent.includes('Chrome') ? 'Chrome' :
                     userAgent.includes('Safari') ? 'Safari' : 'Unknown';

      const deviceType = /mobile/i.test(userAgent) ? 'mobile' : 'desktop';

      const { data, error } = await supabase
        .from('user_consent')
        .insert([{
          session_id: sessionId || null,
          ip_address: ipAddress,
          consent_type: consentType,
          consent_given: consentGiven,
          consent_version: '1.0',
          granted_at: new Date().toISOString(),
          is_active: true,
          metadata: {
            preferences,
            browser,
            device_type: deviceType,
            user_agent: userAgent
          }
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving consent:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

      if (preferences) {
        const cookiePrefsError = await saveCookiePreferences(sessionId, ipAddress, preferences);
        if (cookiePrefsError) {
          console.error('Error saving cookie preferences:', cookiePrefsError);
        }
      }

      res.json({ success: true, consent: data });
    } catch (error: any) {
      console.error('Error in consent route:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/privacy/consent/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;

      const { data, error } = await supabase
        .from('user_consent')
        .select('*')
        .eq('session_id', sessionId)
        .eq('is_active', true)
        .order('granted_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      res.json({ success: true, consent: data || null });
    } catch (error: any) {
      console.error('Error fetching consent:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/privacy/revoke-consent", async (req, res) => {
    try {
      const { sessionId, consentType } = req.body;

      const { data, error } = await supabase
        .from('user_consent')
        .update({ 
          is_active: false,
          revoked_at: new Date().toISOString()
        })
        .eq('session_id', sessionId)
        .eq('consent_type', consentType)
        .eq('is_active', true)
        .select();

      if (error) throw error;

      res.json({ success: true, revoked: data });
    } catch (error: any) {
      console.error('Error revoking consent:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
}

async function saveCookiePreferences(sessionId: string | null, ipAddress: string, preferences: any) {
  try {
    const { error } = await supabase
      .from('cookie_preferences')
      .insert([{
        session_id: sessionId,
        ip_address: ipAddress,
        necessary_cookies: preferences.necessary || true,
        functional_cookies: preferences.functional || false,
        analytics_cookies: preferences.analytics || false,
        advertising_cookies: preferences.advertising || false,
        updated_at: new Date().toISOString()
      }]);

    return error;
  } catch (error) {
    return error;
  }
}
