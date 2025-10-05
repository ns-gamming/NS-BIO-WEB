import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft, Play, Timer } from "lucide-react";

const COLORS = [
  { name: "Red", hex: "#ef4444", bg: "bg-red-500" },
  { name: "Blue", hex: "#3b82f6", bg: "bg-blue-500" },
  { name: "Green", hex: "#10b981", bg: "bg-green-500" },
  { name: "Yellow", hex: "#fbbf24", bg: "bg-yellow-500" },
  { name: "Purple", hex: "#a855f7", bg: "bg-purple-500" },
  { name: "Pink", hex: "#ec4899", bg: "bg-pink-500" },
  { name: "Orange", hex: "#f97316", bg: "bg-orange-500" },
  { name: "Cyan", hex: "#06b6d4", bg: "bg-cyan-500" }
];

const GAME_TIME = 30;

export default function ColorMatch() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameRunning, setGameRunning] = useState(false);
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const [displayedWord, setDisplayedWord] = useState(COLORS[1].name);
  const [wordColor, setWordColor] = useState(COLORS[2].hex);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const showToast = useCallback((message: string, isSuccess = true) => {
    const toast = document.createElement('div');
    toast.className = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass p-6 rounded-2xl z-[9999] ${isSuccess ? 'border-2 border-green-500' : 'border-2 border-red-500'}`;
    toast.style.animation = 'fadeUp 0.5s ease-out forwards';
    toast.innerHTML = `
      <div class="text-center">
        <div class="text-lg font-semibold ${isSuccess ? 'text-green-500' : 'text-red-500'}">${message}</div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'fadeUp 0.5s ease-out reverse forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 500);
    }, 1500);
  }, []);

  const generateNewRound = useCallback(() => {
    const targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const word = COLORS[Math.floor(Math.random() * COLORS.length)].name;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)].hex;
    
    setCurrentColor(targetColor);
    setDisplayedWord(word);
    setWordColor(color);
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setStreak(0);
    setGameRunning(true);
    generateNewRound();
  }, [generateNewRound]);

  const resetGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setStreak(0);
    setGameRunning(false);
  }, []);

  const handleAnswer = useCallback((isMatch: boolean) => {
    if (!gameRunning) return;

    const correctAnswer = wordColor === currentColor.hex;
    
    if ((isMatch && correctAnswer) || (!isMatch && !correctAnswer)) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      if (streak > 0 && streak % 5 === 0) {
        showToast(`🔥 ${streak} Streak! You're on fire!`);
      }
    } else {
      setStreak(0);
      showToast("Wrong! Focus on the word's color!", false);
    }
    
    generateNewRound();
  }, [gameRunning, wordColor, currentColor, streak, generateNewRound, showToast]);

  // Timer
  useEffect(() => {
    if (!gameRunning || timeLeft <= 0) {
      if (timeLeft === 0) {
        setGameRunning(false);
        if (score > highScore) {
          setHighScore(score);
          showToast(`🎉 New High Score: ${score}! Amazing! 🏆`);
        } else {
          showToast(`Time's up! Final score: ${score} 🎯`);
        }
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameRunning, timeLeft, score, highScore, showToast]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleAnswer(true);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleAnswer(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameRunning, handleAnswer]);

  return (
    <div className="pt-16">
      <HeroSection 
        title="Color Match"
        subtitle="Quick! Does the word's color match? Test your reflexes! 🎨"
      />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-8 animate-fadeIn">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-xl p-4 text-center" data-testid="score-display">
                <div className="text-sm text-muted-foreground mb-1">Score</div>
                <div className="text-3xl font-bold text-primary">{score}</div>
              </div>
              <div className="glass rounded-xl p-4 text-center" data-testid="time-display">
                <div className="text-sm text-muted-foreground mb-1">Time</div>
                <div className="text-3xl font-bold text-yellow-500">{timeLeft}s</div>
              </div>
              <div className="glass rounded-xl p-4 text-center" data-testid="streak-display">
                <div className="text-sm text-muted-foreground mb-1">Streak</div>
                <div className="text-3xl font-bold text-orange-500">{streak}🔥</div>
              </div>
            </div>

            {highScore > 0 && (
              <div className="glass rounded-xl p-3 mb-6 text-center" data-testid="highscore-display">
                <span className="text-sm text-muted-foreground">High Score: </span>
                <span className="text-lg font-bold text-primary">{highScore}</span>
              </div>
            )}

            {/* Game Area */}
            {gameRunning ? (
              <div className="space-y-6">
                {/* Target Color */}
                <div className="glass rounded-xl p-6 text-center" data-testid="target-color">
                  <div className="text-sm text-muted-foreground mb-2">Match this color:</div>
                  <div className={`w-24 h-24 ${currentColor.bg} rounded-full mx-auto shadow-lg border-4 border-white/20`} />
                  <div className="text-lg font-bold text-foreground mt-2">{currentColor.name}</div>
                </div>

                {/* Question */}
                <div className="glass rounded-xl p-8 text-center" data-testid="question-area">
                  <div className="text-sm text-muted-foreground mb-4">Is this word displayed in the correct color?</div>
                  <div 
                    className="text-6xl font-bold transition-all duration-300"
                    style={{ color: wordColor }}
                  >
                    {displayedWord}
                  </div>
                </div>

                {/* Answer Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAnswer(true)}
                    className="glass hover:bg-green-500/20 border-2 border-green-500 p-6 rounded-xl font-bold text-green-500 hover:scale-105 transition-all duration-300"
                    data-testid="button-yes"
                  >
                    ✓ YES MATCH<br/>
                    <span className="text-xs opacity-70">(← or A)</span>
                  </button>
                  <button
                    onClick={() => handleAnswer(false)}
                    className="glass hover:bg-red-500/20 border-2 border-red-500 p-6 rounded-xl font-bold text-red-500 hover:scale-105 transition-all duration-300"
                    data-testid="button-no"
                  >
                    ✗ NO MATCH<br/>
                    <span className="text-xs opacity-70">(→ or D)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {score > 0 ? `Game Over! Score: ${score}` : "Ready to Test Your Speed?"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  Match the word's color to the target color as fast as possible!
                </p>
                <button
                  onClick={startGame}
                  className="neon-btn inline-flex items-center"
                  data-testid="button-start"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {score > 0 ? "Play Again" : "Start Game"}
                </button>
              </div>
            )}

            {/* Controls */}
            {gameRunning && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={resetGame}
                  className="flex-1 btn-secondary"
                  data-testid="button-reset"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </button>
              </div>
            )}

            {/* Instructions */}
            <div className="glass rounded-xl p-6 mt-6" data-testid="game-instructions">
              <h3 className="text-lg font-semibold text-primary mb-3">How to Play 🎮</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• You'll see a target color at the top</p>
                <p>• A word will appear below in some color</p>
                <p>• Click "YES" if the word's color matches the target</p>
                <p>• Click "NO" if it doesn't match</p>
                <p><strong className="text-foreground">Desktop:</strong> Use Arrow Keys ← → or A/D</p>
                <p><strong className="text-foreground">Mobile:</strong> Tap the buttons</p>
                <p className="text-primary">💡 Build a streak for bonus points!</p>
              </div>
            </div>

            {/* Back Button */}
            <Link href="/games" className="btn-secondary w-full mt-6" data-testid="link-games">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Link>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
