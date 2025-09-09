import { useEasterEggs } from "../hooks/useEasterEggs";

export default function EasterEggs() {
  useEasterEggs();

  return (
    <div 
      id="confetti-container" 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
      data-testid="easter-eggs-container"
    />
  );
}
