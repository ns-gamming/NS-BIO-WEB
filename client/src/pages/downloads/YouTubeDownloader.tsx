
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
import { Download, Copy, Video, Check, ArrowLeft, ClipboardCopy, Sparkles, HelpCircle, TrendingUp, Shield, Zap, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function YouTubeDownloader() {
  const [url, setUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [progress, setProgress] = useState(0);
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
      toast({ title: "Error", description: "Please enter a YouTube URL", variant: "destructive" });
      return;
    }

    setDownloading(true);
    setProgress(0);
    toast({ title: "🎬 Initiating Download...", description: "Fetching video data from YouTube..." });

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

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

      setProgress(100);
      setVideoData(data);
      toast({
        title: "Download Ready! 🎉",
        description: "Your video is ready to download in multiple formats",
        duration: 5000,
      });

    } catch (error: any) {
      toast({ title: "Download Failed", description: error.message, variant: "destructive" });
    } finally {
      setDownloading(false);
      clearInterval(progressInterval);
    }
  };

  const videoId = extractVideoId(url);

  const qualityBadges = [
    { label: '4K', color: 'from-purple-500 to-pink-500', icon: Sparkles },
    { label: '1080p', color: 'from-blue-500 to-cyan-500', icon: TrendingUp },
    { label: '720p', color: 'from-green-500 to-emerald-500', icon: Check },
    { label: 'Audio', color: 'from-orange-500 to-red-500', icon: Zap }
  ];

  const features = [
    { icon: Shield, title: 'Safe & Secure', desc: 'No malware or ads' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Quick processing' },
    { icon: Globe, title: 'All Formats', desc: 'MP4, MP3, WEBM' },
    { icon: Video, title: 'HD Quality', desc: 'Up to 4K resolution' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-floatSlow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '2s' }}></div>
      </div>

      <HeroSection
        title="🎥 YouTube Video Downloader"
        subtitle="Download YouTube videos in the highest quality - fast, free, and secure!"
      />

      <div className="container mx-auto px-4 py-8 sm:py-12 relative z-10 max-w-6xl">
        <Link href="/tools">
          <Button variant="outline" className="mb-6 group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] border-2">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Tools
          </Button>
        </Link>

        {/* Feature highlights banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fadeUp">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-gradient-to-br from-red-500/5 to-pink-500/5 border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <feature.icon className="w-8 h-8 text-red-500 mb-2" />
              <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        <Card className="dark:bg-gray-900 dark:border-gray-800 border-2 rounded-2xl shadow-2xl overflow-hidden mb-8 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5" />
          
          <CardHeader className="relative z-10 border-b-2 border-red-500/20">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg text-3xl animate-pulse">
                🎥
              </div>
              <div>
                <div className="flex items-center gap-2">
                  YouTube Video Downloader
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 animate-pulse">Pro</Badge>
                </div>
                <p className="text-sm text-muted-foreground font-normal mt-1">Download in multiple formats and qualities</p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10 p-6 space-y-6">
            {/* Quality badges showcase */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {qualityBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg bg-gradient-to-r ${badge.color} bg-opacity-10 border-2 border-opacity-30 hover:scale-105 transition-all duration-300 cursor-pointer group`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <badge.icon className="w-5 h-5 text-white mb-1 group-hover:animate-bounce" />
                  <p className="text-white font-bold text-sm">{badge.label}</p>
                </div>
              ))}
            </div>

            <Tabs defaultValue="download" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="download">Download Video</TabsTrigger>
                <TabsTrigger value="guide">How to Use</TabsTrigger>
              </TabsList>

              <TabsContent value="download" className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Video className="w-4 h-4 text-red-500" />
                    YouTube Video URL
                  </Label>
                  <div className="relative group">
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="h-14 text-base pr-24 border-2 focus:border-red-500 transition-all duration-300 group-hover:shadow-lg"
                    />
                    {url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyUrl}
                        className="absolute right-2 top-2 h-10 px-3 hover:bg-red-500/10"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    )}
                  </div>
                  {url && videoId && (
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Valid YouTube URL detected - Video ID: {videoId}
                    </p>
                  )}
                </div>

                {downloading && (
                  <div className="space-y-2 animate-fadeUp">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing...</span>
                      <span className="font-bold text-red-500">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    onClick={handleDownload}
                    disabled={downloading || !url.trim()}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 h-12 text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
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
                    className="h-12 border-2 hover:border-red-500 hover:bg-red-500/5"
                  >
                    <Video className="mr-2 h-5 w-5" />
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>

                  <Button
                    variant="outline"
                    onClick={copyTitle}
                    disabled={!url.trim()}
                    className="h-12 border-2 hover:border-red-500 hover:bg-red-500/5"
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
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-500 rounded-full">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">Video Ready to Download!</p>
                        <p className="text-sm text-muted-foreground">Choose your preferred quality and format</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => window.open(videoData.downloadUrl, '_blank')}
                      className="w-full h-14 text-base bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Open Download Page
                    </Button>
                    <p className="text-sm text-muted-foreground mt-3 text-center">
                      {videoData.instructions}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="guide" className="space-y-4">
                <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-2 border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <HelpCircle className="w-6 h-6 text-blue-500" />
                    <h3 className="font-bold text-xl">How to Download YouTube Videos</h3>
                  </div>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <div>
                        <p className="font-semibold">Copy YouTube Video URL</p>
                        <p className="text-sm text-muted-foreground">Go to YouTube, find your video, and copy the URL from the address bar</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <div>
                        <p className="font-semibold">Paste URL in the Input Field</p>
                        <p className="text-sm text-muted-foreground">Paste the copied URL in the input box above</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <div>
                        <p className="font-semibold">Click Download Video Button</p>
                        <p className="text-sm text-muted-foreground">Hit the download button and wait for processing</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                      <div>
                        <p className="font-semibold">Choose Quality & Download</p>
                        <p className="text-sm text-muted-foreground">Select your preferred quality (4K, 1080p, 720p, or Audio only) and download</p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="p-4 rounded-lg bg-yellow-500/10 border-2 border-yellow-500/30">
                  <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    Pro Tips:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Download videos for offline viewing during travel</li>
                    <li>Extract audio to create music playlists</li>
                    <li>Save educational content for later reference</li>
                    <li>Higher quality = larger file size</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-8 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
          <AdSenseAd />
        </div>

        <div className="mt-8 animate-fadeUp" style={{ animationDelay: '0.6s' }}>
          <PageFeedback pageName="YouTube Downloader" />
        </div>
      </div>
    </div>
  );
}
