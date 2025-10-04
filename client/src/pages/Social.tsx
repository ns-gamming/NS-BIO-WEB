import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { 
  SiYoutube, 
  SiInstagram, 
  SiTelegram, 
  SiDiscord, 
  SiReddit, 
  SiLinkedin, 
  SiX,
  SiFacebook 
} from "react-icons/si";

import _1000016408 from "@assets/1000016408.jpg";

export default function Social() {
  const socialLinks = [
    {
      name: "YouTube",
      icon: SiYoutube,
      color: "text-red-500",
      url: "https://youtube.com/@Nishant_sarkar",
      description: "Gaming videos, tutorials, and lots of fun! Subscribe kar do yaar — let's grow together! 🎥❤️",
      testId: "social-youtube"
    },
    {
      name: "Instagram",
      icon: SiInstagram,
      color: "text-pink-500",
      url: "https://instagram.com/nishant_sarkar__10k",
      description: "Behind the scenes, daily updates, and gaming moments! Follow for the real me 📸",
      testId: "social-instagram"
    },
    {
      name: "Telegram Channel",
      icon: SiTelegram,
      color: "text-blue-500",
      url: "https://t.me/nsgamming69",
      description: "Daily updates, gaming news, and exclusive content! Join the channel for instant notifications 📢",
      testId: "social-telegram-channel"
    },
    {
      name: "VIP Telegram Group",
      icon: SiTelegram,
      color: "text-yellow-500",
      url: "https://t.me/NSfreefirelikesvip",
      description: "Exclusive community for true supporters! Get free fire likes and more cool things 💎",
      testId: "social-telegram-vip"
    },
    {
      name: "Discord",
      icon: SiDiscord,
      color: "text-indigo-500",
      url: "https://discord.gg/eRnfcBuv5v",
      description: "Gaming sessions, voice chats, and community events! The heart of NS GAMMING family 🎮",
      testId: "social-discord"
    },
    {
      name: "Reddit",
      icon: SiReddit,
      color: "text-orange-600",
      url: "https://reddit.com/u/NSGAMMING699",
      description: "Deep discussions, memes, and community posts! Upvote kar do friends 📈",
      testId: "social-reddit"
    },
    {
      name: "LinkedIn",
      icon: SiLinkedin,
      color: "text-blue-600",
      url: "https://linkedin.com/in/naboraj-sarkar",
      description: "Professional network and career updates! Connect for business opportunities 💼",
      testId: "social-linkedin"
    },
    {
      name: "Twitter (X)",
      icon: SiX,
      color: "text-foreground",
      url: "https://x.com/NSGAMMING699",
      description: "Quick updates, thoughts, and gaming tweets! Follow for daily dose of NS GAMMING 🐦",
      testId: "social-twitter"
    },
    {
      name: "Facebook",
      icon: SiFacebook,
      color: "text-blue-600",
      url: "https://www.facebook.com/share/1BCmPha8aM/",
      description: "Connect with me on Facebook! Updates, posts, and community interactions 📘",
      testId: "social-facebook"
    }
  ];

  return (
    <div className="pt-16">
      <HeroSection 
        title="🌍 Follow Me Everywhere"
        subtitle="Join the NS GAMMING family across all platforms!"
      />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="social-links-grid">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <div 
                  key={social.name}
                  className="glass rounded-2xl p-6 hover:scale-105 transition-transform" 
                  data-testid={social.testId}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <IconComponent className={`w-12 h-12 ${social.color}`} />
                    <h3 className="text-xl font-bold text-foreground">{social.name}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {social.description}
                  </p>
                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="neon-btn w-full"
                    data-testid={`${social.testId}-link`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {social.name === "YouTube" ? "Subscribe Now" :
                     social.name === "Instagram" ? "Follow Me" :
                     social.name.includes("Telegram") ? "Join" :
                     social.name === "Discord" ? "Join Server" :
                     social.name === "Reddit" ? "Follow on Reddit" :
                     social.name === "LinkedIn" ? "Connect Now" :
                     "Follow Me"}
                  </a>
                </div>
              );
            })}
          </div>
          
          {/* Brand Showcase */}
          <div className="glass rounded-2xl p-8 mt-12 text-center" data-testid="brand-showcase">
            <div className="flex items-center justify-center mb-6">
              <img 
                src={_1000016408}
                alt="NS GAMMING Brand" 
                className="w-24 h-24 rounded-xl border-3 border-primary animate-pulse-neon"
              />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-4">The NS GAMMING Brand</h2>
            <p className="text-muted-foreground mb-6">
              This logo represents my journey, passion, and the gaming empire I'm building. Every pixel tells a story of dedication, creativity, and the love for gaming and coding! 🎮✨
            </p>
          </div>

          {/* Old Site Mention */}
          <div className="glass rounded-2xl p-8 mt-8 text-center" data-testid="old-site-mention">
            <h2 className="text-2xl font-bold text-primary mb-4">Previous Site</h2>
            <p className="text-muted-foreground mb-4">
              My previous website{" "}
              <a 
                href="https://nsgamming.xzy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
                data-testid="old-site-link"
              >
                https://nsgamming.xzy
              </a>{" "}
              is now archived. This new site represents my growth and evolution as a creator! 🚀
            </p>
            <p className="text-lg text-primary">
              Thank you for being part of my journey! Shukriya yaar — you all mean the world to me ❤️
            </p>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
