import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft, Play, Shuffle } from "lucide-react";

const GRID_SIZE = 3;
const TILE_COLORS = [
  "bg-gradient-to-br from-blue-400 to-blue-600",
  "bg-gradient-to-br from-purple-400 to-purple-600",
  "bg-gradient-to-br from-pink-400 to-pink-600",
  "bg-gradient-to-br from-red-400 to-red-600",
  "bg-gradient-to-br from-orange-400 to-orange-600",
  "bg-gradient-to-br from-yellow-400 to-yellow-600",
  "bg-gradient-to-br from-green-400 to-green-600",
  "bg-gradient-to-br from-cyan-400 to-cyan-600"
];

export default function SlidingPuzzle() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [bestMoves, setBestMoves] = useState<number | null>(null);

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
    }, 3000);
  }, []);

  const initializePuzzle = useCallback(() => {
    const solvedState = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
    return solvedState;
  }, []);

  const shufflePuzzle = useCallback((tiles: number[]) => {
    const shuffled = [...tiles];
    
    // Shuffle with valid moves to ensure solvability
    for (let i = 0; i < 100; i++) {
      const emptyIndex = shuffled.indexOf(0);
      const validMoves = getValidMoves(emptyIndex);
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      [shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]];
    }
    
    return shuffled;
  }, []);

  const getValidMoves = (emptyIndex: number) => {
    const row = Math.floor(emptyIndex / GRID_SIZE);
    const col = emptyIndex % GRID_SIZE;
    const moves = [];

    if (row > 0) moves.push(emptyIndex - GRID_SIZE); // Up
    if (row < GRID_SIZE - 1) moves.push(emptyIndex + GRID_SIZE); // Down
    if (col > 0) moves.push(emptyIndex - 1); // Left
    if (col < GRID_SIZE - 1) moves.push(emptyIndex + 1); // Right

    return moves;
  };

  const isSolvedState = (tiles: number[]) => {
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i] !== i) return false;
    }
    return true;
  };

  const startGame = useCallback(() => {
    const initial = initializePuzzle();
    const shuffled = shufflePuzzle(initial);
    setTiles(shuffled);
    setMoves(0);
    setIsPlaying(true);
    setIsSolved(false);
  }, [initializePuzzle, shufflePuzzle]);

  const resetGame = useCallback(() => {
    setTiles([]);
    setMoves(0);
    setIsPlaying(false);
    setIsSolved(false);
  }, []);

  const handleTileClick = useCallback((index: number) => {
    if (!isPlaying || isSolved) return;

    const emptyIndex = tiles.indexOf(0);
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves(prev => prev + 1);

      // Check if solved
      if (isSolvedState(newTiles)) {
        setIsSolved(true);
        setIsPlaying(false);
        
        if (bestMoves === null || moves + 1 < bestMoves) {
          setBestMoves(moves + 1);
          showToast(`🎉 Puzzle Solved in ${moves + 1} moves! New Record! 🏆`);
        } else {
          showToast(`✨ Puzzle Solved in ${moves + 1} moves! Great job!`);
        }
      }
    }
  }, [tiles, isPlaying, isSolved, moves, bestMoves, showToast]);

  useEffect(() => {
    if (tiles.length === 0) {
      setTiles(initializePuzzle());
    }
  }, [tiles, initializePuzzle]);

  return (
    <div className="pt-16">
      <HeroSection 
        title="Sliding Puzzle"
        subtitle="Arrange the tiles in order! Can you solve it? 🧩"
      />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-8 animate-fadeIn">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass rounded-xl p-4 text-center" data-testid="moves-display">
                <div className="text-sm text-muted-foreground mb-1">Moves</div>
                <div className="text-3xl font-bold text-primary">{moves}</div>
              </div>
              <div className="glass rounded-xl p-4 text-center" data-testid="best-display">
                <div className="text-sm text-muted-foreground mb-1">Best</div>
                <div className="text-3xl font-bold text-green-500">
                  {bestMoves !== null ? bestMoves : "-"}
                </div>
              </div>
            </div>

            {/* Puzzle Grid */}
            <div className="glass rounded-xl p-6 mb-6">
              <div 
                className="grid gap-2 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                  maxWidth: '400px'
                }}
                data-testid="puzzle-grid"
              >
                {tiles.map((tile, index) => (
                  <div
                    key={index}
                    onClick={() => handleTileClick(index)}
                    className={`
                      aspect-square rounded-xl flex items-center justify-center text-3xl font-bold
                      transition-all duration-300 cursor-pointer
                      ${tile === 0 
                        ? 'bg-transparent' 
                        : `${TILE_COLORS[tile - 1]} text-white shadow-lg hover:scale-105 hover:shadow-xl`
                      }
                    `}
                    data-testid={`tile-${tile}`}
                  >
                    {tile !== 0 && tile}
                  </div>
                ))}
              </div>
            </div>

            {/* Victory Message */}
            {isSolved && (
              <div className="glass rounded-xl p-6 mb-6 text-center border-2 border-green-500 animate-pulse-neon" data-testid="victory-message">
                <div className="text-4xl mb-2">🎉</div>
                <div className="text-xl font-bold text-green-500">Puzzle Solved!</div>
                <div className="text-muted-foreground mt-2">You did it in {moves} moves!</div>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-4">
              <button
                onClick={startGame}
                className="flex-1 neon-btn"
                data-testid="button-shuffle"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                {isPlaying ? "New Puzzle" : "Start"}
              </button>
              {isPlaying && (
                <button
                  onClick={resetGame}
                  className="flex-1 btn-secondary"
                  data-testid="button-reset"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </button>
              )}
            </div>

            {/* Instructions */}
            <div className="glass rounded-xl p-6 mt-6" data-testid="game-instructions">
              <h3 className="text-lg font-semibold text-primary mb-3">How to Play 🎮</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Click on tiles next to the empty space to move them</p>
                <p>• Arrange tiles in numerical order (1-8)</p>
                <p>• Complete the puzzle in the fewest moves possible</p>
                <p><strong className="text-foreground">Desktop & Mobile:</strong> Click/Tap tiles to move</p>
                <p className="text-primary">💡 Think ahead! Plan your moves to solve faster!</p>
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
