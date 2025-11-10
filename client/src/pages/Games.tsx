import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Link } from "wouter";
import { motion } from "framer-motion";
import PageFeedback from "@/components/PageFeedback";
import { Gamepad2, Grid3X3, Cpu, Brain, Bird, Hand, Lightbulb, Grid2X2, Hammer, Palette, Keyboard, Grid, Blocks, Circle, Zap } from "lucide-react";

export default function Games() {
  return (
    <div className="pt-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-floatSlow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        <HeroSection 
          title="Play & Chill"
          subtitle="Games by NS GAMMING — Made with love ❤️"
        />

        <div className="container mx-auto px-4 sm:px-6 pb-20">
          {/* AdSense Ad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <AdSenseAd />
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" data-testid="games-grid">
              {/* Tic Tac Toe */}
              <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-primary/50 cursor-pointer relative overflow-hidden" data-testid="game-tictactoe">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="text-center mb-4">
                    <div className="relative inline-block mb-3">
                      <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <Grid3X3 className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto relative group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">Tic Tac Toe</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                    Classic strategy game — simple but addictive! Challenge yourself or play with friends.
                  </p>
                  <Link href="/games/tictactoe" className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-tictactoe">
                    <Gamepad2 className="w-4 h-4" />
                    <span>Play Now</span>
                  </Link>
                </div>
              </div>

            {/* Snake Game */}
            <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-green-500/50 cursor-pointer relative overflow-hidden" data-testid="game-snake" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Cpu className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mx-auto relative group-hover:animate-spin transition-all duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-green-500 transition-colors duration-300">Snake Game</h3>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                  Nostalgic gameplay with modern neon style! How long can your snake grow?
                </p>
                <Link href="/games/snake" className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-snake">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Play Now</span>
                </Link>
              </div>
            </div>

            {/* Memory Match */}
            <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-purple-500/50 cursor-pointer relative overflow-hidden" data-testid="game-memory" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 mx-auto relative group-hover:animate-pulse transition-all duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-purple-500 transition-colors duration-300">Memory Match</h3>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                  Test your memory skills! Match pairs and challenge your brain power.
                </p>
                <Link href="/games/memory" className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-memory">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Play Now</span>
                </Link>
              </div>
            </div>

            {/* Flappy Clone */}
            <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-yellow-500/50 cursor-pointer relative overflow-hidden" data-testid="game-flappy" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Bird className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 mx-auto relative group-hover:animate-bounce transition-all duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-yellow-500 transition-colors duration-300">Flappy Clone</h3>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                  Navigate through obstacles! Simple controls, endless fun.
                </p>
                <Link href="/games/flappy" className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-flappy">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Play Now</span>
                </Link>
              </div>
            </div>

            {/* Rock Paper Scissors */}
            <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-red-500/50 cursor-pointer relative overflow-hidden" data-testid="game-rps" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Hand className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto relative group-hover:animate-bounce transition-all duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-red-500 transition-colors duration-300">Rock Paper Scissors</h3>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                  Classic hand game against AI! Can you outsmart the computer?
                </p>
                <Link href="/games/rps" className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-rps">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Play Now</span>
                </Link>
              </div>
            </div>

            {/* Simon Says */}
            <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-blue-500/50 cursor-pointer relative overflow-hidden" data-testid="game-simon" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mx-auto relative group-hover:animate-pulse transition-all duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-blue-500 transition-colors duration-300">Simon Says</h3>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                  Memory challenge! Watch, remember, and repeat the pattern. How high can you score?
                </p>
                <Link href="/games/simon" className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-simon">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Play Now</span>
                </Link>
              </div>
            </div>

            {/* 2048 */}
            <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-orange-500/50 cursor-pointer relative overflow-hidden" data-testid="game-2048" style={{ animationDelay: '0.6s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Grid2X2 className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 mx-auto relative group-hover:rotate-45 transition-all duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-orange-500 transition-colors duration-300">2048</h3>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                  Slide, merge, reach 2048! Strategic puzzle game that tests your planning skills.
                </p>
                <Link href="/games/2048" className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-2048">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Play Now</span>
                </Link>
              </div>
            </div>

            {/* Whack-a-Mole */}
            <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-amber-500/50 cursor-pointer relative overflow-hidden" data-testid="game-whack" style={{ animationDelay: '0.7s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Hammer className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 mx-auto relative group-hover:animate-bounce transition-all duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-amber-500 transition-colors duration-300">Whack-a-Mole</h3>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                  Fast-paced clicking action! Test your reflexes and reaction time. Click fast!
                </p>
                <Link href="/games/whack" className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-whack">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Play Now</span>
                </Link>
              </div>
            </div>

            {/* Pong */}
            <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-cyan-500/50 cursor-pointer relative overflow-hidden" data-testid="game-pong" style={{ animationDelay: '0.8s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Circle className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-500 mx-auto relative group-hover:animate-ping transition-all duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-cyan-500 transition-colors duration-300">Pong</h3>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                  Classic arcade action! First to score 5 points wins against AI. Mobile-friendly!
                </p>
                <Link href="/games/pong" className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-pong">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Play Now</span>
                </Link>
              </div>
            </div>

            {/* Color Match */}
            <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-pink-500/50 cursor-pointer relative overflow-hidden" data-testid="game-colormatch" style={{ animationDelay: '0.9s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-pink-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Palette className="w-10 h-10 sm:w-12 sm:h-12 text-pink-500 mx-auto relative group-hover:animate-spin transition-all duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-pink-500 transition-colors duration-300">Color Match</h3>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                  Fast-paced reaction game! Match colors quickly and build your streak. Addictive!
                </p>
                <Link href="/games/colormatch" className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-colormatch">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Play Now</span>
                </Link>
              </div>
            </div>

            {/* Typing Speed */}
            <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-indigo-500/50 cursor-pointer relative overflow-hidden" data-testid="game-typing" style={{ animationDelay: '1s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Keyboard className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500 mx-auto relative group-hover:animate-bounce transition-all duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-indigo-500 transition-colors duration-300">Typing Speed Test</h3>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                  Test your typing skills! See your WPM and accuracy. Practice makes perfect!
                </p>
                <Link href="/games/typing" className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-typing">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Play Now</span>
                </Link>
              </div>
            </div>

            {/* Sliding Puzzle */}
            <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-teal-500/50 cursor-pointer relative overflow-hidden" data-testid="game-sliding" style={{ animationDelay: '1.1s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-teal-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Grid className="w-10 h-10 sm:w-12 sm:h-12 text-teal-500 mx-auto relative group-hover:rotate-12 transition-all duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-teal-500 transition-colors duration-300">Sliding Puzzle</h3>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                  Arrange tiles in order! Classic puzzle game that tests your problem-solving.
                </p>
                <Link href="/games/sliding" className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-sliding">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Play Now</span>
                </Link>
              </div>
            </div>

            {/* Breakout */}
            <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-violet-500/50 cursor-pointer relative overflow-hidden" data-testid="game-breakout" style={{ animationDelay: '1.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-violet-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Blocks className="w-10 h-10 sm:w-12 sm:h-12 text-violet-500 mx-auto relative group-hover:animate-pulse transition-all duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-violet-500 transition-colors duration-300">Breakout</h3>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                  Break all the bricks! Classic arcade fun with smooth touch controls for mobile.
                </p>
                <Link href="/games/breakout" className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-breakout">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Play Now</span>
                </Link>
              </div>
            </div>

            {/* Connect Four */}
            <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-rose-500/50 cursor-pointer relative overflow-hidden" data-testid="game-connect4" style={{ animationDelay: '1.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-rose-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <Grid3X3 className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500 mx-auto relative group-hover:rotate-180 transition-all duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-rose-500 transition-colors duration-300">Connect Four</h3>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                  Get four in a row! Strategic game against AI. Think ahead to win!
                </p>
                <Link href="/games/connect4" className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-connect4">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Play Now</span>
                </Link>
              </div>
            </div>

            {/* Space Shooter 3D - NEW ADVANCED GAME */}
            <Link href="/games/spaceshooter" className="block">
              <div className="glass rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-500 group animate-bounceIn hover:shadow-2xl hover:shadow-cyan-500/50 cursor-pointer relative overflow-hidden" data-testid="game-spaceshooter" style={{ animationDelay: '1.4s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg z-20">
                  NEW 3D!
                </div>
                <div className="relative z-10">
                  <div className="text-center mb-4">
                    <div className="relative inline-block mb-3">
                      <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-500 mx-auto relative group-hover:animate-pulse transition-all duration-300" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-cyan-500 transition-colors duration-300">🚀 Space Shooter 3D</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 sm:mb-6 text-center text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                    Epic 3D space battle with stunning graphics! Destroy enemies, collect power-ups, and save the galaxy! 🌌
                  </p>
                  <div className="neon-btn w-full flex items-center justify-center gap-2" data-testid="play-spaceshooter">
                    <Gamepad2 className="w-4 h-4" />
                    <span>Play Now</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Gaming Philosophy */}
          <div className="glass rounded-2xl p-6 sm:p-8 mt-12 text-center relative overflow-hidden group animate-fadeUp" data-testid="gaming-philosophy">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-pulse" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary animate-textShine">Why I Build Games 🎮</h2>
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              <p className="text-base sm:text-lg text-foreground max-w-3xl mx-auto leading-relaxed px-4">
                Games bring people together! Every game I create is designed to spread joy and provide a moment of fun in your day. 
                Whether it's a quick break from work or a challenge with friends, I believe gaming can make the world a happier place. 
                <span className="text-primary font-semibold block mt-2 animate-bounce-slow">Keep playing, keep smiling! ❤️</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* AdSense Ad and Feedback Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <AdSenseAd />
        </motion.div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12"
        >
          <PageFeedback pageName="Games" />
        </motion.div>
    </div>
  );
}