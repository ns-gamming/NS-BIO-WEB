import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

import _1000016408 from "@assets/1000016408.jpg";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navigationItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/games", label: "Games" },
    { path: "/social", label: "Social" },
    { path: "/contact", label: "Contact" },
    { path: "/goals", label: "Goals" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border" data-testid="navigation">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" data-testid="logo">
            <div className="w-12 h-12 rounded-lg border-2 border-primary animate-pulse-neon overflow-hidden backdrop-blur-sm hover:scale-110 transition-all duration-300">
              <img 
                src={_1000016408} 
                alt="NS GAMMING Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-orbitron font-bold text-xl text-primary animate-glow hover:scale-105 transition-transform duration-300">NS GAMMING</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
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
