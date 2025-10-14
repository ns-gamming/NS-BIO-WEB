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
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${className}`}>
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 dark:from-primary/10 dark:via-accent/10 dark:to-primary/20 animate-gradient-shift" />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 dark:bg-accent/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/15 dark:bg-primary/25 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
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