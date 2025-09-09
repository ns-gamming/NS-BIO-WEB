import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft, Play, Pause } from "lucide-react";

interface Bird {
  x: number;
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const BIRD_SIZE = 20;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -12;
const PIPE_SPEED = 3;

export default function Flappy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bird, setBird] = useState<Bird>({ x: 100, y: 300, velocity: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const showVictoryToast = useCallback((message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass p-6 rounded-2xl z-[9999] animate-pulse-neon';
    toast.style.animation = 'fadeUp 0.5s ease-out forwards';
    toast.innerHTML = `
      <div class="text-center">
        <div class="text-lg font-semibold text-primary">${message}</div>
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
    }, 3000);
  }, []);

  const generatePipe = useCallback(() => {
    const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
    return {
      x: CANVAS_WIDTH,
      topHeight,
      bottomY: topHeight + PIPE_GAP,
      passed: false,
    };
  }, []);

  const resetGame = useCallback(() => {
    setBird({ x: 100, y: 300, velocity: 0 });
    setPipes([]);
    setGameRunning(false);
    setGameOver(false);
    setScore(0);
  }, []);

  const startGame = useCallback(() => {
    if (gameOver) {
      resetGame();
    }
    setGameRunning(true);
    setPipes([generatePipe()]);
  }, [gameOver, resetGame, generatePipe]);

  const pauseGame = useCallback(() => {
    setGameRunning(false);
  }, []);

  const jump = useCallback(() => {
    if (!gameRunning && !gameOver) {
      startGame();
      return;
    }
    if (gameRunning && !gameOver) {
      setBird(prev => ({ ...prev, velocity: JUMP_STRENGTH }));
    }
  }, [gameRunning, gameOver, startGame]);

  const checkCollision = useCallback((birdY: number, currentPipes: Pipe[]) => {
    // Ground and ceiling collision
    if (birdY <= 0 || birdY >= CANVAS_HEIGHT - BIRD_SIZE) {
      return true;
    }

    // Pipe collision
    for (const pipe of currentPipes) {
      if (
        bird.x + BIRD_SIZE > pipe.x &&
        bird.x < pipe.x + PIPE_WIDTH &&
        (birdY < pipe.topHeight || birdY + BIRD_SIZE > pipe.bottomY)
      ) {
        return true;
      }
    }

    return false;
  }, [bird.x]);

  // Game loop
  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const gameInterval = setInterval(() => {
      setBird(prev => {
        const newY = prev.y + prev.velocity;
        const newVelocity = prev.velocity + GRAVITY;
        return { ...prev, y: newY, velocity: newVelocity };
      });

      setPipes(prev => {
        let newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }));
        
        // Remove pipes that are off screen
        newPipes = newPipes.filter(pipe => pipe.x > -PIPE_WIDTH);
        
        // Add new pipe when needed
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < CANVAS_WIDTH - 200) {
          newPipes.push(generatePipe());
        }

        // Check for scoring
        newPipes.forEach(pipe => {
          if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
            pipe.passed = true;
            setScore(prev => {
              const newScore = prev + 1;
              if (newScore > bestScore) {
                setBestScore(newScore);
              }
              if (newScore % 5 === 0) {
                showVictoryToast(`Amazing! Score: ${newScore}! Keep flying! 🦅✨`);
              }
              return newScore;
            });
          }
        });

        return newPipes;
      });
    }, 20);

    return () => clearInterval(gameInterval);
  }, [gameRunning, gameOver, generatePipe, bird.x, bestScore, showVictoryToast]);

  // Collision detection
  useEffect(() => {
    if (!gameRunning) return;

    setPipes(currentPipes => {
      if (checkCollision(bird.y, currentPipes)) {
        setGameOver(true);
        setGameRunning(false);
        if (score > 0) {
          showVictoryToast(`Game Over! Final Score: ${score}. Great effort yaar! 🚀`);
        } else {
          showVictoryToast("Oops! Try again — practice makes perfect! 💪");
        }
      }
      return currentPipes;
    });
  }, [bird.y, checkCollision, score, showVictoryToast]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, 'hsl(240, 10%, 8%)');
    gradient.addColorStop(1, 'hsl(240, 15%, 12%)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw pipes
    ctx.fillStyle = 'hsl(120, 60%, 40%)';
    ctx.strokeStyle = 'hsl(120, 60%, 30%)';
    ctx.lineWidth = 3;
    
    pipes.forEach(pipe => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, CANVAS_HEIGHT - pipe.bottomY);
      ctx.strokeRect(pipe.x, pipe.bottomY, PIPE_WIDTH, CANVAS_HEIGHT - pipe.bottomY);
    });

    // Draw bird with glow effect
    ctx.shadowColor = 'hsl(24, 100%, 60%)';
    ctx.shadowBlur = 15;
    ctx.fillStyle = 'hsl(24, 100%, 60%)';
    ctx.fillRect(bird.x, bird.y, BIRD_SIZE, BIRD_SIZE);
    
    // Bird details
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'hsl(60, 100%, 80%)';
    ctx.fillRect(bird.x + 2, bird.y + 2, 6, 6); // Eye
    
  }, [bird, pipes]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  return (
    <div className="pt-16">
      <HeroSection 
        title="Flappy Clone"
        subtitle="Navigate through obstacles! Simple controls, endless fun! 🦅"
      />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-2xl p-8 mb-8" data-testid="flappy-game">
            {/* Score Display */}
            <div className="grid grid-cols-2 gap-4 mb-6" data-testid="flappy-stats">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary" data-testid="current-score">{score}</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent" data-testid="best-score">{bestScore}</div>
                <div className="text-sm text-muted-foreground">Best</div>
              </div>
            </div>

            {/* Game Canvas */}
            <div className="flex justify-center mb-6">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onClick={jump}
                className="game-canvas cursor-pointer"
                data-testid="flappy-canvas"
              />
            </div>

            {/* Controls */}
            <div className="space-x-4 mb-4">
              {!gameRunning && !gameOver && (
                <button onClick={startGame} className="neon-btn" data-testid="start-flappy">
                  <Play className="w-4 h-4 mr-2" />
                  Start Flying
                </button>
              )}
              {gameRunning && (
                <button onClick={pauseGame} className="neon-btn" data-testid="pause-flappy">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </button>
              )}
              <button onClick={resetGame} className="neon-btn" data-testid="reset-flappy">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
              <Link href="/games" className="neon-btn" data-testid="back-to-games-flappy">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Games
              </Link>
            </div>

            {/* Instructions */}
            <div className="text-sm text-muted-foreground mb-4" data-testid="flappy-instructions">
              Click or press SPACEBAR to flap! Avoid the pipes and see how far you can fly!
            </div>

            {gameOver && (
              <div className="glass bg-accent/20 rounded-lg p-4" data-testid="flappy-game-over">
                <div className="text-lg font-semibold text-accent mb-2">
                  Flight Ended! 🦅
                </div>
                <p className="text-sm text-muted-foreground">
                  Final Score: {score} | Best: {bestScore}
                </p>
              </div>
            )}
          </div>
          
          <div className="glass rounded-2xl p-6 text-center" data-testid="flappy-motivation">
            <h3 className="text-xl font-bold text-primary mb-3">Keep Flying High! 🚀</h3>
            <p className="text-muted-foreground">
              Every crash is a lesson, every flight is progress! Just like in coding and life, 
              persistence and timing are everything. The more you practice, the better you become. 
              Don't give up when you hit obstacles — learn to navigate around them! 
              <span className="text-primary">Sky is not the limit, it's just the beginning! ✨🦅</span>
            </p>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
