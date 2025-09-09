import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "./components/Navigation";
import ParticleBackground from "./components/ParticleBackground";
import TimeGreeting from "./components/TimeGreeting";
import ScrollToTop from "./components/ScrollToTop";
import EasterEggs from "./components/EasterEggs";
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Games from "./pages/Games";
import Social from "./pages/Social";
import Contact from "./pages/Contact";
import Goals from "./pages/Goals";
import TicTacToe from "./pages/games/TicTacToe";
import Snake from "./pages/games/Snake";
import Memory from "./pages/games/Memory";
import Flappy from "./pages/games/Flappy";
import RockPaperScissors from "./pages/games/RockPaperScissors";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

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
      <Route path="/games/tictactoe" component={TicTacToe} />
      <Route path="/games/snake" component={Snake} />
      <Route path="/games/memory" component={Memory} />
      <Route path="/games/flappy" component={Flappy} />
      <Route path="/games/rps" component={RockPaperScissors} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground relative">
          <ParticleBackground />
          <TimeGreeting />
          <Navigation />
          <main className="relative z-10">
            <Router />
          </main>
          <ScrollToTop />
          <EasterEggs />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
