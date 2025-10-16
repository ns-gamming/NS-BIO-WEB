import { useState, useEffect, useRef } from "react";

const MORNING_GREETINGS = [
  { greeting: "Good morning, gamer!", phrase: "Subah ho gayi, chalo code karte hain! ☀️" },
  { greeting: "Rise and shine, coder!", phrase: "Uth ja bhai, naye games khelte hain! 🌅" },
  { greeting: "Morning vibes, creator!", phrase: "Subah ka coding session shuru karo! 💻" },
  { greeting: "Fresh start, champion!", phrase: "Nayi subah, naye sapne! 🌟" },
  { greeting: "Wake up, developer!", phrase: "Chai peelo aur code likho! ☕" },
  { greeting: "New day, new code!", phrase: "Aaj kuch naya banate hain! 🚀" },
  { greeting: "Morning energy!", phrase: "Subah ki taaza hawa, coding ka maza! 🌤️" },
];

const AFTERNOON_GREETINGS = [
  { greeting: "Good afternoon, coder!", phrase: "Dopahar ka josh, keep building! 🌞" },
  { greeting: "Afternoon power!", phrase: "Lunch ke baad, code strong! 💪" },
  { greeting: "Keep coding, champ!", phrase: "Dopahar ho gayi, break mat lo! 🔥" },
  { greeting: "Midday momentum!", phrase: "Aadha din ho gaya, aur badhte jao! 🎯" },
  { greeting: "Coding continues!", phrase: "Dopahar mein bhi game on! 🎮" },
  { greeting: "Stay focused, dev!", phrase: "Focus rakho, magic hoga! ✨" },
  { greeting: "Afternoon grind!", phrase: "Mehnat karo, kamaal hoga! 🌟" },
];

const EVENING_GREETINGS = [
  { greeting: "Good evening, creator!", phrase: "Shaam ho gayi, game time! 🌅" },
  { greeting: "Evening vibes!", phrase: "Shaam ka maza, gaming ka waqt! 🎮" },
  { greeting: "Sunset coding!", phrase: "Suraj dhal raha hai, code chal raha hai! 🌇" },
  { greeting: "Golden hour, gamer!", phrase: "Shaam ki roshni mein code shine! ✨" },
  { greeting: "Evening energy!", phrase: "Thodi der aur, kamaal karenge! 💫" },
  { greeting: "Prime time, coder!", phrase: "Ab toh full form mein ho! 🚀" },
  { greeting: "Perfect coding time!", phrase: "Shaam perfect hai coding ke liye! 🌆" },
];

const NIGHT_GREETINGS = [
  { greeting: "Good night, dreamer!", phrase: "Raat ka samay, sapne dekho! 🌙" },
  { greeting: "Late night hustle!", phrase: "Raat ko bhi code chalta hai! 🌃" },
  { greeting: "Midnight coder!", phrase: "Raat ke andhere mein code ujala! ⭐" },
  { greeting: "Night owl mode!", phrase: "Raat ka coding session best! 🦉" },
  { greeting: "Stars are out!", phrase: "Taare chamak rahe, code bhi! ✨" },
  { greeting: "Keep grinding!", phrase: "Raat ho ya din, code zaroor! 💻" },
  { greeting: "Peaceful coding!", phrase: "Raat ki shanti mein magic banta hai! 🌌" },
];

export default function TimeGreeting() {
  const [greeting, setGreeting] = useState("");
  const [hinglishPhrase, setHinglishPhrase] = useState("");
  const indexRef = useRef(0);

  const updateGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    
    let greetingsArray;
    
    if (hour >= 5 && hour < 12) {
      greetingsArray = MORNING_GREETINGS;
    } else if (hour >= 12 && hour < 17) {
      greetingsArray = AFTERNOON_GREETINGS;
    } else if (hour >= 17 && hour < 21) {
      greetingsArray = EVENING_GREETINGS;
    } else {
      greetingsArray = NIGHT_GREETINGS;
    }

    const selectedGreeting = greetingsArray[indexRef.current % greetingsArray.length];
    setGreeting(selectedGreeting.greeting);
    setHinglishPhrase(selectedGreeting.phrase);
    
    indexRef.current += 1;
  };

  useEffect(() => {
    updateGreeting();
    const interval = setInterval(updateGreeting, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed top-20 left-6 z-40 glass px-4 py-2 rounded-lg animate-fadeUp transition-all duration-500 hover:scale-105 group"
      data-testid="time-greeting"
    >
      <span 
        key={`greeting-${greeting}`}
        className="text-sm text-primary dark:text-primary block font-semibold animate-slideLeft transition-all duration-500 group-hover:text-primary group-hover:scale-105" 
        data-testid="greeting-text"
      >
        {greeting}
      </span>
      <small 
        key={`phrase-${hinglishPhrase}`}
        className="text-xs text-accent dark:text-accent animate-bounceIn block transition-all duration-500 group-hover:text-accent group-hover:scale-105" 
        data-testid="hinglish-phrase" 
        style={{ animationDelay: '0.15s' }}
      >
        {hinglishPhrase}
      </small>
    </div>
  );
}
