
import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Link } from "wouter";
import { Gamepad2, Trophy, Target, Zap, Users, Star, Sparkles, Crown, Flame, Shield } from "lucide-react";

export default function Gaming() {
  const favoriteGames = [
    {
      name: "Free Fire",
      genre: "Battle Royale",
      description: "My main game! Squad up and let's dominate the battlefield together!",
      icon: "🔥",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      shadowColor: "shadow-orange-500/50"
    },
    {
      name: "FARLIGHT84",
      genre: "Battle Royale", 
      description: "Modern BR gameplay with intense strategy and teamwork.",
      icon: "🎯",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      shadowColor: "shadow-blue-500/50"
    },
    {
      name: "Minecraft",
      genre: "Sandbox/Survival",
      description: "Building, crafting, and surviving in endless blocky worlds! Creativity has no limits!",
      icon: "⛏️",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      shadowColor: "shadow-green-500/50"
    },
    {
      name: "Among Us",
      genre: "Social Deduction",
      description: "Trust no one! Perfect for community game nights.",
      icon: "👥",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      shadowColor: "shadow-purple-500/50"
    }
  ];

  const achievements = [
    {
      title: "Tournament Winner",
      description: "Multiple local tournament victories",
      icon: Trophy,
      color: "text-yellow-500",
      bgGradient: "from-yellow-500/20 to-orange-500/20",
      glowColor: "shadow-yellow-500/30"
    },
    {
      title: "Content Creator",
      description: "Growing gaming content on multiple platforms",
      icon: Star,
      color: "text-pink-500",
      bgGradient: "from-pink-500/20 to-purple-500/20",
      glowColor: "shadow-pink-500/30"
    },
    {
      title: "Community Leader",
      description: "Building and leading gaming communities",
      icon: Users,
      color: "text-green-500",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      glowColor: "shadow-green-500/30"
    },
    {
      title: "Skill Development",
      description: "Constantly improving and learning new strategies",
      icon: Target,
      color: "text-blue-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      glowColor: "shadow-blue-500/30"
    }
  ];

  return (
    <div className="pt-16 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-green-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <HeroSection 
        title="🎮 Gaming Life"
        subtitle="Life balance with passion — gaming isn't just a hobby, it's a lifestyle!"
      />
      
      <div className="container mx-auto px-6 pb-20 relative">
        <div className="max-w-6xl mx-auto">
          {/* Gaming Philosophy - Enhanced */}
          <div className="glass rounded-2xl p-8 mb-12 text-center relative group overflow-hidden animate-fadeUp" data-testid="gaming-philosophy">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-primary animate-spin-slow" />
                <h2 className="text-3xl sm:text-4xl font-bold text-primary animate-textShine">Gaming: More Than Just Playing 🏆</h2>
                <Sparkles className="w-8 h-8 text-primary animate-spin-slow" style={{ animationDirection: 'reverse' }} />
              </div>
              
              <p className="text-lg text-foreground leading-relaxed max-w-4xl mx-auto mb-6 animate-slideLeft" style={{ animationDelay: '0.2s' }}>
                Gaming teaches me strategy, teamwork, quick thinking, and resilience. Every game is a lesson, every match is growth, 
                and every victory is shared with the community. Gaming isn't an escape from life — it's preparation for life's challenges!
              </p>
              
              <div className="inline-block relative group/quote">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl group-hover/quote:blur-2xl transition-all duration-500"></div>
                <p className="text-xl sm:text-2xl text-primary font-semibold relative px-6 py-3 animate-bounceIn" style={{ animationDelay: '0.4s' }}>
                  <Crown className="inline w-6 h-6 mr-2 animate-bounce" />
                  "In gaming, as in life, it's not about being the best — it's about getting better!" 🎯
                  <Crown className="inline w-6 h-6 ml-2 animate-bounce" style={{ animationDelay: '0.2s' }} />
                </p>
              </div>
            </div>
          </div>

          {/* Favorite Games - Ultra Enhanced */}
          <div className="grid md:grid-cols-2 gap-8 mb-12" data-testid="favorite-games">
            {favoriteGames.map((game, index) => (
              <div 
                key={game.name}
                className={`glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 animate-float cursor-pointer group relative overflow-hidden ${game.shadowColor} hover:shadow-2xl`}
                style={{ animationDelay: `${index * 0.15}s` }}
                data-testid={`game-${game.name.toLowerCase().replace(' ', '-')}`}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${game.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
                
                {/* Corner decorations */}
                <div className={`absolute top-0 right-0 w-20 h-20 ${game.color} opacity-10 rounded-bl-full group-hover:scale-150 transition-transform duration-500`}></div>
                <div className={`absolute bottom-0 left-0 w-20 h-20 ${game.color} opacity-10 rounded-tr-full group-hover:scale-150 transition-transform duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className={`absolute inset-0 ${game.bgColor} rounded-full blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
                      <div className="relative text-5xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-bounce" style={{ animationDelay: `${index * 0.1}s` }}>
                        {game.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-xl sm:text-2xl font-bold text-foreground group-hover:${game.color} transition-colors duration-300`}>
                        {game.name}
                      </h3>
                      <span className={`text-sm font-medium ${game.color} flex items-center gap-2`}>
                        <Flame className="w-4 h-4 animate-pulse" />
                        {game.genre}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {game.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Gaming Achievements - Ultra Enhanced */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" data-testid="gaming-achievements">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div 
                  key={achievement.title}
                  className={`glass rounded-2xl p-6 text-center hover:scale-110 transition-all duration-500 animate-float cursor-pointer group relative overflow-hidden ${achievement.glowColor} hover:shadow-2xl`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  data-testid={`achievement-${achievement.title.toLowerCase().replace(' ', '-')}`}
                >
                  {/* Animated gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${achievement.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Rotating glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full ${achievement.color} opacity-20 rounded-full blur-2xl animate-rotateGlow`}></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="relative inline-block mb-3">
                      <div className={`absolute inset-0 ${achievement.color} opacity-30 rounded-full blur-xl group-hover:blur-2xl group-hover:scale-150 transition-all duration-500`}></div>
                      <IconComponent className={`w-12 h-12 ${achievement.color} mx-auto relative group-hover:rotate-360 transition-transform duration-700 animate-bounce`} style={{ animationDelay: `${index * 0.1}s` }} />
                    </div>
                    <h3 className="font-bold text-foreground mb-2 group-hover:scale-110 transition-transform duration-300">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">{achievement.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gaming Setup - Enhanced */}
          <div className="glass rounded-2xl p-8 mb-12 relative group overflow-hidden animate-fadeUp" data-testid="gaming-setup" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Zap className="w-8 h-8 text-primary animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center animate-textShine">My Gaming Setup</h2>
                <Zap className="w-8 h-8 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-muted/50 rounded-lg p-6 text-center group/card hover:bg-muted transition-all duration-500 hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-3 animate-bounce group-hover/card:scale-125 transition-transform duration-500">📱</div>
                    <h3 className="font-bold text-foreground mb-2 group-hover/card:text-primary transition-colors duration-300">Mobile Gaming</h3>
                    <p className="text-muted-foreground text-sm mb-3 group-hover/card:text-foreground transition-colors duration-300">High-performance smartphone with gaming accessories</p>
                    <div className="text-primary font-medium flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4 animate-pulse" />
                      Primary Platform
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-6 text-center group/card hover:bg-muted transition-all duration-500 hover:scale-105 relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-3 animate-bounce group-hover/card:scale-125 transition-transform duration-500" style={{ animationDelay: '0.2s' }}>💻</div>
                    <h3 className="font-bold text-foreground mb-2 group-hover/card:text-blue-500 transition-colors duration-300">PC Gaming</h3>
                    <p className="text-muted-foreground text-sm mb-3 group-hover/card:text-foreground transition-colors duration-300">Custom build for streaming and competitive gaming</p>
                    <div className="text-primary font-medium flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 animate-spin-slow" />
                      Content Creation
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-6 text-center group/card hover:bg-muted transition-all duration-500 hover:scale-105 relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-3 animate-bounce group-hover/card:scale-125 transition-transform duration-500" style={{ animationDelay: '0.4s' }}>🎧</div>
                    <h3 className="font-bold text-foreground mb-2 group-hover/card:text-purple-500 transition-colors duration-300">Accessories</h3>
                    <p className="text-muted-foreground text-sm mb-3 group-hover/card:text-foreground transition-colors duration-300">Professional gaming headset, keyboard, and mouse</p>
                    <div className="text-primary font-medium flex items-center justify-center gap-2">
                      <Trophy className="w-4 h-4 animate-wiggle" />
                      Pro Gear
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gaming Schedule - Enhanced */}
          <div className="glass rounded-2xl p-8 mb-12 relative group overflow-hidden animate-fadeUp" data-testid="gaming-schedule" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 text-center animate-textShine flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 animate-spin-slow" />
                🕒 Gaming Schedule
                <Sparkles className="w-6 h-6 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 rounded-lg p-6 group/schedule hover:bg-muted/50 transition-all duration-500 hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover/schedule:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <h3 className="font-bold text-foreground mb-3 flex items-center gap-2 group-hover/schedule:text-red-500 transition-colors duration-300">
                      <Flame className="w-5 h-5 animate-pulse" />
                      🔴 Live Streams:
                    </h3>
                    <ul className="text-muted-foreground space-y-2 group-hover/schedule:text-foreground transition-colors duration-300">
                      <li className="flex items-center gap-2 animate-slideLeft" style={{ animationDelay: '0.1s' }}>
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        Friday Nights: Free Fire Squad Games
                      </li>
                      <li className="flex items-center gap-2 animate-slideLeft" style={{ animationDelay: '0.2s' }}>
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                        Saturday Evenings: Variety Gaming
                      </li>
                      <li className="flex items-center gap-2 animate-slideLeft" style={{ animationDelay: '0.3s' }}>
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></span>
                        Sunday Afternoons: Community Matches
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-6 group/schedule hover:bg-muted/50 transition-all duration-500 hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover/schedule:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <h3 className="font-bold text-foreground mb-3 flex items-center gap-2 group-hover/schedule:text-purple-500 transition-colors duration-300">
                      <Star className="w-5 h-5 animate-spin-slow" />
                      🎥 Content Creation:
                    </h3>
                    <ul className="text-muted-foreground space-y-2 group-hover/schedule:text-foreground transition-colors duration-300">
                      <li className="flex items-center gap-2 animate-slideRight" style={{ animationDelay: '0.1s' }}>
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        Daily: Short gaming clips
                      </li>
                      <li className="flex items-center gap-2 animate-slideRight" style={{ animationDelay: '0.2s' }}>
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                        Weekly: Gameplay highlights
                      </li>
                      <li className="flex items-center gap-2 animate-slideRight" style={{ animationDelay: '0.3s' }}>
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></span>
                        Monthly: Gaming tutorials & tips
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Community Gaming - Enhanced */}
          <div className="glass rounded-2xl p-8 mb-12 relative group overflow-hidden animate-fadeUp" data-testid="community-gaming" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 text-center animate-textShine flex items-center justify-center gap-3">
                <Users className="w-8 h-8 animate-bounce" />
                👥 Community Gaming
                <Users className="w-8 h-8 animate-bounce" style={{ animationDelay: '0.5s' }} />
              </h2>
              
              <div className="text-center">
                <p className="text-foreground mb-6 text-lg animate-slideLeft" style={{ animationDelay: '0.2s' }}>
                  Want to game together? Join our Discord server and let's squad up! We have regular community tournaments, 
                  casual gaming sessions, and always looking for new teammates.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a 
                    href="https://discord.gg/eRnfcBuv5v" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="neon-btn group/btn animate-bounceIn hover:scale-110 transition-all duration-300"
                    style={{ animationDelay: '0.3s' }}
                  >
                    <Users className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                    Join Discord
                  </a>
                  <Link href="/games" className="neon-btn group/btn animate-bounceIn hover:scale-110 transition-all duration-300" style={{ animationDelay: '0.4s' }}>
                    <Gamepad2 className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                    Play Browser Games
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action - Ultra Enhanced */}
          <div className="glass rounded-2xl p-8 text-center relative group overflow-hidden animate-fadeUp" data-testid="gaming-cta" style={{ animationDelay: '0.5s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-20 h-20 bg-primary/30 rounded-full blur-2xl animate-float"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 animate-textShine flex items-center justify-center gap-3">
                <Trophy className="w-8 h-8 animate-bounce" />
                Ready to Level Up Together? 🚀
                <Trophy className="w-8 h-8 animate-bounce" style={{ animationDelay: '0.5s' }} />
              </h2>
              
              <p className="text-foreground mb-6 text-lg max-w-3xl mx-auto animate-slideLeft" style={{ animationDelay: '0.2s' }}>
                Gaming is better with friends! Whether you're a beginner or a pro, there's always room for one more in our squad. 
                Let's create epic moments and unforgettable memories together!
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/social" className="neon-btn group/btn animate-bounceIn hover:scale-110 transition-all duration-300" style={{ animationDelay: '0.3s' }}>
                  <Zap className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300 animate-pulse" />
                  Follow for Updates
                </Link>
                <Link href="/contact" className="neon-btn group/btn animate-bounceIn hover:scale-110 transition-all duration-300" style={{ animationDelay: '0.4s' }}>
                  <Trophy className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300 animate-wiggle" />
                  Challenge Me
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
