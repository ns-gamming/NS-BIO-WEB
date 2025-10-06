import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      if (!isVisible && !isAnimating) {
        setIsVisible(true);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      }
    } else {
      if (isVisible && !isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsVisible(false);
          setIsAnimating(false);
        }, 300);
      }
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

  if (!isVisible && !isAnimating) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/50 animate-bounceSmooth border-2 border-white/20 hover:border-white/60 ${
        isVisible ? 'opacity-100 animate-popIn' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Scroll to top"
      data-testid="scroll-to-top"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-white/30 blur-lg animate-pulse"></div>
        <ArrowUp className="w-6 h-6 relative group-hover:animate-bounce" />
      </div>
    </button>
  );
}