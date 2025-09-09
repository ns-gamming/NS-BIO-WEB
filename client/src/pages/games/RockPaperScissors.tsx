import { useState, useCallback } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft, Zap } from "lucide-react";

type Choice = 'rock' | 'paper' | 'scissors' | null;
type GameResult = 'win' | 'lose' | 'draw' | null;

interface GameStats {
  wins: number;
  losses: number;
  draws: number;
}

const choices = [
  { value: 'rock' as Choice, emoji: '🪨', name: 'Rock', description: 'Crushes Scissors' },
  { value: 'paper' as Choice, emoji: '📄', name: 'Paper', description: 'Covers Rock' },
  { value: 'scissors' as Choice, emoji: '✂️', name: 'Scissors', description: 'Cuts Paper' }
];

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<GameResult>(null);
  const [stats, setStats] = useState<GameStats>({ wins: 0, losses: 0, draws: 0 });
  const [isRevealing, setIsRevealing] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);

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

  const getRandomChoice = useCallback((): Choice => {
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex].value;
  }, []);

  const determineWinner = useCallback((player: Choice, computer: Choice): GameResult => {
    if (player === computer) return 'draw';
    
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'win';
    }
    
    return 'lose';
  }, []);

  const playRound = useCallback((choice: Choice) => {
    setIsRevealing(true);
    setPlayerChoice(choice);
    
    // Simulate computer "thinking" with animation
    setTimeout(() => {
      const compChoice = getRandomChoice();
      setComputerChoice(compChoice);
      
      const gameResult = determineWinner(choice, compChoice);
      setResult(gameResult);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        wins: gameResult === 'win' ? prev.wins + 1 : prev.wins,
        losses: gameResult === 'lose' ? prev.losses + 1 : prev.losses,
        draws: gameResult === 'draw' ? prev.draws + 1 : prev.draws,
      }));

      setRoundNumber(prev => prev + 1);

      // Show appropriate message
      let message = '';
      switch (gameResult) {
        case 'win':
          message = `Shabash! You won with ${choice}! Computer chose ${compChoice}! 🎉`;
          break;
        case 'lose':
          message = `Better luck next time! Computer's ${compChoice} beat your ${choice}! 💪`;
          break;
        case 'draw':
          message = `It's a tie! Great minds think alike — both chose ${choice}! 🤝`;
          break;
      }
      
      if (message) {
        showVictoryToast(message);
      }
      
      setIsRevealing(false);
    }, 1500);
  }, [getRandomChoice, determineWinner, showVictoryToast]);

  const resetGame = useCallback(() => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setStats({ wins: 0, losses: 0, draws: 0 });
    setIsRevealing(false);
    setRoundNumber(1);
  }, []);

  const getChoiceData = (choice: Choice) => {
    return choices.find(c => c.value === choice);
  };

  const getResultMessage = () => {
    switch (result) {
      case 'win':
        return { text: 'You Win! 🎉', color: 'text-green-500' };
      case 'lose':
        return { text: 'You Lose! 😅', color: 'text-red-500' };
      case 'draw':
        return { text: "It's a Draw! 🤝", color: 'text-yellow-500' };
      default:
        return { text: 'Make your choice!', color: 'text-muted-foreground' };
    }
  };

  const getWinRate = () => {
    const totalGames = stats.wins + stats.losses + stats.draws;
    if (totalGames === 0) return 0;
    return Math.round((stats.wins / totalGames) * 100);
  };

  return (
    <div className="pt-16">
      <HeroSection 
        title="Rock Paper Scissors"
        subtitle="Classic hand game against AI! Can you outsmart the computer? 🤖"
      />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-2xl p-8 mb-8" data-testid="rps-game">
            {/* Game Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8" data-testid="rps-stats">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500" data-testid="wins-count">{stats.wins}</div>
                <div className="text-sm text-muted-foreground">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500" data-testid="losses-count">{stats.losses}</div>
                <div className="text-sm text-muted-foreground">Losses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500" data-testid="draws-count">{stats.draws}</div>
                <div className="text-sm text-muted-foreground">Draws</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="win-rate">{getWinRate()}%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>
            </div>

            {/* Round Number */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-primary" data-testid="round-number">
                Round {roundNumber}
              </h3>
            </div>

            {/* Game Arena */}
            <div className="glass bg-muted/30 rounded-lg p-6 mb-8" data-testid="game-arena">
              <div className="grid grid-cols-3 gap-8 items-center">
                {/* Player Choice */}
                <div className="text-center">
                  <h4 className="font-semibold text-foreground mb-2">You</h4>
                  <div className="w-24 h-24 glass rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-primary">
                    <span className="text-4xl" data-testid="player-choice-display">
                      {playerChoice ? getChoiceData(playerChoice)?.emoji : '❓'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {playerChoice ? getChoiceData(playerChoice)?.name : 'Make your choice'}
                  </p>
                </div>

                {/* VS */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">VS</div>
                  <div className={`mt-2 font-semibold ${getResultMessage().color}`} data-testid="game-result">
                    {getResultMessage().text}
                  </div>
                </div>

                {/* Computer Choice */}
                <div className="text-center">
                  <h4 className="font-semibold text-foreground mb-2">Computer</h4>
                  <div className="w-24 h-24 glass rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-accent">
                    <span className={`text-4xl ${isRevealing ? 'animate-pulse' : ''}`} data-testid="computer-choice-display">
                      {isRevealing ? '🤔' : computerChoice ? getChoiceData(computerChoice)?.emoji : '❓'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isRevealing ? 'Thinking...' : computerChoice ? getChoiceData(computerChoice)?.name : 'Waiting...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Choice Buttons */}
            <div className="grid grid-cols-3 gap-4 mb-6" data-testid="choice-buttons">
              {choices.map((choice) => (
                <button
                  key={choice.value}
                  onClick={() => playRound(choice.value)}
                  disabled={isRevealing}
                  className="glass rounded-lg p-4 hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid={`choice-${choice.value}`}
                >
                  <div className="text-4xl mb-2">{choice.emoji}</div>
                  <div className="font-semibold text-foreground">{choice.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{choice.description}</div>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="space-x-4">
              <button onClick={resetGame} className="neon-btn" data-testid="reset-rps">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Game
              </button>
              <Link href="/games" className="neon-btn" data-testid="back-to-games-rps">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Games
              </Link>
            </div>

            {/* Game Rules */}
            <div className="mt-6 text-xs text-muted-foreground" data-testid="game-rules">
              <p>Rock crushes Scissors • Paper covers Rock • Scissors cuts Paper</p>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6 text-center" data-testid="rps-motivation">
            <h3 className="text-xl font-bold text-primary mb-3">Strategy Meets Luck! 🎯</h3>
            <p className="text-muted-foreground">
              This isn't just about luck — it's about reading patterns and making smart choices! 
              Even the computer has tendencies. The more you play, the better you understand the game. 
              Sometimes the simplest games teach us the most about decision-making and intuition! 
              <span className="text-primary">Trust your instincts and keep playing! 🧠⚡</span>
            </p>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
