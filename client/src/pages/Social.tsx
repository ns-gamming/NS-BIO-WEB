import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { 
  SiYoutube, 
  SiInstagram, 
  SiTelegram, 
  SiDiscord, 
  SiReddit, 
  SiLinkedin, 
  SiX 
} from "react-icons/si";

export default function Social() {
  const socialLinks = [
    {
      name: "YouTube",
      icon: SiYoutube,
      color: "text-red-500",
      url: "https://youtube.com/@Nishant_sarkar",
      description: "Gaming videos, tutorials, and vlogs! Subscribe kar do yaar — let's grow together! 🎥❤️",
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
      description: "Exclusive community for true supporters! Chat directly with me and fellow gamers 💎",
      testId: "social-telegram-vip"
    },
    {
      name: "Discord",
      icon: SiDiscord,
      color: "text-indigo-500",
      url: "https://discord.gg/eRnfcBuv5v",
      description: "Gaming sessions, voice chats, and community events! The heart of NS GAMING family 🎮",
      testId: "social-discord"
    },
    {
      name: "Reddit",
      icon: SiReddit,
      color: "text-orange-600",
      url: "https://reddit.com/u/NSGAMMING69",
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
      description: "Quick updates, thoughts, and gaming tweets! Follow for daily dose of NS GAMING 🐦",
      testId: "social-twitter"
    }
  ];

  return (
    <div className="pt-16">
      <HeroSection 
        title="🌍 Follow Me Everywhere"
        subtitle="Join the NS GAMING family across all platforms!"
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
          
          {/* Old Site Mention */}
          <div className="glass rounded-2xl p-8 mt-12 text-center" data-testid="old-site-mention">
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
