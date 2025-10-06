
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
      className="fixed bottom-8 right-8 z-50 bg-primary/90 hover:bg-primary text-white p-3 rounded-full shadow-xl hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:shadow-2xl hover:shadow-primary/30 group"
      aria-label="Scroll to top"
      data-testid="scroll-to-top"
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
    </button>
  );
}
