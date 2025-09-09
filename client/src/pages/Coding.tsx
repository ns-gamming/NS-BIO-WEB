
import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Link } from "wouter";
import { Code, Terminal, Globe, Smartphone, Database, Cloud } from "lucide-react";

export default function Coding() {
  const techStack = [
    {
      name: "Frontend Development",
      icon: Globe,
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      description: "Creating stunning user interfaces that captivate and engage users.",
      color: "text-blue-500"
    },
    {
      name: "Backend Development", 
      icon: Terminal,
      skills: ["Node.js", "Express", "Python", "REST APIs"],
      description: "Building robust server-side applications and APIs.",
      color: "text-green-500"
    },
    {
      name: "Mobile Development",
      icon: Smartphone,
      skills: ["React Native", "Flutter", "iOS", "Android"],
      description: "Developing cross-platform mobile applications.",
      color: "text-purple-500"
    },
    {
      name: "Database Management",
      icon: Database,
      skills: ["MongoDB", "PostgreSQL", "MySQL", "Firebase"],
      description: "Designing and managing efficient database systems.",
      color: "text-yellow-500"
    }
  ];

  return (
    <div className="pt-16">
      <HeroSection 
        title="💻 Coding Journey"
        subtitle="Building the future, one line at a time — every bug is a lesson, every feature is a victory!"
      />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Coding Philosophy */}
          <div className="glass rounded-2xl p-8 mb-12 text-center" data-testid="coding-philosophy">
            <h2 className="text-3xl font-bold text-primary mb-6">My Coding Philosophy 🚀</h2>
            <p className="text-lg text-foreground leading-relaxed max-w-4xl mx-auto mb-6">
              Code is poetry in motion! Every line I write is crafted with love, purpose, and the burning desire to create something amazing. 
              I don't just write code — I architect dreams, solve problems, and build bridges between imagination and reality.
            </p>
            <p className="text-xl text-primary font-semibold">
              "Clean code always looks like it was written by someone who cares!" ❤️
            </p>
          </div>

          {/* Tech Stack */}
          <div className="grid md:grid-cols-2 gap-8 mb-12" data-testid="tech-stack">
            {techStack.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <div 
                  key={tech.name}
                  className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-float"
                  style={{ animationDelay: `${index * 0.2}s` }}
                  data-testid={`tech-${tech.name.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <IconComponent className={`w-12 h-12 ${tech.color}`} />
                    <h3 className="text-xl font-bold text-foreground">{tech.name}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{tech.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tech.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
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
          <div className="glass rounded-2xl p-8 mb-12" data-testid="current-projects">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">🔥 Current Projects</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-muted rounded-lg p-6 hover:bg-muted/80 transition-colors">
                <h3 className="font-bold text-foreground mb-2">NS GAMMING Website</h3>
                <p className="text-muted-foreground text-sm">This very website you're on! Built with React, TypeScript, and lots of love.</p>
              </div>
              <div className="bg-muted rounded-lg p-6 hover:bg-muted/80 transition-colors">
                <h3 className="font-bold text-foreground mb-2">Gaming Portal</h3>
                <p className="text-muted-foreground text-sm">Interactive games and challenges for the community to enjoy.</p>
              </div>
              <div className="bg-muted rounded-lg p-6 hover:bg-muted/80 transition-colors">
                <h3 className="font-bold text-foreground mb-2">Secret Project 🤫</h3>
                <p className="text-muted-foreground text-sm">Something big is coming... Stay tuned for the announcement!</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="glass rounded-2xl p-8 text-center" data-testid="coding-cta">
            <h2 className="text-2xl font-bold text-primary mb-4">Want to Code Together? 🤝</h2>
            <p className="text-foreground mb-6">
              I'm always open to collaborating on exciting projects! Whether it's a game, a website, or something completely new — let's build it together!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/portfolio" className="neon-btn">
                <Code className="w-4 h-4 mr-2" />
                View My Work
              </Link>
              <Link href="/contact" className="neon-btn">
                <Terminal className="w-4 h-4 mr-2" />
                Let's Collaborate
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
