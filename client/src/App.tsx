import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/ThemeProvider";
import { GeminiChatbot } from "./components/GeminiChatbot";
import Navigation from "./components/Navigation";
import ParticleBackground from "./components/ParticleBackground";
import TimeGreeting from "./components/TimeGreeting";
import ScrollToTop from "./components/ScrollToTop";
import EasterEggs from "./components/EasterEggs";
import BackButton from "./components/BackButton";
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Games from "./pages/Games";
import Social from "./pages/Social";
import Contact from "./pages/Contact";
import Goals from "./pages/Goals";
import Coding from "./pages/Coding";
import Content from "./pages/Content";
import Community from "./pages/Community";
import Gaming from "./pages/Gaming";
import TicTacToe from "./pages/games/TicTacToe";
import Snake from "./pages/games/Snake";
import Memory from "./pages/games/Memory";
import Flappy from "./pages/games/Flappy";
import RockPaperScissors from "./pages/games/RockPaperScissors";
import SimonSays from "./pages/games/SimonSays";
import Game2048 from "./pages/games/Game2048";
import WhackAMole from "./pages/games/WhackAMole";
import Pong from "./pages/games/Pong";
import ColorMatch from "./pages/games/ColorMatch";
import TypingSpeed from "./pages/games/TypingSpeed";
import SlidingPuzzle from "./pages/games/SlidingPuzzle";
import Breakout from "./pages/games/Breakout";
import ConnectFour from "./pages/games/ConnectFour";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "@/pages/not-found";
import PageLoader from "./components/PageLoader";
import { useEffect, useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/games" component={Games} />
      <Route path="/social" component={Social} />
      <Route path="/contact" component={Contact} />
      <Route path="/goals" component={Goals} />
      <Route path="/coding" component={Coding} />
      <Route path="/content" component={Content} />
      <Route path="/community" component={Community} />
      <Route path="/gaming" component={Gaming} />
      <Route path="/games/tictactoe" component={TicTacToe} />
      <Route path="/games/snake" component={Snake} />
      <Route path="/games/memory" component={Memory} />
      <Route path="/games/flappy" component={Flappy} />
      <Route path="/games/rps" component={RockPaperScissors} />
      <Route path="/games/simon" component={SimonSays} />
      <Route path="/games/2048" component={Game2048} />
      <Route path="/games/whack" component={WhackAMole} />
      <Route path="/games/pong" component={Pong} />
      <Route path="/games/colormatch" component={ColorMatch} />
      <Route path="/games/typing" component={TypingSpeed} />
      <Route path="/games/sliding" component={SlidingPuzzle} />
      <Route path="/games/breakout" component={Breakout} />
      <Route path="/games/connect4" component={ConnectFour} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Console message for developers (Easter Egg)
    console.log(`
🎮 NS GAMMING Website 🎮

Built with ❤️ by Nishant Sarkar

Easter Eggs:
- Press 'N' key for confetti surprise!
- Click on profile avatars for personal messages
- Check the time-aware greeting in top-left

Want a website like this? Contact me!
WhatsApp: https://wa.me/918900653250

Keep coding, keep creating! 🚀
    `);

    // Simulate loading for initial page load (helps with slow networks)
    const minLoadTime = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Also set loading to false when page is fully loaded
    const handleLoad = () => {
      setIsLoading(false);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(minLoadTime);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground relative transition-colors duration-300">
            <ParticleBackground />
            <TimeGreeting />
            <Navigation />
            <main className="relative z-10">
              <Router />
            </main>
            <ScrollToTop />
            <BackButton />
            <EasterEggs />
            <GeminiChatbot />
            <Toaster />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;