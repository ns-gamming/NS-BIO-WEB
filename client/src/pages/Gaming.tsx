
import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Link } from "wouter";
import { Gamepad2, Trophy, Target, Zap, Users, Star } from "lucide-react";

export default function Gaming() {
  const favoriteGames = [
    {
      name: "Free Fire",
      genre: "Battle Royale",
      description: "My main game! Squad up and let's dominate the battlefield together!",
      icon: "🔥",
      color: "text-orange-500"
    },
    {
      name: "FARLIGHT84",
      genre: "Battle Royale", 
      description: "Mordern BR gameplay with intense strategy and teamwork.",
      icon: "🎯",
      color: "text-blue-500"
    },
    {
      name: "Valorant",
      genre: "Tactical Shooter",
      description: "Precision, strategy, and clutch moments — the perfect combination!",
      icon: "⚡",
      color: "text-red-500"
    },
    {
      name: "Among Us",
      genre: "Social Deduction",
      description: "Trust no one! Perfect for community game nights.",
      icon: "👥",
      color: "text-purple-500"
    }
  ];

  const achievements = [
    {
      title: "Tournament Winner",
      description: "Multiple local tournament victories",
      icon: Trophy,
      color: "text-yellow-500"
    },
    {
      title: "Content Creator",
      description: "Growing gaming content on multiple platforms",
      icon: Star,
      color: "text-pink-500"
    },
    {
      title: "Community Leader",
      description: "Building and leading gaming communities",
      icon: Users,
      color: "text-green-500"
    },
    {
      title: "Skill Development",
      description: "Constantly improving and learning new strategies",
      icon: Target,
      color: "text-blue-500"
    }
  ];

  return (
    <div className="pt-16">
      <HeroSection 
        title="🎮 Gaming Life"
        subtitle="Life balance with passion — gaming isn't just a hobby, it's a lifestyle!"
      />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Gaming Philosophy */}
          <div className="glass rounded-2xl p-8 mb-12 text-center" data-testid="gaming-philosophy">
            <h2 className="text-3xl font-bold text-primary mb-6">Gaming: More Than Just Playing 🏆</h2>
            <p className="text-lg text-foreground leading-relaxed max-w-4xl mx-auto mb-6">
              Gaming teaches me strategy, teamwork, quick thinking, and resilience. Every game is a lesson, every match is growth, 
              and every victory is shared with the community. Gaming isn't an escape from life — it's preparation for life's challenges!
            </p>
            <p className="text-xl text-primary font-semibold">
              "In gaming, as in life, it's not about being the best — it's about getting better!" 🎯
            </p>
          </div>

          {/* Favorite Games */}
          <div className="grid md:grid-cols-2 gap-8 mb-12" data-testid="favorite-games">
            {favoriteGames.map((game, index) => (
              <div 
                key={game.name}
                className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-float"
                style={{ animationDelay: `${index * 0.15}s` }}
                data-testid={`game-${game.name.toLowerCase().replace(' ', '-')}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{game.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{game.name}</h3>
                    <span className={`text-sm font-medium ${game.color}`}>{game.genre}</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{game.description}</p>
              </div>
            ))}
          </div>

          {/* Gaming Achievements */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" data-testid="gaming-achievements">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div 
                  key={achievement.title}
                  className="glass rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 animate-float"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  data-testid={`achievement-${achievement.title.toLowerCase().replace(' ', '-')}`}
                >
                  <IconComponent className={`w-12 h-12 ${achievement.color} mx-auto mb-3`} />
                  <h3 className="font-bold text-foreground mb-2">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              );
            })}
          </div>

          {/* Gaming Setup */}
          <div className="glass rounded-2xl p-8 mb-12" data-testid="gaming-setup">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">⚡ My Gaming Setup</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-muted rounded-lg p-6 text-center">
                <h3 className="font-bold text-foreground mb-2">Mobile Gaming</h3>
                <p className="text-muted-foreground text-sm mb-3">High-performance smartphone with gaming accessories</p>
                <div className="text-primary font-medium">📱 Primary Platform</div>
              </div>
              <div className="bg-muted rounded-lg p-6 text-center">
                <h3 className="font-bold text-foreground mb-2">PC Gaming</h3>
                <p className="text-muted-foreground text-sm mb-3">Custom build for streaming and competitive gaming</p>
                <div className="text-primary font-medium">💻 Content Creation</div>
              </div>
              <div className="bg-muted rounded-lg p-6 text-center">
                <h3 className="font-bold text-foreground mb-2">Accessories</h3>
                <p className="text-muted-foreground text-sm mb-3">Professional gaming headset, keyboard, and mouse</p>
                <div className="text-primary font-medium">🎧 Pro Gear</div>
              </div>
            </div>
          </div>

          {/* Gaming Schedule */}
          <div className="glass rounded-2xl p-8 mb-12" data-testid="gaming-schedule">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">🕒 Gaming Schedule</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-foreground mb-3">🔴 Live Streams:</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Friday Nights: Free Fire Squad Games</li>
                  <li>• Saturday Evenings: Variety Gaming</li>
                  <li>• Sunday Afternoons: Community Matches</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-3">🎥 Content Creation:</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Daily: Short gaming clips</li>
                  <li>• Weekly: Gameplay highlights</li>
                  <li>• Monthly: Gaming tutorials & tips</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Community Gaming */}
          <div className="glass rounded-2xl p-8 mb-12" data-testid="community-gaming">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">👥 Community Gaming</h2>
            <div className="text-center">
              <p className="text-foreground mb-4">
                Want to game together? Join our Discord server and let's squad up! We have regular community tournaments, 
                casual gaming sessions, and always looking for new teammates.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="https://discord.gg/eRnfcBuv5v" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="neon-btn"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Discord
                </a>
                <Link href="/games" className="neon-btn">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Play Browser Games
                </Link>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="glass rounded-2xl p-8 text-center" data-testid="gaming-cta">
            <h2 className="text-2xl font-bold text-primary mb-4">Ready to Level Up Together? 🚀</h2>
            <p className="text-foreground mb-6">
              Gaming is better with friends! Whether you're a beginner or a pro, there's always room for one more in our squad. 
              Let's create epic moments and unforgettable memories together!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/social" className="neon-btn">
                <Zap className="w-4 h-4 mr-2" />
                Follow for Updates
              </Link>
              <Link href="/contact" className="neon-btn">
                <Trophy className="w-4 h-4 mr-2" />
                Challenge Me
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
