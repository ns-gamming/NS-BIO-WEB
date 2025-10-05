import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import HeroSection from "../../components/HeroSection";
import AdSenseAd from "../../components/AdSenseAd";
import { RotateCcw, ArrowLeft, Play, Zap } from "lucide-react";

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog near the riverbank on a sunny afternoon.",
  "Programming is the art of telling a computer what to do with precision and creativity.",
  "Nishant loves creating games and websites that bring joy to people around the world.",
  "NS GAMMING is a channel where gaming meets coding and creativity knows no bounds.",
  "Type as fast as you can while maintaining accuracy to achieve the highest score possible.",
  "Practice makes perfect when it comes to improving your typing speed and accuracy.",
  "Every keystroke brings you closer to mastering the art of fast and precise typing.",
  "The journey of a thousand words begins with a single letter typed on your keyboard."
];

export default function TypingSpeed() {
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [highestWpm, setHighestWpm] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const startGame = useCallback(() => {
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setText(randomText);
    setUserInput("");
    setStartTime(Date.now());
    setEndTime(null);
    setIsPlaying(true);
    setWpm(0);
    setAccuracy(100);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
  }, []);

  const calculateWPM = useCallback((inputLength: number, timeInMs: number) => {
    const minutes = timeInMs / 60000;
    const words = inputLength / 5;
    return Math.round(words / minutes);
  }, []);

  const calculateAccuracy = useCallback(() => {
    if (!userInput) return 100;
    
    let correct = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) {
        correct++;
      }
    }
    return Math.round((correct / userInput.length) * 100);
  }, [userInput, text]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPlaying || !startTime) return;

    const value = e.target.value;
    setUserInput(value);

    // Calculate live stats
    const currentTime = Date.now() - startTime;
    const currentWpm = calculateWPM(value.length, currentTime);
    setWpm(currentWpm);

    const currentAccuracy = calculateAccuracy();
    setAccuracy(currentAccuracy);

    // Check if completed
    if (value === text) {
      setEndTime(Date.now());
      setIsPlaying(false);
      
      if (currentWpm > highestWpm) {
        setHighestWpm(currentWpm);
        showToast(`🎉 New Record! ${currentWpm} WPM with ${currentAccuracy}% accuracy! 🏆`);
      } else {
        showToast(`✨ Completed! ${currentWpm} WPM with ${currentAccuracy}% accuracy!`);
      }
    }
  }, [isPlaying, startTime, text, calculateWPM, calculateAccuracy, highestWpm, showToast]);

  const getCharacterClass = (index: number) => {
    if (index >= userInput.length) {
      return "text-muted-foreground";
    }
    return userInput[index] === text[index] ? "text-green-500" : "text-red-500 bg-red-500/20";
  };

  return (
    <div className="pt-16">
      <HeroSection 
        title="Typing Speed Test"
        subtitle="How fast can you type? Test your skills! ⌨️"
      />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 animate-fadeIn">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="glass rounded-xl p-4 text-center" data-testid="wpm-display">
                <div className="text-sm text-muted-foreground mb-1">WPM</div>
                <div className="text-3xl font-bold text-primary">{wpm}</div>
              </div>
              <div className="glass rounded-xl p-4 text-center" data-testid="accuracy-display">
                <div className="text-sm text-muted-foreground mb-1">Accuracy</div>
                <div className="text-3xl font-bold text-yellow-500">{accuracy}%</div>
              </div>
              <div className="glass rounded-xl p-4 text-center" data-testid="progress-display">
                <div className="text-sm text-muted-foreground mb-1">Progress</div>
                <div className="text-3xl font-bold text-green-500">
                  {text ? Math.round((userInput.length / text.length) * 100) : 0}%
                </div>
              </div>
              <div className="glass rounded-xl p-4 text-center" data-testid="highscore-display">
                <div className="text-sm text-muted-foreground mb-1">Best WPM</div>
                <div className="text-3xl font-bold text-orange-500">{highestWpm}</div>
              </div>
            </div>

            {/* Game Area */}
            {isPlaying || endTime ? (
              <div className="space-y-6">
                {/* Text Display */}
                <div className="glass rounded-xl p-6" data-testid="text-display">
                  <div className="text-2xl leading-relaxed font-mono">
                    {text.split("").map((char, index) => (
                      <span
                        key={index}
                        className={`${getCharacterClass(index)} transition-colors duration-100`}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Input Field */}
                <div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    disabled={!isPlaying}
                    className="w-full glass rounded-xl p-4 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary border-2 border-transparent transition-all disabled:opacity-50"
                    placeholder={isPlaying ? "Start typing here..." : "Click Start to play"}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-testid="input-typing"
                  />
                </div>

                {/* Progress Bar */}
                <div className="glass rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-300"
                    style={{ width: `${text ? (userInput.length / text.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⌨️</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Test Your Typing Speed?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Type the text as fast and accurately as you can!
                </p>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={startGame}
                className="flex-1 neon-btn"
                data-testid="button-start"
              >
                <Play className="w-4 h-4 mr-2" />
                {endTime ? "Try Again" : "Start Test"}
              </button>
              {(isPlaying || endTime) && (
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
                <p>• Click "Start Test" to begin</p>
                <p>• Type the displayed text as fast as possible</p>
                <p>• Green letters = correct, Red letters = wrong</p>
                <p>• WPM (Words Per Minute) shows your typing speed</p>
                <p>• Accuracy shows how correctly you're typing</p>
                <p className="text-primary">💡 Focus on accuracy first, speed will follow!</p>
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
