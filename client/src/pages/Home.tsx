import { Link } from "wouter";
import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Code, Video, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection 
        title="NS GAMING"
        subtitle="Hi, I'm Nishant (Naboraj Sarkar) — Creator • Developer • Gamer"
      >
        {/* Profile Card */}
        <div className="glass rounded-2xl p-8 max-w-4xl mx-auto mb-12 animate-float">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div 
              className="w-32 h-32 rounded-full border-4 border-primary overflow-hidden animate-pulse-neon cursor-pointer"
              data-testid="profile-avatar"
            >
              <img 
                src="/attached_assets/IMG_20250712_204022_796_1757405803893.jpg" 
                alt="NS GAMING - Nishant Sarkar" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Intro Text */}
            <div className="text-left md:text-left flex-1">
              <h2 className="text-2xl font-bold mb-4 text-primary" data-testid="profile-title">
                Building My Empire 🚀
              </h2>
              <p className="text-lg text-foreground leading-relaxed mb-4" data-testid="profile-description">
                I build, learn, and create to build my empire and change the future. From late-night coding sessions to gameplay highlights, har line mera dil se likha gaya hai. 
                <span className="text-primary"> Let's grow together! ❤️</span>
              </p>
              <p className="text-sm text-muted-foreground" data-testid="profile-location">
                <i className="fas fa-map-marker-alt text-primary mr-2"></i>
                Siliguri, West Bengal, India • Born Aug 19th
              </p>
            </div>
          </div>
          
          {/* Primary CTAs */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/about" className="neon-btn" data-testid="cta-about">
              <i className="fas fa-user mr-2"></i>About Me
            </Link>
            <Link href="/portfolio" className="neon-btn" data-testid="cta-portfolio">
              <i className="fas fa-code mr-2"></i>Portfolio
            </Link>
            <Link href="/games" className="neon-btn" data-testid="cta-games">
              <i className="fas fa-gamepad mr-2"></i>Games
            </Link>
          </div>
        </div>
        
        {/* Mini Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          <div className="glass rounded-lg p-6 text-center hover:scale-105 transition-transform" data-testid="highlight-coding">
            <Code className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold text-foreground">Coding</h3>
            <p className="text-sm text-muted-foreground">Building the future, one line at a time</p>
          </div>
          <div className="glass rounded-lg p-6 text-center hover:scale-105 transition-transform" data-testid="highlight-content">
            <Video className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold text-foreground">Content</h3>
            <p className="text-sm text-muted-foreground">Sharing knowledge with love</p>
          </div>
          <div className="glass rounded-lg p-6 text-center hover:scale-105 transition-transform" data-testid="highlight-community">
            <Users className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold text-foreground">Community</h3>
            <p className="text-sm text-muted-foreground">Growing a family of creators</p>
          </div>
          <div className="glass rounded-lg p-6 text-center hover:scale-105 transition-transform" data-testid="highlight-football">
            <Zap className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold text-foreground">Football</h3>
            <p className="text-sm text-muted-foreground">Life balance with passion</p>
          </div>
        </div>
        
        {/* Featured YouTube */}
        <div className="glass rounded-2xl p-8 max-w-2xl mx-auto mb-12" data-testid="featured-youtube">
          <h3 className="text-2xl font-bold mb-4 text-center text-primary">🎥 Latest from NS GAMING</h3>
          <div className="bg-muted rounded-lg p-8 text-center">
            <img 
              src="/attached_assets/IMG_20250712_204022_796_1757405803893.jpg" 
              alt="NS GAMING - Latest Content" 
              className="w-full h-48 object-cover rounded-lg mb-4" 
            />
            <p className="text-foreground mb-4">New videos every week — join the ride!</p>
            <a 
              href="https://youtube.com/@Nishant_sarkar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="neon-btn"
              data-testid="youtube-watch-now"
            >
              <i className="fab fa-youtube mr-2"></i>Watch Now
            </a>
          </div>
        </div>
      </HeroSection>
      
      {/* AdSense Ad */}
      <AdSenseAd />
      
      {/* Footer CTA */}
      <div className="glass border-t border-border py-8 text-center" data-testid="footer-cta">
        <p className="text-muted-foreground mb-4">
          Want a site like this? <span className="text-primary">Chat with me →</span>
        </p>
        <a 
          href="https://wa.me/918900653250" 
          target="_blank" 
          rel="noopener noreferrer"
          className="neon-btn"
          data-testid="commission-cta"
        >
          <i className="fab fa-whatsapp mr-2"></i>Commission Work
        </a>
      </div>
    </div>
  );
}
