import { Link } from 'wouter';
import { Home, User, Briefcase, Zap, Gamepad2, Wrench, BookOpen, Share2, Mail } from 'lucide-react';

const QuickNav = () => {
  const navLinks = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/about', icon: User, label: 'About' },
    { path: '/portfolio', icon: Briefcase, label: 'Portfolio' },
    { path: '/ff-bots', icon: Zap, label: 'FF Bots' },
    { path: '/games', icon: Gamepad2, label: 'Games' },
    { path: '/tools', icon: Wrench, label: 'Tools' },
    { path: '/blog', icon: BookOpen, label: 'Blog' },
    { path: '/social', icon: Share2, label: 'Social' },
    { path: '/contact', icon: Mail, label: 'Contact' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden lg:block animate-fadeUp">
      <div className="flex flex-col gap-2 p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border-2 border-primary/20 dark:border-primary/30 shadow-[0_0_40px_rgba(6,182,212,0.3)] dark:shadow-[0_0_40px_rgba(6,182,212,0.4)]">
        <div className="text-xs font-bold text-center text-primary dark:text-primary mb-1 animate-textShine">
          Quick Nav
        </div>
        {navLinks.map((link, index) => (
          <Link
            key={link.path}
            href={link.path}
            className="group relative"
          >
            <div 
              className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 hover:from-primary/30 hover:to-accent/30 dark:hover:from-primary/40 dark:hover:to-accent/40 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer animate-scaleIn border border-primary/20 dark:border-primary/30"
              style={{ animationDelay: `${index * 0.05}s` }}
              data-testid={`quicknav-${link.label.toLowerCase()}`}
            >
              <link.icon className="w-5 h-5 text-primary dark:text-primary group-hover:animate-wiggle" />
            </div>
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              <div className="px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white dark:text-white text-sm rounded-lg shadow-lg border border-primary/30">
                {link.label}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickNav;
