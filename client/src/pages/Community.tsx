import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Link } from "wouter";
import { Users, Heart, MessageCircle, Gift, Star, Crown } from "lucide-react";
import { SiDiscord, SiTelegram, SiYoutube } from "react-icons/si";

export default function Community() {
  const [discordCount, setDiscordCount] = useState(1300);
  const [youtubeCount, setYoutubeCount] = useState(8000);
  const [telegramCount, setTelegramCount] = useState(15000);
  const [interactionsCount, setInteractionsCount] = useState(1000000);

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly increment counters to simulate live growth
      setDiscordCount(prev => prev + Math.floor(Math.random() * 3));
      setYoutubeCount(prev => prev + Math.floor(Math.random() * 5));
      setTelegramCount(prev => prev + Math.floor(Math.random() * 8));
      setInteractionsCount(prev => prev + Math.floor(Math.random() * 20));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
    return `${num}+`;
  };

  const communityStats = [
    {
      name: "Discord Family",
      icon: SiDiscord,
      count: formatNumber(discordCount),
      description: "Active members chatting daily",
      color: "text-indigo-500",
      bgGlow: "bg-indigo-500/20"
    },
    {
      name: "YouTube Subscribers",
      icon: SiYoutube,
      count: formatNumber(youtubeCount),
      description: "Growing community of supporters",
      color: "text-red-500",
      bgGlow: "bg-red-500/20"
    },
    {
      name: "Telegram Group",
      icon: SiTelegram,
      count: formatNumber(telegramCount),
      description: "VIP members with exclusive content",
      color: "text-blue-500",
      bgGlow: "bg-blue-500/20"
    },
    {
      name: "Content Interactions",
      icon: Heart,
      count: formatNumber(interactionsCount),
      description: "Likes, comments, and shares",
      color: "text-pink-500",
      bgGlow: "bg-pink-500/20"
    }
  ];

  const communityValues = [
    {
      icon: Heart,
      title: "Love & Support",
      description: "We lift each other up and celebrate every victory together!",
      color: "text-pink-500"
    },
    {
      icon: Star,
      title: "Growth Mindset",
      description: "Every member is encouraged to learn, improve, and reach their potential.",
      color: "text-yellow-500"
    },
    {
      icon: Users,
      title: "Inclusive Environment",
      description: "Everyone is welcome regardless of skill level or background.",
      color: "text-blue-500"
    },
    {
      icon: Crown,
      title: "Recognition",
      description: "We celebrate achievements and recognize contributions from all members.",
      color: "text-purple-500"
    }
  ];

  return (
    <div className="pt-16">
      <HeroSection 
        title="👥 Community"
        subtitle="Growing a family of creators — together we're stronger, together we thrive!"
      />

      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* AdSense Ad */}
          <div className="mb-8">
            <AdSenseAd />
          </div>

          {/* Community Philosophy */}
          <div className="glass rounded-2xl p-8 mb-12 text-center" data-testid="community-philosophy">
            <h2 className="text-3xl font-bold text-primary mb-6">Building More Than a Community 🏠</h2>
            <p className="text-lg text-foreground leading-relaxed max-w-4xl mx-auto mb-6">
              This isn't just a community — it's a family! Every member matters, every voice is heard, and every dream is supported. 
              We're not just building followers; we're building lifelong friendships and creating a space where everyone can grow together.
            </p>
            <p className="text-xl text-primary font-semibold">
              "A community built with love becomes a family that lasts forever!" ❤️
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" data-testid="community-stats">
            {communityStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={stat.name}
                  className={`glass rounded-2xl p-6 text-center hover:scale-110 transition-all duration-500 animate-float hover:shadow-2xl ${stat.bgGlow} border-2 border-transparent hover:border-current`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animation: 'float 6s ease-in-out infinite, pulse 2s ease-in-out infinite'
                  }}
                  data-testid={`stat-${stat.name.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="relative">
                    <div className={`absolute inset-0 ${stat.bgGlow} blur-xl animate-pulse`}></div>
                    <IconComponent className={`w-14 h-14 ${stat.color} mx-auto mb-3 relative animate-bounce-slow`} />
                  </div>
                  <h3 className={`text-3xl font-bold ${stat.color} mb-2 animate-pulse transition-all duration-300`}>
                    {stat.count}
                  </h3>
                  <h4 className="font-semibold text-foreground mb-1 animate-fadeUp">{stat.name}</h4>
                  <p className="text-sm text-muted-foreground animate-fadeUp" style={{ animationDelay: '0.1s' }}>
                    {stat.description}
                  </p>
                  <div className="mt-3 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50 animate-shimmer"></div>
                </div>
              );
            })}
          </div>

          {/* Community Values */}
          <div className="grid md:grid-cols-2 gap-8 mb-12" data-testid="community-values">
            {communityValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div 
                  key={value.title}
                  className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 animate-float hover:shadow-2xl hover:rotate-1 border-2 border-transparent hover:border-primary/30"
                  style={{ 
                    animationDelay: `${index * 0.15}s`,
                    animation: 'float 6s ease-in-out infinite, fadeUp 0.8s ease-out forwards'
                  }}
                  data-testid={`value-${value.title.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className={`absolute inset-0 ${value.color} opacity-20 blur-xl animate-pulse`}></div>
                      <IconComponent className={`w-12 h-12 ${value.color} relative animate-bounce-slow hover:animate-spin`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground animate-slideRight">{value.title}</h3>
                  </div>
                  <p className="text-muted-foreground animate-fadeInLeft" style={{ animationDelay: '0.2s' }}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Community Highlights */}
          <div className="glass rounded-2xl p-8 mb-12 animate-scaleIn" data-testid="community-highlights">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center animate-glow">🌟 Community Highlights</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-muted rounded-lg p-6 text-center hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/50 animate-bounceIn border-2 border-transparent hover:border-yellow-500/50">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500/20 blur-xl animate-pulse"></div>
                  <Gift className="w-12 h-12 text-yellow-500 mx-auto mb-3 relative animate-wiggle" />
                </div>
                <h3 className="font-bold text-foreground mb-2 animate-fadeUp">Weekly Giveaways</h3>
                <p className="text-muted-foreground text-sm animate-fadeInLeft">Exclusive prizes for active community members!</p>
              </div>
              <div className="bg-muted rounded-lg p-6 text-center hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/50 animate-bounceIn border-2 border-transparent hover:border-green-500/50" style={{ animationDelay: '0.1s' }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-xl animate-pulse"></div>
                  <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-3 relative animate-bounce-slow" />
                </div>
                <h3 className="font-bold text-foreground mb-2 animate-fadeUp">Daily Interactions</h3>
                <p className="text-muted-foreground text-sm animate-fadeInLeft">Active discussions and support 24/7!</p>
              </div>
              <div className="bg-muted rounded-lg p-6 text-center hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/50 animate-bounceIn border-2 border-transparent hover:border-purple-500/50" style={{ animationDelay: '0.2s' }}>
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl animate-pulse"></div>
                  <Crown className="w-12 h-12 text-purple-500 mx-auto mb-3 relative animate-float" />
                </div>
                <h3 className="font-bold text-foreground mb-2 animate-fadeUp">VIP Access</h3>
                <p className="text-muted-foreground text-sm animate-fadeInLeft">Special perks and early access to content!</p>
              </div>
            </div>
          </div>

          {/* Community Rules */}
          <div className="glass rounded-2xl p-8 mb-12" data-testid="community-rules">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">📋 Community Guidelines</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-foreground mb-3">✅ What We Encourage:</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Helping fellow members</li>
                  <li>• Sharing knowledge and tips</li>
                  <li>• Positive and constructive feedback</li>
                  <li>• Celebrating each other's achievements</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-3">❌ What We Don't Allow:</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Spam or excessive self-promotion</li>
                  <li>• Disrespectful or toxic behavior</li>
                  <li>• Sharing inappropriate content</li>
                  <li>• Harassment of any kind</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="glass rounded-2xl p-8 text-center animate-zoomIn hover:scale-105 transition-all duration-500 border-2 border-primary/30 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/50" data-testid="community-cta">
            <h2 className="text-2xl font-bold text-primary mb-4 animate-glow">Ready to Join the Family? 🤝</h2>
            <p className="text-foreground mb-6 animate-fadeUp">
              Don't just be a spectator — be part of something amazing! Join our community and let's grow together, support each other, and create lasting friendships.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/social" className="neon-btn animate-pulse-neon">
                <Users className="w-4 h-4 mr-2 animate-bounce" />
                Join All Platforms
              </Link>
              <Link href="/contact" className="neon-btn animate-pulse-neon" style={{ animationDelay: '0.5s' }}>
                <MessageCircle className="w-4 h-4 mr-2 animate-bounce" style={{ animationDelay: '0.5s' }} />
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AdSenseAd />
    </div>
  );
}