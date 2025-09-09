import { useState, useEffect } from "react";

export default function TimeGreeting() {
  const [greeting, setGreeting] = useState("");
  const [hinglishPhrase, setHinglishPhrase] = useState("");

  const updateGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    let newGreeting;
    let newHinglishPhrase;

    if (hour >= 5 && hour < 12) {
      newGreeting = "Good morning, gamer!";
      newHinglishPhrase = "Subah ho gayi, chalo code karte hain! ☀️";
    } else if (hour >= 12 && hour < 17) {
      newGreeting = "Good afternoon, coder!";
      newHinglishPhrase = "Dopahar ka josh, keep building! 🌞";
    } else if (hour >= 17 && hour < 21) {
      newGreeting = "Good evening, creator!";
      newHinglishPhrase = "Shaam ho gayi, game time! 🌅";
    } else {
      newGreeting = "Good night, dreamer!";
      newHinglishPhrase = "Raat ka samay, sapne dekho! 🌙";
    }

    setGreeting(newGreeting);
    setHinglishPhrase(newHinglishPhrase);
  };

  useEffect(() => {
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed top-20 left-6 z-40 glass px-4 py-2 rounded-lg animate-fadeUp"
      data-testid="time-greeting"
    >
      <span className="text-sm text-primary block" data-testid="greeting-text">
        {greeting}
      </span>
      <small className="text-xs text-accent" data-testid="hinglish-phrase">
        {hinglishPhrase}
      </small>
    </div>
  );
}
