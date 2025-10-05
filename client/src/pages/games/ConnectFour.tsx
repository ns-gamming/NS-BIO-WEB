import { useState, useCallback } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft, Play } from "lucide-react";

const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const PLAYER = 1;
const AI = 2;

export default function ConnectFour() {
  const [board, setBoard] = useState<number[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY)));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerWins, setPlayerWins] = useState(0);
  const [aiWins, setAiWins] = useState(0);

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
    }, 2500);
  }, []);

  const checkWinner = useCallback((board: number[][], row: number, col: number, player: number): boolean => {
    // Horizontal
    let count = 1;
    for (let c = col - 1; c >= 0 && board[row][c] === player; c--) count++;
    for (let c = col + 1; c < COLS && board[row][c] === player; c++) count++;
    if (count >= 4) return true;

    // Vertical
    count = 1;
    for (let r = row - 1; r >= 0 && board[r][col] === player; r--) count++;
    for (let r = row + 1; r < ROWS && board[r][col] === player; r++) count++;
    if (count >= 4) return true;

    // Diagonal \
    count = 1;
    for (let r = row - 1, c = col - 1; r >= 0 && c >= 0 && board[r][c] === player; r--, c--) count++;
    for (let r = row + 1, c = col + 1; r < ROWS && c < COLS && board[r][c] === player; r++, c++) count++;
    if (count >= 4) return true;

    // Diagonal /
    count = 1;
    for (let r = row - 1, c = col + 1; r >= 0 && c < COLS && board[r][c] === player; r--, c++) count++;
    for (let r = row + 1, c = col - 1; r < ROWS && c >= 0 && board[r][c] === player; r++, c--) count++;
    if (count >= 4) return true;

    return false;
  }, []);

  const dropPiece = useCallback((board: number[][], col: number, player: number): number => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === EMPTY) {
        board[row][col] = player;
        return row;
      }
    }
    return -1;
  }, []);

  const getAIMove = useCallback((board: number[][]): number => {
    // Simple AI: Try to win, block player, or random
    for (let col = 0; col < COLS; col++) {
      const testBoard = board.map(row => [...row]);
      const row = dropPiece(testBoard, col, AI);
      if (row !== -1 && checkWinner(testBoard, row, col, AI)) {
        return col;
      }
    }

    // Block player
    for (let col = 0; col < COLS; col++) {
      const testBoard = board.map(row => [...row]);
      const row = dropPiece(testBoard, col, PLAYER);
      if (row !== -1 && checkWinner(testBoard, row, col, PLAYER)) {
        return col;
      }
    }

    // Random valid move
    const validCols = [];
    for (let col = 0; col < COLS; col++) {
      if (board[0][col] === EMPTY) validCols.push(col);
    }
    return validCols[Math.floor(Math.random() * validCols.length)];
  }, [dropPiece, checkWinner]);

  const handleColumnClick = useCallback((col: number) => {
    if (gameOver || currentPlayer === AI || !isPlaying) return;

    const newBoard = board.map(row => [...row]);
    const row = dropPiece(newBoard, col, PLAYER);

    if (row === -1) return; // Column full

    setBoard(newBoard);

    if (checkWinner(newBoard, row, col, PLAYER)) {
      setGameOver(true);
      setWinner(PLAYER);
      setPlayerWins(prev => prev + 1);
      showToast("🎉 You Win! Great strategy! 🏆");
      return;
    }

    // Check draw
    if (newBoard[0].every(cell => cell !== EMPTY)) {
      setGameOver(true);
      showToast("It's a Draw! Try again! 🤝");
      return;
    }

    setCurrentPlayer(AI);

    // AI turn
    setTimeout(() => {
      const aiCol = getAIMove(newBoard);
      if (aiCol !== undefined) {
        const aiRow = dropPiece(newBoard, aiCol, AI);
        if (aiRow !== -1) {
          setBoard([...newBoard]);

          if (checkWinner(newBoard, aiRow, aiCol, AI)) {
            setGameOver(true);
            setWinner(AI);
            setAiWins(prev => prev + 1);
            showToast("AI Wins! Better luck next time! 🤖");
          } else if (newBoard[0].every(cell => cell !== EMPTY)) {
            setGameOver(true);
            showToast("It's a Draw! Try again! 🤝");
          }
        }
      }
      setCurrentPlayer(PLAYER);
    }, 500);
  }, [board, currentPlayer, gameOver, isPlaying, dropPiece, checkWinner, getAIMove, showToast]);

  const startGame = useCallback(() => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY)));
    setCurrentPlayer(PLAYER);
    setGameOver(false);
    setWinner(null);
    setIsPlaying(true);
  }, []);

  const resetGame = useCallback(() => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY)));
    setCurrentPlayer(PLAYER);
    setGameOver(false);
    setWinner(null);
    setIsPlaying(false);
    setPlayerWins(0);
    setAiWins(0);
  }, []);

  const getCellColor = (value: number) => {
    if (value === PLAYER) return "bg-gradient-to-br from-blue-400 to-blue-600";
    if (value === AI) return "bg-gradient-to-br from-red-400 to-red-600";
    return "bg-background/50";
  };

  return (
    <div className="pt-16">
      <HeroSection 
        title="Connect Four"
        subtitle="Get four in a row to win! Strategy game! 🔴🔵"
      />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="glass rounded-2xl p-8 animate-fadeIn">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-xl p-4 text-center" data-testid="player-wins">
                <div className="text-sm text-muted-foreground mb-1">You</div>
                <div className="text-3xl font-bold text-blue-500">{playerWins}</div>
              </div>
              <div className="glass rounded-xl p-4 text-center" data-testid="turn-indicator">
                <div className="text-sm text-muted-foreground mb-1">Turn</div>
                <div className={`text-2xl font-bold ${currentPlayer === PLAYER ? 'text-blue-500' : 'text-red-500'}`}>
                  {!isPlaying ? '-' : currentPlayer === PLAYER ? '🔵 You' : '🔴 AI'}
                </div>
              </div>
              <div className="glass rounded-xl p-4 text-center" data-testid="ai-wins">
                <div className="text-sm text-muted-foreground mb-1">AI</div>
                <div className="text-3xl font-bold text-red-500">{aiWins}</div>
              </div>
            </div>

            {/* Game Board */}
            {isPlaying ? (
              <div className="glass rounded-xl p-6 mb-6">
                <div 
                  className="grid gap-2 mx-auto p-4 bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-xl"
                  style={{
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                    maxWidth: '500px'
                  }}
                  data-testid="board-grid"
                >
                  {board.map((row, rowIndex) => 
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleColumnClick(colIndex)}
                        className={`
                          aspect-square rounded-full flex items-center justify-center
                          transition-all duration-300 cursor-pointer border-2 border-white/10
                          ${getCellColor(cell)}
                          ${cell === EMPTY && currentPlayer === PLAYER && !gameOver ? 'hover:scale-110 hover:border-blue-400' : ''}
                          ${cell !== EMPTY ? 'shadow-lg' : ''}
                        `}
                        data-testid={`cell-${rowIndex}-${colIndex}`}
                      />
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {gameOver ? `Game Over! ${winner === PLAYER ? 'You Win!' : winner === AI ? 'AI Wins!' : "It's a Draw!"}` : "Ready for Connect Four?"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  Connect 4 pieces in a row to win!
                </p>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-4">
              <button
                onClick={startGame}
                className="flex-1 neon-btn"
                data-testid="button-start"
              >
                <Play className="w-4 h-4 mr-2" />
                {gameOver ? "Play Again" : "Start Game"}
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
                <p>• Click on any column to drop your piece (blue)</p>
                <p>• Connect 4 pieces horizontally, vertically, or diagonally</p>
                <p>• Block the AI (red) from getting 4 in a row</p>
                <p><strong className="text-foreground">Desktop & Mobile:</strong> Click/Tap columns</p>
                <p className="text-primary">💡 Think ahead! Plan your moves strategically!</p>
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
