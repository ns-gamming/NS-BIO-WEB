import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft, Play, Pause } from "lucide-react";

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 300;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 60;
const BALL_SIZE = 8;

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerY, setPlayerY] = useState(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [aiY, setAiY] = useState(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ball, setBall] = useState<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    dx: 3,
    dy: 3
  });
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [touchY, setTouchY] = useState<number | null>(null);

  const showToast = useCallback((message: string) => {
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
    }, 2000);
  }, []);

  const resetBall = useCallback(() => {
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: (Math.random() > 0.5 ? 1 : -1) * 3,
      dy: (Math.random() * 2 - 1) * 3
    });
  }, []);

  const resetGame = useCallback(() => {
    setPlayerScore(0);
    setAiScore(0);
    setPlayerY(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setAiY(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    resetBall();
    setGameRunning(false);
  }, [resetBall]);

  const startGame = useCallback(() => {
    setGameRunning(true);
  }, []);

  const pauseGame = useCallback(() => {
    setGameRunning(false);
  }, []);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setPlayerY(prev => Math.max(0, prev - 20));
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setPlayerY(prev => Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prev + 20));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameRunning]);

  // Handle touch/mouse controls for mobile
  const handleCanvasMove = useCallback((clientY: number) => {
    if (!canvasRef.current || !gameRunning) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const newY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, y - PADDLE_HEIGHT / 2));
    setPlayerY(newY);
  }, [gameRunning]);

  // Game loop
  useEffect(() => {
    if (!gameRunning) return;

    const interval = setInterval(() => {
      setBall(prevBall => {
        let newBall = { ...prevBall };
        
        // Move ball
        newBall.x += newBall.dx;
        newBall.y += newBall.dy;

        // Ball collision with top/bottom
        if (newBall.y <= 0 || newBall.y >= CANVAS_HEIGHT - BALL_SIZE) {
          newBall.dy = -newBall.dy;
        }

        // Ball collision with player paddle
        if (
          newBall.x <= PADDLE_WIDTH &&
          newBall.y >= playerY &&
          newBall.y <= playerY + PADDLE_HEIGHT
        ) {
          newBall.dx = Math.abs(newBall.dx);
          const hitPos = (newBall.y - playerY) / PADDLE_HEIGHT;
          newBall.dy = (hitPos - 0.5) * 6;
        }

        // Ball collision with AI paddle
        if (
          newBall.x >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
          newBall.y >= aiY &&
          newBall.y <= aiY + PADDLE_HEIGHT
        ) {
          newBall.dx = -Math.abs(newBall.dx);
          const hitPos = (newBall.y - aiY) / PADDLE_HEIGHT;
          newBall.dy = (hitPos - 0.5) * 6;
        }

        // Player scores
        if (newBall.x >= CANVAS_WIDTH) {
          setPlayerScore(prev => {
            const newScore = prev + 1;
            if (newScore >= 5) {
              showToast("🎉 Victory! You are the Pong Champion! 🏆");
              setGameRunning(false);
            } else {
              showToast("Goal! Keep it up! 🎯");
            }
            return newScore;
          });
          return {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            dx: -3,
            dy: (Math.random() * 2 - 1) * 3
          };
        }

        // AI scores
        if (newBall.x <= 0) {
          setAiScore(prev => {
            const newScore = prev + 1;
            if (newScore >= 5) {
              showToast("AI wins! Try again! 💪");
              setGameRunning(false);
            } else {
              showToast("Oops! AI scored! 🤖");
            }
            return newScore;
          });
          return {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            dx: 3,
            dy: (Math.random() * 2 - 1) * 3
          };
        }

        return newBall;
      });

      // AI movement (follows ball with slight delay)
      setAiY(prevAiY => {
        const aiCenter = prevAiY + PADDLE_HEIGHT / 2;
        const ballCenter = ball.y + BALL_SIZE / 2;
        const diff = ballCenter - aiCenter;
        
        if (Math.abs(diff) < 2) return prevAiY;
        
        const move = diff > 0 ? 2 : -2;
        return Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prevAiY + move));
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [gameRunning, ball, playerY, aiY, showToast]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw player paddle (left)
    ctx.fillStyle = '#6366f1';
    ctx.shadowColor = '#6366f1';
    ctx.shadowBlur = 10;
    ctx.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw AI paddle (right)
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_SIZE, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [ball, playerY, aiY]);

  return (
    <div className="pt-16">
      <HeroSection 
        title="Pong"
        subtitle="Classic arcade action — first to 5 wins! 🏓"
      />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-8 animate-fadeIn">
            {/* Score */}
            <div className="flex justify-between items-center mb-6" data-testid="pong-scoreboard">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">You</div>
                <div className="text-4xl font-bold text-primary" data-testid="player-score">{playerScore}</div>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">VS</div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">AI</div>
                <div className="text-4xl font-bold text-red-500" data-testid="ai-score">{aiScore}</div>
              </div>
            </div>

            {/* Game Canvas */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full h-auto rounded-lg border-2 border-primary/30 cursor-pointer"
                onMouseMove={(e) => handleCanvasMove(e.clientY)}
                onTouchMove={(e) => {
                  e.preventDefault();
                  handleCanvasMove(e.touches[0].clientY);
                }}
                data-testid="pong-canvas"
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
                  Start Game
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
                <p><strong className="text-foreground">Desktop:</strong> Use Arrow Keys ↑↓ or W/S keys</p>
                <p><strong className="text-foreground">Mobile:</strong> Touch and drag on the game area</p>
                <p><strong className="text-foreground">Goal:</strong> First to score 5 points wins!</p>
                <p className="text-primary">💡 Tip: Hit the ball with different parts of your paddle to control the angle!</p>
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
