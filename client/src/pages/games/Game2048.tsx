import { useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft, Trophy } from "lucide-react";

type Grid = number[][];

const GRID_SIZE = 4;

const getTileColor = (value: number): string => {
  const colors: { [key: number]: string } = {
    2: 'bg-orange-200 text-gray-800',
    4: 'bg-orange-300 text-gray-800',
    8: 'bg-orange-400 text-white',
    16: 'bg-orange-500 text-white',
    32: 'bg-red-400 text-white',
    64: 'bg-red-500 text-white',
    128: 'bg-yellow-400 text-white',
    256: 'bg-yellow-500 text-white',
    512: 'bg-yellow-600 text-white',
    1024: 'bg-green-400 text-white',
    2048: 'bg-green-500 text-white',
  };
  return colors[value] || 'bg-green-600 text-white';
};

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('2048BestScore');
    if (saved) setBestScore(parseInt(saved));
    initGame();
  }, []);

  const createEmptyGrid = useCallback((): Grid => {
    return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  }, []);

  const addRandomTile = useCallback((grid: Grid): Grid => {
    const empty: [number, number][] = [];
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) empty.push([i, j]);
      });
    });

    if (empty.length > 0) {
      const [i, j] = empty[Math.floor(Math.random() * empty.length)];
      const newGrid = grid.map(row => [...row]);
      newGrid[i][j] = Math.random() < 0.9 ? 2 : 4;
      return newGrid;
    }
    return grid;
  }, []);

  const initGame = useCallback(() => {
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, [createEmptyGrid, addRandomTile]);

  const slideRow = (row: number[]): [number[], number] => {
    let arr = row.filter(val => val !== 0);
    let points = 0;
    
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        points += arr[i];
        arr[i + 1] = 0;
      }
    }
    
    arr = arr.filter(val => val !== 0);
    while (arr.length < GRID_SIZE) arr.push(0);
    return [arr, points];
  };

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || won) return;

    let newGrid = grid.map(row => [...row]);
    let moved = false;
    let totalPoints = 0;

    if (direction === 'left' || direction === 'right') {
      for (let i = 0; i < GRID_SIZE; i++) {
        let row = newGrid[i];
        if (direction === 'right') row = row.reverse();
        
        const [newRow, points] = slideRow(row);
        totalPoints += points;
        
        if (direction === 'right') newRow.reverse();
        if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
        newGrid[i] = newRow;
      }
    } else {
      for (let j = 0; j < GRID_SIZE; j++) {
        let col = newGrid.map(row => row[j]);
        if (direction === 'down') col = col.reverse();
        
        const [newCol, points] = slideRow(col);
        totalPoints += points;
        
        if (direction === 'down') newCol.reverse();
        if (JSON.stringify(col) !== JSON.stringify(newCol)) moved = true;
        for (let i = 0; i < GRID_SIZE; i++) {
          newGrid[i][j] = newCol[i];
        }
      }
    }

    if (moved) {
      newGrid = addRandomTile(newGrid);
      setGrid(newGrid);
      const newScore = score + totalPoints;
      setScore(newScore);

      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048BestScore', newScore.toString());
      }

      if (newGrid.some(row => row.includes(2048)) && !won) {
        setWon(true);
        setTimeout(() => alert("🎉 You reached 2048! You're a legend! Keep going for even higher scores! 🏆"), 300);
      }

      if (!canMove(newGrid)) {
        setGameOver(true);
        setTimeout(() => alert(`Game Over! Final Score: ${newScore} 💀 Try again!`), 300);
      }
    }
  }, [grid, score, bestScore, gameOver, won, addRandomTile]);

  const canMove = (grid: Grid): boolean => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) return true;
        if (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) return true;
        if (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const direction = e.key.replace('Arrow', '').toLowerCase() as 'up' | 'down' | 'left' | 'right';
        move(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  return (
    <div className="pt-16">
      <HeroSection 
        title="🎲 2048 Game"
        subtitle="Slide, merge, and reach 2048 — strategic puzzle fun!"
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
                <p className="text-sm text-muted-foreground">Best: {bestScore}</p>
              </div>
              <button 
                onClick={initGame}
                className="neon-btn"
                data-testid="restart-game"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Game
              </button>
            </div>

            {(gameOver || won) && (
              <div className="text-center mb-4 p-4 glass rounded-lg animate-pulse-neon">
                <p className="text-lg font-bold text-primary">
                  {won ? '🎉 Victory! You reached 2048!' : '💀 Game Over!'}
                </p>
              </div>
            )}

            <div className="max-w-md mx-auto bg-gray-800/30 p-4 rounded-2xl">
              {grid.map((row, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  {row.map((cell, j) => (
                    <div
                      key={j}
                      className={`
                        w-full aspect-square rounded-lg flex items-center justify-center
                        text-2xl font-bold transition-all duration-200 transform
                        ${cell ? getTileColor(cell) + ' scale-100 animate-bounceIn' : 'bg-gray-700/30'}
                        ${cell === 2048 ? 'animate-pulse-neon' : ''}
                      `}
                      data-testid={`tile-${i}-${j}`}
                    >
                      {cell || ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 max-w-xs mx-auto">
              <div></div>
              <button 
                onClick={() => move('up')}
                className="neon-btn"
                data-testid="move-up"
              >
                ↑
              </button>
              <div></div>
              <button 
                onClick={() => move('left')}
                className="neon-btn"
                data-testid="move-left"
              >
                ←
              </button>
              <button 
                onClick={() => move('down')}
                className="neon-btn"
                data-testid="move-down"
              >
                ↓
              </button>
              <button 
                onClick={() => move('right')}
                className="neon-btn"
                data-testid="move-right"
              >
                →
              </button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 text-center">
            <h3 className="font-bold text-lg text-primary mb-2">How to Play</h3>
            <p className="text-muted-foreground">
              Use arrow keys or buttons to slide tiles. When two tiles with the same number touch, they merge into one! 
              Reach the 2048 tile to win! 🎯
            </p>
            <p className="text-primary mt-4 font-semibold">
              Strategy beats luck every time! 🧠
            </p>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
