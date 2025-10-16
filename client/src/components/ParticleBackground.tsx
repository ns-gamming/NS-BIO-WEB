import { useEffect, useRef, useState } from "react";
import { useParticles } from "../hooks/useParticles";
import { Button } from "@/components/ui/button";
import { Sparkles, SparklesIcon } from "lucide-react";

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { createParticle, handleMouseMove } = useParticles();
  const [particlesEnabled, setParticlesEnabled] = useState(() => {
    const saved = localStorage.getItem('particles-enabled');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('particles-enabled', String(particlesEnabled));
  }, [particlesEnabled]);

  useEffect(() => {
    if (!containerRef.current || !particlesEnabled) {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      return;
    }

    // Create initial particles (fewer on mobile for better performance)
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 20 : 50;
    
    for (let i = 0; i < particleCount; i++) {
      createParticle(containerRef.current);
    }

    // Add mouse interaction (disabled on mobile)
    const mouseHandler = (e: MouseEvent) => {
      if (!isMobile) {
        handleMouseMove(e.clientX, e.clientY);
      }
    };

    if (!isMobile) {
      document.addEventListener('mousemove', mouseHandler);
    }

    return () => {
      if (!isMobile) {
        document.removeEventListener('mousemove', mouseHandler);
      }
    };
  }, [createParticle, handleMouseMove, particlesEnabled]);

  return (
    <>
      <div 
        ref={containerRef}
        className="particles fixed top-0 left-0 w-full h-full pointer-events-none z-[1]"
        data-testid="particle-background"
      />
      
      <Button
        onClick={() => setParticlesEnabled(!particlesEnabled)}
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-24 z-50 pointer-events-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-2 border-cyan-500/30 hover:border-cyan-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
        data-testid="button-toggle-particles"
        title={particlesEnabled ? "Disable Particles" : "Enable Particles"}
      >
        {particlesEnabled ? (
          <Sparkles className="h-5 w-5 text-cyan-500 animate-pulse" />
        ) : (
          <SparklesIcon className="h-5 w-5 text-gray-400" />
        )}
      </Button>
    </>
  );
}
