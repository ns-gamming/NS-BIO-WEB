import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Trophy, Users, TrendingUp, Sparkles, Rocket, Zap, Star, Gift, Swords } from "lucide-react";
import AdSenseAd from "@/components/AdSenseAd";
import TelegramWhatsAppCTA from "@/components/TelegramWhatsAppCTA";

const BOTS = [
  {
    id: 'likes',
    title: 'Free Fire Likes Bot',
    description: 'Apne profile ko boost karo with FREE likes! Ek click mein hundreds of likes milega boss! 💕',
    icon: Trophy,
    color: 'from-pink-500 to-rose-500',
    gradient: 'from-pink-500/20 to-rose-500/20',
    badge: 'Most Popular 🔥',
    status: 'Live',
    features: ['Free Likes Daily', 'All Regions', 'Instant Delivery']
  },
  {
    id: 'info',
    title: 'Free Fire Info Bot',
    description: 'Kisi bhi player ki complete details nikalo! Stats, level, achievements - sab kuch ek jagah! 📊',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    badge: 'Live Now 🎉',
    status: 'Live',
    features: ['5 Free Searches/Day', 'Complete Stats', 'Copy & Download']
  },
  {
    id: 'compare',
    title: 'Free Fire VS Battle',
    description: 'Do players ko head-to-head compare karo! AI-powered analysis se jano kaun hai asli champion! ⚔️',
    icon: Swords,
    color: 'from-purple-500 to-pink-500',
    gradient: 'from-purple-500/20 to-pink-500/20',
    badge: 'NEW & HOT 🌟',
    status: 'Live',
    features: ['3 Free Compares/Day', 'AI Analysis', 'Detailed Scores']
  },
  {
    id: 'spam',
    title: 'Free Fire Spam Bot',
    description: 'Profile visibility badao aur famous bano! Automated engagement se popularity boost karo! 📈',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
    gradient: 'from-orange-500/20 to-red-500/20',
    badge: 'Coming Soon 🎯',
    status: 'Soon',
    features: ['Auto Engagement', 'Visibility Boost', 'Safe & Secure']
  },
  {
    id: 'visit',
    title: 'Free Fire Visit Bot',
    description: 'Profile visits badao aur followers gain karo! Become a star player with massive following! ⭐',
    icon: Sparkles,
    color: 'from-green-500 to-emerald-500',
    gradient: 'from-green-500/20 to-emerald-500/20',
    badge: 'Coming Soon ✨',
    status: 'Soon',
    features: ['Profile Visits', 'Follower Growth', 'Organic Reach']
  }
];

