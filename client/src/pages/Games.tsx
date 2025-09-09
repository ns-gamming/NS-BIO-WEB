import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Link } from "wouter";
import { Gamepad2, Grid3X3, Cpu, Brain, Bird, Hand, Plus } from "lucide-react";

export default function Games() {
  return (
    <div className="pt-16">
      <HeroSection 
        title="Play & Chill"
        subtitle="Games by NS GAMMING — Made with love ❤️"
      />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="games-grid">
            {/* Tic Tac Toe */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform" data-testid="game-tictactoe">
              <div className="text-center mb-4">
                <Grid3X3 className="w-12 h-12 text-primary mb-3 mx-auto" />
                <h3 className="text-xl font-bold text-foreground">Tic Tac Toe</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Classic strategy game — simple but addictive! Challenge yourself or play with friends.
              </p>
              <Link href="/games/tictactoe" className="neon-btn w-full" data-testid="play-tictactoe">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </Link>
            </div>
            
            {/* Snake Game */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform" data-testid="game-snake">
              <div className="text-center mb-4">
                <Cpu className="w-12 h-12 text-primary mb-3 mx-auto" />
                <h3 className="text-xl font-bold text-foreground">Snake Game</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Nostalgic gameplay with modern neon style! How long can your snake grow?
              </p>
              <Link href="/games/snake" className="neon-btn w-full" data-testid="play-snake">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </Link>
            </div>
            
            {/* Memory Match */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform" data-testid="game-memory">
              <div className="text-center mb-4">
                <Brain className="w-12 h-12 text-primary mb-3 mx-auto" />
                <h3 className="text-xl font-bold text-foreground">Memory Match</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Test your memory skills! Match pairs and challenge your brain power.
              </p>
              <Link href="/games/memory" className="neon-btn w-full" data-testid="play-memory">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </Link>
            </div>
            
            {/* Flappy Clone */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform" data-testid="game-flappy">
              <div className="text-center mb-4">
                <Bird className="w-12 h-12 text-primary mb-3 mx-auto" />
                <h3 className="text-xl font-bold text-foreground">Flappy Clone</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Navigate through obstacles! Simple controls, endless fun.
              </p>
              <Link href="/games/flappy" className="neon-btn w-full" data-testid="play-flappy">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </Link>
            </div>
            
            {/* Rock Paper Scissors */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform" data-testid="game-rps">
              <div className="text-center mb-4">
                <Hand className="w-12 h-12 text-primary mb-3 mx-auto" />
                <h3 className="text-xl font-bold text-foreground">Rock Paper Scissors</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Classic hand game against AI! Can you outsmart the computer?
              </p>
              <Link href="/games/rps" className="neon-btn w-full" data-testid="play-rps">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </Link>
            </div>
            
            {/* More Games Coming */}
            <div className="glass rounded-2xl p-6 opacity-75" data-testid="game-coming-soon">
              <div className="text-center mb-4">
                <Plus className="w-12 h-12 text-muted-foreground mb-3 mx-auto" />
                <h3 className="text-xl font-bold text-muted-foreground">More Coming Soon</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                I'm always creating new games! Stay tuned for more fun experiences.
              </p>
              <button disabled className="neon-btn w-full opacity-50 cursor-not-allowed">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Coming Soon
              </button>
            </div>
          </div>
          
          {/* Gaming Philosophy */}
          <div className="glass rounded-2xl p-8 mt-12 text-center" data-testid="gaming-philosophy">
            <h2 className="text-2xl font-bold text-primary mb-4">Why I Build Games 🎮</h2>
            <p className="text-lg text-foreground max-w-3xl mx-auto leading-relaxed">
              Games bring people together! Every game I create is designed to spread joy and provide a moment of fun in your day. 
              Whether it's a quick break from work or a challenge with friends, I believe gaming can make the world a happier place. 
              <span className="text-primary">Keep playing, keep smiling! ❤️</span>
            </p>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
