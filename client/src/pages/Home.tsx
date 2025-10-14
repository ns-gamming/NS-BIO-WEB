import { Link } from "wouter";
import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Code, Video, Users, Zap } from "lucide-react";

import _1000016408 from "@assets/1000016408.jpg";

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection 
        title="NS GAMMING"
        subtitle="Hi, I'm Nishant (Naboraj Sarkar) — Creator • Developer • Gamer"
      >
        {/* Profile Card */}
        <div className="glass rounded-2xl p-8 max-w-4xl mx-auto mb-12 animate-float">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div 
              className="w-32 h-32 rounded-full border-4 border-primary overflow-hidden animate-pulse-neon cursor-pointer backdrop-blur-sm hover:scale-110 hover:rotate-6 transition-all duration-500 group"
              data-testid="profile-avatar"
              onClick={() => {
                alert("🎮 NS GAMMING - Nishant here! Thanks for clicking on my avatar! Keep exploring and let's build something amazing together! ❤️");
              }}
            >
              <img 
                src={_1000016408} 
                alt="NS GAMMING - Nishant Sarkar" 
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
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
        
        {/* FF Bots Promo - Eye-Catching Section */}
        <div className="glass rounded-2xl p-8 max-w-4xl mx-auto mb-12 border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 animate-pulse-neon hover:scale-105 transition-all duration-500">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white font-bold mb-4 animate-bounce">
              <Zap className="w-5 h-5 animate-spin" />
              <span>NEW! Free Fire Tools</span>
              <Zap className="w-5 h-5 animate-spin" />
            </div>
            <h3 className="text-3xl font-orbitron font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
              🔥 FF Bots Hub - Game Badlo Yaar! 
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Get free likes, boost stats, aur dominate karo battlefield mein! 💪 Sab kuch free hai boss! 🎮
            </p>
          </div>
          <Link 
            href="/ff-bots" 
            className="block w-full py-4 px-8 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold rounded-xl text-center text-xl shadow-lg hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] transition-all duration-300 hover:scale-105 animate-shimmer"
            data-testid="cta-ffbots"
          >
            <span className="flex items-center justify-center gap-3">
              <i className="fas fa-fire animate-pulse"></i>
              Explore FF Bots Ab!
              <i className="fas fa-arrow-right animate-bounce"></i>
            </span>
          </Link>
        </div>

        {/* Mini Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          <Link href="/coding" className="glass rounded-lg p-6 text-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 animate-pulse-neon cursor-pointer group" data-testid="highlight-coding">
            <Code className="w-8 h-8 text-primary mb-3 mx-auto group-hover:animate-spin transition-all duration-300" />
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Coding</h3>
            <p className="text-sm text-muted-foreground">Building the future, one line at a time</p>
          </Link>
          <Link href="/content" className="glass rounded-lg p-6 text-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 animate-pulse-neon cursor-pointer group" data-testid="highlight-content">
            <Video className="w-8 h-8 text-primary mb-3 mx-auto group-hover:animate-pulse transition-all duration-300" />
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Content</h3>
            <p className="text-sm text-muted-foreground">Sharing knowledge with love</p>
          </Link>
          <Link href="/community" className="glass rounded-lg p-6 text-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 animate-pulse-neon cursor-pointer group" data-testid="highlight-community">
            <Users className="w-8 h-8 text-primary mb-3 mx-auto group-hover:animate-bounce transition-all duration-300" />
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Community</h3>
            <p className="text-sm text-muted-foreground">Growing a family of creators</p>
          </Link>
          <Link href="/gaming" className="glass rounded-lg p-6 text-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 animate-pulse-neon cursor-pointer group" data-testid="highlight-gaming">
            <Zap className="w-8 h-8 text-primary mb-3 mx-auto group-hover:animate-pulse transition-all duration-300" />
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Gaming</h3>
            <p className="text-sm text-muted-foreground">Life balance with passion</p>
          </Link>
        </div>
        
        {/* Tools Access Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-3xl font-orbitron font-bold mb-8 text-center bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
            🛠️ Free Tools & Utilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FF Tools Card */}
            <Link 
              href="/tools" 
              className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-500 border-2 border-orange-500/30 hover:border-orange-500/60 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] group cursor-pointer"
              data-testid="tools-ff-card"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500">
                  <i className="fas fa-fire text-3xl text-white"></i>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-foreground group-hover:text-orange-500 transition-colors">
                    Free Fire Tools
                  </h4>
                  <p className="text-sm text-muted-foreground">Gaming utilities</p>
                </div>
              </div>
              <p className="text-foreground mb-4">
                Name Generator, UID Generator, Sensitivity Settings, and more FF tools to level up your game!
              </p>
              <div className="flex items-center text-orange-500 font-semibold group-hover:translate-x-2 transition-transform">
                Explore FF Tools <i className="fas fa-arrow-right ml-2"></i>
              </div>
            </Link>

            {/* Utility Tools Card */}
            <Link 
              href="/utility-tools" 
              className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-500 border-2 border-primary/30 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] group cursor-pointer"
              data-testid="tools-utility-card"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500">
                  <i className="fas fa-tools text-3xl text-white"></i>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Utility Tools
                  </h4>
                  <p className="text-sm text-muted-foreground">Productivity boosters</p>
                </div>
              </div>
              <p className="text-foreground mb-4">
                Image Compressor, Text-to-Speech, QR Generator, Clipboard Saver - everything you need!
              </p>
              <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                Explore Utilities <i className="fas fa-arrow-right ml-2"></i>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Featured YouTube */}
        <div className="glass rounded-2xl p-8 max-w-2xl mx-auto mb-12 hover:scale-105 transition-all duration-300" data-testid="featured-youtube">
          <h3 className="text-2xl font-bold mb-4 text-center text-primary animate-glow">🎥 Latest from NS GAMMING</h3>
          <div className="bg-muted rounded-lg p-8 text-center hover:bg-muted/80 transition-all duration-300 group">
            <div className="w-full h-48 bg-gradient-to-br from-red-500/20 to-primary/20 rounded-lg mb-4 flex items-center justify-center backdrop-blur-sm border-2 border-red-500/30 group-hover:border-red-500/60 transition-all duration-300">
              <div className="text-center">
                <i className="fab fa-youtube text-6xl text-red-500 mb-2 group-hover:animate-bounce"></i>
                <p className="text-red-500 font-bold">NS GAMMING</p>
              </div>
            </div>
            <p className="text-foreground mb-4 group-hover:text-primary transition-colors">New videos every week — join the ride!</p>
            <a 
              href="https://youtube.com/@Nishant_sarkar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="neon-btn hover:scale-110 transition-all duration-300"
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
