
import { motion, useScroll, useTransform } from "framer-motion";
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
  SiBinance,
  SiGithub
} from "react-icons/si";

import _1000016408 from "@assets/1000016408.jpg";
import { useRef } from "react";

export default function Social() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  const socialLinks = [
    {
      name: "GitHub",
      icon: SiGithub,
      color: "text-gray-900 dark:text-white",
      bgGradient: "from-gray-700/20 to-gray-900/20",
      hoverGradient: "from-gray-700/40 to-gray-900/40",
      url: "https://github.com/ns-gamming",
      description: "Check out my code, projects, and open-source contributions on GitHub! Star my repos! ⭐💻",
      testId: "social-github"
    },
    {
      name: "Binance Square",
      icon: SiBinance,
      color: "text-yellow-500",
      bgGradient: "from-yellow-500/20 to-orange-500/20",
      hoverGradient: "from-yellow-500/40 to-orange-500/40",
      url: "https://app.binance.com/uni-qr/cpro/Nishant_sarkar?l=en&r=V0EBXRR3&uc=app_square_share_link&us=copylink",
      description: "Follow me on Binance Square for crypto insights, trading tips, and blockchain content! 💰🚀",
      testId: "social-binance-square"
    },
    {
      name: "WhatsApp Channel",
      icon: SiWhatsapp,
      color: "text-green-500",
      bgGradient: "from-green-500/20 to-emerald-500/20",
      hoverGradient: "from-green-500/40 to-emerald-500/40",
      url: "https://whatsapp.com/channel/0029Vb4QTP7GE56sVeiOJJ1i",
      description: "Join my exclusive WhatsApp channel for instant updates, gaming tips, and behind-the-scenes content! 💚✨",
      testId: "social-whatsapp-channel"
    },
    {
      name: "YouTube",
      icon: SiYoutube,
      color: "text-red-500",
      bgGradient: "from-red-500/20 to-pink-500/20",
      hoverGradient: "from-red-500/40 to-pink-500/40",
      url: "https://youtube.com/@Nishant_sarkar",
      description: "Gaming videos, tutorials, and lots of fun! Subscribe kar do yaar — let's grow together! 🎥❤️",
      testId: "social-youtube"
    },
    {
      name: "Instagram",
      icon: SiInstagram,
      color: "text-pink-500",
      bgGradient: "from-pink-500/20 to-purple-500/20",
      hoverGradient: "from-pink-500/40 to-purple-500/40",
      url: "https://instagram.com/nishant_sarkar__10k",
      description: "Behind the scenes, daily updates, and gaming moments! Follow for the real me 📸",
      testId: "social-instagram"
    },
    {
      name: "Telegram Channel",
      icon: SiTelegram,
      color: "text-blue-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      hoverGradient: "from-blue-500/40 to-cyan-500/40",
      url: "https://t.me/nsgamming69",
      description: "Daily updates, gaming news, and exclusive content! Join the channel for instant notifications 📢",
      testId: "social-telegram-channel"
    },
    {
      name: "VIP Telegram Group",
      icon: SiTelegram,
      color: "text-yellow-500",
      bgGradient: "from-yellow-500/20 to-amber-500/20",
      hoverGradient: "from-yellow-500/40 to-amber-500/40",
      url: "https://t.me/NSfreefirelikesvip",
      description: "Exclusive community for true supporters! Get free fire likes and more cool things 💎",
      testId: "social-telegram-vip"
    },
    {
      name: "Discord",
      icon: SiDiscord,
      color: "text-indigo-500",
      bgGradient: "from-indigo-500/20 to-violet-500/20",
      hoverGradient: "from-indigo-500/40 to-violet-500/40",
      url: "https://discord.gg/eRnfcBuv5v",
      description: "Gaming sessions, voice chats, and community events! The heart of NS GAMMING family 🎮",
      testId: "social-discord"
    },
    {
      name: "Reddit",
      icon: SiReddit,
      color: "text-orange-600",
      bgGradient: "from-orange-600/20 to-red-500/20",
      hoverGradient: "from-orange-600/40 to-red-500/40",
      url: "https://reddit.com/u/NSGAMMING699",
      description: "Deep discussions, memes, and community posts! Upvote kar do friends 📈",
      testId: "social-reddit"
    },
    {
      name: "LinkedIn",
      icon: SiLinkedin,
      color: "text-blue-600",
      bgGradient: "from-blue-600/20 to-sky-500/20",
      hoverGradient: "from-blue-600/40 to-sky-500/40",
      url: "https://linkedin.com/in/naboraj-sarkar",
      description: "Professional network and career updates! Connect for business opportunities 💼",
      testId: "social-linkedin"
    },
    {
      name: "Twitter (X)",
      icon: SiX,
      color: "text-foreground",
      bgGradient: "from-gray-500/20 to-slate-500/20",
      hoverGradient: "from-gray-500/40 to-slate-500/40",
      url: "https://x.com/NSGAMMING699",
      description: "Quick updates, thoughts, and gaming tweets! Follow for daily dose of NS GAMMING 🐦",
      testId: "social-twitter"
    },
    {
      name: "Facebook",
      icon: SiFacebook,
      color: "text-blue-600",
      bgGradient: "from-blue-600/20 to-indigo-500/20",
      hoverGradient: "from-blue-600/40 to-indigo-500/40",
      url: "https://www.facebook.com/share/1BCmPha8aM/",
      description: "Connect with me on Facebook! Updates, posts, and community interactions 📘",
      testId: "social-facebook"
    }
  ];

  return (
    <div className="pt-16" ref={containerRef}>
      <HeroSection 
        title="🌍 Follow Me Everywhere"
        subtitle="Join the NS GAMMING family across all platforms!"
      />
      
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl"
          animate={{
            x: [-50, 50, -50],
            y: [-50, 50, -50],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="container mx-auto px-6 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" 
            data-testid="social-links-grid"
            style={{ opacity, scale }}
          >
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <motion.div 
                  key={social.name}
                  className="relative group"
                  initial={{ opacity: 0, y: 60, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.08,
                    type: "spring",
                    stiffness: 80
                  }}
                  data-testid={social.testId}
                >
                  {/* Card Container */}
                  <motion.a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass rounded-2xl p-6 block relative overflow-hidden"
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 8,
                      rotateX: 8,
                      transition: { duration: 0.3, type: "spring", stiffness: 200 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    style={{ 
                      transformStyle: "preserve-3d",
                      perspective: "1000px"
                    }}
                    data-testid={`${social.testId}-link`}
                  >
                    {/* Animated gradient background */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${social.bgGradient} opacity-0 group-hover:opacity-100`}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    {/* Animated border glow */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100`}
                      style={{
                        background: `linear-gradient(45deg, transparent, ${social.color.replace('text-', 'rgba(var(--')}, 0.3), transparent)`,
                        filter: "blur(8px)",
                      }}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    {/* Floating particles */}
                    <motion.div 
                      className={`absolute top-0 right-0 w-32 h-32 ${social.color} opacity-20 rounded-full blur-2xl`}
                      animate={{
                        scale: [1, 1.3, 1],
                        x: [0, 20, 0],
                        y: [0, -20, 0],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    <motion.div 
                      className={`absolute bottom-0 left-0 w-24 h-24 ${social.color} opacity-15 rounded-full blur-xl`}
                      animate={{
                        scale: [1, 1.4, 1],
                        x: [0, -15, 0],
                        y: [0, 15, 0],
                        opacity: [0.15, 0.3, 0.15],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                    
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      initial={{ x: "-200%" }}
                      whileHover={{
                        x: "200%",
                        transition: { duration: 1, ease: "easeInOut" }
                      }}
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)"
                      }}
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <motion.div 
                          className="relative"
                          whileHover={{ 
                            rotate: [0, -10, 10, -10, 0],
                            scale: 1.2
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Icon glow effect */}
                          <motion.div 
                            className={`absolute inset-0 ${social.color} opacity-40 blur-xl`}
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.4, 0.6, 0.4]
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                          <IconComponent className={`w-12 h-12 ${social.color} relative drop-shadow-lg`} />
                        </motion.div>
                        
                        <motion.h3 
                          className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300"
                          initial={{ x: -20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08 + 0.2 }}
                        >
                          {social.name}
                        </motion.h3>
                      </div>
                      
                      <motion.p 
                        className="text-muted-foreground mb-6 group-hover:text-foreground transition-colors duration-300 leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 + 0.3 }}
                      >
                        {social.description}
                      </motion.p>
                      
                      <motion.div 
                        className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r ${social.bgGradient} border-2 border-transparent group-hover:border-current ${social.color} font-semibold transition-all duration-300`}
                        whileHover={{ 
                          scale: 1.08,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          animate={{ 
                            rotate: [0, 15, -15, 0],
                            y: [0, -2, 0]
                          }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <IconComponent className="w-4 h-4" />
                        </motion.div>
                        <span>
                          {social.name === "Binance Square" ? "Follow on Binance" :
                           social.name === "WhatsApp Channel" ? "Join Channel" :
                           social.name === "YouTube" ? "Subscribe Now" :
                           social.name === "Instagram" ? "Follow Me" :
                           social.name.includes("Telegram") ? "Join" :
                           social.name === "Discord" ? "Join Server" :
                           social.name === "Reddit" ? "Follow on Reddit" :
                           social.name === "LinkedIn" ? "Connect Now" :
                           "Follow Me"}
                        </span>
                      </motion.div>
                    </div>
                  </motion.a>
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* Brand Showcase */}
          <motion.div 
            className="glass rounded-3xl p-8 mt-12 text-center group relative overflow-hidden" 
            data-testid="brand-showcase"
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 60 }}
            whileHover={{ scale: 1.02, rotateX: 2 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/15 via-purple-500/10 to-pink-500/15 dark:from-primary/20 dark:via-purple-500/15 dark:to-pink-500/20"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.25, 0.1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <motion.div 
                  className="relative"
                  whileHover={{ 
                    scale: 1.15,
                    rotate: [0, -5, 5, -5, 0]
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-primary/40 dark:bg-primary/50 rounded-xl blur-xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.4, 0.6, 0.4]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                  <motion.img 
                    src={_1000016408}
                    alt="NS GAMMING Brand" 
                    className="w-24 h-24 rounded-xl border-3 border-primary relative shadow-2xl"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(6, 182, 212, 0.3)",
                        "0 0 40px rgba(6, 182, 212, 0.6)",
                        "0 0 20px rgba(6, 182, 212, 0.3)",
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </div>
              
              <motion.h2 
                className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                The NS GAMMING Brand
              </motion.h2>
              
              <motion.p 
                className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                This logo represents my journey, passion, and the gaming empire I'm building. Every pixel tells a story of dedication, creativity, and the love for gaming and coding! 🎮✨
              </motion.p>
            </div>
          </motion.div>

          {/* Old Site Mention */}
          <motion.div 
            className="glass rounded-2xl p-8 mt-8 text-center relative overflow-hidden group" 
            data-testid="old-site-mention"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.4 }}
            />
            
            <motion.h2 
              className="text-2xl font-bold text-primary mb-4 relative z-10"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Previous Site
            </motion.h2>
            <motion.p 
              className="text-muted-foreground mb-4 relative z-10"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              My previous website{" "}
              <motion.a 
                href="https://nsgamming.xzy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline font-semibold"
                data-testid="old-site-link"
                whileHover={{ scale: 1.1, color: "#00BFFF" }}
              >
                https://nsgamming.xzy
              </motion.a>{" "}
              is now archived. This new site represents my growth and evolution as a creator! 🚀
            </motion.p>
            <motion.p 
              className="text-lg text-primary relative z-10"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              animate={{
                textShadow: [
                  "0 0 10px rgba(6, 182, 212, 0.5)",
                  "0 0 20px rgba(6, 182, 212, 0.8)",
                  "0 0 10px rgba(6, 182, 212, 0.5)",
                ]
              }}
              style={{
                transition: "text-shadow 1.5s ease-in-out infinite"
              }}
            >
              Thank you for being part of my journey! Shukriya yaar — you all mean the world to me ❤️
            </motion.p>
          </motion.div>

          {/* Privacy Policy Link */}
          <motion.div 
            className="glass rounded-2xl p-6 mt-8 text-center relative overflow-hidden group" 
            data-testid="privacy-link"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05, rotateZ: 1 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            <motion.a 
              href="/privacy-policy" 
              className="text-primary hover:text-cyan-400 font-bold text-lg transition-colors inline-flex items-center gap-2 relative z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🔒
              </motion.span>
              Privacy Policy
            </motion.a>
          </motion.div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
