
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { platform, url } = req.body;

    if (!platform || !url) {
      return res.status(400).json({
        success: false,
        error: "Platform and URL are required"
      });
    }

    const platformValidation: Record<string, RegExp[]> = {
      youtube: [/youtube\.com/, /youtu\.be/],
      instagram: [/instagram\.com/],
      tiktok: [/tiktok\.com/],
      facebook: [/facebook\.com/, /fb\.watch/],
      twitter: [/twitter\.com/, /x\.com/],
      pinterest: [/pinterest\.com/],
      reddit: [/reddit\.com/],
      snapchat: [/snapchat\.com/],
      vimeo: [/vimeo\.com/],
      dailymotion: [/dailymotion\.com/]
    };

    const validPatterns = platformValidation[platform];
    if (!validPatterns || !validPatterns.some(pattern => pattern.test(url))) {
      return res.status(400).json({
        success: false,
        error: `Invalid ${platform} URL`
      });
    }

    const extractYouTubeID = (url: string): string | null => {
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
      ];
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      return null;
    };

    const downloadServices: Record<string, (url: string) => any> = {
      youtube: (url: string) => {
        const videoId = extractYouTubeID(url);
        if (!videoId) throw new Error("Could not extract video ID");
        return {
          success: true,
          platform: 'youtube',
          videoId,
          downloadUrl: `https://www.y2mate.com/youtube/${videoId}`,
          message: 'Redirecting to download service...',
          instructions: 'Click "Download Now" to get your video in various qualities!'
        };
      },
      instagram: (url: string) => ({
        success: true,
        platform: 'instagram',
        downloadUrl: `https://instadownloader.co/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service...',
        instructions: 'Download Instagram videos, reels, and stories easily!'
      }),
      tiktok: (url: string) => ({
        success: true,
        platform: 'tiktok',
        downloadUrl: `https://snaptik.app/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service...',
        instructions: 'Download TikTok videos without watermark!'
      }),
      facebook: (url: string) => ({
        success: true,
        platform: 'facebook',
        downloadUrl: `https://fdown.net/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service...',
        instructions: 'Download Facebook videos in HD quality!'
      }),
      twitter: (url: string) => ({
        success: true,
        platform: 'twitter',
        downloadUrl: `https://twittervideodownloader.com/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service...',
        instructions: 'Save Twitter/X videos and GIFs easily!'
      }),
      pinterest: (url: string) => ({
        success: true,
        platform: 'pinterest',
        downloadUrl: `https://pinterestdownloader.com/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service...',
        instructions: 'Download Pinterest videos and images!'
      }),
      reddit: (url: string) => ({
        success: true,
        platform: 'reddit',
        downloadUrl: `https://redditdownloader.app/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service...',
        instructions: 'Download Reddit videos with audio!'
      }),
      snapchat: (url: string) => ({
        success: true,
        platform: 'snapchat',
        downloadUrl: `https://snapdownloader.com/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service...',
        instructions: 'Save Snapchat stories and videos!'
      }),
      vimeo: (url: string) => ({
        success: true,
        platform: 'vimeo',
        downloadUrl: `https://vimeodownloader.com/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service...',
        instructions: 'Download Vimeo videos in high quality!'
      }),
      dailymotion: (url: string) => ({
        success: true,
        platform: 'dailymotion',
        downloadUrl: `https://dailymotiondownloader.com/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service...',
        instructions: 'Download Dailymotion videos easily!'
      })
    };

    const handler = downloadServices[platform];
    if (!handler) {
      return res.status(400).json({
        success: false,
        error: `Unsupported platform: ${platform}`
      });
    }

    const result = handler(url);
    return res.status(200).json(result);

  } catch (error: any) {
    console.error('Download error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process download request'
    });
  }
}
