import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

import _1000016408 from "@assets/1000016408.jpg";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navigationItems = [
    { path: "/", label: "Home" },
    { path: "/ff-bots", label: "🔥 FF Bots" },
    { path: "/about", label: "About" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/games", label: "Games" },
    { path: "/social", label: "Social" },
    { path: "/contact", label: "Contact" },
    { path: "/goals", label: "Goals" },
    { path: "/privacy-policy", label: "Privacy" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border backdrop-blur-xl animate-slideInFromBottom" data-testid="navigation" style={{ boxShadow: '0 4px 20px rgba(0, 191, 255, 0.1)' }}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" data-testid="logo">
            <div className="w-12 h-12 rounded-lg border-2 border-primary animate-pulse-neon animate-glowPulse overflow-hidden backdrop-blur-sm group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <img 
                src={_1000016408} 
                alt="NS GAMMING Logo" 
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
              />
            </div>
            <span className="font-orbitron font-bold text-xl text-primary animate-glow group-hover:scale-105 group-hover:animate-textShine transition-all duration-300">NS GAMMING</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {location !== "/" && (
              <button
                onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = "/"}
                className="text-foreground hover:text-primary transition-all duration-300 hover:scale-110 flex items-center gap-1 group"
                data-testid="nav-back-button"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
            )}
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-foreground hover:text-primary transition-colors ${
                  location === item.path ? "text-primary" : ""
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>
          
          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="text-foreground hover:text-primary"
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2" data-testid="mobile-menu">
            {location !== "/" && (
              <button
                onClick={() => {
                  window.history.length > 1 ? window.history.back() : window.location.href = "/";
                  closeMobileMenu();
                }}
                className="w-full text-left text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
                data-testid="mobile-nav-back-button"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeMobileMenu}
                className={`block w-full text-left text-foreground hover:text-primary transition-colors py-2 ${
                  location === item.path ? "text-primary" : ""
                }`}
                data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