export default function FFBotsHub() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10">
      <div className="container mx-auto max-w-7xl">
        {/* Epic Hero Section */}
        <div className="text-center mb-16 animate-fadeUp">
          <div className="inline-flex items-center gap-3 mb-6 px-8 py-3 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 dark:from-orange-500/30 dark:via-red-500/30 dark:to-pink-500/30 rounded-full border-2 border-orange-500/50 dark:border-orange-500/70 animate-pulse-neon backdrop-blur-sm">
            <Rocket className="w-7 h-7 text-orange-500 dark:text-orange-400 animate-bounce" />
            <span className="font-orbitron font-bold text-xl text-orange-500 dark:text-orange-400">Free Fire Power Tools</span>
            <Rocket className="w-7 h-7 text-orange-500 dark:text-orange-400 animate-bounce" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 bg-clip-text text-transparent animate-glow" data-testid="text-title">
            FF Bots Hub 🔥
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground dark:text-muted-foreground max-w-3xl mx-auto mb-8 animate-slideInFromBottom">
            Game ko next level pe le jao yaar! Free tools se apne FF profile ko supercharge karo! 💪 
            <span className="text-primary dark:text-primary font-bold"> Sab kuch FREE hai boss!</span>
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center animate-scaleIn">
            <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 rounded-full border-2 border-green-500/50 dark:border-green-500/70">
              <Star className="w-5 h-5 text-green-500 dark:text-green-400 animate-spin" />
              <span className="font-semibold text-green-600 dark:text-green-400">100% Free</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 rounded-full border-2 border-blue-500/50 dark:border-blue-500/70">
              <Zap className="w-5 h-5 text-blue-500 dark:text-blue-400 animate-pulse" />
              <span className="font-semibold text-blue-600 dark:text-blue-400">Instant Results</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full border-2 border-purple-500/50 dark:border-purple-500/70">
              <Gift className="w-5 h-5 text-purple-500 dark:text-purple-400 animate-bounce" />
              <span className="font-semibold text-purple-600 dark:text-purple-400">Safe & Secure</span>
            </div>
          </div>
        </div>

        {/* Ad Placement - Top */}
        <div className="mb-12 animate-fadeUp">
          <AdSenseAd />
        </div>

        {/* Bots Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {BOTS.map((bot, index) => (
            <Card 
              key={bot.id}
              className={`group relative overflow-hidden bg-gradient-to-br ${bot.gradient} dark:${bot.gradient} backdrop-blur-sm border-2 border-primary/20 dark:border-primary/30 hover:border-primary/50 dark:hover:border-primary/60 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] dark:hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] animate-scaleIn`}
              style={{ animationDelay: `${index * 0.15}s` }}
              data-testid={`card-bot-${bot.id}`}
            >
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${bot.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              {/* Status Badge */}
              {bot.badge && (
                <div className="absolute top-4 right-4 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 text-white dark:text-white text-sm font-bold rounded-full animate-pulse shadow-lg z-10">
                  {bot.badge}
                </div>
              )}

              <div className="relative p-8">
                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${bot.color} dark:${bot.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-pulse-neon`}>
                  <bot.icon className="w-10 h-10 text-white dark:text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3 text-foreground dark:text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors">
                  {bot.title}
                </h3>
                <p className="text-muted-foreground dark:text-muted-foreground mb-6 leading-relaxed">
                  {bot.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {bot.features.map((feature, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-background/50 dark:bg-background/70 border border-primary/30 dark:border-primary/50 rounded-full text-xs font-semibold text-primary dark:text-primary"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                {bot.status === 'Live' ? (
                  <Link 
                    href={`/ff-bots/${bot.id}`}
                    className={`block w-full py-4 px-6 bg-gradient-to-r ${bot.color} dark:${bot.color} text-white dark:text-white font-bold rounded-xl text-center shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] dark:hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] transition-all duration-300 hover:scale-105 group-hover:animate-pulse`}
                    data-testid={`button-use-${bot.id}`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5 animate-spin" />
                      Use Now - FREE!
                      <Sparkles className="w-5 h-5 animate-bounce" />
                    </span>
                  </Link>
                ) : (
                  <button 
                    disabled
                    className="w-full py-4 px-6 bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700 text-white dark:text-white font-bold rounded-xl text-center shadow-lg cursor-not-allowed opacity-60"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Rocket className="w-5 h-5" />
                      Launching Soon...
                    </span>
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fadeUp">
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border-2 border-blue-500/30 dark:border-blue-500/50 hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-bold mb-3 text-foreground dark:text-foreground flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              How It Works?
            </h3>
            <p className="text-muted-foreground dark:text-muted-foreground">
              Simple hai yaar! Just select your tool, enter your UID, aur bas! Results instantly milega. No signup, no payment - ekdum FREE! 🎮
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border-2 border-green-500/30 dark:border-green-500/50 hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-bold mb-3 text-foreground dark:text-foreground flex items-center gap-2">
              <Star className="w-6 h-6 text-green-500 dark:text-green-400" />
              Safe & Secure
            </h3>
            <p className="text-muted-foreground dark:text-muted-foreground">
              100% safe and secure tools! No ban risk, no account access needed. Bas apna UID dalo aur enjoy karo! Trust the process boss! 🛡️
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border-2 border-purple-500/30 dark:border-purple-500/50 hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-bold mb-3 text-foreground dark:text-foreground flex items-center gap-2">
              <Gift className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              More Coming Soon!
            </h3>
            <p className="text-muted-foreground dark:text-muted-foreground">
              Ye toh sirf shuruat hai! More amazing tools aa rahe hain soon. Stay tuned aur share karo apne dosto ke saath! 🚀
            </p>
          </Card>
        </div>

        {/* Telegram & WhatsApp CTA */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-8 text-center bg-gradient-to-r from-blue-500 via-green-500 to-cyan-500 dark:from-blue-400 dark:via-green-400 dark:to-cyan-400 bg-clip-text text-transparent animate-glow">
            Join Our Community! 🎉
          </h2>
          <TelegramWhatsAppCTA />
        </div>

        {/* Ad Placement - Bottom */}
        <div className="mb-12 animate-fadeUp">
          <AdSenseAd />
        </div>

        {/* CTA Section */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 dark:from-primary/20 dark:via-accent/20 dark:to-primary/10 border-2 border-primary/30 dark:border-primary/50 text-center animate-fadeUp">
          <h3 className="text-2xl font-bold mb-4 text-foreground dark:text-foreground">
            Kuch Doubt Hai? Questions Hai? 🤔
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground mb-6 max-w-2xl mx-auto">
            Koi bhi problem ho toh directly contact karo! Main hoon na help karne ke liye. Let's dominate together! 💪
          </p>
          <a 
            href="https://wa.me/918900653250" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 text-white dark:text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] dark:hover:shadow-[0_0_30px_rgba(34,197,94,0.8)] transition-all duration-300 hover:scale-105"
          >
            <i className="fab fa-whatsapp text-2xl"></i>
            WhatsApp pe Message Karo!
          </a>
        </Card>
      </div>
    </div>
  );
}
