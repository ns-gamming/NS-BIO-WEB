
import { Loader2, Gamepad2, Sparkles, Zap, Star, Rocket, Trophy } from "lucide-react";
import { useState, useEffect } from "react";

const funnyMessages = [
  "Bas 2 second... Almost ready! 🎮",
  "Loading ho raha hai bhai... Patience! 😄",
  "Thoda wait karo yaar... Magic happening! ✨",
  "Boss aa raha hai... Get ready! 🔥",
  "Lag nahi raha, load ho raha hai! 🚀",
  "Chill karo bhai, ban raha hai! 😎",
  "Arre bhai bhai bhai... Loading! 🎯",
  "Thoda sa aur... Almost there yaar! 💪",
  "Pro tip: Patience is key! 🏆",
  "Ekdum jhakaas experience incoming! 🌟"
];

const welcomeMessages = [
  "Welcome to NS GAMMING! 🎮",
  "Swagat hai aapka! 🙏",
  "Get ready for awesomeness! 🚀",
  "NS GAMMING mein aapka swagat hai! ✨",
  "Prepare for epic content! 🔥",
  "Welcome aboard, champ! 🏆"
];

export default function PageLoader() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [currentWelcome, setCurrentWelcome] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Rotate funny messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % funnyMessages.length);
    }, 2000);

    // Rotate welcome messages
    const welcomeInterval = setInterval(() => {
      setCurrentWelcome((prev) => (prev + 1) % welcomeMessages.length);
    }, 2500);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 200);

    // Show welcome after 1 second
    setTimeout(() => setShowWelcome(true), 1000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(welcomeInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-950 via-purple-950 to-black overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-particle opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        />
      ))}

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 max-w-2xl w-full">
        
        {/* Animated Logo with Multiple Effects */}
        <div className="relative">
          {/* Rotating Ring */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="w-32 h-32 border-4 border-transparent border-t-cyan-400 border-r-purple-400 rounded-full"></div>
          </div>
          
          {/* Pulsing Rings */}
          <div className="absolute inset-0 animate-ping opacity-20">
            <Gamepad2 className="w-32 h-32 text-cyan-400" />
          </div>
          <div className="absolute inset-0 animate-pulse opacity-40" style={{ animationDelay: '0.3s' }}>
            <Gamepad2 className="w-32 h-32 text-purple-400" />
          </div>
          
          {/* Main Icon */}
          <div className="relative animate-float">
            <Gamepad2 className="w-32 h-32 text-cyan-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]" />
            
            {/* Sparkles Around Icon */}
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
            <Zap className="absolute -bottom-2 -left-2 w-8 h-8 text-purple-400 animate-bounce" />
            <Star className="absolute top-0 -left-4 w-6 h-6 text-pink-400 animate-ping" />
            <Rocket className="absolute -top-4 right-2 w-6 h-6 text-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>

        {/* Welcome Message with Fade Animation */}
        {showWelcome && (
          <div className="animate-fadeUp">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-center mb-2 animate-textShine" 
                style={{ backgroundSize: '200% auto', animation: 'textShine 3s linear infinite' }}>
              {welcomeMessages[currentWelcome]}
            </h1>
          </div>
        )}

        {/* Loading Text with Multiple Animations */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center gap-3 animate-bounceIn">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              Loading NS GAMMING
              <Trophy className="w-7 h-7 text-yellow-400 animate-bounce" />
            </h2>
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" style={{ animationDirection: 'reverse' }} />
          </div>

          {/* Funny Hinglish Message */}
          <p className="text-lg text-cyan-300 animate-pulse text-center px-4 min-h-[2rem]">
            {funnyMessages[currentMessage]}
          </p>
        </div>

        {/* Progress Bar with Glow */}
        <div className="w-full max-w-md relative">
          <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-cyan-500/30">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full transition-all duration-300 relative"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
            </div>
          </div>
          <p className="text-cyan-400 text-sm text-center mt-2 font-mono">
            {Math.min(Math.round(progress), 100)}% Complete
          </p>
        </div>

        {/* Bouncing Dots with Stagger */}
        <div className="flex gap-3">
          {[0, 0.15, 0.3].map((delay, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 animate-bounce shadow-lg shadow-cyan-400/50"
              style={{ animationDelay: `${delay}s` }}
            ></div>
          ))}
        </div>

        {/* Fun Rotating Icons */}
        <div className="flex gap-6 mt-4">
          <Star className="w-8 h-8 text-yellow-400 animate-spin-slow" />
          <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
          <Zap className="w-8 h-8 text-cyan-400 animate-bounce" />
          <Trophy className="w-8 h-8 text-purple-400 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
        </div>

        {/* Bottom Tagline with Wave Effect */}
        <p className="text-sm text-gray-400 text-center animate-fadeUp mt-4">
          <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>G</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>e</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>t</span>
          <span className="inline-block mx-2">🔥</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>R</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>e</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.5s' }}>a</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.6s' }}>d</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.7s' }}>y</span>
          <span className="inline-block mx-2">🚀</span>
        </p>
      </div>

      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
