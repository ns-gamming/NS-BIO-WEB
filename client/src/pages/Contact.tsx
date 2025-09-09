import HeroSection from "../components/HeroSection";
import AdSenseAd from "../components/AdSenseAd";
import { Mail, MessageCircle, Send, Eye, Code, Smartphone, Search, Target } from "lucide-react";
import { SiWhatsapp, SiTelegram } from "react-icons/si";
import { Link } from "wouter";

export default function Contact() {
  return (
    <div className="pt-16">
      <HeroSection 
        title="📩 Let's Connect"
        subtitle="Want to talk? I reply with love and respect! ✨"
      />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12" data-testid="contact-methods">
            {/* Business Email */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform" data-testid="contact-email">
              <div className="text-center mb-4">
                <Mail className="w-12 h-12 text-primary mb-3 mx-auto" />
                <h3 className="text-xl font-bold text-foreground">Business Email</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                For business inquiries, collaborations, and professional work
              </p>
              <a 
                href="mailto:nishant.ns.business@gmail.com" 
                className="neon-btn w-full"
                data-testid="email-link"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </a>
            </div>
            
            {/* WhatsApp Chat */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform" data-testid="contact-whatsapp">
              <div className="text-center mb-4">
                <SiWhatsapp className="w-12 h-12 text-green-500 mb-3 mx-auto" />
                <h3 className="text-xl font-bold text-foreground">WhatsApp Chat</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Quick chats, instant replies, and friendly conversations! 💬
              </p>
              <a 
                href="https://wa.me/918900653250" 
                target="_blank" 
                rel="noopener noreferrer"
                className="neon-btn w-full"
                data-testid="whatsapp-link"
              >
                <SiWhatsapp className="w-4 h-4 mr-2" />
                Chat with Nishant
              </a>
            </div>
            
            {/* Telegram Chat */}
            <div className="glass rounded-2xl p-6 hover:scale-105 transition-transform" data-testid="contact-telegram">
              <div className="text-center mb-4">
                <SiTelegram className="w-12 h-12 text-blue-500 mb-3 mx-auto" />
                <h3 className="text-xl font-bold text-foreground">Telegram Chat</h3>
              </div>
              <p className="text-muted-foreground mb-6 text-center">
                Direct messaging for quick questions and support 📱
              </p>
              <a 
                href="https://t.me/Nishantsarkar10k" 
                target="_blank" 
                rel="noopener noreferrer"
                className="neon-btn w-full"
                data-testid="telegram-link"
              >
                <SiTelegram className="w-4 h-4 mr-2" />
                Message Me
              </a>
            </div>
          </div>
          
          {/* Commission Section */}
          <div className="glass rounded-2xl p-8 text-center" data-testid="commission-section">
            <h2 className="text-3xl font-bold text-primary mb-6">🎨 Want a Website Like This?</h2>
            <p className="text-lg text-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
              I build custom websites, portfolios, and gaming projects with the same love and attention to detail you see here! 
              Whether it's a personal portfolio, business site, or gaming platform — I create digital experiences that matter.
              <span className="block mt-4 text-primary font-semibold">DM me on WhatsApp to discuss your project! 🚀</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a 
                href="https://wa.me/918900653250" 
                target="_blank" 
                rel="noopener noreferrer"
                className="neon-btn"
                data-testid="commission-whatsapp"
              >
                <SiWhatsapp className="w-4 h-4 mr-2" />
                Commission Work
              </a>
              <Link href="/portfolio" className="neon-btn" data-testid="view-work-link">
                <Eye className="w-4 h-4 mr-2" />
                View My Work
              </Link>
            </div>
            
            <div className="glass bg-muted rounded-lg p-6" data-testid="services-offered">
              <h3 className="text-lg font-semibold text-foreground mb-3">What I Offer:</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  Custom Websites
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Portfolio Sites
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  Gaming Platforms
                </div>
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-primary" />
                  Business Solutions
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-primary" />
                  Mobile-Responsive Design
                </div>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" />
                  SEO Optimization
                </div>
              </div>
            </div>
          </div>
          
          {/* Personal Touch */}
          <div className="text-center mt-12 glass rounded-2xl p-8" data-testid="personal-touch">
            <h2 className="text-2xl font-bold text-primary mb-4">Why Choose Me? 💙</h2>
            <p className="text-lg text-foreground max-w-3xl mx-auto leading-relaxed">
              I don't just build websites — I create digital homes for your ideas! Every project gets my personal attention, 
              love, and dedication. From concept to launch, you'll work directly with me, not a team of strangers.
              <span className="block mt-4 text-primary">Let's build something amazing together! Chalo shuru karte hain! 🎯</span>
            </p>
          </div>
        </div>
      </div>
      
      <AdSenseAd />
    </div>
  );
}
