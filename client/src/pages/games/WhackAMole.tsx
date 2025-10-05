import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft, Trophy, Zap } from "lucide-react";

const GRID_SIZE = 9;
const GAME_DURATION = 30;

export default function WhackAMole() {
  const [holes, setHoles] = useState<boolean[]>(Array(GRID_SIZE).fill(false));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hitAnimation, setHitAnimation] = useState<number | null>(null);
  
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('whackHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const showMole = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * GRID_SIZE);
    setHoles(prev => {
      const newHoles = [...prev];
      newHoles[randomIndex] = true;
      return newHoles;
    });

    setTimeout(() => {
      setHoles(prev => {
        const newHoles = [...prev];
        newHoles[randomIndex] = false;
        return newHoles;
      });
    }, 800);
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    setHoles(Array(GRID_SIZE).fill(false));

    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    gameIntervalRef.current = setInterval(showMole, 1000);
    
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [showMole]);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    setHoles(Array(GRID_SIZE).fill(false));
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && isPlaying) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('whackHighScore', score.toString());
        setTimeout(() => alert(`🎉 New High Score: ${score}! You're lightning fast! ⚡`), 300);
      } else {
        setTimeout(() => alert(`Time's up! Final Score: ${score} 💪 Try again!`), 300);
      }
    }
  }, [timeLeft, isPlaying, score, highScore]);

  const whack = useCallback((index: number) => {
    if (!isPlaying || !holes[index]) return;

    setHoles(prev => {
      const newHoles = [...prev];
      newHoles[index] = false;
      return newHoles;
    });

    setScore(prev => prev + 1);
    setHitAnimation(index);
    setTimeout(() => setHitAnimation(null), 300);

    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
  }, [isPlaying, holes]);

  return (
    <div className="pt-16">
      <HeroSection 
        title="🔨 Whack-a-Mole"
        subtitle="Test your reflexes — how fast can you click?"
      />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <Link href="/games" className="inline-flex items-center gap-2 text-primary hover:underline mb-6" data-testid="back-to-games">
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Link>

          <div className="glass rounded-2xl p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-primary" />
                  Score: <span className="text-primary animate-pulse" data-testid="current-score">{score}</span>
                </h3>
                <p className="text-sm text-muted-foreground">High Score: {highScore}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary animate-pulse" data-testid="time-left">
                  {timeLeft}s
                </div>
                <p className="text-xs text-muted-foreground">Time Left</p>
              </div>
              <button 
                onClick={startGame}
                className="neon-btn"
                data-testid="start-game"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isPlaying ? 'Restart' : 'Start'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {holes.map((isActive, index) => (
                <button
                  key={index}
                  onClick={() => whack(index)}
                  disabled={!isPlaying}
                  className={`
                    aspect-square rounded-2xl border-4 border-primary/30
                    transition-all duration-200 transform relative overflow-hidden
                    ${isActive ? 'bg-primary/20 scale-95' : 'bg-background/10'}
                    ${hitAnimation === index ? 'animate-pulse-neon bg-green-500' : ''}
                    ${isPlaying ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}
                    disabled:cursor-not-allowed
                  `}
                  data-testid={`hole-${index}`}
                  aria-label={`Hole ${index + 1}`}
                >
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center animate-bounceIn">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg shadow-orange-500/50 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-white animate-pulse" />
                      </div>
                    </div>
                  )}
                  {!isActive && !isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-3 bg-gray-700/50 rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {!isPlaying && timeLeft === GAME_DURATION && (
              <div className="text-center mt-6">
                <p className="text-lg text-primary font-semibold animate-pulse">
                  Click Start to begin! 🎮
                </p>
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-6 text-center">
            <h3 className="font-bold text-lg text-primary mb-2">How to Play</h3>
            <p className="text-muted-foreground">
              Click on the moles as they pop up! You have 30 seconds to get as many hits as possible. 
              Quick reflexes = high scores! ⚡
            </p>
            <p className="text-primary mt-4 font-semibold">
              Speed and focus — that's the winning combo! 🎯
            </p>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
