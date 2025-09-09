import { useEffect, useRef } from "react";
import { useParticles } from "../hooks/useParticles";

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { createParticle, handleMouseMove } = useParticles();

  useEffect(() => {
    if (!containerRef.current) return;

    // Create initial particles
    for (let i = 0; i < 50; i++) {
      createParticle(containerRef.current);
    }

    // Add mouse interaction
    const mouseHandler = (e: MouseEvent) => {
      handleMouseMove(e.clientX, e.clientY);
    };

    document.addEventListener('mousemove', mouseHandler);

    return () => {
      document.removeEventListener('mousemove', mouseHandler);
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
