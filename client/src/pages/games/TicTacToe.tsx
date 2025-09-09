import { useState, useCallback } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft } from "lucide-react";

type Player = 'X' | 'O' | '';
type Board = Player[];

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameActive, setGameActive] = useState(true);
  const [status, setStatus] = useState("Player X's turn");

  const checkWinner = useCallback((board: Board): Player => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return '';
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

  const handleMove = useCallback((index: number) => {
    if (board[index] !== '' || !gameActive) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setStatus(`Player ${winner} wins! 🎉`);
      setGameActive(false);
      showVictoryToast(`Woh! Player ${winner} won — proud of your grind! ❤️`);
      return;
    }

    if (newBoard.every(cell => cell !== '')) {
      setStatus("It's a draw! 🤝");
      setGameActive(false);
      showVictoryToast("Good game! Try again for the victory! 💪");
      return;
    }

    const nextPlayer: Player = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);
    setStatus(`Player ${nextPlayer}'s turn`);
  }, [board, currentPlayer, gameActive, checkWinner, showVictoryToast]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(''));
    setCurrentPlayer('X');
    setGameActive(true);
    setStatus("Player X's turn");
  }, []);

  return (
    <div className="pt-16">
      <HeroSection 
        title="Tic Tac Toe"
        subtitle="Three in a row wins! Best of luck! 🎯"
      />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-2xl p-8 mb-8" data-testid="tictactoe-game">
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6" data-testid="game-board">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleMove(index)}
                  className="w-16 h-16 bg-muted border-2 border-primary rounded-lg text-2xl font-bold text-primary hover:bg-primary hover:text-black transition-colors disabled:cursor-not-allowed"
                  disabled={!gameActive || cell !== ''}
                  data-testid={`cell-${index}`}
                >
                  {cell}
                </button>
              ))}
            </div>
            
            <div className="space-x-4 mb-4">
              <button 
                onClick={resetGame} 
                className="neon-btn"
                data-testid="reset-game"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Game
              </button>
              <Link href="/games" className="neon-btn" data-testid="back-to-games">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Games
              </Link>
            </div>
            
            <div 
              className="text-lg font-semibold text-primary" 
              data-testid="game-status"
            >
              {status}
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center" data-testid="game-motivation">
            <h3 className="text-xl font-bold text-primary mb-3">Strategy Time! 🧠</h3>
            <p className="text-muted-foreground">
              Think ahead, plan your moves, and may the best strategist win! 
              Remember — sometimes the simplest games teach us the most about thinking ahead. 
              <span className="text-primary">Keep your mind sharp! ⚡</span>
            </p>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
