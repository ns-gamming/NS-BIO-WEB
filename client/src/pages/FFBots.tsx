import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trophy, Gamepad2, Sparkles, Gift, Clock, TrendingUp, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from '@supabase/supabase-js';
import AdSenseAd from "@/components/AdSenseAd";

const supabaseUrl = 'https://zsithfxmjtyeummbchpy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzaXRoZnhtanR5ZXVtbWJjaHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTUwOTEsImV4cCI6MjA3NTQzMTA5MX0.h8ej73edKcLyQJxY-N1irLc4tXTnavDVOySLF1aC5ps';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const REGIONS = [
  { value: 'sg', label: 'Singapore (SG)' },
  { value: 'ind', label: 'India (IND)' },
  { value: 'cis', label: 'CIS' },
  { value: 'pk', label: 'Pakistan (PK)' },
  { value: 'th', label: 'Thailand (TH)' },
  { value: 'br', label: 'Brazil (BR)' },
  { value: 'bd', label: 'Bangladesh (BD)' },
  { value: 'me', label: 'Middle East (ME)' },
  { value: 'vn', label: 'Vietnam (VN)' },
];

const UPCOMING_TOOLS = [
  {
    title: 'Free Fire Info Bot',
    description: 'Get detailed player information including stats, level, and more',
    icon: Users,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Free Fire Spam Bot',
    description: 'Boost your profile visibility with automated engagement',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Free Fire Visit Bot',
    description: 'Increase your profile visits and gain more followers',
    icon: Sparkles,
    color: 'from-green-500 to-emerald-500'
  },
];

