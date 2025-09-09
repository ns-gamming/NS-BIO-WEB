import { useCallback } from "react";

export function useParticles() {
  const createParticle = useCallback((container: HTMLElement) => {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 15 + 5) + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(particle);

    // Remove particle after animation completes
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
      // Create a new particle to maintain count
      createParticle(container);
    }, parseFloat(particle.style.animationDuration) * 1000);
  }, []);

  const createCursorParticle = useCallback((x: number, y: number) => {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    particle.style.animation = 'confetti 1s ease-out forwards';
    document.body.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 1000);
  }, []);

  const handleMouseMove = useCallback((x: number, y: number) => {
    // Create cursor trail particles (throttled)
    if (Math.random() < 0.1) {
      createCursorParticle(x, y);
    }
  }, [createCursorParticle]);

  return { createParticle, handleMouseMove };
}
