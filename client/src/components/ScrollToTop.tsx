
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [location] = useLocation();

  // Auto scroll to top when navigating to a new page
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);

  const toggleVisibility = () => {
    // Show button only when scrolled down more than 500px
    if (window.pageYOffset > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 group"
      aria-label="Scroll to top"
      data-testid="scroll-to-top"
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl group-hover:bg-primary/50 transition-all duration-300 animate-pulse"></div>
      
      {/* Main button */}
      <div className="relative glass rounded-full p-4 border-2 border-primary/40 hover:border-primary/80 shadow-2xl hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110 bg-background/80 backdrop-blur-xl">
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Arrow icon */}
        <ArrowUp className="w-6 h-6 text-primary relative z-10 group-hover:-translate-y-1 transition-transform duration-300 drop-shadow-lg" />
        
        {/* Ripple effect on hover */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/60 scale-100 opacity-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500"></div>
      </div>

      {/* Bottom tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-background/95 border border-primary/40 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap backdrop-blur-sm">
        <span className="text-sm font-medium text-primary">Back to Top</span>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background/95 border-r border-b border-primary/40 rotate-45"></div>
      </div>
    </button>
  );
}