export default function FFBots() {
  const [uid, setUid] = useState('');
  const [region, setRegion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const getUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      const browserFingerprint = `${navigator.userAgent}_${navigator.language}_${new Date().toDateString()}`;
      return btoa(browserFingerprint);
    }
  };

  const checkUsageLimit = async (ip: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('usage_logs')
      .select('*')
      .eq('ip', ip)
      .gte('used_at', today.toISOString());

    if (error) {
      console.error('Error checking usage:', error);
      return false;
    }

    return data && data.length > 0;
  };

  const logUsage = async (ip: string, uid: string, region: string) => {
    const { error } = await supabase
      .from('usage_logs')
      .insert([{ ip, uid, region, used_at: new Date().toISOString() }]);

    if (error) {
      console.error('Error logging usage:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uid || !region) {
      toast({
        title: "Missing Information",
        description: "Please enter both UID and select a region",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{8,11}$/.test(uid)) {
      toast({
        title: "Invalid UID",
        description: "UID must be 8-11 digits",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const userIP = await getUserIP();
      const hasUsedToday = await checkUsageLimit(userIP);

      if (hasUsedToday) {
        toast({
          title: "⏰ Daily Limit Reached",
          description: "You have already used this tool today. Come back tomorrow!",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const apiUrl = `https://likes.api.freefireofficial.com/api/${region}/${uid}?key=testkey12`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === 1 && data.response?.LikesGivenByAPI > 0) {
        await logUsage(userIP, uid, region);
        
        setResult({
          success: true,
          player: data.response.PlayerNickname,
          uid: data.response.UID,
          level: data.response.PlayerLevel,
          likesBefore: data.response.LikesbeforeCommand,
          likesAdded: data.response.LikesGivenByAPI,
          likesAfter: data.response.LikesafterCommand,
        });

        toast({
          title: "🎉 Success!",
          description: `Added ${data.response.LikesGivenByAPI} likes to ${data.response.PlayerNickname}!`,
        });
      } else {
        setResult({ success: false, message: data.message || "Unable to add likes at this time" });
        toast({
          title: "⚠️ Unable to Process",
          description: data.message || "UID already used elsewhere or 0 likes given",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "❌ Error",
        description: "Failed to connect to the API. Please try again later.",
        variant: "destructive",
      });
      setResult({ success: false, message: "Connection error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeUp">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-2 bg-gradient-to-r from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-full border-2 border-primary/30 dark:border-primary/50 animate-pulse-neon">
            <Gamepad2 className="w-6 h-6 text-primary dark:text-primary animate-bounce" />
            <span className="font-orbitron font-bold text-primary dark:text-primary">Free Fire Tools</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary dark:from-primary dark:via-accent dark:to-primary bg-clip-text text-transparent animate-glow" data-testid="text-title">
            FF Bots Hub
          </h1>
          <p className="text-lg text-muted-foreground dark:text-muted-foreground max-w-2xl mx-auto animate-slideInFromBottom">
            Enhance your Free Fire experience with our powerful tools. Get likes, boost stats, and dominate the battlefield! 🔥
          </p>
        </div>

        {/* Ad Placement */}
        <div className="mb-8 animate-fadeUp">
          <AdSenseAd />
        </div>

        {/* Free Fire Likes Tool */}
        <Card className="mb-12 p-8 bg-gradient-to-br from-card/80 to-card/60 dark:from-card/90 dark:to-card/70 backdrop-blur-sm border-2 border-primary/20 dark:border-primary/30 shadow-[0_0_30px_rgba(6,182,212,0.3)] dark:shadow-[0_0_30px_rgba(6,182,212,0.5)] animate-scaleIn hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] dark:hover:shadow-[0_0_50px_rgba(6,182,212,0.7)] transition-all duration-500" data-testid="card-likes-tool">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-primary to-accent dark:from-primary dark:to-accent rounded-xl shadow-lg animate-pulse-neon">
              <Trophy className="w-8 h-8 text-white dark:text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-foreground dark:text-foreground">Free Fire Likes Tool</h2>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4" />
                1 use per day per user
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 animate-slideInFromBottom" style={{ animationDelay: '0.1s' }}>
                <Label htmlFor="uid" className="text-lg font-semibold text-foreground dark:text-foreground">
                  Free Fire UID
                </Label>
                <Input
                  id="uid"
                  type="text"
                  placeholder="Enter 8-11 digit UID"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  className="text-lg border-2 border-primary/30 dark:border-primary/50 focus:border-primary dark:focus:border-primary bg-background/50 dark:bg-background/70 text-foreground dark:text-foreground transition-all duration-300 hover:border-primary/50 dark:hover:border-primary/70"
                  data-testid="input-uid"
                  maxLength={11}
                />
              </div>

              <div className="space-y-2 animate-slideInFromBottom" style={{ animationDelay: '0.2s' }}>
                <Label htmlFor="region" className="text-lg font-semibold text-foreground dark:text-foreground">
                  Region
                </Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger 
                    id="region" 
                    className="text-lg border-2 border-primary/30 dark:border-primary/50 focus:border-primary dark:focus:border-primary bg-background/50 dark:bg-background/70 text-foreground dark:text-foreground transition-all duration-300 hover:border-primary/50 dark:hover:border-primary/70" 
                    data-testid="select-region"
                  >
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent className="bg-background dark:bg-background border-primary/30 dark:border-primary/50">
                    {REGIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value} className="text-foreground dark:text-foreground hover:bg-primary/10 dark:hover:bg-primary/20">
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-lg py-6 bg-gradient-to-r from-primary to-accent dark:from-primary dark:to-accent hover:from-primary/90 hover:to-accent/90 dark:hover:from-primary/90 dark:hover:to-accent/90 text-white dark:text-white font-bold shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] dark:hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all duration-300 hover:scale-105 animate-pulse-neon border-2 border-white/20 dark:border-white/30"
              data-testid="button-submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5 mr-2" />
                  Get Free Likes
                </>
              )}
            </Button>
          </form>

          {/* Result Display */}
          {result && (
            <div className={`mt-6 p-6 rounded-xl border-2 animate-bounceIn ${
              result.success 
                ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border-green-500/50 dark:border-green-500/70' 
                : 'bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20 border-red-500/50 dark:border-red-500/70'
            }`} data-testid="result-display">
              {result.success ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-xl">
                    <Trophy className="w-6 h-6 animate-bounce" />
                    Congratulations! Likes sent successfully! 🎉
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-green-500/30 dark:border-green-500/50">
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Player</p>
                      <p className="text-lg font-bold text-foreground dark:text-foreground" data-testid="text-player">{result.player}</p>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-green-500/30 dark:border-green-500/50">
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">UID</p>
                      <p className="text-lg font-bold text-foreground dark:text-foreground" data-testid="text-uid">{result.uid}</p>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-green-500/30 dark:border-green-500/50">
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Level</p>
                      <p className="text-lg font-bold text-foreground dark:text-foreground" data-testid="text-level">{result.level}</p>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-green-500/30 dark:border-green-500/50">
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Likes Added</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400" data-testid="text-likes-added">+{result.likesAdded}</p>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-green-500/30 dark:border-green-500/50">
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Likes Before</p>
                      <p className="text-lg font-bold text-foreground dark:text-foreground" data-testid="text-likes-before">{result.likesBefore}</p>
                    </div>
                    <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-green-500/30 dark:border-green-500/50">
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Likes After</p>
                      <p className="text-lg font-bold text-primary dark:text-primary" data-testid="text-likes-after">{result.likesAfter}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-red-600 dark:text-red-400 font-semibold" data-testid="text-error">
                  {result.message}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Upcoming Tools Section */}
        <div className="mb-12 animate-fadeUp">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-8 text-center bg-gradient-to-r from-primary via-accent to-primary dark:from-primary dark:via-accent dark:to-primary bg-clip-text text-transparent">
            Upcoming Tools 🚀
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {UPCOMING_TOOLS.map((tool, index) => (
              <Card 
                key={index}
                className="p-6 bg-gradient-to-br from-card/80 to-card/60 dark:from-card/90 dark:to-card/70 backdrop-blur-sm border-2 border-primary/20 dark:border-primary/30 hover:border-primary/40 dark:hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] dark:hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-scaleIn"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`card-upcoming-${index}`}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg animate-pulse-neon`}>
                  <tool.icon className="w-8 h-8 text-white dark:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground dark:text-foreground">{tool.title}</h3>
                <p className="text-muted-foreground dark:text-muted-foreground mb-4">{tool.description}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 dark:from-yellow-500/30 dark:to-orange-500/30 rounded-full border-2 border-yellow-500/50 dark:border-yellow-500/70 text-yellow-600 dark:text-yellow-400 font-semibold animate-pulse">
                  <Sparkles className="w-4 h-4" />
                  Coming Soon
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 border-2 border-primary/30 dark:border-primary/50 animate-fadeUp">
          <h3 className="text-xl font-bold mb-3 text-foreground dark:text-foreground">📌 Important Information</h3>
          <ul className="space-y-2 text-muted-foreground dark:text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary dark:text-primary mt-1">•</span>
              <span>Each IP address can use the Likes tool once per day</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary dark:text-primary mt-1">•</span>
              <span>UID must be 8-11 digits long</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary dark:text-primary mt-1">•</span>
              <span>Select the correct region for your account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary dark:text-primary mt-1">•</span>
              <span>More tools coming soon - stay tuned! 🎮</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
