import { Link } from "wouter";
import { ArrowLeft, Swords, Trophy, Zap, Crown, Star, Heart, Shield, Send, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import AdSenseAd from "@/components/AdSenseAd";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
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
    badgeCnt: number;
    showBrRank: boolean;
    showCsRank: boolean;
    primePrivilegeDetail?: { primeLevel: number };
  };
  clanBasicInfo?: {
    clanName: string;
    clanLevel: number;
  };
  creditScoreInfo?: {
    creditScore: number;
  };
}

interface ComparisonResult {
  id: string;
  player1: PlayerData;
  player2: PlayerData;
  player1Score: number;
  player2Score: number;
  winnerUid: string;
  analysis: string;
}

interface LimitResponse {
  remainingCompares: number;
  totalCompares: number;
  dailyLimit: number;
  limitReached: boolean;
  isVip: boolean;
}

const REGIONS = [
  { value: 'IND', label: '🇮🇳 India' },
  { value: 'SG', label: '🇸🇬 Singapore' },
  { value: 'PK', label: '🇵🇰 Pakistan' },
  { value: 'BD', label: '🇧🇩 Bangladesh' },
  { value: 'TH', label: '🇹🇭 Thailand' },
  { value: 'VN', label: '🇻🇳 Vietnam' },
  { value: 'BR', label: '🇧🇷 Brazil' },
  { value: 'ID', label: '🇮🇩 Indonesia' },
  { value: 'MY', label: '🇲🇾 Malaysia' },
  { value: 'PH', label: '🇵🇭 Philippines' },
  { value: 'US', label: '🇺🇸 USA' },
  { value: 'EU', label: '🇪🇺 Europe' },
  { value: 'ME', label: '🇦🇪 Middle East' },
];

