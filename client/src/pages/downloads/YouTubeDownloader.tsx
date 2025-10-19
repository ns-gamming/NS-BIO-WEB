
import { useState } from 'react';
import { Link } from 'wouter';
import HeroSection from '@/components/HeroSection';
import AdSenseAd from '@/components/AdSenseAd';
import PageFeedback from '@/components/PageFeedback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, Copy, Video, Check, ArrowLeft, ClipboardCopy } from 'lucide-react';
import SEO from '@/components/SEO';

export default function YouTubeDownloader() {
  const [url, setUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const extractVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const copyTitle = () => {
    const videoId = extractVideoId(url);
    const title = videoId ? `YouTube Video - ${videoId}` : 'YouTube Video';
    navigator.clipboard.writeText(title);
    toast({ title: "Copied!", description: "Video title copied to clipboard" });
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "URL copied to clipboard" });
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      toast({ title: "Error", description: "Please enter a YouTube URL" });
      return;
    }

    setDownloading(true);
    toast({ title: "Initiating Download...", description: "Fetching video data from YouTube..." });

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: 'youtube', url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setVideoData(data);
      toast({
        title: "Download Ready! 🎉",
        description: "Your video is ready to download",
        duration: 5000,
      });

    } catch (error: any) {
      toast({ title: "Download Failed", description: error.message, variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  const videoId = extractVideoId(url);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      <SEO 
        title="YouTube Video Downloader - Download YouTube Videos in HD Quality Free"
        description="Download YouTube videos in high quality for free. Fast, easy, and no registration required. Support for 1080p, 720p, and 4K downloads with video preview."
        keywords="youtube downloader, download youtube videos, youtube to mp4, youtube video download, free youtube downloader, hd youtube downloader"
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-floatSlow"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '1s' }}></div>
      </div>

      <HeroSection
        title="🎥 YouTube Downloader"
        subtitle="Download YouTube videos in high quality - fast and free!"
      />

      <div className="container mx-auto px-4 py-8 sm:py-12 relative z-10 max-w-4xl">
        <Link href="/tools">
          <a>
            <Button variant="outline" className="mb-6 group transition-all duration-300 hover:scale-105">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Tools
            </Button>
          </a>
        </Link>

        <Card className="dark:bg-gray-900 dark:border-gray-800 border-2 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg text-3xl">
                🎥
              </div>
              YouTube Video Downloader
            </CardTitle>
            <CardDescription className="text-base">
              Paste any YouTube URL to download videos in multiple formats and qualities
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Video className="w-4 h-4" />
                YouTube Video URL
              </Label>
              <div className="relative">
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12 text-base pr-24 border-2 focus:border-red-500"
                />
                {url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyUrl}
                    className="absolute right-1 top-1 h-10 px-3 hover:bg-red-500/10"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={handleDownload}
                disabled={downloading || !url.trim()}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 h-12 text-base shadow-lg hover:shadow-xl transition-all"
              >
                {downloading ? (
                  <>
                    <svg className="mr-2 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 8l2-2.709z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Download Video
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                disabled={!videoId}
                className="h-12 border-2 hover:border-red-500"
              >
                <Video className="mr-2 h-5 w-5" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>

              <Button
                variant="outline"
                onClick={copyTitle}
                disabled={!url.trim()}
                className="h-12 border-2 hover:border-red-500"
              >
                <ClipboardCopy className="mr-2 h-5 w-5" />
                Copy Title
              </Button>
            </div>

            {showPreview && videoId && (
              <div className="rounded-xl overflow-hidden border-2 border-red-500/30 animate-fadeUp shadow-2xl">
                <div className="aspect-video bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="Video Preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {videoData && videoData.downloadUrl && (
              <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 animate-bounceIn shadow-lg">
                <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                  <Check className="w-6 h-6" />
                  Video Ready to Download!
                </p>
                <Button
                  onClick={() => window.open(videoData.downloadUrl, '_blank')}
                  className="w-full h-12 text-base bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Open Download Page
                </Button>
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  {videoData.instructions}
                </p>
              </div>
            )}

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <h3 className="font-semibold mb-2">📋 How to use:</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Copy any YouTube video URL</li>
                <li>Paste it in the input field above</li>
                <li>Click "Download Video" button</li>
                <li>Choose your preferred quality and format</li>
                <li>Enjoy your downloaded video!</li>
              </ol>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
              <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">✨ Features & Benefits:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>Download in multiple qualities (4K, 1080p, 720p, 480p)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>No registration or login required</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>100% free to use forever</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>Fast download speeds</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>Works on all devices (mobile, tablet, PC)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                  <span>Video preview before download</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900 dark:border-gray-800 border-2 rounded-2xl shadow-xl overflow-hidden mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Is it legal to download YouTube videos?</h4>
              <p className="text-sm text-muted-foreground">Downloading YouTube videos for personal use is generally acceptable, but sharing or redistributing copyrighted content without permission is illegal. Always respect copyright laws.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">What video formats are supported?</h4>
              <p className="text-sm text-muted-foreground">You can download videos in MP4, WebM, and other formats. Audio-only downloads in MP3 format are also available.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Do I need to install any software?</h4>
              <p className="text-sm text-muted-foreground">No! Our YouTube downloader is completely web-based. Just paste the URL and download directly from your browser.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Can I download playlists?</h4>
              <p className="text-sm text-muted-foreground">Currently, you need to download videos one at a time. Copy individual video URLs from the playlist.</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <AdSenseAd />
        </div>

        <div className="mt-8">
          <PageFeedback pageName="YouTube Downloader" />
        </div>
      </div>
    </div>
  );
}
