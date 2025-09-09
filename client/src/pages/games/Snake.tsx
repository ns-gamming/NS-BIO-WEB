import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft, Play, Pause } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    setFood(newFood);
  }, []);

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

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 0, y: 0 });
    setGameRunning(false);
    setScore(0);
    setGameOver(false);
  }, []);

  const startGame = useCallback(() => {
    setGameRunning(true);
    setDirection({ x: 1, y: 0 });
  }, []);

  const pauseGame = useCallback(() => {
    setGameRunning(false);
  }, []);

  const moveSnake = useCallback(() => {
    if (!gameRunning || gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setGameRunning(false);
        showVictoryToast("Game Over! Better luck next time! 🐍💪");
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setGameRunning(false);
        showVictoryToast("Oops! You hit yourself! Try again! 🔄");
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        generateFood();
        if (newSnake.length > 15) {
          showVictoryToast("Wahh! Amazing score! You're a Snake master! 🏆✨");
        }
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameRunning, gameOver, generateFood, showVictoryToast]);

  // Game loop
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'hsl(240, 10%, 3.9%)';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake
    ctx.fillStyle = 'hsl(193, 100%, 50%)';
    snake.forEach((segment, index) => {
      ctx.fillRect(
        segment.x * (CANVAS_SIZE / GRID_SIZE),
        segment.y * (CANVAS_SIZE / GRID_SIZE),
        CANVAS_SIZE / GRID_SIZE - 2,
        CANVAS_SIZE / GRID_SIZE - 2
      );
      
      // Add glow effect to head
      if (index === 0) {
        ctx.shadowColor = 'hsl(193, 100%, 50%)';
        ctx.shadowBlur = 10;
        ctx.fillRect(
          segment.x * (CANVAS_SIZE / GRID_SIZE),
          segment.y * (CANVAS_SIZE / GRID_SIZE),
          CANVAS_SIZE / GRID_SIZE - 2,
          CANVAS_SIZE / GRID_SIZE - 2
        );
        ctx.shadowBlur = 0;
      }
    });

    // Draw food
    ctx.fillStyle = 'hsl(24, 100%, 60%)';
    ctx.shadowColor = 'hsl(24, 100%, 60%)';
    ctx.shadowBlur = 15;
    ctx.fillRect(
      food.x * (CANVAS_SIZE / GRID_SIZE),
      food.y * (CANVAS_SIZE / GRID_SIZE),
      CANVAS_SIZE / GRID_SIZE - 2,
      CANVAS_SIZE / GRID_SIZE - 2
    );
    ctx.shadowBlur = 0;
  }, [snake, food]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameRunning]);

  return (
    <div className="pt-16">
      <HeroSection 
        title="Snake Game"
        subtitle="Nostalgic gameplay with modern neon style! 🐍✨"
      />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-2xl p-8 mb-8" data-testid="snake-game">
            {/* Score */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-primary mb-2" data-testid="score-display">
                Score: {score}
              </h3>
              <p className="text-sm text-muted-foreground">Length: {snake.length}</p>
            </div>

            {/* Game Canvas */}
            <div className="flex justify-center mb-6">
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="game-canvas"
                data-testid="snake-canvas"
              />
            </div>

            {/* Controls */}
            <div className="space-x-4 mb-4">
              {!gameRunning && !gameOver && (
                <button onClick={startGame} className="neon-btn" data-testid="start-game">
                  <Play className="w-4 h-4 mr-2" />
                  Start Game
                </button>
              )}
              {gameRunning && (
                <button onClick={pauseGame} className="neon-btn" data-testid="pause-game">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </button>
              )}
              <button onClick={resetGame} className="neon-btn" data-testid="reset-snake-game">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
              <Link href="/games" className="neon-btn" data-testid="back-to-games-snake">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Games
              </Link>
            </div>

            {/* Instructions */}
            <div className="text-sm text-muted-foreground mb-4" data-testid="game-instructions">
              Use arrow keys to control the snake. Eat the orange food to grow!
            </div>

            {gameOver && (
              <div className="text-lg font-semibold text-accent" data-testid="game-over-message">
                Game Over! Final Score: {score}
              </div>
            )}
          </div>
          
          <div className="glass rounded-2xl p-6 text-center" data-testid="snake-motivation">
            <h3 className="text-xl font-bold text-primary mb-3">Grow & Conquer! 🚀</h3>
            <p className="text-muted-foreground">
              Just like in life, growth comes from taking calculated risks and staying focused on your goals. 
              The longer you survive, the stronger you become — but don't let success make you reckless! 
              <span className="text-primary">Keep growing, keep learning! 🐍💪</span>
            </p>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
