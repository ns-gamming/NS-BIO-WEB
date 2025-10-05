import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft, Play, Pause } from "lucide-react";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_RADIUS = 6;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = CANVAS_WIDTH / BRICK_COLS - 4;
const BRICK_HEIGHT = 20;

interface Brick {
  x: number;
  y: number;
  status: number;
  color: string;
}

export default function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paddleX, setPaddleX] = useState(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [ball, setBall] = useState({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: 3, dy: -3 });
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const BRICK_COLORS = ['#ef4444', '#f97316', '#fbbf24', '#10b981', '#3b82f6'];

  const showToast = useCallback((message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass p-6 rounded-2xl z-[9999] animate-pulse-neon border-2 border-primary';
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
    }, 2000);
  }, []);

  const initializeBricks = useCallback(() => {
    const newBricks: Brick[] = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        newBricks.push({
          x: col * (BRICK_WIDTH + 4) + 2,
          y: row * (BRICK_HEIGHT + 4) + 40,
          status: 1,
          color: BRICK_COLORS[row]
        });
      }
    }
    return newBricks;
  }, []);

  const startGame = useCallback(() => {
    setBricks(initializeBricks());
    setPaddleX(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);
    setBall({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: 3, dy: -3 });
    setScore(0);
    setLives(3);
    setGameRunning(true);
    setGameWon(false);
  }, [initializeBricks]);

  const resetGame = useCallback(() => {
    setBricks(initializeBricks());
    setPaddleX(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);
    setBall({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: 3, dy: -3 });
    setScore(0);
    setLives(3);
    setGameRunning(false);
    setGameWon(false);
  }, [initializeBricks]);

  const pauseGame = useCallback(() => {
    setGameRunning(false);
  }, []);

  // Handle keyboard and touch controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setPaddleX(prev => Math.max(0, prev - 20));
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setPaddleX(prev => Math.min(CANVAS_WIDTH - PADDLE_WIDTH, prev + 20));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameRunning]);

  const handleCanvasMove = useCallback((clientX: number) => {
    if (!canvasRef.current || !gameRunning) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const newX = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, x - PADDLE_WIDTH / 2));
    setPaddleX(newX);
  }, [gameRunning]);

  // Game loop
  useEffect(() => {
    if (!gameRunning) return;

    const interval = setInterval(() => {
      setBall(prevBall => {
        let newBall = { ...prevBall };
        
        newBall.x += newBall.dx;
        newBall.y += newBall.dy;

        // Wall collision
        if (newBall.x <= BALL_RADIUS || newBall.x >= CANVAS_WIDTH - BALL_RADIUS) {
          newBall.dx = -newBall.dx;
        }
        if (newBall.y <= BALL_RADIUS) {
          newBall.dy = -newBall.dy;
        }

        // Paddle collision
        if (
          newBall.y >= CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10 &&
          newBall.y <= CANVAS_HEIGHT - PADDLE_HEIGHT - 5 &&
          newBall.x >= paddleX &&
          newBall.x <= paddleX + PADDLE_WIDTH
        ) {
          newBall.dy = -Math.abs(newBall.dy);
          const hitPos = (newBall.x - paddleX) / PADDLE_WIDTH;
          newBall.dx = (hitPos - 0.5) * 8;
        }

        // Bottom collision (lose life)
        if (newBall.y >= CANVAS_HEIGHT) {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameRunning(false);
              if (score > highScore) {
                setHighScore(score);
                showToast(`Game Over! New High Score: ${score}! 🏆`);
              } else {
                showToast(`Game Over! Score: ${score} 💥`);
              }
            } else {
              showToast(`Life lost! ${newLives} remaining! 💔`);
            }
            return newLives;
          });
          return { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: 3, dy: -3 };
        }

        return newBall;
      });

      // Brick collision
      setBricks(prevBricks => {
        const newBricks = [...prevBricks];
        let brickHit = false;

        for (let i = 0; i < newBricks.length; i++) {
          const brick = newBricks[i];
          if (brick.status === 0) continue;

          if (
            ball.x >= brick.x &&
            ball.x <= brick.x + BRICK_WIDTH &&
            ball.y >= brick.y &&
            ball.y <= brick.y + BRICK_HEIGHT
          ) {
            setBall(prev => ({ ...prev, dy: -prev.dy }));
            brick.status = 0;
            brickHit = true;
            setScore(prev => prev + 10);
            break;
          }
        }

        // Check win condition
        if (newBricks.every(brick => brick.status === 0)) {
          setGameRunning(false);
          setGameWon(true);
          if (score + 10 > highScore) {
            setHighScore(score + 10);
            showToast(`🎉 You Won! Perfect Score: ${score + 10}! 🏆`);
          } else {
            showToast(`🎉 Victory! All bricks cleared! Score: ${score + 10}`);
          }
        }

        return newBricks;
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [gameRunning, ball, paddleX, score, highScore, showToast]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bricks
    bricks.forEach(brick => {
      if (brick.status === 1) {
        ctx.fillStyle = brick.color;
        ctx.shadowColor = brick.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
      }
    });

    // Draw paddle
    ctx.fillStyle = '#6366f1';
    ctx.shadowColor = '#6366f1';
    ctx.shadowBlur = 15;
    ctx.fillRect(paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }, [ball, paddleX, bricks]);

  return (
    <div className="pt-16">
      <HeroSection 
        title="Breakout"
        subtitle="Break all the bricks! Classic arcade fun! 🧱"
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
              <div className="glass rounded-xl p-4 text-center" data-testid="lives-display">
                <div className="text-sm text-muted-foreground mb-1">Lives</div>
                <div className="text-3xl font-bold text-red-500">{'❤️'.repeat(lives)}</div>
              </div>
              <div className="glass rounded-xl p-4 text-center" data-testid="highscore-display">
                <div className="text-sm text-muted-foreground mb-1">High Score</div>
                <div className="text-3xl font-bold text-yellow-500">{highScore}</div>
              </div>
            </div>

            {/* Game Canvas */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full h-auto rounded-lg border-2 border-primary/30 cursor-pointer"
                onMouseMove={(e) => handleCanvasMove(e.clientX)}
                onTouchMove={(e) => {
                  e.preventDefault();
                  handleCanvasMove(e.touches[0].clientX);
                }}
                data-testid="breakout-canvas"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-4 mt-6">
              {!gameRunning ? (
                <button
                  onClick={startGame}
                  className="flex-1 neon-btn"
                  data-testid="button-start"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {gameWon || lives === 0 ? "Play Again" : "Start Game"}
                </button>
              ) : (
                <button
                  onClick={pauseGame}
                  className="flex-1 neon-btn"
                  data-testid="button-pause"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </button>
              )}
              <button
                onClick={resetGame}
                className="flex-1 btn-secondary"
                data-testid="button-reset"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>

            {/* Instructions */}
            <div className="glass rounded-xl p-6 mt-6" data-testid="game-instructions">
              <h3 className="text-lg font-semibold text-primary mb-3">How to Play 🎮</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Desktop:</strong> Use Arrow Keys ← → or A/D keys</p>
                <p><strong className="text-foreground">Mobile:</strong> Touch and drag on the game area</p>
                <p><strong className="text-foreground">Goal:</strong> Break all bricks without losing lives!</p>
                <p>• Each brick = 10 points</p>
                <p>• You have 3 lives</p>
                <p className="text-primary">💡 Hit different parts of the paddle to control ball angle!</p>
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
