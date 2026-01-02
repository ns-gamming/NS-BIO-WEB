import { motion } from "framer-motion";
import { SEO } from "../components/SEO";
import HeroSection from "../components/HeroSection";
import { Target, Globe, Code, Award, Heart, Zap } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="pt-16">
      <SEO 
        title="About Naboraj Sarkar - Digital Entrepreneur & Gamer"
        description="Learn about Naboraj Sarkar (Nishant), a 16-year-old developer and creator from Siliguri. Founder of NS GAMMING, gamer, and digital innovator."
        keywords="Naboraj Sarkar, Nishant Sarkar, NS GAMMING founder, developer Siliguri, Indian gamer, tech entrepreneur"
        type="profile"
      />
      
      <HeroSection 
        title="About Naboraj Sarkar"
        subtitle="The story behind NS GAMMING and the vision for the future."
      />

      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-10 border-2 border-primary/20 shadow-2xl relative overflow-hidden mb-12"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Code className="w-32 h-32" />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6 text-primary">Who is Naboraj Sarkar?</h2>
              <p className="text-xl text-foreground leading-relaxed mb-8">
                Namaste! I am <span className="text-primary font-bold">Naboraj Sarkar</span>, widely known in the gaming community as <span className="text-primary font-bold">Nishant Sarkar</span>. I am a 16-year-old developer, gamer, and digital entrepreneur from <span className="text-accent font-bold">Siliguri, West Bengal</span>.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <Target className="w-6 h-6" /> My Vision
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    My mission is to build a digital empire that inspires young creators in India. I want to bridge the gap between passion for gaming and the power of technology.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <Globe className="w-6 h-6" /> Digital Journey
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    I started my journey with Python at the age of 13. Today, I manage multiple gaming tools and communities, helping thousands of players every day.
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-foreground/80 leading-relaxed">
                <p>
                  As the founder of <span className="font-bold">NS GAMMING</span>, I focus on creating high-quality content, useful gaming utilities, and interactive web experiences. My work spans from Free Fire tool development to full-stack web applications.
                </p>
                <p>
                  I believe in constant learning and consistency. Whether it's coding a new feature or editing a gaming highlight, I pour my heart into everything I create. Har ek project mere liye ek naya seekhne ka mauka hai.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="glass p-6 rounded-2xl text-center border border-primary/10">
              <Zap className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
              <h4 className="font-bold mb-2">Passion</h4>
              <p className="text-sm text-muted-foreground">Driven by curiosity and the love for building things.</p>
            </div>
            <div className="glass p-6 rounded-2xl text-center border border-primary/10">
              <Award className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-bold mb-2">Quality</h4>
              <p className="text-sm text-muted-foreground">Delivering excellence in every line of code.</p>
            </div>
            <div className="glass p-6 rounded-2xl text-center border border-primary/10">
              <Heart className="w-10 h-10 text-pink-500 mx-auto mb-4" />
              <h4 className="font-bold mb-2">Community</h4>
              <p className="text-sm text-muted-foreground">Building relationships based on trust and respect.</p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/contact" className="neon-btn text-lg py-4 px-10">
              Let's Build Something Together 🚀
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
