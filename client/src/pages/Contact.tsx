import { useState } from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import AdSenseAd from "@/components/AdSenseAd";
import { Mail, MessageCircle, Send, Eye, Code, Smartphone, Search, Target, CheckCircle } from "lucide-react";
import { SiWhatsapp, SiTelegram, SiFacebook } from "react-icons/si";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import PageFeedback from "@/components/PageFeedback";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before submitting! 📝",
        variant: "destructive",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address! ✉️",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const mailtoLink = `mailto:nishant.ns.business@gmail.com?subject=Message from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoLink;

    setTimeout(() => {
      toast({
        title: "Message Sent! 🎉",
        description: "Thanks for reaching out! I'll get back to you soon! ❤️",
      });
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

          {/* Contact Form */}
          <div className="glass rounded-2xl p-8 mb-12 animate-fadeUp" data-testid="contact-form-section">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">📨 Send Me a Message</h2>
            <p className="text-center text-muted-foreground mb-8">
              Fill out the form below and I'll get back to you as soon as possible! 💬
            </p>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              <div className="animate-fadeUp" style={{ animationDelay: '0.1s' }}>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  data-testid="input-name"
                />
              </div>

              <div className="animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  data-testid="input-email"
                />
              </div>

              <div className="animate-fadeUp" style={{ animationDelay: '0.3s' }}>
                <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell me about your project or question..."
                  className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  data-testid="input-message"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="neon-btn w-full animate-fadeUp disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ animationDelay: '0.4s' }}
                data-testid="submit-button"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </span>
                )}
              </button>

              <p className="text-center text-sm text-muted-foreground animate-fadeUp" style={{ animationDelay: '0.5s' }}>
                * All fields are required
              </p>
            </form>
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
              love, and dedication.
              From concept to launch, you'll work directly with me, not a team of strangers.
              <span className="block mt-4 text-primary">Let's build something amazing together! Chalo shuru karte hain! 🎯</span>
            </p>
          </div>
        </div>

        {/* AdSense */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AdSenseAd />
        </motion.div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <PageFeedback pageName="Contact" />
        </motion.div>
      </div>
    </div>
  );
}