import { useState } from "react";
import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Goals() {
  const [hoveredGoal, setHoveredGoal] = useState<number | null>(null);

  const goals = [
    {
      id: 1,
      emoji: "💻",
      title: "Master Coding & Build Impactful Products",
      description: "From learning my first Python code to building complex applications — the journey continues! I want to create products that solve real problems and help people achieve their dreams.",
      hinglish: "Code meri zindagi hai, aur main iske saath badal raha hoon!",
      bgGradient: "bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600",
      borderColor: "border-blue-500 dark:border-cyan-500",
      testId: "goal-coding"
    },
    {
      id: 2,
      emoji: "🎥",
      title: "Grow NS GAMING Community & Content",
      description: "YouTube is where I share my journey, tutorials, and gaming experiences. My goal is to build a supportive community where everyone learns and grows together.",
      hinglish: "Subscribe kar do yaar — let's make it happen! 🎮❤️",
      bgGradient: "bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600",
      borderColor: "border-orange-500 dark:border-red-500",
      testId: "goal-community"
    },
    {
      id: 3,
      emoji: "⚽",
      title: "Keep Playing Football & Enjoy Life",
      description: "Football keeps me grounded and happy! It's not just a game — it's therapy, fun, and friendship all rolled into one. No matter how busy life gets, I'll always make time for the beautiful game.",
      hinglish: "Balance hi life ka secret hai! ⚽✨",
      bgGradient: "bg-gradient-to-br from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600",
      borderColor: "border-green-500 dark:border-emerald-500",
      testId: "goal-football"
    },
    {
      id: 4,
      emoji: "🚀",
      title: "Build My Empire & Change the Future",
      description: "This is the big one! I'm not just building a career — I'm building an empire of creativity, learning, and impact. One project at a time, one person helped at a time, one dream fulfilled at a time.",
      hinglish: "Yeh sirf shurarat hai — the best is yet to come! 🌟",
      bgGradient: "bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600",
      borderColor: "border-purple-500 dark:border-pink-500",
      testId: "goal-empire"
    }
  ];

  return (
    <div className="pt-16">
      <HeroSection 
        title="🎯 My Goals"
        subtitle="Building my empire, one goal at a time!"
      />

      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8" data-testid="goals-list">
            {goals.map((goal, index) => (
              <div 
                key={goal.title}
                className={`rounded-2xl border-2 p-8 text-white dark:text-white hover:scale-105 transition-all duration-500 cursor-pointer group animate-bounceIn hover:shadow-2xl ${goal.bgGradient} ${goal.borderColor}`}
                style={{ animationDelay: `${index * 0.2}s` }}
                data-testid={`goal-${goal.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onMouseEnter={() => setHoveredGoal(goal.id)}
                onMouseLeave={() => setHoveredGoal(null)}
                onClick={() => {
                  alert(`🎯 ${goal.title}\n\n${goal.description}\n\n"${goal.hinglish}"\n\nThanks for checking out my goals! Let's achieve them together! 🚀`);
                }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center text-3xl shadow-lg">
                    {goal.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-lg" data-testid={`${goal.testId}-title`}>
                      {goal.title}
                    </h3>
                    <p className="text-lg leading-relaxed mb-3 text-white/95 drop-shadow" data-testid={`${goal.testId}-description`}>
                      {goal.description}
                    </p>
                    <p className="text-base font-medium italic text-white/90 drop-shadow" data-testid={`${goal.testId}-hinglish`}>
                      "{goal.hinglish}"
                    </p>
                  </div>
                  <div className={`goal-check transition-all duration-300 ${hoveredGoal === goal.id ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}`}>
                    <CheckCircle className="w-12 h-12 text-white drop-shadow-lg" data-testid={`${goal.testId}-check`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Motivation Section */}
          <div className="glass rounded-2xl border-2 border-primary/30 p-8 mt-12 text-center animate-fadeUp" data-testid="motivation-section">
            <h2 className="text-3xl font-bold text-primary dark:text-primary mb-6 drop-shadow-lg">The Journey Continues 🛤️</h2>
            <p className="text-lg text-foreground dark:text-foreground leading-relaxed max-w-3xl mx-auto mb-6 font-medium">
              These goals aren't just wishes — they're my daily motivation! Every morning I wake up thinking about how to get one step closer. 
              Some days are harder than others, but the vision keeps me going.
            </p>
            <p className="text-xl text-primary dark:text-primary font-bold mb-8 italic drop-shadow" data-testid="motivational-quote">
              "Sapne wo nahi jo hum sote waqt dekhte hain, sapne wo hain jo hume sone nahi dete!"
            </p>
            <Link href="/contact" className="neon-btn" data-testid="join-journey-cta">
              <CheckCircle className="w-4 h-4 mr-2" />
              Join My Journey
            </Link>
          </div>
        </div>
      </div>

      <AdSenseAd />
    </div>
  );
}