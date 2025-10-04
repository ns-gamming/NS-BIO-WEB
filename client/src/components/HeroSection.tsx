import { ReactNode } from "react";

import _1000016408 from "@assets/1000016408.jpg";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export default function HeroSection({ title, subtitle, children, className = "" }: HeroSectionProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center relative ${className}`}>
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="animate-fadeUp">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl border-3 border-primary animate-float overflow-hidden backdrop-blur-sm hover:scale-110 hover:rotate-3 transition-all duration-500 cursor-pointer group">
              <img 
                src={_1000016408} 
                alt="NS GAMMING Logo" 
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
              />
            </div>
          </div>
          <h1 
            className="hero-title font-orbitron font-black text-4xl md:text-6xl text-primary animate-glow mb-4"
            data-testid="hero-title"
          >
            {title}
          </h1>
          {subtitle && (
            <p 
              className="hero-subtitle font-inter text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8"
              data-testid="hero-subtitle"
            >
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
