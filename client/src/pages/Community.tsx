
import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Link } from "wouter";
import { Users, Heart, MessageCircle, Gift, Star, Crown } from "lucide-react";
import { SiDiscord, SiTelegram, SiYoutube } from "react-icons/si";

export default function Community() {
  const communityStats = [
    {
      name: "Discord Family",
      icon: SiDiscord,
      count: "500+",
      description: "Active members chatting daily",
      color: "text-indigo-500"
    },
    {
      name: "YouTube Subscribers",
      icon: SiYoutube,
      count: "1K+",
      description: "Growing community of supporters",
      color: "text-red-500"
    },
    {
      name: "Telegram Group",
      icon: SiTelegram,
      count: "200+",
      description: "VIP members with exclusive content",
      color: "text-blue-500"
    },
    {
      name: "Content Interactions",
      icon: Heart,
      count: "10K+",
      description: "Likes, comments, and shares",
      color: "text-pink-500"
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
                  className="glass rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 animate-float"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  data-testid={`stat-${stat.name.toLowerCase().replace(' ', '-')}`}
                >
                  <IconComponent className={`w-12 h-12 ${stat.color} mx-auto mb-3`} />
                  <h3 className="text-2xl font-bold text-primary">{stat.count}</h3>
                  <h4 className="font-semibold text-foreground">{stat.name}</h4>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
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
                  className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-float"
                  style={{ animationDelay: `${index * 0.15}s` }}
                  data-testid={`value-${value.title.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <IconComponent className={`w-12 h-12 ${value.color}`} />
                    <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>

          {/* Community Highlights */}
          <div className="glass rounded-2xl p-8 mb-12" data-testid="community-highlights">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">🌟 Community Highlights</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-muted rounded-lg p-6 text-center">
                <Gift className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-2">Weekly Giveaways</h3>
                <p className="text-muted-foreground text-sm">Exclusive prizes for active community members!</p>
              </div>
              <div className="bg-muted rounded-lg p-6 text-center">
                <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-2">Daily Interactions</h3>
                <p className="text-muted-foreground text-sm">Active discussions and support 24/7!</p>
              </div>
              <div className="bg-muted rounded-lg p-6 text-center">
                <Crown className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-2">VIP Access</h3>
                <p className="text-muted-foreground text-sm">Special perks and early access to content!</p>
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
          <div className="glass rounded-2xl p-8 text-center" data-testid="community-cta">
            <h2 className="text-2xl font-bold text-primary mb-4">Ready to Join the Family? 🤝</h2>
            <p className="text-foreground mb-6">
              Don't just be a spectator — be part of something amazing! Join our community and let's grow together, support each other, and create lasting friendships.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/social" className="neon-btn">
                <Users className="w-4 h-4 mr-2" />
                Join All Platforms
              </Link>
              <Link href="/contact" className="neon-btn">
                <MessageCircle className="w-4 h-4 mr-2" />
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
