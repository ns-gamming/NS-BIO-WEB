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
        image={_1000016408}
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
            {/* Avatar with Enhanced Effects */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
              <div 
                className="relative w-32 h-32 rounded-full border-4 border-primary overflow-hidden animate-pulse-neon cursor-pointer backdrop-blur-sm hover:scale-110 hover:rotate-6 transition-all duration-500 group"
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
                {/* Rotating ring effect */}
                <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
              </div>
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

        {/* Unified Tools Access Section - Ultra Enhanced */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-3xl sm:text-4xl font-orbitron font-bold mb-10 text-center bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
            🛠️ Free Tools & Utilities Hub
          </h3>
          
          {/* Single Unified Card */}
          <Link 
            href="/tools" 
            className="glass rounded-3xl p-8 sm:p-10 hover:scale-[1.02] transition-all duration-700 border-2 border-primary/30 hover:border-primary/60 hover:shadow-[0_0_60px_rgba(6,182,212,0.7)] group cursor-pointer relative overflow-hidden animate-bounceIn block"
            data-testid="tools-unified-card"
            style={{ animationDelay: '0.3s' }}
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-gradient-shift" />

            {/* Glowing Border Effect */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-neon" style={{ background: 'linear-gradient(45deg, transparent 30%, rgba(249,115,22,0.3) 40%, rgba(6,182,212,0.3) 60%, transparent 70%)', backgroundSize: '300% 300%' }} />

            {/* Enhanced Animated Particles */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute top-8 left-8 w-2.5 h-2.5 bg-orange-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.9)]"></div>
              <div className="absolute top-16 right-16 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.9)]" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.8)]" style={{ animationDelay: '0.4s' }}></div>
              <div className="absolute bottom-12 left-12 w-2 h-2 bg-pink-400 rounded-full animate-bounce shadow-[0_0_12px_rgba(236,72,153,0.8)]" style={{ animationDelay: '0.6s' }}></div>
              <div className="absolute bottom-16 right-20 w-2 h-2 bg-blue-400 rounded-full animate-bounce shadow-[0_0_12px_rgba(59,130,246,0.8)]" style={{ animationDelay: '0.8s' }}></div>
              <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>

            <div className="relative z-10">
              {/* Header Section */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="flex gap-4 mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:shadow-[0_0_30px_rgba(249,115,22,0.8)]">
                    <i className="fas fa-fire text-3xl sm:text-4xl text-white animate-pulse"></i>
                  </div>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:rotate-[-12deg] group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:shadow-[0_0_30px_rgba(6,182,212,0.8)]">
                    <i className="fas fa-tools text-3xl sm:text-4xl text-white animate-pulse"></i>
                  </div>
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-foreground group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:via-primary group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 mb-3">
                  Complete Tools & Utilities Suite
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground group-hover:text-primary/80 transition-colors max-w-3xl">
                  Everything you need in one place - Free Fire gaming tools, productivity utilities, and advanced features!
                </p>
              </div>

              {/* Two Column Feature Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Free Fire Tools Column */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 group-hover:border-orange-500/50 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <i className="fas fa-gamepad text-2xl text-orange-500"></i>
                    <h5 className="text-lg font-bold text-orange-600 dark:text-orange-400">Free Fire Tools</h5>
                  </div>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-orange-500 text-xs"></i>
                      <span>Stylish Name Generator (16+ fonts)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-orange-500 text-xs"></i>
                      <span>UID Generator with Rating System</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-orange-500 text-xs"></i>
                      <span>Advanced Sensitivity (Max 200 DPI)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-orange-500 text-xs"></i>
                      <span>Weapon Stats & Drop Simulator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-orange-500 text-xs"></i>
                      <span>Secure Password Generator</span>
                    </li>
                  </ul>
                </div>

                {/* Productivity Tools Column */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 group-hover:border-cyan-500/50 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <i className="fas fa-wrench text-2xl text-cyan-500"></i>
                    <h5 className="text-lg font-bold text-cyan-600 dark:text-cyan-400">Productivity Utilities</h5>
                  </div>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-cyan-500 text-xs"></i>
                      <span>Advanced Image Compressor</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-cyan-500 text-xs"></i>
                      <span>Text-to-Speech Converter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-cyan-500 text-xs"></i>
                      <span>QR Code Generator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-cyan-500 text-xs"></i>
                      <span>Clipboard Manager</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check-circle text-cyan-500 text-xs"></i>
                      <span>Text Formatter & Nickname Gen</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature Tags - Updated */}
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                <span className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-full text-xs font-bold text-orange-700 dark:text-orange-300 transform group-hover:scale-110 transition-all duration-300 shadow-md">
                  Gaming Optimized
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-full text-xs font-bold text-cyan-700 dark:text-cyan-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.05s' }}>
                  Fast & Easy
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-full text-xs font-bold text-purple-700 dark:text-purple-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.1s' }}>
                  Free Forever
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-full text-xs font-bold text-green-700 dark:text-green-300 transform group-hover:scale-110 transition-all duration-300 shadow-md" style={{ transitionDelay: '0.15s' }}>
                  No Signup Required
                </span>
              </div>

              {/* CTA Footer */}
              <div className="flex items-center justify-center pt-6 border-t border-primary/20">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 via-primary to-purple-500 bg-clip-text text-transparent group-hover:scale-110 group-hover:translate-x-2 transition-all duration-300 flex items-center gap-3">
                  Explore All Tools 
                  <i className="fas fa-arrow-right animate-bounce"></i>
                </span>
              </div>
            </div>
          </Link>
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