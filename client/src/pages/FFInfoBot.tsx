
import { Link } from "wouter";
import { Users, ArrowLeft, Search, Copy, CheckCircle, AlertCircle, Trophy, Shield, Crown, Heart, Star, Zap, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AdSenseAd from "@/components/AdSenseAd";
import FFPlayerImages from "@/components/FFPlayerImages";
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
    accountType?: number;
    badgeId?: string;
    headPic?: string;
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
  { value: 'IND', label: '🇮🇳 India (IND)' },
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
  const [showAdDialog, setShowAdDialog] = useState(false);

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
      
      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');
      
      if (!response.ok) {
        if (isJson) {
          try {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch player info');
          } catch (parseError) {
            throw new Error('Server error. Please try again later.');
          }
        } else {
          const text = await response.text();
          if (text.includes('FUNCTION_INVOCATION_TIMEOUT') || text.includes('timeout')) {
            throw new Error('⏱️ Request timeout. The server took too long to respond. Please try again.');
          }
          if (response.status === 504) {
            throw new Error('⏱️ Gateway timeout. The request took too long. Please try again.');
          }
          throw new Error(`Server error (${response.status}). Please try again later.`);
        }
      }
      
      if (!isJson) {
        throw new Error('⚠️ Invalid server response. The server may be experiencing issues. Please try again.');
      }
      
      try {
        return await response.json();
      } catch (parseError) {
        throw new Error('⚠️ Failed to parse server response. Please try again.');
      }
    },
    onSuccess: (data: SearchResponse) => {
      setPlayerData(data.data);
      setSearchInfo(data.searchInfo);
      queryClient.invalidateQueries({ queryKey: ['/api/ff-info-bot/check-limit'] });
      
      // Show ad dialog after successful search
      setShowAdDialog(true);
      
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
    
    if (uid.length < 6 || uid.length > 20) {
      toast({
        title: "⚠️ Invalid UID",
        description: "UID must be between 6 and 20 digits",
        variant: "destructive",
      });
      return;
    }
    
    try {
      searchMutation.mutate({ uid: uid.trim(), region });
    } catch (error) {
      console.error('Search mutation error:', error);
      toast({
        title: "❌ Error",
        description: "Failed to start search. Please try again.",
        variant: "destructive",
      });
    }
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
${playerData.creditScoreInfo ? `🎖️ Honour Score: ${playerData.creditScoreInfo.creditScore}` : ''}

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
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 mb-6 shadow-lg shadow-blue-500/50 animate-pulse-neon">
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8 border-2 border-primary/30 shadow-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-primary/20">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Search className="w-6 h-6 text-primary" />
                Search Player Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <Label htmlFor="uid" className="text-base font-semibold mb-2 block">Player UID</Label>
                  <Input
                    id="uid"
                    type="text"
                    placeholder="Enter Free Fire UID (e.g., 2405657626)"
                    value={uid}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 20) {
                        setUid(value);
                      }
                    }}
                    maxLength={20}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    data-testid="input-uid"
                    className="h-12 text-base"
                  />
                  {uid && uid.length < 6 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      UID must be at least 6 digits
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="region" className="text-base font-semibold mb-2 block">Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger id="region" data-testid="select-region" className="h-12 text-base">
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
                className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                data-testid="button-search"
              >
                {searchMutation.isPending ? (
                  <>
                    <Zap className="w-5 h-5 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : currentLimit.remainingSearches === 0 ? (
                  <>
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Daily Limit Reached
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
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
            <Card className="mb-8 overflow-hidden border-2 border-primary/30 shadow-2xl">
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
                      <p><span className="text-muted-foreground">Nickname:</span> <span className="font-semibold">{playerData.basicInfo.nickname}</span></p>
                      <p><span className="text-muted-foreground">Region:</span> <Badge variant="outline">{playerData.basicInfo.region}</Badge></p>
                      <p><span className="text-muted-foreground">Account Type:</span> <Badge>{playerData.basicInfo.accountType === 1 ? 'Standard' : 'Guest'}</Badge></p>
                      <p><span className="text-muted-foreground">Level:</span> <Badge variant="secondary" data-testid="text-level">{playerData.basicInfo.level}</Badge></p>
                      <p><span className="text-muted-foreground">Total EXP:</span> {playerData.basicInfo.exp.toLocaleString()}</p>
                      <p><span className="text-muted-foreground">Last Login:</span> <Badge variant="outline">{formatLastLogin(playerData.basicInfo.lastLoginAt)}</Badge></p>
                      <p><span className="text-muted-foreground">Game Version:</span> {playerData.basicInfo.releaseVersion || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      Rank Statistics
                    </h3>
                    <div className="space-y-2 text-sm">
                      {playerData.basicInfo.showBrRank && (
                        <>
                          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-3 rounded-lg border border-yellow-500/20">
                            <p className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">🏆 Battle Royale</p>
                            <p><span className="text-muted-foreground">Rank:</span> <Badge className="ml-2 bg-yellow-500" data-testid="text-br-rank">#{playerData.basicInfo.rank}</Badge></p>
                            <p><span className="text-muted-foreground">Rating Points:</span> <span className="font-bold text-yellow-600 dark:text-yellow-400">{playerData.basicInfo.rankingPoints.toLocaleString()}</span></p>
                          </div>
                        </>
                      )}
                      {playerData.basicInfo.showCsRank && (
                        <>
                          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-3 rounded-lg border border-purple-500/20">
                            <p className="font-semibold text-purple-600 dark:text-purple-400 mb-2">⚔️ Clash Squad</p>
                            <p><span className="text-muted-foreground">Rank:</span> <Badge className="ml-2 bg-purple-500" data-testid="text-cs-rank">#{playerData.basicInfo.csRank}</Badge></p>
                            <p><span className="text-muted-foreground">Rating Points:</span> <span className="font-bold text-purple-600 dark:text-purple-400">{playerData.basicInfo.csRankingPoints.toLocaleString()}</span></p>
                          </div>
                        </>
                      )}
                      {!playerData.basicInfo.showBrRank && !playerData.basicInfo.showCsRank && (
                        <p className="text-muted-foreground italic">No ranked data available</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-500" />
                      Achievements & Stats
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-2 bg-red-500/10 rounded border border-red-500/20">
                        <span className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-muted-foreground">Total Likes:</span>
                        </span>
                        <Badge variant="outline" className="text-red-600 dark:text-red-400 font-bold" data-testid="text-likes">{playerData.basicInfo.liked.toLocaleString()}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded border border-blue-500/20">
                        <span className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <span className="text-muted-foreground">Badges:</span>
                        </span>
                        <Badge variant="outline" className="text-blue-600 dark:text-blue-400 font-bold">{playerData.basicInfo.badgeCnt}</Badge>
                      </div>
                      {playerData.basicInfo.primePrivilegeDetail && (
                        <div className="flex items-center justify-between p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                          <span className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <span className="text-muted-foreground">Prime Level:</span>
                          </span>
                          <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400 font-bold">{playerData.basicInfo.primePrivilegeDetail.primeLevel}</Badge>
                        </div>
                      )}
                      {playerData.creditScoreInfo && (
                        <div className="flex items-center justify-between p-2 bg-green-500/10 rounded border border-green-500/20">
                          <span className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-green-500" />
                            <span className="text-muted-foreground">Honour Score:</span>
                          </span>
                          <Badge variant="outline" className="text-green-600 dark:text-green-400 font-bold">{playerData.creditScoreInfo.creditScore}</Badge>
                        </div>
                      )}
                      {playerData.petInfo && (
                        <div className="flex items-center justify-between p-2 bg-purple-500/10 rounded border border-purple-500/20">
                          <span className="text-muted-foreground">🐾 Pet Level:</span>
                          <Badge variant="outline" className="text-purple-600 dark:text-purple-400 font-bold">{playerData.petInfo.level}</Badge>
                        </div>
                      )}
                      {playerData.basicInfo.badgeId && (
                        <p><span className="text-muted-foreground">Badge ID:</span> <span className="font-mono text-xs">{playerData.basicInfo.badgeId}</span></p>
                      )}
                      {playerData.basicInfo.headPic && (
                        <p><span className="text-muted-foreground">Profile Avatar:</span> <span className="font-mono text-xs">{playerData.basicInfo.headPic}</span></p>
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

                {playerData.socialInfo && (
                  <>
                    <Separator className="my-6" />
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Star className="w-5 h-5 text-cyan-500" />
                        Social & Profile Info
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {playerData.socialInfo.signature && (
                          <div className="md:col-span-2">
                            <p className="text-muted-foreground font-semibold mb-2">📝 Bio/Signature:</p>
                            <p className="bg-muted p-4 rounded-lg italic" data-testid="text-signature">{playerData.socialInfo.signature}</p>
                          </div>
                        )}
                        {playerData.socialInfo.language && (
                          <div>
                            <p className="text-muted-foreground">🌐 Language:</p>
                            <Badge variant="outline" className="mt-1">{playerData.socialInfo.language.toUpperCase()}</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <FFPlayerImages uid={playerData.basicInfo.accountId} region={playerData.basicInfo.region} />
          </motion.div>
        )}

        {playerData && (
          <Card className="mb-8 bg-gradient-to-br from-primary/10 to-accent/10 border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Quick Stats Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-background/50 rounded-lg border">
                  <p className="text-3xl font-bold text-primary">{playerData.basicInfo.level}</p>
                  <p className="text-sm text-muted-foreground">Level</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg border">
                  <p className="text-3xl font-bold text-yellow-500">{playerData.basicInfo.liked.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg border">
                  <p className="text-3xl font-bold text-purple-500">{playerData.basicInfo.badgeCnt}</p>
                  <p className="text-sm text-muted-foreground">Badges</p>
                </div>
                <div className="text-center p-4 bg-background/50 rounded-lg border">
                  <p className="text-3xl font-bold text-green-500">{playerData.creditScoreInfo?.creditScore || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">Honour Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle>ℹ️ Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• 🔢 Free searches: 5 per day per user</p>
            <p>• 🔄 Limit resets daily at midnight (00:00)</p>
            <p>• 📋 Use "Copy Info" to get beautifully formatted player details with emojis</p>
            <p>• 💾 Download JSON for complete raw data (all API fields included)</p>
            <p>• ⚡ Data is fetched in real-time from official Free Fire servers</p>
            <p>• 🌍 Supports all major regions: SG, IND, CIS, TH, VN, TR, BR</p>
            <p>• 🔒 Your data is private and never shared</p>
            <p>• 🖼️ Player images auto-open in full screen when loaded successfully</p>
          </CardContent>
        </Card>
      </div>

      {/* Ad Dialog - Shows after search */}
      <Dialog open={showAdDialog} onOpenChange={setShowAdDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">✨ Thank you for using our service!</DialogTitle>
            <DialogDescription className="text-base">
              Please support us by viewing this advertisement. This helps us keep the service free for everyone! 🙏
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <AdSenseAd />
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowAdDialog(false)} size="lg">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
