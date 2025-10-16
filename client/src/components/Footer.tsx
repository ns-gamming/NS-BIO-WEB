import { Link } from 'wouter';
import { Heart, Github, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/blog', label: 'Blog' },
  ];

  const toolsLinks = [
    { path: '/ff-bots', label: 'Free Fire Bots' },
    { path: '/games', label: 'Games' },
    { path: '/tools', label: 'Tools Hub' },
  ];

  const legalLinks = [
    { path: '/terms-conditions', label: 'Terms & Conditions' },
    { path: '/privacy-policy', label: 'Privacy Policy' },
    { path: '/disclaimer', label: 'Disclaimer' },
  ];

  return (
    <footer className="relative mt-20 border-t border-border bg-gradient-to-b from-background to-primary/5 dark:from-background dark:to-primary/10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4 animate-fadeUp">
            <h3 className="text-xl font-orbitron font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-glow">
              NS GAMMING
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">
              Your ultimate destination for gaming tools, utilities, and creative content. Building the future, one tool at a time.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://github.com/nishant-sarkark" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                data-testid="footer-github"
              >
                <Github className="w-5 h-5 text-primary dark:text-primary" />
              </a>
              <a 
                href="https://twitter.com/nishant_sarkark" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                data-testid="footer-twitter"
              >
                <Twitter className="w-5 h-5 text-primary dark:text-primary" />
              </a>
              <a 
                href="https://instagram.com/nishant.sarkark" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                data-testid="footer-instagram"
              >
                <Instagram className="w-5 h-5 text-primary dark:text-primary" />
              </a>
              <a 
                href="https://youtube.com/@nsgamming" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                data-testid="footer-youtube"
              >
                <Youtube className="w-5 h-5 text-primary dark:text-primary" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
            <h4 className="font-bold text-foreground dark:text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    href={link.path}
                    className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors hover:translate-x-1 inline-block"
                    data-testid={`footer-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Features */}
          <div className="space-y-4 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
            <h4 className="font-bold text-foreground dark:text-foreground">Tools & Features</h4>
            <ul className="space-y-2">
              {toolsLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    href={link.path}
                    className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors hover:translate-x-1 inline-block"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
            <h4 className="font-bold text-foreground dark:text-foreground">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    href={link.path}
                    className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors hover:translate-x-1 inline-block"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="pt-6 border-t border-border/50 mb-6 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
          <h4 className="font-bold text-foreground dark:text-foreground mb-3 text-center">Contact & Support</h4>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a 
              href="mailto:nsgamming69@gmail.com" 
              className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors hover:scale-105 inline-block"
              data-testid="footer-email"
            >
              📧 Email: nsgamming69@gmail.com
            </a>
            <a 
              href="https://wa.me/918900653250" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors hover:scale-105 inline-block"
              data-testid="footer-whatsapp"
            >
              📱 WhatsApp: +91 89006 53250
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 animate-fadeUp" style={{ animationDelay: '0.5s' }}>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground text-center md:text-left">
            © {currentYear} Naboraj Sarkar (Nishant). All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 animate-heartBeat inline" /> by Nishant Sarkar
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
