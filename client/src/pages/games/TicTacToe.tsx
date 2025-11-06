
import { useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft, Settings, Zap, Trophy, Target } from "lucide-react";

type Player = 'X' | 'O' | '';
type Board = Player[];
type GameMode = 'pvp' | 'ai-easy' | 'ai-medium' | 'ai-hard' | 'ai-impossible';
type BoardSize = 3 | 4 | 5;

interface GameSettings {
  mode: GameMode;
  boardSize: BoardSize;
  playerSymbol: 'X' | 'O';
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

export default function TicTacToe() {
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'ai-medium',
    boardSize: 3,
    playerSymbol: 'X',
    soundEnabled: true,
    animationsEnabled: true,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [board, setBoard] = useState<Board>(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameActive, setGameActive] = useState(true);
  const [status, setStatus] = useState("Player X's turn");
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [draws, setDraws] = useState(0);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const checkWinner = useCallback((board: Board, size: number): { winner: Player; line: number[] | null } => {
    const winPatterns: number[][] = [];
    
    // Rows
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(i * size + j);
      }
      winPatterns.push(row);
    }
    
    // Columns
    for (let i = 0; i < size; i++) {
      const col = [];
      for (let j = 0; j < size; j++) {
        col.push(j * size + i);
      }
      winPatterns.push(col);
    }
    
    // Diagonals
    const diag1 = [];
    const diag2 = [];
    for (let i = 0; i < size; i++) {
      diag1.push(i * size + i);
      diag2.push(i * size + (size - 1 - i));
    }
    winPatterns.push(diag1, diag2);

    for (const pattern of winPatterns) {
      const [a, ...rest] = pattern;
      if (board[a] && rest.every(idx => board[idx] === board[a])) {
        return { winner: board[a], line: pattern };
      }
    }
    return { winner: '', line: null };
  }, []);

  const evaluateBoard = useCallback((board: Board, size: number, player: Player): number => {
    const result = checkWinner(board, size);
    if (result.winner === player) return 10;
    if (result.winner && result.winner !== player) return -10;
    return 0;
  }, [checkWinner]);

  const minimax = useCallback((
    board: Board,
    size: number,
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number,
    aiPlayer: Player
  ): number => {
    const score = evaluateBoard(board, size, aiPlayer);
    
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
      let best = -1000;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = aiPlayer;
          best = Math.max(best, minimax(board, size, depth + 1, false, alpha, beta, aiPlayer));
          board[i] = '';
          alpha = Math.max(alpha, best);
          if (beta <= alpha) break;
        }
      }
      return best;
    } else {
      let best = 1000;
      const opponent: Player = aiPlayer === 'X' ? 'O' : 'X';
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = opponent;
          best = Math.min(best, minimax(board, size, depth + 1, true, alpha, beta, aiPlayer));
          board[i] = '';
          beta = Math.min(beta, best);
          if (beta <= alpha) break;
        }
      }
      return best;
    }
  }, [evaluateBoard]);

  const getAIMove = useCallback((board: Board, size: number, difficulty: GameMode, aiPlayer: Player): number => {
    const emptyCells = board.map((cell, idx) => cell === '' ? idx : -1).filter(idx => idx !== -1);
    
    if (emptyCells.length === 0) return -1;

    switch (difficulty) {
      case 'ai-easy':
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
      
      case 'ai-medium':
        if (Math.random() < 0.5) {
          return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
        // Fall through to hard
      
      case 'ai-hard':
      case 'ai-impossible':
        let bestMove = -1;
        let bestValue = -1000;
        
        for (const move of emptyCells) {
          const newBoard = [...board];
          newBoard[move] = aiPlayer;
          const moveValue = minimax(newBoard, size, 0, false, -1000, 1000, aiPlayer);
          
          if (moveValue > bestValue) {
            bestValue = moveValue;
            bestMove = move;
          }
        }
        
        if (difficulty === 'ai-hard' && Math.random() < 0.2) {
          return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
        
        return bestMove;
      
      default:
        return emptyCells[0];
    }
  }, [minimax]);

  const showVictoryToast = useCallback((message: string) => {
    if (!settings.soundEnabled) return;
    
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
  }, [settings.soundEnabled]);

  const handleMove = useCallback((index: number) => {
    if (board[index] !== '' || !gameActive) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard, settings.boardSize);
    if (result.winner) {
      setStatus(`Player ${result.winner} wins! 🎉`);
      setGameActive(false);
      setWinningLine(result.line);
      
      if (result.winner === settings.playerSymbol) {
        setPlayerScore(prev => prev + 1);
        showVictoryToast(`🎉 Victory! You won! Great strategy! 🏆`);
      } else {
        setAiScore(prev => prev + 1);
        showVictoryToast(`AI wins this round! Try again! 💪`);
      }
      return;
    }

    if (newBoard.every(cell => cell !== '')) {
      setStatus("It's a draw! 🤝");
      setGameActive(false);
      setDraws(prev => prev + 1);
      showVictoryToast("Good game! Try again for the victory! 💪");
      return;
    }

    const nextPlayer: Player = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);
    setStatus(`Player ${nextPlayer}'s turn`);

    // AI move
    if (settings.mode !== 'pvp' && nextPlayer !== settings.playerSymbol) {
      setTimeout(() => {
        const aiMove = getAIMove(newBoard, settings.boardSize, settings.mode, nextPlayer);
        if (aiMove !== -1) {
          newBoard[aiMove] = nextPlayer;
          setBoard([...newBoard]);
          
          const aiResult = checkWinner(newBoard, settings.boardSize);
          if (aiResult.winner) {
            setStatus(`Player ${aiResult.winner} wins! 🎉`);
            setGameActive(false);
            setWinningLine(aiResult.line);
            
            if (aiResult.winner === settings.playerSymbol) {
              setPlayerScore(prev => prev + 1);
              showVictoryToast(`🎉 Victory! You won! Amazing! 🏆`);
            } else {
              setAiScore(prev => prev + 1);
              showVictoryToast(`AI wins! Challenge accepted? 🤖`);
            }
            return;
          }

          if (newBoard.every(cell => cell !== '')) {
            setStatus("It's a draw! 🤝");
            setGameActive(false);
            setDraws(prev => prev + 1);
            showVictoryToast("Draw! Well played! 🤝");
            return;
          }

          setCurrentPlayer(settings.playerSymbol);
          setStatus(`Player ${settings.playerSymbol}'s turn`);
        }
      }, 500);
    }
  }, [board, currentPlayer, gameActive, settings, checkWinner, getAIMove, showVictoryToast]);

  const resetGame = useCallback(() => {
    const size = settings.boardSize * settings.boardSize;
    setBoard(Array(size).fill(''));
    setCurrentPlayer('X');
    setGameActive(true);
    setStatus("Player X's turn");
    setWinningLine(null);
  }, [settings.boardSize]);

  const resetScores = useCallback(() => {
    setPlayerScore(0);
    setAiScore(0);
    setDraws(0);
  }, []);

  const applySettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    const size = newSettings.boardSize * newSettings.boardSize;
    setBoard(Array(size).fill(''));
    setCurrentPlayer('X');
    setGameActive(true);
    setStatus("Player X's turn");
    setWinningLine(null);
    setShowSettings(false);
  }, []);

  useEffect(() => {
    const size = settings.boardSize * settings.boardSize;
    setBoard(Array(size).fill(''));
  }, [settings.boardSize]);

  const getDifficultyLabel = (mode: GameMode) => {
    switch (mode) {
      case 'pvp': return 'Player vs Player';
      case 'ai-easy': return 'AI - Easy';
      case 'ai-medium': return 'AI - Medium';
      case 'ai-hard': return 'AI - Hard';
      case 'ai-impossible': return 'AI - Impossible';
      default: return mode;
    }
  };

  return (
    <div className="pt-16">
      <HeroSection 
        title="Tic Tac Toe AI"
        subtitle="Advanced AI-powered game with customizable settings! 🎯"
      />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-2xl p-8 mb-8" data-testid="tictactoe-game">
            {/* Settings Modal */}
            {showSettings && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="glass rounded-2xl p-6 max-w-md w-full space-y-4">
                  <h3 className="text-xl font-bold text-primary mb-4">Game Settings ⚙️</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Game Mode</label>
                    <select
                      value={settings.mode}
                      onChange={(e) => setSettings({...settings, mode: e.target.value as GameMode})}
                      className="w-full p-2 rounded-lg border-2 border-primary bg-background text-foreground"
                    >
                      <option value="pvp">Player vs Player</option>
                      <option value="ai-easy">AI - Easy</option>
                      <option value="ai-medium">AI - Medium</option>
                      <option value="ai-hard">AI - Hard</option>
                      <option value="ai-impossible">AI - Impossible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Board Size</label>
                    <select
                      value={settings.boardSize}
                      onChange={(e) => setSettings({...settings, boardSize: parseInt(e.target.value) as BoardSize})}
                      className="w-full p-2 rounded-lg border-2 border-primary bg-background text-foreground"
                    >
                      <option value="3">3x3 (Classic)</option>
                      <option value="4">4x4 (Advanced)</option>
                      <option value="5">5x5 (Expert)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Your Symbol</label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setSettings({...settings, playerSymbol: 'X'})}
                        className={`flex-1 p-2 rounded-lg border-2 ${settings.playerSymbol === 'X' ? 'border-primary bg-primary/20' : 'border-muted'}`}
                      >
                        X
                      </button>
                      <button
                        onClick={() => setSettings({...settings, playerSymbol: 'O'})}
                        className={`flex-1 p-2 rounded-lg border-2 ${settings.playerSymbol === 'O' ? 'border-primary bg-primary/20' : 'border-muted'}`}
                      >
                        O
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Sound Effects</span>
                    <button
                      onClick={() => setSettings({...settings, soundEnabled: !settings.soundEnabled})}
                      className={`w-12 h-6 rounded-full transition-colors ${settings.soundEnabled ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Animations</span>
                    <button
                      onClick={() => setSettings({...settings, animationsEnabled: !settings.animationsEnabled})}
                      className={`w-12 h-6 rounded-full transition-colors ${settings.animationsEnabled ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.animationsEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => applySettings(settings)}
                      className="flex-1 neon-btn"
                    >
                      Apply Settings
                    </button>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Score Board */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-xl p-4 text-center">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-primary">{playerScore}</div>
                <div className="text-xs text-muted-foreground">You</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold text-yellow-500">{draws}</div>
                <div className="text-xs text-muted-foreground">Draws</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold text-red-500">{aiScore}</div>
                <div className="text-xs text-muted-foreground">AI</div>
              </div>
            </div>

            {/* Game Info */}
            <div className="mb-4 p-3 glass rounded-xl">
              <div className="text-sm font-semibold text-primary">
                {getDifficultyLabel(settings.mode)} • {settings.boardSize}x{settings.boardSize}
              </div>
            </div>

            {/* Game Board */}
            <div 
              className="grid gap-2 max-w-md mx-auto mb-6" 
              style={{ gridTemplateColumns: `repeat(${settings.boardSize}, 1fr)` }}
              data-testid="game-board"
            >
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleMove(index)}
                  className={`aspect-square bg-muted border-2 border-primary rounded-lg text-2xl md:text-4xl font-bold text-primary hover:bg-primary hover:text-black transition-all duration-300 disabled:cursor-not-allowed ${
                    winningLine?.includes(index) ? 'bg-primary text-black animate-pulse-neon' : ''
                  } ${settings.animationsEnabled ? 'hover:scale-105' : ''}`}
                  disabled={!gameActive || cell !== ''}
                  data-testid={`cell-${index}`}
                >
                  {cell}
                </button>
              ))}
            </div>
            
            <div className="space-y-4 mb-4">
              <div className="flex gap-2">
                <button 
                  onClick={resetGame} 
                  className="flex-1 neon-btn"
                  data-testid="reset-game"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Game
                </button>
                <button 
                  onClick={() => setShowSettings(true)} 
                  className="neon-btn"
                  data-testid="settings-button"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={resetScores} 
                className="w-full btn-secondary text-sm"
              >
                Reset Scores
              </button>
            </div>
            
            <div 
              className="text-lg font-semibold text-primary mb-4" 
              data-testid="game-status"
            >
              {status}
            </div>

            <Link href="/games" className="neon-btn inline-flex items-center" data-testid="back-to-games">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Link>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center" data-testid="game-motivation">
            <h3 className="text-xl font-bold text-primary mb-3">AI-Powered Strategy! 🧠</h3>
            <p className="text-muted-foreground">
              Challenge yourself against advanced AI using the minimax algorithm! 
              Customize board size, difficulty, and settings for the perfect game experience. 
              <span className="text-primary">Can you beat the impossible AI? ⚡</span>
            </p>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
