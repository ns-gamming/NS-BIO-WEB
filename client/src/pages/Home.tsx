import { Link } from "wouter";
import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { SEO } from "../components/SEO";
import { Code, Video, Users, Zap } from "lucide-react";

import _1000016408 from "@assets/1000016408.jpg";

export default function Home() {
  return (
    <>
      <SEO 
        title="NS GAMMING - Naboraj Sarkar (Nishant) | Free Fire Tools, Gaming & Coding"
        description="Welcome to NS GAMMING! I'm Naboraj Sarkar (Nishant), a developer and gamer creating free Free Fire tools, gaming utilities, coding projects, and content. Explore FF Bots Hub, games, blogs, and more!"
        keywords="NS GAMMING, Naboraj Sarkar, Nishant Sarkar, NishantB, Naboraj, Free Fire tools, FF Bots, Gaming utilities, Coding projects, YouTube gaming, Developer portfolio, Free Fire likes bot, Free Fire utilities, Gaming content creator, Web developer India"
        ogImage={_1000016408}
        canonicalUrl="/"
      />
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

        {/* Tools Access Section - Enhanced */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-3xl sm:text-4xl font-orbitron font-bold mb-10 text-center bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
            🛠️ Free Tools & Utilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* FF Tools Card - Enhanced */}
            <Link 
              href="/tools" 
              className="glass rounded-2xl p-6 sm:p-8 hover:scale-105 transition-all duration-500 border-2 border-orange-500/30 hover:border-orange-500/60 hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] group cursor-pointer relative overflow-hidden animate-bounceIn"
              data-testid="tools-ff-card"
              style={{ animationDelay: '0.3s' }}
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-shift" />

              {/* Glowing Border Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-neon" style={{ background: 'linear-gradient(45deg, transparent 40%, rgba(249,115,22,0.3) 50%, transparent 60%)', backgroundSize: '200% 200%' }} />

              {/* Animated Particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-5 left-5 w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                <div className="absolute top-10 right-10 w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute bottom-5 left-10 w-1.5 h-1.5 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
                <div className="absolute bottom-10 right-5 w-1.5 h-1.5 bg-red-300 rounded-full animate-bounce" style={{ animationDelay: '0.9s' }}></div>
              </div>

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-[0_0_20px_rgba(249,115,22,0.6)]">
                    <i className="fas fa-fire text-2xl sm:text-3xl text-white animate-pulse"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-orange-500 transition-colors mb-1">
                      Free Fire Tools
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-orange-400 transition-colors">Advanced gaming utilities</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-foreground mb-4 group-hover:text-orange-50 dark:group-hover:text-orange-100 transition-colors leading-relaxed">
                  Stylish Name Generator, UID Creator, Advanced Sensitivity Settings (Max 200 with DPI), and Secure Password Generator!
                </p>
                
                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-full text-xs font-bold text-orange-700 dark:text-orange-300 transform group-hover:scale-110 transition-all duration-300">
                    Device Optimized
                  </span>
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/40 rounded-full text-xs font-bold text-red-700 dark:text-red-300 transform group-hover:scale-110 transition-all duration-300" style={{ transitionDelay: '0.05s' }}>
                    Max 200 Sens
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-orange-500/20">
                  <span className="text-base sm:text-lg font-bold text-orange-500 group-hover:translate-x-2 transition-transform">
                    Explore FF Tools →
                  </span>
                  <i className="fas fa-gamepad text-xl text-orange-500 animate-pulse"></i>
                </div>
              </div>
            </Link>

            {/* Utility Tools Card - Enhanced */}
            <Link 
              href="/utility-tools" 
              className="glass rounded-2xl p-6 sm:p-8 hover:scale-105 transition-all duration-500 border-2 border-primary/30 hover:border-primary/60 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] group cursor-pointer relative overflow-hidden animate-bounceIn"
              data-testid="tools-utility-card"
              style={{ animationDelay: '0.4s' }}
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-cyan-500/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-shift" />

              {/* Glowing Border Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-neon" style={{ background: 'linear-gradient(45deg, transparent 40%, rgba(6,182,212,0.3) 50%, transparent 60%)', backgroundSize: '200% 200%' }} />

              {/* Animated Particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-5 left-5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                <div className="absolute top-10 right-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.8)]" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute bottom-5 left-10 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
                <div className="absolute bottom-10 right-5 w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.9s' }}></div>
              </div>

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-cyan-600 rounded-xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                    <i className="fas fa-tools text-2xl sm:text-3xl text-white animate-pulse"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                      Productivity Tools
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-cyan-400 transition-colors">Essential utilities</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-foreground mb-4 group-hover:text-cyan-50 dark:group-hover:text-cyan-100 transition-colors leading-relaxed">
                  Image Compressor, Text-to-Speech Converter, QR Code Generator, and Clipboard Manager - all in one place!
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-full text-xs font-bold text-cyan-700 dark:text-cyan-300 transform group-hover:scale-110 transition-all duration-300">
                    Fast & Easy
                  </span>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/40 rounded-full text-xs font-bold text-blue-700 dark:text-blue-300 transform group-hover:scale-110 transition-all duration-300" style={{ transitionDelay: '0.05s' }}>
                    Free Forever
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-primary/20">
                  <span className="text-base sm:text-lg font-bold text-primary group-hover:translate-x-2 transition-transform">
                    Explore Utilities →
                  </span>
                  <i className="fas fa-wrench text-xl text-primary animate-pulse"></i>
                </div>
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
    </>
  );
}