
import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Link } from "wouter";
import { Code, Terminal, Globe, Smartphone, Database, Cloud, Sparkles, Zap, Heart } from "lucide-react";

export default function Coding() {
  const techStack = [
    {
      name: "Frontend Development",
      icon: Globe,
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      description: "Creating stunning user interfaces that captivate and engage users.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      hoverBg: "hover:bg-blue-500/20"
    },
    {
      name: "Backend Development", 
      icon: Terminal,
      skills: ["Node.js", "Express", "Python", "REST APIs"],
      description: "Building robust server-side applications and APIs.",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      hoverBg: "hover:bg-green-500/20"
    },
    {
      name: "Mobile Development",
      icon: Smartphone,
      skills: ["React Native", "Flutter", "iOS", "Android"],
      description: "Developing cross-platform mobile applications.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      hoverBg: "hover:bg-purple-500/20"
    },
    {
      name: "Database Management",
      icon: Database,
      skills: ["MongoDB", "PostgreSQL", "MySQL", "Firebase"],
      description: "Designing and managing efficient database systems.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      hoverBg: "hover:bg-yellow-500/20"
    }
  ];

  return (
    <div className="pt-16 min-h-screen">
      <HeroSection 
        title="💻 Coding Journey"
        subtitle="Building the future, one line at a time — every bug is a lesson, every feature is a victory!"
      />
      
      <div className="container mx-auto px-4 sm:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Coding Philosophy */}
          <div 
            className="glass rounded-2xl p-6 sm:p-8 mb-12 text-center animate-fadeUp hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 relative overflow-hidden group" 
            data-testid="coding-philosophy"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
            <div className="absolute top-4 right-4 animate-bounce-slow">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div className="absolute bottom-4 left-4 animate-floatSlow">
              <Zap className="w-5 h-5 text-accent animate-wiggle" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6 animate-slideInFromBottom animate-textShine">
              My Coding Philosophy 🚀
            </h2>
            <p className="text-base sm:text-lg text-foreground leading-relaxed max-w-4xl mx-auto mb-6 animate-fadeInLeft" style={{ animationDelay: '0.2s' }}>
              Code is poetry in motion! Every line I write is crafted with love, purpose, and the burning desire to create something amazing. 
              I don't just write code — I architect dreams, solve problems, and build bridges between imagination and reality.
            </p>
            <div className="relative inline-block animate-popIn" style={{ animationDelay: '0.4s' }}>
              <Heart className="w-5 h-5 text-red-500 absolute -top-2 -right-2 animate-heartbeat" />
              <p className="text-lg sm:text-xl text-primary font-semibold px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-300">
                "Clean code always looks like it was written by someone who cares!" ❤️
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-12" data-testid="tech-stack">
            {techStack.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <div 
                  key={tech.name}
                  className={`glass rounded-2xl p-6 hover:scale-105 transition-all duration-500 animate-slideInFromBottom hover:shadow-2xl hover:shadow-${tech.color}/30 cursor-pointer relative overflow-hidden group ${tech.hoverBg}`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                  data-testid={`tech-${tech.name.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className={`${tech.bgColor} p-3 rounded-xl group-hover:rotate-12 transition-transform duration-500 group-hover:scale-110 animate-bounceSmooth`}>
                      <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 ${tech.color} group-hover:animate-pulse`} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {tech.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 group-hover:text-foreground transition-colors duration-300 relative z-10">
                    {tech.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {tech.skills.map((skill, skillIndex) => (
                      <span 
                        key={skill}
                        className={`px-3 py-1 ${tech.bgColor} ${tech.color} rounded-full text-xs sm:text-sm font-medium hover:scale-110 transition-all duration-300 cursor-pointer animate-fadeInRight hover:shadow-lg`}
                        style={{ animationDelay: `${(index * 0.15) + (skillIndex * 0.1)}s` }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Projects */}
          <div 
            className="glass rounded-2xl p-6 sm:p-8 mb-12 animate-zoomIn hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20" 
            data-testid="current-projects"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="flex items-center justify-center gap-3 mb-6 animate-slideInFromLeft">
              <Code className="w-8 h-8 text-primary animate-wiggle" />
              <h2 className="text-xl sm:text-2xl font-bold text-primary text-center">
                🔥 Current Projects
              </h2>
              <Code className="w-8 h-8 text-primary animate-wiggle" style={{ animationDelay: '0.5s' }} />
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-muted/50 rounded-lg p-4 sm:p-6 hover:bg-muted transition-all duration-500 hover:scale-105 hover:shadow-xl cursor-pointer animate-popIn group relative overflow-hidden" style={{ animationDelay: '0.7s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="font-bold text-foreground mb-2 text-base sm:text-lg group-hover:text-primary transition-colors duration-300 relative z-10">
                  NS GAMMING Website
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm group-hover:text-foreground transition-colors duration-300 relative z-10">
                  This very website you're on! Built with React, TypeScript, and lots of love.
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 sm:p-6 hover:bg-muted transition-all duration-500 hover:scale-105 hover:shadow-xl cursor-pointer animate-popIn group relative overflow-hidden" style={{ animationDelay: '0.75s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="font-bold text-foreground mb-2 text-base sm:text-lg group-hover:text-blue-500 transition-colors duration-300 relative z-10">
                  Telegram Bots 🤖
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm group-hover:text-foreground transition-colors duration-300 relative z-10">
                  Smart automation bots for Telegram! Managing communities with powerful features and commands.
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 sm:p-6 hover:bg-muted transition-all duration-500 hover:scale-105 hover:shadow-xl cursor-pointer animate-popIn group relative overflow-hidden" style={{ animationDelay: '0.8s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="font-bold text-foreground mb-2 text-base sm:text-lg group-hover:text-indigo-500 transition-colors duration-300 relative z-10">
                  Discord Bots 🎮
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm group-hover:text-foreground transition-colors duration-300 relative z-10">
                  Custom Discord bots with moderation, gaming features, and community engagement tools!
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 sm:p-6 hover:bg-muted transition-all duration-500 hover:scale-105 hover:shadow-xl cursor-pointer animate-popIn group relative overflow-hidden" style={{ animationDelay: '0.85s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="font-bold text-foreground mb-2 text-base sm:text-lg group-hover:text-orange-500 transition-colors duration-300 relative z-10">
                  VPS Hosting Server 🖥️
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm group-hover:text-foreground transition-colors duration-300 relative z-10">
                  Building my own VPS hosting infrastructure! Learning server management and deployment at scale.
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 sm:p-6 hover:bg-muted transition-all duration-500 hover:scale-105 hover:shadow-xl cursor-pointer animate-popIn group relative overflow-hidden" style={{ animationDelay: '0.9s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="font-bold text-foreground mb-2 text-base sm:text-lg group-hover:text-green-500 transition-colors duration-300 relative z-10">
                  Gaming Portal
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm group-hover:text-foreground transition-colors duration-300 relative z-10">
                  Interactive games and challenges for the community to enjoy.
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 sm:p-6 hover:bg-muted transition-all duration-500 hover:scale-105 hover:shadow-xl cursor-pointer animate-popIn group relative overflow-hidden" style={{ animationDelay: '0.95s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                <h3 className="font-bold text-foreground mb-2 text-base sm:text-lg group-hover:text-purple-500 transition-colors duration-300 relative z-10">
                  Secret Project 🤫
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm group-hover:text-foreground transition-colors duration-300 relative z-10">
                  Something big is coming... Stay tuned for the announcement!
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div 
            className="glass rounded-2xl p-6 sm:p-8 text-center animate-bounceIn hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 relative overflow-hidden group" 
            data-testid="coding-cta"
            style={{ animationDelay: '1s' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 animate-slideInFromBottom relative z-10">
              Want to Code Together? 🤝
            </h2>
            <p className="text-sm sm:text-base text-foreground mb-6 max-w-2xl mx-auto animate-fadeInLeft relative z-10" style={{ animationDelay: '1.1s' }}>
              I'm always open to collaborating on exciting projects! Whether it's a game, a website, or something completely new — let's build it together!
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 relative z-10">
              <Link href="/portfolio">
                <button className="neon-btn w-full sm:w-auto animate-slideInFromLeft hover:scale-110 transition-all duration-300 group/btn" style={{ animationDelay: '1.2s' }}>
                  <Code className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                  View My Work
                </button>
              </Link>
              <Link href="/contact">
                <button className="neon-btn w-full sm:w-auto animate-slideInFromRight hover:scale-110 transition-all duration-300 group/btn" style={{ animationDelay: '1.3s' }}>
                  <Terminal className="w-4 h-4 mr-2 group-hover/btn:animate-pulse transition-transform duration-300" />
                  Let's Collaborate
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
