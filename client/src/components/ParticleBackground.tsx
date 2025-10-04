import { useEffect, useRef } from "react";
import { useParticles } from "../hooks/useParticles";

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { createParticle, handleMouseMove } = useParticles();

  useEffect(() => {
    if (!containerRef.current) return;

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
  }, [createParticle, handleMouseMove]);

  return (
    <div 
      ref={containerRef}
      className="particles fixed top-0 left-0 w-full h-full pointer-events-none z-[1]"
      data-testid="particle-background"
    />
  );
}
