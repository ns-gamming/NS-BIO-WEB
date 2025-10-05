import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Link } from "wouter";
import { Gamepad2, Grid3X3, Cpu, Brain, Bird, Hand, Lightbulb, Grid2X2, Hammer, Palette, Keyboard, Grid, Blocks, Circle } from "lucide-react";

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
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-xl hover:shadow-primary/50 cursor-pointer" data-testid="game-tictactoe">
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
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-xl hover:shadow-green-500/50 cursor-pointer" data-testid="game-snake">
              <div className="text-center mb-4">
                <Cpu className="w-12 h-12 text-primary mb-3 mx-auto group-hover:animate-spin transition-all duration-300" />
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
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-xl hover:shadow-purple-500/50 cursor-pointer" data-testid="game-memory">
              <div className="text-center mb-4">
                <Brain className="w-12 h-12 text-primary mb-3 mx-auto group-hover:animate-pulse transition-all duration-300" />
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
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-xl hover:shadow-yellow-500/50 cursor-pointer" data-testid="game-flappy">
              <div className="text-center mb-4">
                <Bird className="w-12 h-12 text-primary mb-3 mx-auto group-hover:animate-bounce transition-all duration-300" />
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
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-xl hover:shadow-red-500/50 cursor-pointer" data-testid="game-rps">
              <div className="text-center mb-4">
                <Hand className="w-12 h-12 text-primary mb-3 mx-auto group-hover:animate-bounce transition-all duration-300" />
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
            
            {/* Simon Says */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-xl hover:shadow-blue-500/50 cursor-pointer" data-testid="game-simon">
              <div className="text-center mb-4">
                <Lightbulb className="w-12 h-12 text-primary mb-3 mx-auto group-hover:animate-pulse transition-all duration-300" />
                <h3 className="text-xl font-bold text-foreground">Simon Says</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Memory challenge! Watch, remember, and repeat the pattern. How high can you score?
              </p>
              <Link href="/games/simon" className="neon-btn w-full" data-testid="play-simon">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </Link>
            </div>
            
            {/* 2048 */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-xl hover:shadow-orange-500/50 cursor-pointer" data-testid="game-2048">
              <div className="text-center mb-4">
                <Grid2X2 className="w-12 h-12 text-primary mb-3 mx-auto group-hover:rotate-45 transition-all duration-300" />
                <h3 className="text-xl font-bold text-foreground">2048</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Slide, merge, reach 2048! Strategic puzzle game that tests your planning skills.
              </p>
              <Link href="/games/2048" className="neon-btn w-full" data-testid="play-2048">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </Link>
            </div>
            
            {/* Whack-a-Mole */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-xl hover:shadow-amber-500/50 cursor-pointer" data-testid="game-whack">
              <div className="text-center mb-4">
                <Hammer className="w-12 h-12 text-primary mb-3 mx-auto group-hover:animate-bounce transition-all duration-300" />
                <h3 className="text-xl font-bold text-foreground">Whack-a-Mole</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Fast-paced clicking action! Test your reflexes and reaction time. Click fast!
              </p>
              <Link href="/games/whack" className="neon-btn w-full" data-testid="play-whack">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </Link>
            </div>
            
            {/* Pong */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-xl hover:shadow-cyan-500/50 cursor-pointer" data-testid="game-pong">
              <div className="text-center mb-4">
                <Circle className="w-12 h-12 text-primary mb-3 mx-auto group-hover:animate-ping transition-all duration-300" />
                <h3 className="text-xl font-bold text-foreground">Pong</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Classic arcade action! First to score 5 points wins against AI. Mobile-friendly!
              </p>
              <Link href="/games/pong" className="neon-btn w-full" data-testid="play-pong">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </Link>
            </div>
            
            {/* Color Match */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-xl hover:shadow-pink-500/50 cursor-pointer" data-testid="game-colormatch">
              <div className="text-center mb-4">
                <Palette className="w-12 h-12 text-primary mb-3 mx-auto group-hover:animate-spin transition-all duration-300" />
                <h3 className="text-xl font-bold text-foreground">Color Match</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Fast-paced reaction game! Match colors quickly and build your streak. Addictive!
              </p>
              <Link href="/games/colormatch" className="neon-btn w-full" data-testid="play-colormatch">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </Link>
            </div>
            
            {/* Typing Speed */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-xl hover:shadow-indigo-500/50 cursor-pointer" data-testid="game-typing">
              <div className="text-center mb-4">
                <Keyboard className="w-12 h-12 text-primary mb-3 mx-auto group-hover:animate-bounce transition-all duration-300" />
                <h3 className="text-xl font-bold text-foreground">Typing Speed Test</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Test your typing skills! See your WPM and accuracy. Practice makes perfect!
              </p>
              <Link href="/games/typing" className="neon-btn w-full" data-testid="play-typing">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </Link>
            </div>
            
            {/* Sliding Puzzle */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-xl hover:shadow-teal-500/50 cursor-pointer" data-testid="game-sliding">
              <div className="text-center mb-4">
                <Grid className="w-12 h-12 text-primary mb-3 mx-auto group-hover:rotate-12 transition-all duration-300" />
                <h3 className="text-xl font-bold text-foreground">Sliding Puzzle</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Arrange tiles in order! Classic puzzle game that tests your problem-solving.
              </p>
              <Link href="/games/sliding" className="neon-btn w-full" data-testid="play-sliding">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </Link>
            </div>
            
            {/* Breakout */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-xl hover:shadow-violet-500/50 cursor-pointer" data-testid="game-breakout">
              <div className="text-center mb-4">
                <Blocks className="w-12 h-12 text-primary mb-3 mx-auto group-hover:animate-pulse transition-all duration-300" />
                <h3 className="text-xl font-bold text-foreground">Breakout</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Break all the bricks! Classic arcade fun with smooth touch controls for mobile.
              </p>
              <Link href="/games/breakout" className="neon-btn w-full" data-testid="play-breakout">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </Link>
            </div>
            
            {/* Connect Four */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-xl hover:shadow-rose-500/50 cursor-pointer" data-testid="game-connect4">
              <div className="text-center mb-4">
                <Grid3X3 className="w-12 h-12 text-primary mb-3 mx-auto group-hover:rotate-180 transition-all duration-300" />
                <h3 className="text-xl font-bold text-foreground">Connect Four</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Get four in a row! Strategic game against AI. Think ahead to win!
              </p>
              <Link href="/games/connect4" className="neon-btn w-full" data-testid="play-connect4">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Play Now
              </Link>
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
