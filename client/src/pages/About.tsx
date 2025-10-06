
import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Heart, GraduationCap, Users, Sparkles, Zap, Code, Trophy } from "lucide-react";
import { useState } from "react";

export default function About() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skills = [
    { name: "React", description: "JavaScript library for building user interfaces.", icon: "⚛️", color: "from-blue-500/20 to-cyan-500/20" },
    { name: "Next.js", description: "React framework for production.", icon: "▲", color: "from-gray-500/20 to-black/20" },
    { name: "Tailwind CSS", description: "Utility-first CSS framework.", icon: "🎨", color: "from-cyan-500/20 to-blue-500/20" },
    { name: "JavaScript", description: "The language of the web.", icon: "🟨", color: "from-yellow-500/20 to-orange-500/20" },
    { name: "Python", description: "Versatile programming language for AI and automation.", icon: "🐍", color: "from-blue-600/20 to-yellow-500/20" },
    { name: "HTML", description: "Structure of web content.", icon: "📄", color: "from-orange-500/20 to-red-500/20" },
    { name: "CSS", description: "Styling of web content.", icon: "🎭", color: "from-blue-500/20 to-purple-500/20" },
    { name: "AI Using", description: "Leveraging AI tools and models for smart solutions.", icon: "🤖", color: "from-purple-500/20 to-pink-500/20" },
    { name: "Prompt Engineering", description: "Crafting effective prompts for AI systems.", icon: "✨", color: "from-pink-500/20 to-violet-500/20" },
    { name: "AWS", description: "Cloud computing and deployment services.", icon: "☁️", color: "from-orange-600/20 to-yellow-600/20" },
    { name: "Vercel", description: "Modern web hosting and deployment platform.", icon: "▲", color: "from-black/20 to-gray-500/20" },
    { name: "Figma", description: "Interface design tool.", icon: "🎨", color: "from-red-500/20 to-purple-500/20" },
    { name: "Git", description: "Version control system.", icon: "🔀", color: "from-orange-500/20 to-red-600/20" },
    { name: "Node.js", description: "JavaScript runtime environment.", icon: "🟢", color: "from-green-600/20 to-lime-500/20" },
    { name: "Team Handling", description: "Leading and managing development teams.", icon: "👥", color: "from-indigo-500/20 to-blue-500/20" },
    { name: "Selling", description: "Marketing and client relationship management.", icon: "💼", color: "from-green-500/20 to-emerald-500/20" },
    { name: "Video Creator", description: "Content creation and video production.", icon: "🎬", color: "from-red-500/20 to-pink-500/20" },
    { name: "Project Management", description: "Planning and executing projects efficiently.", icon: "📊", color: "from-purple-500/20 to-indigo-500/20" },
  ];

  return (
    <div className="pt-16 overflow-hidden">
      <HeroSection 
        title="About Nishant"
        subtitle="The story behind NS GAMMING"
      />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-floatSlow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Biography */}
      <div className="container mx-auto px-6 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 mb-12 animate-fadeUp hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 relative overflow-hidden group" data-testid="biography-section">
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient"></div>
            <div className="absolute inset-[2px] bg-background/95 dark:bg-background/95 rounded-2xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3 animate-slideRight">
                <Sparkles className="w-8 h-8 animate-spin-slow" />
                My Journey 🌟
              </h2>
              <div className="prose prose-lg text-foreground leading-relaxed space-y-6">
                <p className="animate-fadeInLeft" style={{ animationDelay: '0.1s' }}>
                  Siliguri ke ek ladke ki kahani hai ye — a small town dreamer with big ambitions! Growing up in West Bengal, I always believed code could change the world. 
                  Every late night spent learning PYTHON, every failed project that taught me something new, every small victory that pushed me forward — sab kuch iss empire ke liye hai.
                </p>
                <p className="text-primary font-semibold animate-fadeInRight animate-textShine" style={{ animationDelay: '0.2s' }}>
                  "My mission is to build my OWN EMPIRE, change the future, keep learning, and build things I love."
                </p>
                <p className="animate-fadeInLeft" style={{ animationDelay: '0.3s' }}>
                  From playing Free Fire with games to creating content, from learning my first programming language to building communities — 
                  har step mein I've tried to spread love and learning. Football keeps me grounded, coding keeps me excited, and my community keeps me motivated.
                </p>
                <p className="animate-fadeInRight" style={{ animationDelay: '0.4s' }}>
                  Chalo saath banayein kuch naya — let's build something amazing together! This website isn't just a portfolio, it's a testament to believing in dreams and working hard to achieve them. ❤️
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-12" data-testid="timeline-section">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center animate-bounceIn flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 animate-wiggle" />
              Milestones 🎯
            </h2>
            <div className="space-y-8 relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary animate-shimmer hidden sm:block"></div>
              
              <div className="glass rounded-lg p-6 hover:scale-105 transition-all duration-500 hover:shadow-xl hover:shadow-primary/30 animate-slideInFromLeft group relative overflow-hidden" data-testid="milestone-1">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black font-bold shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse">1</div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      First Lines of Code
                    </h3>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">Started with PYTHON — the magic of creating something from nothing</p>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-lg p-6 hover:scale-105 transition-all duration-500 hover:shadow-xl hover:shadow-accent/30 animate-slideInFromRight group relative overflow-hidden" data-testid="milestone-2" style={{ animationDelay: '0.1s' }}>
                <div className="absolute inset-0 bg-gradient-to-l from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 animate-pulse" style={{ animationDelay: '0.2s' }}>2</div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-accent transition-colors duration-300 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      YouTube Journey Begins
                    </h3>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">NS GAMMING channel — sharing knowledge with gaming vibes</p>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-lg p-6 hover:scale-105 transition-all duration-500 hover:shadow-xl hover:shadow-primary/30 animate-slideInFromLeft group relative overflow-hidden" data-testid="milestone-3" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black font-bold shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse" style={{ animationDelay: '0.4s' }}>3</div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Community Building
                    </h3>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">Growing a family of learners and creators</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16" data-testid="values-section">
            <div className="glass rounded-lg p-6 text-center hover:scale-110 transition-all duration-500 animate-popIn hover:shadow-2xl hover:shadow-accent/30 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-rotateGlow"></div>
              <Heart className="w-12 h-12 text-accent mb-4 mx-auto animate-heartbeat group-hover:scale-125 transition-transform duration-300 relative z-10" />
              <h3 className="font-bold text-lg text-foreground mb-2 relative z-10 group-hover:text-accent transition-colors duration-300">Passion</h3>
              <p className="text-muted-foreground relative z-10 group-hover:text-foreground transition-colors duration-300">Everything I do comes from the heart</p>
            </div>
            <div className="glass rounded-lg p-6 text-center hover:scale-110 transition-all duration-500 animate-popIn hover:shadow-2xl hover:shadow-primary/30 group relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-rotateGlow"></div>
              <GraduationCap className="w-12 h-12 text-primary mb-4 mx-auto animate-bounce group-hover:scale-125 transition-transform duration-300 relative z-10" />
              <h3 className="font-bold text-lg text-foreground mb-2 relative z-10 group-hover:text-primary transition-colors duration-300">Learning</h3>
              <p className="text-muted-foreground relative z-10 group-hover:text-foreground transition-colors duration-300">Never stop growing and improving</p>
            </div>
            <div className="glass rounded-lg p-6 text-center hover:scale-110 transition-all duration-500 animate-popIn hover:shadow-2xl hover:shadow-secondary/30 group relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-rotateGlow"></div>
              <Users className="w-12 h-12 text-secondary mb-4 mx-auto animate-wiggle group-hover:scale-125 transition-transform duration-300 relative z-10" />
              <h3 className="font-bold text-lg text-foreground mb-2 relative z-10 group-hover:text-secondary transition-colors duration-300">Community</h3>
              <p className="text-muted-foreground relative z-10 group-hover:text-foreground transition-colors duration-300">Building connections that matter</p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mt-16" data-testid="skills-section">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center animate-zoomIn flex items-center justify-center gap-3">
              <Code className="w-8 h-8 animate-spin-slow" />
              Skills & Expertise 💻
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {skills.map((skill, index) => (
                <div 
                  key={skill.name}
                  className="glass rounded-2xl p-4 sm:p-6 hover:scale-110 transition-all duration-500 cursor-pointer group relative overflow-hidden"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    animation: 'fadeUp 0.8s ease-out forwards, float 6s ease-in-out infinite'
                  }}
                  data-testid={`skill-${skill.name.toLowerCase().replace(' ', '-')}`}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  onClick={() => {
                    alert(`🚀 ${skill.name}: ${skill.description}\n\nThanks for exploring my skills! Let's build something amazing together! 💪`);
                  }}
                >
                  {/* Animated Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient`}></div>
                  
                  {/* Ripple Effect on Hover */}
                  {hoveredSkill === skill.name && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary/50 animate-ripple"></div>
                  )}
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-125 transition-transform duration-300 animate-bounce-slow">
                      {skill.icon}
                    </div>
                    <h3 className="font-bold text-sm sm:text-lg text-foreground mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300 animate-textShine">
                      {skill.name}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm group-hover:text-foreground transition-colors duration-300 line-clamp-2">
                      {skill.description}
                    </p>
                  </div>
                  
                  {/* Sparkle Effect */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-4 h-4 text-primary animate-spin-slow" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AdSenseAd />
    </div>
  );
}
