import { ReactNode } from "react";

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
