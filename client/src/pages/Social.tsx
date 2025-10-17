import { motion } from "framer-motion";
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
  SiFacebook,
  SiWhatsapp,
  SiBinance
} from "react-icons/si";

import _1000016408 from "@assets/1000016408.jpg";

export default function Social() {
  const socialLinks = [
    {
      name: "Binance Square",
      icon: SiBinance,
      color: "text-yellow-500",
      url: "https://app.binance.com/uni-qr/cpro/Nishant_sarkar?l=en&r=V0EBXRR3&uc=app_square_share_link&us=copylink",
      description: "Follow me on Binance Square for crypto insights, trading tips, and blockchain content! 💰🚀",
      testId: "social-binance-square"
    },
    {
      name: "WhatsApp Channel",
      icon: SiWhatsapp,
      color: "text-green-500",
      url: "https://whatsapp.com/channel/0029Vb4QTP7GE56sVeiOJJ1i",
      description: "Join my exclusive WhatsApp channel for instant updates, gaming tips, and behind-the-scenes content! 💚✨",
      testId: "social-whatsapp-channel"
    },
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
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" 
            data-testid="social-links-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <motion.div 
                  key={social.name}
                  className="glass rounded-2xl p-6 group relative overflow-hidden cursor-pointer"
                  data-testid={social.testId}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: 5,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                  }}
                >
                  {/* Animated gradient background */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Animated orbs */}
                  <motion.div 
                    className={`absolute top-0 right-0 w-40 h-40 ${social.color} opacity-20 rounded-full blur-3xl`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.div 
                    className={`absolute bottom-0 left-0 w-32 h-32 ${social.color} opacity-15 rounded-full blur-2xl`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />
                  
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    initial={{ x: "-100%" }}
                    whileHover={{
                      x: "100%",
                      transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div 
                        className="relative"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <motion.div 
                          className={`absolute inset-0 ${social.color} opacity-30 blur-xl`}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <IconComponent className={`w-12 h-12 ${social.color} relative`} />
                        </motion.div>
                      </motion.div>
                      
                      <motion.h3 
                        className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        {social.name}
                      </motion.h3>
                    </div>
                    
                    <motion.p 
                      className="text-muted-foreground mb-6 group-hover:text-foreground transition-colors duration-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {social.description}
                    </motion.p>
                    
                    <motion.a 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="neon-btn w-full inline-flex items-center justify-center"
                      data-testid={`${social.testId}-link`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                      </motion.div>
                      {social.name === "Binance Square" ? "Follow on Binance" :
                       social.name === "WhatsApp Channel" ? "Join Channel" :
                       social.name === "YouTube" ? "Subscribe Now" :
                       social.name === "Instagram" ? "Follow Me" :
                       social.name.includes("Telegram") ? "Join" :
                       social.name === "Discord" ? "Join Server" :
                       social.name === "Reddit" ? "Follow on Reddit" :
                       social.name === "LinkedIn" ? "Connect Now" :
                       "Follow Me"}
                    </motion.a>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* Brand Showcase */}
          <motion.div 
            className="glass rounded-2xl p-8 mt-12 text-center group relative overflow-hidden" 
            data-testid="brand-showcase"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/5"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <motion.div 
                  className="relative"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-primary/30 rounded-xl blur-xl"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.img 
                    src={_1000016408}
                    alt="NS GAMMING Brand" 
                    className="w-24 h-24 rounded-xl border-3 border-primary relative"
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </motion.div>
              </div>
              
              <motion.h2 
                className="text-2xl font-bold text-primary mb-4"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                The NS GAMMING Brand
              </motion.h2>
              
              <motion.p 
                className="text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                This logo represents my journey, passion, and the gaming empire I'm building. Every pixel tells a story of dedication, creativity, and the love for gaming and coding! 🎮✨
              </motion.p>
            </div>
          </motion.div>

          {/* Old Site Mention */}
          <motion.div 
            className="glass rounded-2xl p-8 mt-8 text-center" 
            data-testid="old-site-mention"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.h2 
              className="text-2xl font-bold text-primary mb-4"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Previous Site
            </motion.h2>
            <motion.p 
              className="text-muted-foreground mb-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              My previous website{" "}
              <motion.a 
                href="https://nsgamming.xzy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
                data-testid="old-site-link"
                whileHover={{ scale: 1.05 }}
              >
                https://nsgamming.xzy
              </motion.a>{" "}
              is now archived. This new site represents my growth and evolution as a creator! 🚀
            </motion.p>
            <motion.p 
              className="text-lg text-primary"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Thank you for being part of my journey! Shukriya yaar — you all mean the world to me ❤️
            </motion.p>
          </motion.div>

          {/* Privacy Policy Link */}
          <motion.div 
            className="glass rounded-2xl p-6 mt-8 text-center" 
            data-testid="privacy-link"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.a 
              href="/privacy-policy" 
              className="text-primary hover:underline font-semibold transition-colors inline-block"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              🔒 Privacy Policy
            </motion.a>
          </motion.div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
