import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Heart, GraduationCap, Users } from "lucide-react";

export default function About() {
  const skills = [
    { name: "React", description: "JavaScript library for building user interfaces." },
    { name: "Next.js", description: "React framework for production." },
    { name: "Tailwind CSS", description: "Utility-first CSS framework." },
    { name: "JavaScript", description: "The language of the web." },
    { name: "HTML", description: "Structure of web content." },
    { name: "CSS", description: "Styling of web content." },
    { name: "Figma", description: "Interface design tool." },
    { name: "Git", description: "Version control system." },
    { name: "Node.js", description: "JavaScript runtime environment." },
  ];

  return (
    <div className="pt-16">
      <HeroSection 
        title="About Nishant"
        subtitle="The story behind NS GAMMING"
      />

      {/* Biography */}
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 mb-12" data-testid="biography-section">
            <h2 className="text-3xl font-bold text-primary mb-6">My Journey 🌟</h2>
            <div className="prose prose-lg text-foreground leading-relaxed space-y-6">
              <p>
                Siliguri ke ek ladke ki kahani hai ye — a small town dreamer with big ambitions! Growing up in West Bengal, I always believed code could change the world. 
                Every late night spent learning HTML, every failed project that taught me something new, every small victory that pushed me forward — sab kuch iss empire ke liye hai.
              </p>
              <p className="text-primary font-semibold">
                "My mission is to build my OWN EMPIRE, change the future, keep learning, and build things I love."
              </p>
              <p>
                From playing Free Fire with games to creating content, from learning my first programming language to building communities — 
                har step mein I've tried to spread love and learning. Football keeps me grounded, coding keeps me excited, and my community keeps me motivated.
              </p>
              <p>
                Chalo saath banayein kuch naya — let's build something amazing together! This website isn't just a portfolio, it's a testament to believing in dreams and working hard to achieve them. ❤️
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-12" data-testid="timeline-section">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">Milestones 🎯</h2>
            <div className="space-y-8">
              <div className="glass rounded-lg p-6 hover:scale-105 transition-transform" data-testid="milestone-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black font-bold">1</div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">First Lines of Code</h3>
                    <p className="text-muted-foreground">Started with HTML — the magic of creating something from nothing</p>
                  </div>
                </div>
              </div>
              <div className="glass rounded-lg p-6 hover:scale-105 transition-transform" data-testid="milestone-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black font-bold">2</div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">YouTube Journey Begins</h3>
                    <p className="text-muted-foreground">NS GAMMING channel — sharing knowledge with gaming vibes</p>
                  </div>
                </div>
              </div>
              <div className="glass rounded-lg p-6 hover:scale-105 transition-transform" data-testid="milestone-3">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black font-bold">3</div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Community Building</h3>
                    <p className="text-muted-foreground">Growing a family of learners and creators</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Cards */}
          <div className="grid md:grid-cols-3 gap-6" data-testid="values-section">
            <div className="glass rounded-lg p-6 text-center">
              <Heart className="w-12 h-12 text-accent mb-4 mx-auto" />
              <h3 className="font-bold text-lg text-foreground mb-2">Passion</h3>
              <p className="text-muted-foreground">Everything I do comes from the heart</p>
            </div>
            <div className="glass rounded-lg p-6 text-center">
              <GraduationCap className="w-12 h-12 text-primary mb-4 mx-auto" />
              <h3 className="font-bold text-lg text-foreground mb-2">Learning</h3>
              <p className="text-muted-foreground">Never stop growing and improving</p>
            </div>
            <div className="glass rounded-lg p-6 text-center">
              <Users className="w-12 h-12 text-secondary mb-4 mx-auto" />
              <h3 className="font-bold text-lg text-foreground mb-2">Community</h3>
              <p className="text-muted-foreground">Building connections that matter</p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mt-16" data-testid="skills-section">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">Skills & Expertise 💻</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <div 
                  key={skill.name}
                  className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group animate-fadeUp hover:shadow-lg hover:shadow-primary/30"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  data-testid={`skill-${skill.name.toLowerCase().replace(' ', '-')}`}
                  onClick={() => {
                    alert(`🚀 ${skill.name}: ${skill.description}\n\nThanks for exploring my skills! Let's build something amazing together! 💪`);
                  }}
                >
                  <h3 className="font-bold text-lg text-foreground mb-2">{skill.name}</h3>
                  <p className="text-muted-foreground text-sm">{skill.description}</p>
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