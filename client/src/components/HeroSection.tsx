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
      <div className="relative z-10 py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-primary mb-6 animate-glow animate-swingIn" data-testid="hero-title" style={{ textShadow: '0 0 30px rgba(0, 191, 255, 0.5)' }}>
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fadeUp animate-slideInFromBottom" data-testid="hero-subtitle" style={{ animationDelay: '0.2s' }}>
            {subtitle}
          </p>
          <div className="animate-popIn" style={{ animationDelay: '0.4s' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}