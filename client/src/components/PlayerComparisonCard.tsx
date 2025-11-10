import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Crown, Trophy, Star, Heart, Shield, User } from "lucide-react";
import { outfitImageUrl, bannerImageUrl } from "@/lib/ff-images";
import { motion } from "framer-motion";

interface PlayerData {
  basicInfo: {
    accountId: string;
    nickname: string;
    region: string;
    level: number;
    rank: number;
    rankingPoints: number;
    liked: number;
    badgeCnt: number;
  };
}

interface PlayerComparisonCardProps {
  player: PlayerData;
  score: number;
  index: number;
  isWinner: boolean;
}

export default function PlayerComparisonCard({ player, score, index, isWinner }: PlayerComparisonCardProps) {
  const [outfitImageError, setOutfitImageError] = useState(false);
  const [bannerImageError, setBannerImageError] = useState(false);

  const outfit = outfitImageUrl(player.basicInfo.region.toLowerCase(), player.basicInfo.accountId);
  const banner = bannerImageUrl(player.basicInfo.region.toLowerCase(), player.basicInfo.accountId);

  return (
    <motion.div
      className={`rounded-lg border-2 overflow-hidden ${
        isWinner
          ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/50'
          : 'bg-muted/50 border-muted'
      }`}
      initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      {!bannerImageError && banner && (
        <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 overflow-hidden">
          <img
            src={banner}
            alt={`${player.basicInfo.nickname} banner`}
            className="w-full h-full object-cover transition-transform hover:scale-110"
            onError={() => setBannerImageError(true)}
            loading="lazy"
          />
        </div>
      )}

      <div className="p-6">
        {isWinner && (
          <div className="flex items-center justify-center mb-4">
            <Badge className="bg-green-500 text-white px-4 py-2 text-lg animate-pulse">
              <Crown className="w-5 h-5 mr-2" />
              WINNER!
            </Badge>
          </div>
        )}

        <div className="text-center mb-4">
          <div className="w-32 h-32 mx-auto mb-3 rounded-full overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-4 border-primary/30">
            {outfitImageError || !outfit ? (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-16 h-16 text-muted-foreground" />
              </div>
            ) : (
              <img
                src={outfit}
                alt={`${player.basicInfo.nickname} outfit`}
                className="w-full h-full object-cover transition-transform hover:scale-110"
                onError={() => setOutfitImageError(true)}
                loading="lazy"
              />
            )}
          </div>
          <h3 className="text-2xl font-bold mb-2">{player.basicInfo.nickname}</h3>
          <Badge variant="outline" className="text-lg px-4 py-2">Level {player.basicInfo.level}</Badge>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold">Overall Score</span>
              <span className="font-bold text-primary">{score}/100</span>
            </div>
            <Progress value={score} className="h-4" />
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <p className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" /> BR Rank:
              </span>
              <Badge variant="secondary">#{player.basicInfo.rank}</Badge>
            </p>
            <p className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-500" /> BR Points:
              </span>
              <span className="font-semibold">{player.basicInfo.rankingPoints.toLocaleString()}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" /> Likes:
              </span>
              <span className="font-semibold">{player.basicInfo.liked.toLocaleString()}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" /> Badges:
              </span>
              <span className="font-semibold">{player.basicInfo.badgeCnt}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
