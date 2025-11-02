import { Link } from "wouter";
import { Users, ArrowLeft, Search, Copy, CheckCircle, AlertCircle, Trophy, Shield, Crown, Heart, Star, Zap, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AdSenseAd from "@/components/AdSenseAd";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface PlayerData {
  basicInfo: {
    accountId: string;
    nickname: string;
    region: string;
    level: number;
    exp: number;
    rank: number;
    rankingPoints: number;
    liked: number;
    lastLoginAt: string;
    csRank: number;
    csRankingPoints: number;
    releaseVersion: string;
    badgeCnt: number;
    showBrRank: boolean;
    showCsRank: boolean;
    primePrivilegeDetail?: {
      primeLevel: number;
    };
  };
  clanBasicInfo?: {
    clanName: string;
    clanLevel: number;
    memberNum: number;
    capacity: number;
  };
  captainBasicInfo?: {
    nickname: string;
    level: number;
  };
  petInfo?: {
    level: number;
  };
  socialInfo?: {
    signature: string;
    language: string;
  };
  creditScoreInfo?: {
    creditScore: number;
  };
}

interface SearchResponse {
  success: boolean;
  data: PlayerData;
  searchInfo: {
    remainingSearches: number;
    totalSearches: number;
    dailyLimit: number;
  };
}

interface LimitResponse {
  remainingSearches: number;
  totalSearches: number;
  dailyLimit: number;
  limitReached: boolean;
}

const REGIONS = [
  { value: 'ind', label: '🇮🇳 India (IND)' },
  { value: 'SG', label: '🇸🇬 Singapore (SG)' },
  { value: 'PK', label: '🇵🇰 Pakistan (PK)' },
  { value: 'BD', label: '🇧🇩 Bangladesh (BD)' },
  { value: 'TH', label: '🇹🇭 Thailand (TH)' },
  { value: 'VN', label: '🇻🇳 Vietnam (VN)' },
  { value: 'BR', label: '🇧🇷 Brazil (BR)' },
  { value: 'ID', label: '🇮🇩 Indonesia (ID)' },
  { value: 'MY', label: '🇲🇾 Malaysia (MY)' },
  { value: 'PH', label: '🇵🇭 Philippines (PH)' },
  { value: 'US', label: '🇺🇸 United States (US)' },
  { value: 'EU', label: '🇪🇺 Europe (EU)' },
  { value: 'ME', label: '🇦🇪 Middle East (ME)' },
];

export default function FFInfoBot() {
  const { toast } = useToast();
  const [uid, setUid] = useState("");
  const [region, setRegion] = useState("IND");
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [searchInfo, setSearchInfo] = useState({ remainingSearches: 5, totalSearches: 0, dailyLimit: 5 });
  const [copied, setCopied] = useState(false);

  const { data: limitData } = useQuery<LimitResponse>({
    queryKey: ['/api/ff-info-bot/check-limit'],
  });

  const searchMutation = useMutation({
    mutationFn: async (data: { uid: string; region: string }): Promise<SearchResponse> => {
      const response = await fetch('/api/ff-info-bot/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch player info');
      }
      
      return response.json();
    },
    onSuccess: (data: SearchResponse) => {
      setPlayerData(data.data);
      setSearchInfo(data.searchInfo);
      queryClient.invalidateQueries({ queryKey: ['/api/ff-info-bot/check-limit'] });
      toast({
        title: "✅ Success!",
        description: `Player found! ${data.searchInfo.remainingSearches} searches remaining today.`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to fetch player info";
      const isConfigError = errorMessage.includes("not configured") || errorMessage.includes("Secrets") || errorMessage.includes("API key");
      const isNotFound = errorMessage.includes("No player found") || errorMessage.includes("404");
      
      toast({
        title: isConfigError ? "⚙️ Configuration Error" : isNotFound ? "🔍 Player Not Found" : "❌ Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      console.error('Search error:', error);
    },
  });

  const handleSearch = () => {
    if (!uid.trim() || !region) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please enter UID and select region",
        variant: "destructive",
      });
      return;
    }
    searchMutation.mutate({ uid, region });
  };

  const formatLastLogin = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const copyPlayerInfo = () => {
    if (!playerData) return;

    const info = playerData.basicInfo;
    const clan = playerData.clanBasicInfo;
    const social = playerData.socialInfo;
    
    const text = `
🎮 *FREE FIRE PLAYER INFO* 🎮

👤 *Player Details*
━━━━━━━━━━━━━━━━━━━
🆔 UID: ${info.accountId}
✨ Nickname: ${info.nickname}
🌍 Region: ${info.region}
⭐ Level: ${info.level}
📊 EXP: ${info.exp.toLocaleString()}

🏆 *Rank Information*
━━━━━━━━━━━━━━━━━━━
${info.showBrRank ? `👑 BR Rank: ${info.rank}\n💎 BR Points: ${info.rankingPoints}` : ''}
${info.showCsRank ? `🎯 CS Rank: ${info.csRank}\n⚡ CS Points: ${info.csRankingPoints}` : ''}

💝 *Statistics*
━━━━━━━━━━━━━━━━━━━
❤️ Total Likes: ${info.liked.toLocaleString()}
🏅 Badges: ${info.badgeCnt}
🌟 Prime Level: ${info.primePrivilegeDetail?.primeLevel || 'N/A'}
⏰ Last Login: ${formatLastLogin(info.lastLoginAt)}
${playerData.creditScoreInfo ? `🎖️ Credit Score: ${playerData.creditScoreInfo.creditScore}` : ''}

${clan ? `👥 *Guild/Clan Info*
━━━━━━━━━━━━━━━━━━━
🏰 Name: ${clan.clanName}
📈 Level: ${clan.clanLevel}
👨‍👩‍👧‍👦 Members: ${clan.memberNum}/${clan.capacity}
${playerData.captainBasicInfo ? `👨‍✈️ Captain: ${playerData.captainBasicInfo.nickname} (Lv ${playerData.captainBasicInfo.level})` : ''}
` : ''}
${social?.signature ? `💬 *Bio/Signature*
━━━━━━━━━━━━━━━━━━━
${social.signature}
` : ''}
━━━━━━━━━━━━━━━━━━━
🎉 Powered by NS GAMMING
📱 Get your info at: nsgamming.com/ff-bots/info
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "📋 Copied!",
      description: "Player info copied to clipboard with emojis!",
    });
  };

  const downloadJSON = () => {
    if (!playerData) return;
    
    const dataStr = JSON.stringify(playerData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ff-player-${playerData.basicInfo.accountId}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "📥 Downloaded!",
      description: "Player data saved as JSON file",
    });
  };

  const currentLimit = limitData || searchInfo;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-background via-background to-blue-500/10 dark:from-background dark:via-background dark:to-blue-500/20">
      <div className="container mx-auto max-w-6xl">
        <Link 
          href="/ff-bots"
          className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-primary transition-colors group"
          data-testid="link-back"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to FF Bots Hub
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 mb-6 shadow-lg animate-pulse-neon">
            <Users className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent animate-glow" data-testid="text-title">
            Free Fire Info Bot 📊
          </h1>
          
          <p className="text-xl text-muted-foreground mb-4">
            Get complete player stats instantly! Level, rank, achievements - everything in one click! 🎯
          </p>

          <Badge variant="outline" className="px-4 py-2 text-lg" data-testid="text-searches-remaining">
            {currentLimit.remainingSearches}/{currentLimit.dailyLimit} searches remaining today
          </Badge>
        </motion.div>

        <div className="mb-12">
          <AdSenseAd />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-6 h-6 text-primary" />
                Search Player Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <Label htmlFor="uid">Player UID</Label>
                  <Input
                    id="uid"
                    type="text"
                    placeholder="Enter Free Fire UID (e.g., 2405657626)"
                    value={uid}
                    onChange={(e) => setUid(e.target.value.replace(/\D/g, ''))}
                    maxLength={20}
                    data-testid="input-uid"
                  />
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger id="region" data-testid="select-region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={handleSearch}
                disabled={searchMutation.isPending || currentLimit.remainingSearches === 0}
                className="w-full"
                data-testid="button-search"
              >
                {searchMutation.isPending ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : currentLimit.remainingSearches === 0 ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Daily Limit Reached
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Player Info
                  </>
                )}
              </Button>
              
              {currentLimit.remainingSearches === 0 && (
                <p className="text-sm text-destructive mt-2 text-center" data-testid="text-limit-message">
                  ⚠️ Daily limit reached (5 searches/day). Come back tomorrow! 🌟
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {playerData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 overflow-hidden border-2 border-primary/30">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    {playerData.basicInfo.nickname}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={copyPlayerInfo}
                      variant="outline"
                      size="sm"
                      data-testid="button-copy"
                    >
                      {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? 'Copied!' : 'Copy Info'}
                    </Button>
                    <Button
                      onClick={downloadJSON}
                      variant="outline"
                      size="sm"
                      data-testid="button-download"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      Basic Info
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">UID:</span> <span className="font-mono" data-testid="text-uid">{playerData.basicInfo.accountId}</span></p>
                      <p><span className="text-muted-foreground">Region:</span> {playerData.basicInfo.region}</p>
                      <p><span className="text-muted-foreground">Level:</span> <Badge variant="secondary" data-testid="text-level">{playerData.basicInfo.level}</Badge></p>
                      <p><span className="text-muted-foreground">EXP:</span> {playerData.basicInfo.exp.toLocaleString()}</p>
                      <p><span className="text-muted-foreground">Last Login:</span> {formatLastLogin(playerData.basicInfo.lastLoginAt)}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      Rank Stats
                    </h3>
                    <div className="space-y-2 text-sm">
                      {playerData.basicInfo.showBrRank && (
                        <>
                          <p><span className="text-muted-foreground">BR Rank:</span> <Badge className="ml-2" data-testid="text-br-rank">{playerData.basicInfo.rank}</Badge></p>
                          <p><span className="text-muted-foreground">BR Points:</span> {playerData.basicInfo.rankingPoints}</p>
                        </>
                      )}
                      {playerData.basicInfo.showCsRank && (
                        <>
                          <p><span className="text-muted-foreground">CS Rank:</span> <Badge className="ml-2" data-testid="text-cs-rank">{playerData.basicInfo.csRank}</Badge></p>
                          <p><span className="text-muted-foreground">CS Points:</span> {playerData.basicInfo.csRankingPoints}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-500" />
                      Achievements
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-muted-foreground">Likes:</span> 
                        <Badge variant="outline" data-testid="text-likes">{playerData.basicInfo.liked.toLocaleString()}</Badge>
                      </p>
                      <p className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="text-muted-foreground">Badges:</span> {playerData.basicInfo.badgeCnt}
                      </p>
                      {playerData.basicInfo.primePrivilegeDetail && (
                        <p className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <span className="text-muted-foreground">Prime Lv:</span> {playerData.basicInfo.primePrivilegeDetail.primeLevel}
                        </p>
                      )}
                      {playerData.creditScoreInfo && (
                        <p><span className="text-muted-foreground">Credit:</span> {playerData.creditScoreInfo.creditScore}</p>
                      )}
                    </div>
                  </div>
                </div>

                {playerData.clanBasicInfo && (
                  <>
                    <Separator className="my-6" />
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-500" />
                        Guild/Clan Info
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <p><span className="text-muted-foreground">Name:</span> <span className="font-semibold" data-testid="text-clan-name">{playerData.clanBasicInfo.clanName}</span></p>
                        <p><span className="text-muted-foreground">Level:</span> {playerData.clanBasicInfo.clanLevel}</p>
                        <p><span className="text-muted-foreground">Members:</span> {playerData.clanBasicInfo.memberNum}/{playerData.clanBasicInfo.capacity}</p>
                        {playerData.captainBasicInfo && (
                          <p><span className="text-muted-foreground">Captain:</span> {playerData.captainBasicInfo.nickname} (Lv {playerData.captainBasicInfo.level})</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {playerData.socialInfo?.signature && (
                  <>
                    <Separator className="my-6" />
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Bio/Signature</h3>
                      <p className="text-sm bg-muted p-4 rounded-lg" data-testid="text-signature">{playerData.socialInfo.signature}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle>ℹ️ Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• 🔢 Free searches: 5 per day</p>
            <p>• 🔄 Limit resets daily at midnight</p>
            <p>• 📋 Use "Copy Info" to get formatted player details with emojis</p>
            <p>• 💾 Download JSON for complete raw data</p>
            <p>• ⚡ Data is fetched in real-time from official Free Fire servers</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
