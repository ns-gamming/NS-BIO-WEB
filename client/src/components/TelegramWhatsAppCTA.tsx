
import { MessageCircle, Send, Crown, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TelegramWhatsAppCTAProps {
  telegramLink?: string;
  whatsappLink?: string;
  showVIPOption?: boolean;
  className?: string;
}

export default function TelegramWhatsAppCTA({ 
  telegramLink = "https://t.me/NSfreefirelikesvip",
  whatsappLink = "https://wa.me/918900653250",
  showVIPOption = true,
  className = ""
}: TelegramWhatsAppCTAProps) {
  return (
    <div className={`grid md:grid-cols-2 gap-6 ${className}`}>
      {/* Telegram Group Card */}
      <Card className="relative overflow-hidden group bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-500/5 dark:from-blue-500/20 dark:via-cyan-500/20 dark:to-blue-500/10 border-2 border-blue-500/30 dark:border-blue-500/50 hover:border-blue-500/60 dark:hover:border-blue-500/80 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_40px_rgba(59,130,246,0.7)] animate-fadeUp">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
          <Send className="w-24 h-24 text-blue-500 dark:text-blue-400 animate-float" />
        </div>

        <div className="relative p-8">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-pulse-neon mx-auto">
            <Send className="w-10 h-10 text-white dark:text-white animate-bounce" />
          </div>

          {/* Content */}
          <h3 className="text-2xl font-bold text-center mb-3 text-foreground dark:text-foreground group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
            Join Telegram Group! 🚀
          </h3>
          <p className="text-muted-foreground dark:text-muted-foreground text-center mb-6 leading-relaxed">
            Sabhi tools Telegram pe bhi use karo! Free Fire likes, updates, aur exclusive content - sab kuch ek jagah! 💯
          </p>

          {/* Features */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-blue-500 dark:text-blue-400 animate-pulse" />
              <span className="text-foreground dark:text-foreground">Instant FF Likes via Telegram Bot</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-blue-500 dark:text-blue-400 animate-pulse" />
              <span className="text-foreground dark:text-foreground">Daily Updates & Tips</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-blue-500 dark:text-blue-400 animate-pulse" />
              <span className="text-foreground dark:text-foreground">Active Community Support 24/7</span>
            </div>
          </div>

          {/* CTA Button */}
          <a 
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 text-white dark:text-white font-bold rounded-xl text-center shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300 hover:scale-105 group-hover:animate-pulse"
          >
            <span className="flex items-center justify-center gap-2">
              <Send className="w-5 h-5 animate-bounce" />
              Join Telegram Group Now!
            </span>
          </a>
        </div>
      </Card>

      {/* WhatsApp VIP Card */}
      {showVIPOption && (
        <Card className="relative overflow-hidden group bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/5 dark:from-green-500/20 dark:via-emerald-500/20 dark:to-green-500/10 border-2 border-green-500/30 dark:border-green-500/50 hover:border-green-500/60 dark:hover:border-green-500/80 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] dark:hover:shadow-[0_0_40px_rgba(34,197,94,0.7)] animate-fadeUp" style={{ animationDelay: '0.1s' }}>
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
          
          {/* VIP Badge */}
          <div className="absolute top-4 right-4">
            <div className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-400 dark:to-orange-400 text-white dark:text-white font-bold rounded-full text-xs shadow-lg animate-pulse flex items-center gap-2">
              <Crown className="w-4 h-4 animate-bounce" />
              VIP ACCESS
            </div>
          </div>

          {/* Floating Icons */}
          <div className="absolute bottom-4 left-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
            <MessageCircle className="w-24 h-24 text-green-500 dark:text-green-400 animate-float" />
          </div>

          <div className="relative p-8 pt-16">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-pulse-neon mx-auto">
              <MessageCircle className="w-10 h-10 text-white dark:text-white animate-bounce" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-center mb-3 text-foreground dark:text-foreground group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">
              Get VIP Access! 👑
            </h3>
            <p className="text-muted-foreground dark:text-muted-foreground text-center mb-6 leading-relaxed">
              Premium features chahiye? WhatsApp karo aur VIP member bano! Unlimited access aur exclusive tools! 💎
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Crown className="w-4 h-4 text-green-500 dark:text-green-400 animate-pulse" />
                <span className="text-foreground dark:text-foreground">Unlimited Daily Uses</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Crown className="w-4 h-4 text-green-500 dark:text-green-400 animate-pulse" />
                <span className="text-foreground dark:text-foreground">Priority Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Crown className="w-4 h-4 text-green-500 dark:text-green-400 animate-pulse" />
                <span className="text-foreground dark:text-foreground">Early Access to New Tools</span>
              </div>
            </div>

            {/* CTA Button */}
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 text-white dark:text-white font-bold rounded-xl text-center shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] dark:hover:shadow-[0_0_30px_rgba(34,197,94,0.8)] transition-all duration-300 hover:scale-105 group-hover:animate-pulse"
            >
              <span className="flex items-center justify-center gap-2">
                <i className="fab fa-whatsapp text-xl"></i>
                Contact for VIP Access
              </span>
            </a>
          </div>
        </Card>
      )}
    </div>
  );
}
