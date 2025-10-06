
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function BackButton() {
  const [location] = useLocation();
  
  // Don't show on home page
  if (location === "/") return null;

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <button
      onClick={handleBack}
      className="fixed bottom-6 left-6 z-40 glass rounded-full p-4 hover:scale-110 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/50 animate-float group border-2 border-primary/30 hover:border-primary/60"
      aria-label="Go back"
      data-testid="back-button"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse"></div>
        <ArrowLeft className="w-6 h-6 text-primary relative group-hover:-translate-x-1 transition-transform animate-pulse" />
      </div>
    </button>
  );
}
