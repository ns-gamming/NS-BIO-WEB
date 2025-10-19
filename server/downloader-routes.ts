import type { Express } from "express";

export function registerDownloaderRoutes(app: Express) {
  
  // Unified download endpoint that routes to specific platform handlers
  app.post("/api/download", async (req, res) => {
    try {
      const { platform, url } = req.body;

      if (!platform || !url) {
        return res.status(400).json({
          success: false,
          error: "Platform and URL are required"
        });
      }

      // Validate URL for the specific platform
      const platformValidation: Record<string, RegExp[]> = {
        youtube: [/youtube\.com/, /youtu\.be/],
        instagram: [/instagram\.com/],
        tiktok: [/tiktok\.com/],
        facebook: [/facebook\.com/, /fb\.watch/],
        twitter: [/twitter\.com/, /x\.com/],
        pinterest: [/pinterest\.com/],
        snapchat: [/snapchat\.com/],
        reddit: [/reddit\.com/]
      };

      const validPatterns = platformValidation[platform];
      if (!validPatterns || !validPatterns.some(pattern => pattern.test(url))) {
        return res.status(400).json({
          success: false,
          error: `Invalid ${platform} URL`
        });
      }

      // Platform-specific download URLs and services
      const downloadServices: Record<string, (url: string) => any> = {
        youtube: (url: string) => {
          const videoId = extractYouTubeID(url);
          if (!videoId) {
            throw new Error("Could not extract video ID");
          }
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
          instructions: 'The download service will let you save videos, reels, and stories!'
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
        snapchat: (url: string) => ({
          success: true,
          platform: 'snapchat',
          downloadUrl: `https://snapdownloader.com/download?url=${encodeURIComponent(url)}`,
          message: 'Redirecting to download service...',
          instructions: 'Save Snapchat stories and videos!'
        }),
        reddit: (url: string) => ({
          success: true,
          platform: 'reddit',
          downloadUrl: `https://redditdownloader.app/download?url=${encodeURIComponent(url)}`,
          message: 'Redirecting to download service...',
          instructions: 'Download Reddit videos with audio!'
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
      res.json(result);
    } catch (error: any) {
      console.error('Download error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to process download request'
      });
    }
  });
  
  // YouTube Downloader - Using free service
  app.post("/api/download/youtube", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid YouTube URL" 
        });
      }

      const videoId = extractYouTubeID(url);
      if (!videoId) {
        return res.status(400).json({ 
          success: false, 
          message: "Could not extract video ID" 
        });
      }

      res.json({
        success: true,
        platform: 'youtube',
        videoId,
        downloadUrl: `https://www.y2mate.com/youtube/${videoId}`,
        message: 'Use Y2Mate or similar service to download'
      });
    } catch (error: any) {
      console.error('YouTube download error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Instagram Downloader
  app.post("/api/download/instagram", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url || !url.includes('instagram.com')) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid Instagram URL" 
        });
      }

      res.json({
        success: true,
        platform: 'instagram',
        url,
        downloadUrl: `https://instadownloader.co/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service'
      });
    } catch (error: any) {
      console.error('Instagram download error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // TikTok Downloader
  app.post("/api/download/tiktok", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url || !url.includes('tiktok.com')) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid TikTok URL" 
        });
      }

      res.json({
        success: true,
        platform: 'tiktok',
        url,
        downloadUrl: `https://snaptik.app/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service'
      });
    } catch (error: any) {
      console.error('TikTok download error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Facebook Downloader
  app.post("/api/download/facebook", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url || !url.includes('facebook.com') && !url.includes('fb.watch')) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid Facebook URL" 
        });
      }

      res.json({
        success: true,
        platform: 'facebook',
        url,
        downloadUrl: `https://fdown.net/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service'
      });
    } catch (error: any) {
      console.error('Facebook download error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Twitter/X Downloader
  app.post("/api/download/twitter", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url || !url.includes('twitter.com') && !url.includes('x.com')) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid Twitter/X URL" 
        });
      }

      res.json({
        success: true,
        platform: 'twitter',
        url,
        downloadUrl: `https://twittervideodownloader.com/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service'
      });
    } catch (error: any) {
      console.error('Twitter download error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Pinterest Downloader
  app.post("/api/download/pinterest", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url || !url.includes('pinterest.com')) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid Pinterest URL" 
        });
      }

      res.json({
        success: true,
        platform: 'pinterest',
        url,
        downloadUrl: `https://pinterestdownloader.com/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service'
      });
    } catch (error: any) {
      console.error('Pinterest download error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Snapchat Downloader
  app.post("/api/download/snapchat", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url || !url.includes('snapchat.com')) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid Snapchat URL" 
        });
      }

      res.json({
        success: true,
        platform: 'snapchat',
        url,
        downloadUrl: `https://snapdownloader.com/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service'
      });
    } catch (error: any) {
      console.error('Snapchat download error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Reddit Downloader
  app.post("/api/download/reddit", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url || !url.includes('reddit.com')) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid Reddit URL" 
        });
      }

      res.json({
        success: true,
        platform: 'reddit',
        url,
        downloadUrl: `https://redditdownloader.app/download?url=${encodeURIComponent(url)}`,
        message: 'Redirecting to download service'
      });
    } catch (error: any) {
      console.error('Reddit download error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
}

function extractYouTubeID(url: string): string | null {
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
}
