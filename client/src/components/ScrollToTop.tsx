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
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-primary/20 hover:bg-primary/30 border-2 border-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/50 animate-pulse-neon backdrop-blur-sm ${
        isVisible && !isAnimating ? 'animate-slideUpFade' : 'animate-slideDownFade'
      }`}
      data-testid="scroll-to-top"
    >
      <ArrowUp className="w-5 h-5 text-primary transition-transform duration-300 hover:scale-125" />
    </button>
  );
}
