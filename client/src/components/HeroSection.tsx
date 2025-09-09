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
          <div className="flex items-center justify-center gap-6 mb-6">
            <img 
              src="/attached_assets/IMG_20250712_204022_796_1757405803893.jpg" 
              alt="NS GAMMING Logo" 
              className="w-20 h-20 md:w-28 md:h-28 rounded-xl border-3 border-primary animate-float"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                console.error('Hero logo image failed to load');
              }}
            />
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
