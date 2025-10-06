
import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Link } from "wouter";
import { Video, Camera, Mic, Edit, Youtube, Instagram, TrendingUp, Users, Eye } from "lucide-react";
import { useState, useEffect } from "react";

export default function Content() {
  const [videoCount, setVideoCount] = useState(50);
  const [tutorialCount, setTutorialCount] = useState(25);
  const [reviewCount, setReviewCount] = useState(15);
  const [youtubeViews, setYoutubeViews] = useState(8000);
  const [instagramFollowers, setInstagramFollowers] = useState(5000);
  const [liveViewers, setLiveViewers] = useState(150);

  useEffect(() => {
    const intervals = [
      setInterval(() => setVideoCount(prev => prev + Math.floor(Math.random() * 2)), 3000),
      setInterval(() => setTutorialCount(prev => prev + Math.floor(Math.random() * 2)), 4000),
      setInterval(() => setReviewCount(prev => prev + 1), 5000),
      setInterval(() => setYoutubeViews(prev => prev + Math.floor(Math.random() * 50) + 10), 2000),
      setInterval(() => setInstagramFollowers(prev => prev + Math.floor(Math.random() * 20) + 5), 2500),
      setInterval(() => setLiveViewers(prev => Math.max(100, prev + Math.floor(Math.random() * 21) - 10)), 1500),
    ];

    return () => intervals.forEach(interval => clearInterval(interval));
  }, []);

  const contentTypes = [
    {
      name: "Gaming Videos",
      icon: Video,
      description: "Epic gameplay, tutorials, and gaming reviews that keep you entertained!",
      stats: `${videoCount}+ Videos`,
      color: "text-red-500",
      bgGlow: "hover:shadow-red-500/50"
    },
    {
      name: "Coding Tutorials",
      icon: Edit,
      description: "Step-by-step programming guides to help you level up your coding skills.",
      stats: `${tutorialCount}+ Tutorials`,
      color: "text-blue-500",
      bgGlow: "hover:shadow-blue-500/50"
    },
    {
      name: "Tech Reviews",
      icon: Camera,
      description: "Honest reviews of gaming gear, software, and tech that actually matters.",
      stats: `${reviewCount}+ Reviews`,
      color: "text-green-500",
      bgGlow: "hover:shadow-green-500/50"
    },
    {
      name: "Live Streams",
      icon: Mic,
      description: "Interactive sessions where we code, game, and chat together in real-time!",
      stats: "Weekly Streams",
      color: "text-purple-500",
      bgGlow: "hover:shadow-purple-500/50"
    }
  ];

  return (
    <div className="pt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 animate-pulse pointer-events-none"></div>
      
      <HeroSection 
        title="🎥 Content Creation"
        subtitle="Sharing knowledge with love — every video is made with passion and purpose!"
      />
      
      <div className="container mx-auto px-6 pb-20 relative">
        <div className="max-w-6xl mx-auto">
          {/* Content Philosophy */}
          <div className="glass rounded-2xl p-8 mb-12 text-center animate-fadeUp hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30" data-testid="content-philosophy">
            <h2 className="text-3xl font-bold text-primary mb-6 animate-slideLeft">My Content Mission 📹</h2>
            <p className="text-lg text-foreground leading-relaxed max-w-4xl mx-auto mb-6 animate-slideRight" style={{ animationDelay: '0.1s' }}>
              Content creation isn't just about views or likes — it's about creating value, sharing knowledge, and building genuine connections. 
              Every video I make, every post I share, comes straight from the heart with one goal: to help you grow and succeed!
            </p>
            <p className="text-xl text-primary font-semibold animate-bounceIn" style={{ animationDelay: '0.2s' }}>
              "Content with purpose creates communities with passion!" ❤️
            </p>
          </div>

          {/* Live Stats Banner */}
          <div className="glass rounded-2xl p-6 mb-12 animate-slideUpFade">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-primary animate-bounce" />
              <h3 className="text-xl font-bold text-primary">Live Stats 📊</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 rounded-lg p-4 text-center animate-pulse hover:scale-110 transition-all duration-300">
                <Youtube className="w-8 h-8 text-red-500 mx-auto mb-2 animate-spin-slow" />
                <div className="text-2xl font-bold text-foreground animate-countUp">{youtubeViews.toLocaleString()}+</div>
                <div className="text-xs text-muted-foreground">YouTube Views</div>
              </div>
              <div className="bg-gradient-to-br from-pink-500/20 to-pink-500/5 rounded-lg p-4 text-center animate-pulse hover:scale-110 transition-all duration-300" style={{ animationDelay: '0.1s' }}>
                <Instagram className="w-8 h-8 text-pink-500 mx-auto mb-2 animate-wiggle" />
                <div className="text-2xl font-bold text-foreground animate-countUp">{instagramFollowers.toLocaleString()}+</div>
                <div className="text-xs text-muted-foreground">Instagram Followers</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-lg p-4 text-center animate-pulse hover:scale-110 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
                <Eye className="w-8 h-8 text-purple-500 mx-auto mb-2 animate-pulse" />
                <div className="text-2xl font-bold text-foreground animate-countUp">{liveViewers}</div>
                <div className="text-xs text-muted-foreground">Live Viewers Now</div>
              </div>
            </div>
          </div>

          {/* Content Types */}
          <div className="grid md:grid-cols-2 gap-8 mb-12" data-testid="content-types">
            {contentTypes.map((content, index) => {
              const IconComponent = content.icon;
              return (
                <div 
                  key={content.name}
                  className={`glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 animate-float hover:shadow-2xl ${content.bgGlow} group cursor-pointer`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                  data-testid={`content-${content.name.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-br ${content.color.replace('text-', 'from-')}/20 ${content.color.replace('text-', 'to-')}/5 animate-pulse group-hover:animate-spin-slow`}>
                      <IconComponent className={`w-12 h-12 ${content.color} animate-pulse`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:scale-110 transition-transform inline-block">{content.name}</h3>
                      <span className={`block text-lg ${content.color} font-bold animate-pulse`}>{content.stats}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">{content.description}</p>
                </div>
              );
            })}
          </div>

          {/* Latest Content */}
          <div className="glass rounded-2xl p-8 mb-12 animate-scaleIn hover:scale-105 transition-all duration-500" data-testid="latest-content">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center animate-neonPulse">🔥 Latest Content</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-lg p-6 text-center animate-float hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/50 group">
                <Youtube className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce group-hover:animate-spin" />
                <h3 className="font-bold text-foreground mb-2 group-hover:text-red-500 transition-colors">YouTube Channel</h3>
                <p className="text-muted-foreground mb-4">New videos every week! Gaming, coding, and life updates.</p>
                <a 
                  href="https://youtube.com/@Nishant_sarkar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="neon-btn animate-pulse hover:animate-none"
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  Subscribe Now
                </a>
              </div>
              <div className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 rounded-lg p-6 text-center animate-float hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/50 group" style={{ animationDelay: '0.2s' }}>
                <Instagram className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-wiggle group-hover:animate-spin" />
                <h3 className="font-bold text-foreground mb-2 group-hover:text-pink-500 transition-colors">Instagram Stories</h3>
                <p className="text-muted-foreground mb-4">Behind-the-scenes content and daily updates.</p>
                <a 
                  href="https://instagram.com/nishant_sarkar__10k" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="neon-btn animate-pulse hover:animate-none"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Follow Me
                </a>
              </div>
            </div>
          </div>

          {/* Content Calendar */}
          <div className="glass rounded-2xl p-8 mb-12 animate-bounceIn hover:scale-105 transition-all duration-500" data-testid="content-calendar">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center animate-slideLeft">📅 Content Schedule</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-4 text-center animate-float hover:scale-110 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30">
                <h3 className="font-bold text-foreground text-lg mb-2 animate-pulse">Monday</h3>
                <p className="text-muted-foreground text-sm">Gaming Highlights</p>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-4 text-center animate-float hover:scale-110 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30" style={{ animationDelay: '0.1s' }}>
                <h3 className="font-bold text-foreground text-lg mb-2 animate-pulse">Wednesday</h3>
                <p className="text-muted-foreground text-sm">Coding Tutorials</p>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-4 text-center animate-float hover:scale-110 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30" style={{ animationDelay: '0.2s' }}>
                <h3 className="font-bold text-foreground text-lg mb-2 animate-pulse">Friday</h3>
                <p className="text-muted-foreground text-sm">Live Streams</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="glass rounded-2xl p-8 text-center animate-zoomIn hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/50" data-testid="content-cta">
            <h2 className="text-2xl font-bold text-primary mb-4 animate-neonPulse">Join the Content Journey! 🚀</h2>
            <p className="text-foreground mb-6 animate-slideRight">
              Be part of the NS GAMMING family! Subscribe, follow, and let's grow together. Your support means everything to me!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/social" className="neon-btn animate-float hover:scale-110">
                <Video className="w-4 h-4 mr-2 animate-pulse" />
                Follow All Platforms
              </Link>
              <Link href="/contact" className="neon-btn animate-float hover:scale-110" style={{ animationDelay: '0.2s' }}>
                <Mic className="w-4 h-4 mr-2 animate-pulse" />
                Suggest Content
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
