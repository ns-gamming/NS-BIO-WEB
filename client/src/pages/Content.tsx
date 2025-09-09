
import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Link } from "wouter";
import { Video, Camera, Mic, Edit, Youtube, Instagram } from "lucide-react";

export default function Content() {
  const contentTypes = [
    {
      name: "Gaming Videos",
      icon: Video,
      description: "Epic gameplay, tutorials, and gaming reviews that keep you entertained!",
      stats: "50+ Videos",
      color: "text-red-500"
    },
    {
      name: "Coding Tutorials",
      icon: Edit,
      description: "Step-by-step programming guides to help you level up your coding skills.",
      stats: "25+ Tutorials",
      color: "text-blue-500"
    },
    {
      name: "Tech Reviews",
      icon: Camera,
      description: "Honest reviews of gaming gear, software, and tech that actually matters.",
      stats: "15+ Reviews",
      color: "text-green-500"
    },
    {
      name: "Live Streams",
      icon: Mic,
      description: "Interactive sessions where we code, game, and chat together in real-time!",
      stats: "Weekly Streams",
      color: "text-purple-500"
    }
  ];

  return (
    <div className="pt-16">
      <HeroSection 
        title="🎥 Content Creation"
        subtitle="Sharing knowledge with love — every video is made with passion and purpose!"
      />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Content Philosophy */}
          <div className="glass rounded-2xl p-8 mb-12 text-center" data-testid="content-philosophy">
            <h2 className="text-3xl font-bold text-primary mb-6">My Content Mission 📹</h2>
            <p className="text-lg text-foreground leading-relaxed max-w-4xl mx-auto mb-6">
              Content creation isn't just about views or likes — it's about creating value, sharing knowledge, and building genuine connections. 
              Every video I make, every post I share, comes straight from the heart with one goal: to help you grow and succeed!
            </p>
            <p className="text-xl text-primary font-semibold">
              "Content with purpose creates communities with passion!" ❤️
            </p>
          </div>

          {/* Content Types */}
          <div className="grid md:grid-cols-2 gap-8 mb-12" data-testid="content-types">
            {contentTypes.map((content, index) => {
              const IconComponent = content.icon;
              return (
                <div 
                  key={content.name}
                  className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-float"
                  style={{ animationDelay: `${index * 0.15}s` }}
                  data-testid={`content-${content.name.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <IconComponent className={`w-12 h-12 ${content.color}`} />
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{content.name}</h3>
                      <span className="text-sm text-primary font-medium">{content.stats}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{content.description}</p>
                </div>
              );
            })}
          </div>

          {/* Latest Content */}
          <div className="glass rounded-2xl p-8 mb-12" data-testid="latest-content">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">🔥 Latest Content</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted rounded-lg p-6 text-center">
                <Youtube className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">YouTube Channel</h3>
                <p className="text-muted-foreground mb-4">New videos every week! Gaming, coding, and life updates.</p>
                <a 
                  href="https://youtube.com/@Nishant_sarkar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="neon-btn"
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  Subscribe Now
                </a>
              </div>
              <div className="bg-muted rounded-lg p-6 text-center">
                <Instagram className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">Instagram Stories</h3>
                <p className="text-muted-foreground mb-4">Behind-the-scenes content and daily updates.</p>
                <a 
                  href="https://instagram.com/nishant_sarkar__10k" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="neon-btn"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Follow Me
                </a>
              </div>
            </div>
          </div>

          {/* Content Calendar */}
          <div className="glass rounded-2xl p-8 mb-12" data-testid="content-calendar">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">📅 Content Schedule</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <h3 className="font-bold text-foreground">Monday</h3>
                <p className="text-muted-foreground text-sm">Gaming Highlights</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <h3 className="font-bold text-foreground">Wednesday</h3>
                <p className="text-muted-foreground text-sm">Coding Tutorials</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <h3 className="font-bold text-foreground">Friday</h3>
                <p className="text-muted-foreground text-sm">Live Streams</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="glass rounded-2xl p-8 text-center" data-testid="content-cta">
            <h2 className="text-2xl font-bold text-primary mb-4">Join the Content Journey! 🚀</h2>
            <p className="text-foreground mb-6">
              Be part of the NS GAMMING family! Subscribe, follow, and let's grow together. Your support means everything to me!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/social" className="neon-btn">
                <Video className="w-4 h-4 mr-2" />
                Follow All Platforms
              </Link>
              <Link href="/contact" className="neon-btn">
                <Mic className="w-4 h-4 mr-2" />
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