export default function FFCompare() {
  const { toast } = useToast();
  const [player1Uid, setPlayer1Uid] = useState("");
  const [player1Region, setPlayer1Region] = useState("IND");
  const [player2Uid, setPlayer2Uid] = useState("");
  const [player2Region, setPlayer2Region] = useState("IND");
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [helpful, setHelpful] = useState<boolean | null>(null);

  const { data: limitData } = useQuery<LimitResponse>({
    queryKey: ['/api/ff-compare/check-limit'],
  });

  const compareMutation = useMutation({
    mutationFn: async (data: { player1Uid: string; player1Region: string; player2Uid: string; player2Region: string }) => {
      const response = await fetch('/api/ff-compare/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');
      
      if (!response.ok) {
        if (isJson) {
          const error = await response.json();
          throw new Error(error.error || 'Comparison failed');
        } else {
          const text = await response.text();
          if (text.includes('timeout')) {
            throw new Error('⏱️ Request timeout. Please try again.');
          }
          throw new Error(`Server error (${response.status})`);
        }
      }
      
      if (!isJson) {
        throw new Error('⚠️ Invalid server response');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setComparison(data.comparison);
      setShowFeedback(false);
      queryClient.invalidateQueries({ queryKey: ['/api/ff-compare/check-limit'] });
      toast({
        title: "⚔️ Battle Complete!",
        description: `${data.limitInfo.isVip ? 'VIP' : `${data.limitInfo.remainingCompares} comparisons remaining today`}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Comparison Failed",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/ff-compare/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comparisonId: comparison?.id,
          rating,
          comment,
          helpful,
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "🙏 Thank You!",
        description: "Your feedback helps us improve!",
      });
      setShowFeedback(false);
      setRating(0);
      setComment("");
      setHelpful(null);
    },
  });

  const handleCompare = () => {
    if (!player1Uid.trim() || !player2Uid.trim()) {
      toast({
        title: "⚠️ Missing UIDs",
        description: "Please enter both player UIDs",
        variant: "destructive",
      });
      return;
    }

    if (player1Uid.length < 6 || player2Uid.length < 6) {
      toast({
        title: "⚠️ Invalid UIDs",
        description: "UIDs must be at least 6 digits",
        variant: "destructive",
      });
      return;
    }

    if (player1Uid === player2Uid && player1Region === player2Region) {
      toast({
        title: "⚠️ Same Player",
        description: "Please select two different players",
        variant: "destructive",
      });
      return;
    }

    compareMutation.mutate({ player1Uid, player1Region, player2Uid, player2Region });
  };

  const currentLimit = limitData || { remainingCompares: 3, totalCompares: 0, dailyLimit: 3, limitReached: false, isVip: false };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-background via-background to-purple-500/10 dark:from-background dark:via-background dark:to-purple-500/20">
      <div className="container mx-auto max-w-7xl">
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
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 mb-6 shadow-lg animate-pulse-neon">
            <Swords className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-glow" data-testid="text-title">
            Free Fire VS Battle ⚔️
          </h1>
          
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Compare two Free Fire players head-to-head! AI-powered analysis determines the ultimate winner! 🏆
          </p>

          <div className="flex flex-wrap justify-center gap-4 items-center">
            {currentLimit.isVip ? (
              <Badge variant="default" className="px-6 py-3 text-lg bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse-neon" data-testid="badge-vip">
                <Crown className="w-5 h-5 mr-2" />
                VIP Access - Unlimited Comparisons 💎
              </Badge>
            ) : (
              <Badge variant="outline" className="px-6 py-3 text-lg" data-testid="badge-compares-remaining">
                {currentLimit.remainingCompares}/{currentLimit.dailyLimit} free comparisons remaining
              </Badge>
            )}
          </div>

          {!currentLimit.isVip && currentLimit.remainingCompares <= 1 && currentLimit.remainingCompares > 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4"
            >
              <Badge variant="destructive" className="px-4 py-2">
                ⚠️ Last free comparison! Upgrade to VIP for unlimited access
              </Badge>
            </motion.div>
          )}
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
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                Select Players to Compare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div 
                  className="space-y-4 p-6 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border-2 border-blue-500/30"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl font-bold">Player 1</h3>
                  </div>
                  <div>
                    <Label htmlFor="player1-uid">Player UID</Label>
                    <Input
                      id="player1-uid"
                      type="text"
                      placeholder="Enter UID"
                      value={player1Uid}
                      onChange={(e) => setPlayer1Uid(e.target.value.replace(/\D/g, '').slice(0, 20))}
                      data-testid="input-player1-uid"
                    />
                  </div>
                  <div>
                    <Label htmlFor="player1-region">Region</Label>
                    <Select value={player1Region} onValueChange={setPlayer1Region}>
                      <SelectTrigger id="player1-region" data-testid="select-player1-region">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map((r) => (
                          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-4 p-6 rounded-lg bg-red-500/10 dark:bg-red-500/20 border-2 border-red-500/30"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-6 h-6 text-red-500" />
                    <h3 className="text-xl font-bold">Player 2</h3>
                  </div>
                  <div>
                    <Label htmlFor="player2-uid">Player UID</Label>
                    <Input
                      id="player2-uid"
                      type="text"
                      placeholder="Enter UID"
                      value={player2Uid}
                      onChange={(e) => setPlayer2Uid(e.target.value.replace(/\D/g, '').slice(0, 20))}
                      data-testid="input-player2-uid"
                    />
                  </div>
                  <div>
                    <Label htmlFor="player2-region">Region</Label>
                    <Select value={player2Region} onValueChange={setPlayer2Region}>
                      <SelectTrigger id="player2-region" data-testid="select-player2-region">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map((r) => (
                          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              </div>

              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={handleCompare}
                  disabled={compareMutation.isPending || currentLimit.limitReached}
                  size="lg"
                  className="text-lg px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 animate-pulse-neon"
                  data-testid="button-compare"
                >
                  {compareMutation.isPending ? (
                    <>
                      <Zap className="w-6 h-6 mr-2 animate-spin" />
                      Analyzing Battle...
                    </>
                  ) : currentLimit.limitReached ? (
                    <>
                      <Crown className="w-6 h-6 mr-2" />
                      Get VIP Access
                    </>
                  ) : (
                    <>
                      <Swords className="w-6 h-6 mr-2" />
                      Start Battle Comparison
                    </>
                  )}
                </Button>
              </div>

              {currentLimit.limitReached && !currentLimit.isVip && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center"
                >
                  <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                    <CardContent className="p-6">
                      <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-500 animate-bounce" />
                      <h3 className="text-xl font-bold mb-2">Daily Limit Reached! 🚫</h3>
                      <p className="text-muted-foreground mb-4">
                        Upgrade to VIP for unlimited comparisons, exclusive features, and more! 💎
                      </p>
                      <Button variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                        <Crown className="w-4 h-4 mr-2" />
                        Get VIP Access
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          {comparison && (
            <motion.div
              key="comparison-results"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-8 overflow-hidden border-2 border-primary">
                <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                  <CardTitle className="text-3xl text-center flex items-center justify-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
                    Battle Results
                    <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <motion.div
                      className={`p-6 rounded-lg border-2 ${
                        comparison.winnerUid === comparison.player1.basicInfo.accountId
                          ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/50'
                          : 'bg-muted/50 border-muted'
                      }`}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {comparison.winnerUid === comparison.player1.basicInfo.accountId && (
                        <div className="flex items-center justify-center mb-4">
                          <Badge className="bg-green-500 text-white px-4 py-2 text-lg animate-pulse">
                            <Crown className="w-5 h-5 mr-2" />
                            WINNER!
                          </Badge>
                        </div>
                      )}
                      <div className="text-center mb-4">
                        <h3 className="text-2xl font-bold mb-2">{comparison.player1.basicInfo.nickname}</h3>
                        <Badge variant="outline" className="text-lg px-4 py-2">Level {comparison.player1.basicInfo.level}</Badge>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall Score</span>
                            <span className="font-bold">{comparison.player1Score}/100</span>
                          </div>
                          <Progress value={comparison.player1Score} className="h-4" />
                        </div>
                        <Separator />
                        <div className="space-y-2 text-sm">
                          <p className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500" /> BR Rank:</span>
                            <Badge variant="secondary">#{comparison.player1.basicInfo.rank}</Badge>
                          </p>
                          <p className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><Star className="w-4 h-4 text-purple-500" /> BR Points:</span>
                            <span className="font-semibold">{comparison.player1.basicInfo.rankingPoints.toLocaleString()}</span>
                          </p>
                          <p className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-500" /> Likes:</span>
                            <span className="font-semibold">{comparison.player1.basicInfo.liked.toLocaleString()}</span>
                          </p>
                          <p className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-500" /> Badges:</span>
                            <span className="font-semibold">{comparison.player1.basicInfo.badgeCnt}</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className={`p-6 rounded-lg border-2 ${
                        comparison.winnerUid === comparison.player2.basicInfo.accountId
                          ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/50'
                          : 'bg-muted/50 border-muted'
                      }`}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {comparison.winnerUid === comparison.player2.basicInfo.accountId && (
                        <div className="flex items-center justify-center mb-4">
                          <Badge className="bg-green-500 text-white px-4 py-2 text-lg animate-pulse">
                            <Crown className="w-5 h-5 mr-2" />
                            WINNER!
                          </Badge>
                        </div>
                      )}
                      <div className="text-center mb-4">
                        <h3 className="text-2xl font-bold mb-2">{comparison.player2.basicInfo.nickname}</h3>
                        <Badge variant="outline" className="text-lg px-4 py-2">Level {comparison.player2.basicInfo.level}</Badge>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall Score</span>
                            <span className="font-bold">{comparison.player2Score}/100</span>
                          </div>
                          <Progress value={comparison.player2Score} className="h-4" />
                        </div>
                        <Separator />
                        <div className="space-y-2 text-sm">
                          <p className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500" /> BR Rank:</span>
                            <Badge variant="secondary">#{comparison.player2.basicInfo.rank}</Badge>
                          </p>
                          <p className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><Star className="w-4 h-4 text-purple-500" /> BR Points:</span>
                            <span className="font-semibold">{comparison.player2.basicInfo.rankingPoints.toLocaleString()}</span>
                          </p>
                          <p className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-500" /> Likes:</span>
                            <span className="font-semibold">{comparison.player2.basicInfo.liked.toLocaleString()}</span>
                          </p>
                          <p className="flex items-center justify-between">
                            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-500" /> Badges:</span>
                            <span className="font-semibold">{comparison.player2.basicInfo.badgeCnt}</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-lg border border-purple-500/30"
                  >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-primary" />
                      AI Analysis
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed" data-testid="text-analysis">
                      {comparison.analysis}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 text-center"
                  >
                    <Button
                      onClick={() => setShowFeedback(!showFeedback)}
                      variant="outline"
                      size="lg"
                      data-testid="button-feedback"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Share Your Feedback
                    </Button>
                  </motion.div>

                  <AnimatePresence>
                    {showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6"
                      >
                        <Card className="bg-muted/50">
                          <CardContent className="p-6 space-y-4">
                            <div>
                              <Label>How accurate was the comparison?</Label>
                              <div className="flex gap-2 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-110"
                                    data-testid={`button-rating-${star}`}
                                  >
                                    <Star
                                      className={`w-8 h-8 ${
                                        star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label>Was this comparison helpful?</Label>
                              <div className="flex gap-4 mt-2">
                                <Button
                                  variant={helpful === true ? 'default' : 'outline'}
                                  onClick={() => setHelpful(true)}
                                  data-testid="button-helpful-yes"
                                >
                                  <ThumbsUp className="w-4 h-4 mr-2" />
                                  Yes
                                </Button>
                                <Button
                                  variant={helpful === false ? 'default' : 'outline'}
                                  onClick={() => setHelpful(false)}
                                  data-testid="button-helpful-no"
                                >
                                  <ThumbsDown className="w-4 h-4 mr-2" />
                                  No
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="comment">Additional Comments (Optional)</Label>
                              <Textarea
                                id="comment"
                                placeholder="Share your thoughts..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={3}
                                data-testid="textarea-comment"
                              />
                            </div>
                            <Button
                              onClick={() => feedbackMutation.mutate()}
                              disabled={!rating || feedbackMutation.isPending}
                              className="w-full"
                              data-testid="button-submit-feedback"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              {feedbackMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
