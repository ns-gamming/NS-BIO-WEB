import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Link } from "wouter";
import { Github, Youtube, ExternalLink } from "lucide-react";
import { SiHtml5, SiCss3, SiJavascript, SiReact, SiPython, SiJava, SiCplusplus } from "react-icons/si";

export default function Portfolio() {
  return (
    <div className="pt-16">
      <HeroSection 
        title="Portfolio"
        subtitle="Code is my medium, community is my mission"
      />

      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Featured Projects */}
          <div className="grid md:grid-cols-2 gap-8 mb-12" data-testid="featured-projects">
            {/* GitHub */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform" data-testid="github-project">
              <div className="flex items-center gap-4 mb-4">
                <Github className="w-12 h-12 text-foreground" />
                <h3 className="text-2xl font-bold text-foreground">GitHub Projects</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Here's where the magic happens! Every repo tells a story of late-night coding, problem-solving, and learning. 
                My GitHub is like my digital diary — full of experiments, victories, and lessons learned.
              </p>
              <a 
                href="https://github.com/ns-gamming" 
                target="_blank" 
                rel="noopener noreferrer"
                className="neon-btn"
                data-testid="github-link"
              >
                <Github className="w-4 h-4 mr-2" />
                View Projects
              </a>
            </div>

            {/* YouTube */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform" data-testid="youtube-project">
              <div className="flex items-center gap-4 mb-4">
                <Youtube className="w-12 h-12 text-accent" />
                <h3 className="text-2xl font-bold text-foreground">YouTube Content</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                🎥 Check out my latest gaming and coding videos here! From tutorials to gameplay, 
                I create content with love and share knowledge that helped me grow. Har video mein dil hai!
              </p>
              <a 
                href="https://youtube.com/@Nishant_sarkar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="neon-btn"
                data-testid="youtube-link"
              >
                <Youtube className="w-4 h-4 mr-2" />
                Watch Videos
              </a>
            </div>
          </div>

          {/* Skills Showcase */}
          <div className="glass rounded-2xl p-8 mb-12" data-testid="skills-section">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">Technical Skills 💻</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg hover:bg-muted transition-colors" data-testid="skill-html">
                <SiHtml5 className="w-12 h-12 text-orange-500 mb-2 mx-auto" />
                <p className="text-foreground font-semibold">HTML5</p>
              </div>
              <div className="text-center p-4 rounded-lg hover:bg-muted transition-colors" data-testid="skill-css">
                <SiCss3 className="w-12 h-12 text-blue-500 mb-2 mx-auto" />
                <p className="text-foreground font-semibold">CSS3</p>
              </div>
              <div className="text-center p-4 rounded-lg hover:bg-muted transition-colors" data-testid="skill-javascript">
                <SiJavascript className="w-12 h-12 text-yellow-500 mb-2 mx-auto" />
                <p className="text-foreground font-semibold">JavaScript</p>
              </div>
              <div className="text-center p-4 rounded-lg hover:bg-muted transition-colors" data-testid="skill-react">
                <SiReact className="w-12 h-12 text-primary mb-2 mx-auto" />
                <p className="text-foreground font-semibold">React</p>
              </div>
              <div className="text-center p-4 rounded-lg hover:bg-muted transition-colors" data-testid="skill-python">
                <SiPython className="w-12 h-12 text-blue-600 mb-2 mx-auto" />
                <p className="text-foreground font-semibold">Python</p>
              </div>
              <div className="text-center p-4 rounded-lg hover:bg-muted transition-colors" data-testid="skill-java">
                <SiJava className="w-12 h-12 text-red-500 mb-2 mx-auto" />
                <p className="text-foreground font-semibold">Java</p>
              </div>
              <div className="text-center p-4 rounded-lg hover:bg-muted transition-colors" data-testid="skill-cpp">
                <SiCplusplus className="w-12 h-12 text-blue-700 mb-2 mx-auto" />
                <p className="text-foreground font-semibold">C++</p>
              </div>
            </div>
          </div>

          {/* Motivational Section */}
          <div className="text-center glass rounded-2xl p-8" data-testid="motivational-section">
            <h2 className="text-2xl font-bold text-primary mb-4">Building the Future 🚀</h2>
            <p className="text-lg text-foreground max-w-3xl mx-auto leading-relaxed">
              Every project I work on is a step towards building something bigger. From simple websites to complex games, 
              I believe in creating experiences that bring joy to people. Coding se duniya badlegi — one project at a time!
            </p>
            <div className="mt-6">
              <Link href="/contact" className="neon-btn" data-testid="collaborate-cta">
                <ExternalLink className="w-4 h-4 mr-2" />
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