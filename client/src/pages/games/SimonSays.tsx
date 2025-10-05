import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft, Volume2, Trophy } from "lucide-react";

type Color = 'red' | 'blue' | 'green' | 'yellow';

const COLORS = {
  red: { bg: 'bg-red-500', glow: 'shadow-red-500/50' },
  blue: { bg: 'bg-blue-500', glow: 'shadow-blue-500/50' },
  green: { bg: 'bg-green-500', glow: 'shadow-green-500/50' },
  yellow: { bg: 'bg-yellow-500', glow: 'shadow-yellow-500/50' }
};

export default function SimonSays() {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Color[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [gameMessage, setGameMessage] = useState("Press Start to Begin!");
  const audioRef = useRef<{ [key in Color]?: HTMLAudioElement }>({});

  useEffect(() => {
    const savedHighScore = localStorage.getItem('simonHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  const playSound = useCallback((color: Color) => {
    const frequencies = { red: 329.63, blue: 261.63, green: 392.00, yellow: 493.88 };
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.frequency.value = frequencies[color];
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    oscillator.stop(context.currentTime + 0.3);
  }, []);

  const flashColor = useCallback((color: Color) => {
    setActiveColor(color);
    playSound(color);
    setTimeout(() => setActiveColor(null), 300);
  }, [playSound]);

  const playSequence = useCallback(async (seq: Color[]) => {
    setIsPlayerTurn(false);
    setGameMessage("Watch the pattern! 👀");
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      flashColor(seq[i]);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsPlayerTurn(true);
    setGameMessage("Your turn! Repeat the pattern! 🎯");
  }, [flashColor]);

  const startGame = useCallback(() => {
    const colors: Color[] = ['red', 'blue', 'green', 'yellow'];
    const firstColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence([firstColor]);
    setPlayerSequence([]);
    setScore(0);
    setIsPlaying(true);
    setGameMessage("Get ready! 🚀");
    setTimeout(() => playSequence([firstColor]), 1000);
  }, [playSequence]);

  const handleColorClick = useCallback((color: Color) => {
    if (!isPlayerTurn || !isPlaying) return;

    flashColor(color);
    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setIsPlaying(false);
      setIsPlayerTurn(false);
      setGameMessage(`Game Over! Final Score: ${score} 💀`);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('simonHighScore', score.toString());
        setTimeout(() => alert(`🎉 New High Score: ${score}! You're a legend! 🏆`), 500);
      }
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      setPlayerSequence([]);
      setGameMessage("Perfect! Next level! 🔥");
      
      setTimeout(() => {
        const colors: Color[] = ['red', 'blue', 'green', 'yellow'];
        const nextColor = colors[Math.floor(Math.random() * colors.length)];
        const newSequence = [...sequence, nextColor];
        setSequence(newSequence);
        playSequence(newSequence);
      }, 1500);
    }
  }, [isPlayerTurn, isPlaying, playerSequence, sequence, score, highScore, flashColor, playSequence]);

  return (
    <div className="pt-16">
      <HeroSection 
        title="🎯 Simon Says"
        subtitle="Test your memory and reflexes — how long can you remember?"
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
                <p className="text-sm text-muted-foreground">High Score: {highScore}</p>
              </div>
              <button 
                onClick={startGame}
                className="neon-btn"
                data-testid="start-game"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isPlaying ? 'Restart' : 'Start Game'}
              </button>
            </div>

            <div className="text-center mb-8">
              <p className="text-lg font-semibold text-primary animate-pulse" data-testid="game-status">
                {gameMessage}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto aspect-square">
              {(Object.keys(COLORS) as Color[]).map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorClick(color)}
                  disabled={!isPlayerTurn}
                  className={`
                    ${COLORS[color].bg} 
                    rounded-2xl 
                    transition-all 
                    duration-200 
                    transform 
                    hover:scale-105
                    ${activeColor === color ? `scale-110 shadow-2xl ${COLORS[color].glow} brightness-150` : 'brightness-75'}
                    ${!isPlayerTurn ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:brightness-100'}
                    disabled:cursor-not-allowed
                  `}
                  data-testid={`color-${color}`}
                  aria-label={`${color} button`}
                />
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 text-center">
            <h3 className="font-bold text-lg text-primary mb-2">How to Play</h3>
            <p className="text-muted-foreground">
              Watch the pattern carefully, then repeat it by clicking the colored pads in the same order. 
              Each round adds a new color to the sequence. How far can you go? 🎮
            </p>
            <p className="text-primary mt-4 font-semibold">
              Memory is muscle — train it every day! 🧠
            </p>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
