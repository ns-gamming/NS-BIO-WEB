
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
import { Download, Copy, Video, Check, ArrowLeft, ClipboardCopy, Instagram, Info } from 'lucide-react';
import SEO from '@/components/SEO';

export default function InstagramDownloader() {
  const [url, setUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const { toast } = useToast();

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "URL copied to clipboard" });
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      toast({ title: "Error", description: "Please enter an Instagram URL" });
      return;
    }

    if (!url.includes('instagram.com')) {
      toast({ title: "Invalid URL", description: "Please enter a valid Instagram URL" });
      return;
    }

    setDownloading(true);
    toast({ title: "Initiating Download...", description: "Fetching data from Instagram..." });

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: 'instagram', url }),
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
        description: "Your content is ready to download",
        duration: 5000,
      });

    } catch (error: any) {
      toast({ title: "Download Failed", description: error.message, variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      <SEO 
        title="Instagram Downloader - Download Instagram Videos, Reels & Stories Free"
        description="Download Instagram videos, reels, IGTV, and stories in original quality. Fast, free, and no login required. Save Instagram content easily."
        keywords="instagram downloader, download instagram videos, instagram reels downloader, instagram story downloader, save instagram videos, instagram video download"
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-floatSlow"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '1s' }}></div>
      </div>

      <HeroSection
        title="📸 Instagram Downloader"
        subtitle="Download Instagram videos, reels, and stories in high quality - fast and free!"
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

        <Card className="dark:bg-gray-900 dark:border-gray-800 border-2 rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <Instagram className="h-8 w-8 text-white" />
              </div>
              Instagram Content Downloader
            </CardTitle>
            <CardDescription className="text-base">
              Download videos, reels, IGTV, and stories from Instagram in original quality
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Video className="w-4 h-4" />
                Instagram URL
              </Label>
              <div className="relative">
                <Input
                  placeholder="https://www.instagram.com/p/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12 text-base pr-24 border-2 focus:border-purple-500"
                />
                {url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyUrl}
                    className="absolute right-1 top-1 h-10 px-3 hover:bg-purple-500/10"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
            </div>

            <Button
              onClick={handleDownload}
              disabled={downloading || !url.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 h-12 text-base shadow-lg hover:shadow-xl transition-all"
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
                  Download Content
                </>
              )}
            </Button>

            {videoData && videoData.downloadUrl && (
              <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 animate-bounceIn shadow-lg">
                <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                  <Check className="w-6 h-6" />
                  Content Ready to Download!
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

            <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/10">
              <div className="flex items-start gap-2 mb-3">
                <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Supported Content Types:</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-5">
                <li>Instagram Feed Videos</li>
                <li>Instagram Reels</li>
                <li>IGTV Videos</li>
                <li>Instagram Stories (if accessible)</li>
                <li>Carousel Posts (multiple images/videos)</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <h3 className="font-semibold mb-2">📋 How to use:</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Open Instagram and find the content you want to download</li>
                <li>Click the three dots (...) and select "Copy Link"</li>
                <li>Paste the link in the input field above</li>
                <li>Click "Download Content" button</li>
                <li>Choose your preferred quality and save!</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <AdSenseAd />
        </div>

        <div className="mt-8">
          <PageFeedback pageName="Instagram Downloader" />
        </div>
      </div>
    </div>
  );
}
