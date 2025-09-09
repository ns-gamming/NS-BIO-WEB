import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft, Star } from "lucide-react";

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOLS = ['🎮', '🚀', '⚡', '🔥', '💎', '🌟', '🎯', '💫'];

export default function Memory() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

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

  const initializeGame = useCallback(() => {
    const shuffledSymbols = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledSymbols);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameComplete(false);
    setStartTime(Date.now());
    setEndTime(null);
  }, []);

  const flipCard = useCallback((cardId: number) => {
    if (flippedCards.length === 2 || gameComplete) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    setFlippedCards(prev => [...prev, cardId]);
  }, [cards, flippedCards, gameComplete]);

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      setMoves(prev => prev + 1);

      if (firstCard?.symbol === secondCard?.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  // Check for game completion
  useEffect(() => {
    if (matches === SYMBOLS.length && !gameComplete) {
      setGameComplete(true);
      setEndTime(Date.now());
      const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
      showVictoryToast(`Brilliant! Memory master! Completed in ${timeTaken}s with ${moves} moves! 🧠✨`);
    }
  }, [matches, gameComplete, startTime, moves, showVictoryToast]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const getGameTime = () => {
    if (!startTime) return 0;
    const endTimeToUse = endTime || Date.now();
    return Math.round((endTimeToUse - startTime) / 1000);
  };

  return (
    <div className="pt-16">
      <HeroSection 
        title="Memory Match"
        subtitle="Test your memory skills! Match the pairs! 🧠"
      />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass rounded-2xl p-8 mb-8" data-testid="memory-game">
            {/* Game Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6" data-testid="game-stats">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="moves-count">{moves}</div>
                <div className="text-sm text-muted-foreground">Moves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent" data-testid="matches-count">{matches}</div>
                <div className="text-sm text-muted-foreground">Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary" data-testid="time-display">{getGameTime()}s</div>
                <div className="text-sm text-muted-foreground">Time</div>
              </div>
            </div>

            {/* Game Board */}
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-6" data-testid="memory-board">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => flipCard(card.id)}
                  className={`aspect-square text-2xl font-bold rounded-lg border-2 transition-all duration-300 ${
                    card.isFlipped || card.isMatched
                      ? 'bg-primary border-primary text-black'
                      : 'bg-muted border-muted-foreground hover:border-primary hover:bg-muted/80'
                  } ${card.isMatched ? 'animate-pulse-neon' : ''}`}
                  disabled={card.isFlipped || card.isMatched || gameComplete}
                  data-testid={`memory-card-${card.id}`}
                >
                  {card.isFlipped || card.isMatched ? card.symbol : '?'}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="space-x-4 mb-4">
              <button onClick={initializeGame} className="neon-btn" data-testid="reset-memory-game">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Game
              </button>
              <Link href="/games" className="neon-btn" data-testid="back-to-games-memory">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Games
              </Link>
            </div>

            {gameComplete && (
              <div className="glass bg-accent/20 rounded-lg p-4" data-testid="completion-message">
                <div className="flex items-center justify-center gap-2 text-accent font-bold">
                  <Star className="w-5 h-5" />
                  <span>Perfect! All pairs matched!</span>
                  <Star className="w-5 h-5" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Challenge yourself with a new game!
                </p>
              </div>
            )}
          </div>
          
          <div className="glass rounded-2xl p-6 text-center" data-testid="memory-motivation">
            <h3 className="text-xl font-bold text-primary mb-3">Exercise Your Mind! 🧠</h3>
            <p className="text-muted-foreground">
              Memory games aren't just fun — they're brain training! Each match strengthens your cognitive abilities. 
              The more you practice, the sharper your mind becomes. It's like coding for your brain! 
              <span className="text-primary">Keep those neurons firing! ⚡🧠</span>
            </p>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
