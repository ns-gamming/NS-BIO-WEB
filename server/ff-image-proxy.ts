import type { Request, Response } from "express";

const OUTFIT_BASE_URL = 'http://160.250.247.175:5132/outfit';
const BANNER_BASE_URL = 'http://160.250.137.144:5133/banner';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }

  if (limit.count >= 30) {
    return false;
  }

  limit.count++;
  return true;
}

export async function handleImageProxy(req: Request, res: Response) {
  try {
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
                     req.socket.remoteAddress || 'unknown';

    if (!checkRateLimit(ipAddress)) {
      return res.status(429).json({ error: 'Too many image requests. Please slow down.' });
    }

    const { type, region, uid } = req.query;

    if (!type || !region || !uid) {
      return res.status(400).json({ error: 'Missing required parameters: type, region, uid' });
    }

    if (type !== 'outfit' && type !== 'banner') {
      return res.status(400).json({ error: 'Invalid type. Must be "outfit" or "banner"' });
    }

    const sanitizedRegion = String(region).toLowerCase();
    const sanitizedUid = String(uid).replace(/\D/g, '');

    if (!/^[a-z]{2,5}$/.test(sanitizedRegion)) {
      return res.status(400).json({ error: 'Invalid region format (2-5 lowercase letters required)' });
    }

    if (!/^\d{6,20}$/.test(sanitizedUid)) {
      return res.status(400).json({ error: 'Invalid UID format (6-20 digits required)' });
    }

    const targetUrl = type === 'banner'
      ? `${BANNER_BASE_URL}/${sanitizedRegion}/${sanitizedUid}`
      : `${OUTFIT_BASE_URL}/${sanitizedRegion}/${sanitizedUid}`;

    console.log(`📸 Fetching FF image: ${targetUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`❌ Image fetch failed: ${response.status}`);
      return res.status(response.status).json({ 
        error: `Failed to fetch ${type} image: ${response.status}` 
      });
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.send(buffer);

  } catch (error: any) {
    console.error('FF Image proxy error:', error);
    
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Image fetch timeout' });
    }
    
    return res.status(500).json({ error: 'Failed to proxy image' });
  }
}
