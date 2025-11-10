
import { useState } from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import AdSenseAd from "@/components/AdSenseAd";
import { Mail, MessageCircle, Send, Eye, Code, Smartphone, Search, Target, CheckCircle, Star, MapPin, Clock, Globe, Sparkles, Zap, Heart } from "lucide-react";
import { SiWhatsapp, SiTelegram, SiFacebook } from "react-icons/si";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import PageFeedback from "@/components/PageFeedback";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [feedbackData, setFeedbackData] = useState({ name: '', email: '', subject: '', message: '', rating: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

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

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackData.name || !feedbackData.email || !feedbackData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields! 📝",
        variant: "destructive",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(feedbackData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address! ✉️",
        variant: "destructive",
      });
      return;
    }

    if (feedbackData.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please give us a star rating! ⭐",
        variant: "destructive",
      });
      return;
    }

    setIsFeedbackSubmitting(true);

    try {
      const response = await fetch('/api/contact/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Feedback Received! 🎉",
          description: "Thank you for sharing your thoughts with us! ❤️",
        });
        setFeedbackData({ name: '', email: '', subject: '', message: '', rating: 0 });
      } else {
        throw new Error(data.message || 'Failed to submit feedback');
      }
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsFeedbackSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFeedbackData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="pt-16 overflow-hidden min-h-screen">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [-50, 50, -50],
            y: [-50, 50, -50],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/4 right-1/4 w-40 h-40 sm:w-56 sm:h-56 bg-pink-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [50, -50, 50],
            y: [30, -30, 30],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <HeroSection 
        title="📩 Let's Connect"
        subtitle="Want to talk? I reply with love and respect! ✨"
      />

      <div className="container mx-auto px-4 sm:px-6 pb-20 relative z-10">
        {/* Hero Stats Section - Enhanced */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto mb-12 sm:mb-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {[
              { icon: Clock, value: "24/7", label: "Available", color: "from-primary to-cyan-400", emoji: "⏰" },
              { icon: MessageCircle, value: "<1hr", label: "Response Time", color: "from-green-500 to-emerald-400", emoji: "⚡" },
              { icon: Star, value: "5.0", label: "Client Rating", color: "from-yellow-500 to-orange-400", emoji: "⭐" },
              { icon: Globe, value: "Global", label: "Reach", color: "from-blue-500 to-purple-500", emoji: "🌍" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.08, y: -8 }}
                whileTap={{ scale: 0.95 }}
                className="glass rounded-2xl p-4 sm:p-5 lg:p-6 text-center relative overflow-hidden group cursor-pointer border border-border/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-15 transition-all duration-500`}></div>
                <motion.div 
                  className="relative z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">{stat.emoji}</div>
                  <stat.icon className={`w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mx-auto mb-3 group-hover:animate-pulse`} />
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
                <motion.div 
                  className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Contact Methods Grid - Enhanced */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-12 sm:mb-16" 
            data-testid="contact-methods"
          >
            {/* Business Email - Enhanced */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -12 }}
              whileTap={{ scale: 0.98 }}
              className="glass rounded-3xl p-6 sm:p-8 lg:p-10 group relative overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/20" 
              data-testid="contact-email"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <motion.div 
                className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative z-10">
                <motion.div 
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-primary via-cyan-400 to-blue-500 rounded-3xl flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/40"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">Business Email</h3>
                <div className="h-1.5 w-20 bg-gradient-to-r from-primary via-cyan-400 to-blue-500 mx-auto mb-5 rounded-full group-hover:w-32 transition-all duration-500"></div>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-7 text-center leading-relaxed px-2">
                  📧 For business inquiries, collaborations, and professional work opportunities
                </p>
                <motion.a 
                  href="mailto:nishant.ns.business@gmail.com" 
                  className="neon-btn w-full text-sm sm:text-base lg:text-lg py-3 sm:py-4"
                  data-testid="email-link"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Send Email Now
                </motion.a>
              </div>
            </motion.div>

            {/* WhatsApp Chat - Enhanced */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -12 }}
              whileTap={{ scale: 0.98 }}
              className="glass rounded-3xl p-6 sm:p-8 lg:p-10 group relative overflow-hidden border border-border/50 hover:border-green-500/50 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-green-500/20" 
              data-testid="contact-whatsapp"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <motion.div 
                className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative z-10">
                <motion.div 
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-green-500 via-emerald-400 to-green-600 rounded-3xl flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl group-hover:shadow-green-500/40"
                  whileHover={{ rotate: [0, 15, -15, 15, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <SiWhatsapp className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 group-hover:text-green-500 transition-colors duration-300">WhatsApp Chat</h3>
                <div className="h-1.5 w-20 bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 mx-auto mb-5 rounded-full group-hover:w-32 transition-all duration-500"></div>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-7 text-center leading-relaxed px-2">
                  💬 Quick chats, instant replies, and friendly conversations!
                </p>
                <motion.a 
                  href="https://wa.me/918900653250" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="neon-btn w-full bg-green-500/10 hover:bg-green-500/20 border-green-500/50 hover:border-green-500 text-sm sm:text-base lg:text-lg py-3 sm:py-4"
                  data-testid="whatsapp-link"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SiWhatsapp className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Chat with Nishant
                </motion.a>
              </div>
            </motion.div>

            {/* Telegram Chat - Enhanced */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -12 }}
              whileTap={{ scale: 0.98 }}
              className="glass rounded-3xl p-6 sm:p-8 lg:p-10 group relative overflow-hidden sm:col-span-2 lg:col-span-1 border border-border/50 hover:border-blue-500/50 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20" 
              data-testid="contact-telegram"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-sky-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <motion.div 
                className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative z-10">
                <motion.div 
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-blue-500 via-sky-400 to-blue-600 rounded-3xl flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/40"
                  whileHover={{ rotate: [0, -15, 15, -15, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <SiTelegram className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 group-hover:text-blue-500 transition-colors duration-300">Telegram Chat</h3>
                <div className="h-1.5 w-20 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 mx-auto mb-5 rounded-full group-hover:w-32 transition-all duration-500"></div>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-7 text-center leading-relaxed px-2">
                  📱 Direct messaging for quick questions and support
                </p>
                <motion.a 
                  href="https://t.me/Nishantsarkar10k" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="neon-btn w-full bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/50 hover:border-blue-500 text-sm sm:text-base lg:text-lg py-3 sm:py-4"
                  data-testid="telegram-link"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SiTelegram className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Message Me Now
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          {/* Two Column Layout: Contact Form + Feedback Form */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass rounded-2xl p-6 sm:p-8 border-2 border-primary/30 hover:border-primary/50 transition-all relative overflow-hidden group" 
              data-testid="contact-form-section"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-center mb-6 sm:mb-8">
                  <motion.div 
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Send className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">📨 Send Me a Message</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Fill out the form and I'll get back to you ASAP! 💬
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <label htmlFor="name" className="block text-sm font-bold text-foreground mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-primary/30 dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm sm:text-base"
                      data-testid="input-name"
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <label htmlFor="email" className="block text-sm font-bold text-foreground mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-primary/30 dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm sm:text-base"
                      data-testid="input-email"
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <label htmlFor="message" className="block text-sm font-bold text-foreground mb-2">
                      Your Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell me about your project or question..."
                      className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none hover:border-primary/30 dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm sm:text-base"
                      data-testid="input-message"
                    />
                  </motion.div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="neon-btn w-full py-5 sm:py-6 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="submit-button"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        Send Message
                      </span>
                    )}
                  </Button>

                  <p className="text-center text-xs sm:text-sm text-muted-foreground">
                    * All fields are required
                  </p>
                </form>
              </div>
            </motion.div>

            {/* Feedback Form */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass rounded-2xl p-6 sm:p-8 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-center mb-6 sm:mb-8">
                  <motion.div 
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">💭 Leave Feedback</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Share your thoughts about the website! 🌟
                  </p>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-4 sm:space-y-5">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <label htmlFor="feedback-name" className="block text-sm font-bold text-foreground mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="feedback-name"
                      name="name"
                      value={feedbackData.name}
                      onChange={handleFeedbackChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all hover:border-purple-500/30 dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm sm:text-base"
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <label htmlFor="feedback-email" className="block text-sm font-bold text-foreground mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="feedback-email"
                      name="email"
                      value={feedbackData.email}
                      onChange={handleFeedbackChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all hover:border-purple-500/30 dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm sm:text-base"
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <label htmlFor="feedback-subject" className="block text-sm font-bold text-foreground mb-2">
                      Subject (Optional)
                    </label>
                    <input
                      type="text"
                      id="feedback-subject"
                      name="subject"
                      value={feedbackData.subject}
                      onChange={handleFeedbackChange}
                      placeholder="What's this about?"
                      className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all hover:border-purple-500/30 dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm sm:text-base"
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-bold text-foreground mb-3">
                      Rate Your Experience *
                    </label>
                    <div className="flex gap-2 justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackData(prev => ({ ...prev, rating: star }))}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Star
                            className={`w-8 h-8 sm:w-10 sm:h-10 ${
                              star <= (hoveredRating || feedbackData.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-400 dark:text-gray-500"
                            } transition-colors duration-200`}
                          />
                        </motion.button>
                      ))}
                    </div>
                    {feedbackData.rating > 0 && (
                      <motion.p 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center text-sm text-purple-500 font-semibold"
                      >
                        {feedbackData.rating === 5 && "Awesome! 🎉"}
                        {feedbackData.rating === 4 && "Great! 😊"}
                        {feedbackData.rating === 3 && "Good 👍"}
                        {feedbackData.rating === 2 && "Could be better 😕"}
                        {feedbackData.rating === 1 && "Sorry to hear that 😔"}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <label htmlFor="feedback-message" className="block text-sm font-bold text-foreground mb-2">
                      Your Feedback *
                    </label>
                    <Textarea
                      id="feedback-message"
                      name="message"
                      value={feedbackData.message}
                      onChange={handleFeedbackChange}
                      rows={5}
                      placeholder="What did you like? What could be improved?"
                      className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none hover:border-purple-500/30 dark:bg-gray-800 dark:text-white dark:border-gray-600 text-sm sm:text-base"
                    />
                  </motion.div>

                  <Button
                    type="submit"
                    disabled={isFeedbackSubmitting}
                    className="w-full py-5 sm:py-6 text-base sm:text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFeedbackSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                        Submit Feedback
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Commission Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-6 sm:p-10 text-center border-2 border-primary/20 hover:border-primary/40 transition-all mb-8 sm:mb-12 relative overflow-hidden group" 
            data-testid="commission-section"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto" />
              </motion.div>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4 sm:mb-6">🎨 Want a Website Like This?</h2>
              <p className="text-base sm:text-lg text-foreground leading-relaxed mb-6 sm:mb-8 max-w-3xl mx-auto">
                I build custom websites, portfolios, and gaming projects with the same love and attention to detail you see here! 
                Whether it's a personal portfolio, business site, or gaming platform — I create digital experiences that matter.
                <span className="block mt-4 text-primary font-semibold text-lg sm:text-xl">DM me on WhatsApp to discuss your project! 🚀</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-10">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://wa.me/918900653250" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="neon-btn text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8"
                  data-testid="commission-whatsapp"
                >
                  <SiWhatsapp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Commission Work
                </motion.a>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/portfolio" className="neon-btn text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8" data-testid="view-work-link">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    View My Work
                  </Link>
                </motion.div>
              </div>

              <div className="glass bg-muted/50 rounded-xl p-6 sm:p-8 border border-border" data-testid="services-offered">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6">What I Offer:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {[
                    { icon: Code, label: "Custom Websites" },
                    { icon: Target, label: "Portfolio Sites" },
                    { icon: MessageCircle, label: "Gaming Platforms" },
                    { icon: Send, label: "Business Solutions" },
                    { icon: Smartphone, label: "Mobile-Responsive" },
                    { icon: Search, label: "SEO Optimization" }
                  ].map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-background/50 hover:bg-primary/10 transition-all"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <service.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <span className="text-foreground font-medium text-sm sm:text-base">{service.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Personal Touch */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center glass rounded-2xl p-6 sm:p-10 border-2 border-primary/20 relative overflow-hidden group" 
            data-testid="personal-touch"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6">Why Choose Me? 💙</h2>
              <p className="text-base sm:text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
                I don't just build websites — I create digital homes for your ideas! Every project gets my personal attention, 
                love, and dedication.
                From concept to launch, you'll work directly with me, not a team of strangers.
                <span className="block mt-4 sm:mt-6 text-xl sm:text-2xl text-primary font-bold">Let's build something amazing together! Chalo shuru karte hain! 🎯</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* AdSense */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-16"
        >
          <AdSenseAd />
        </motion.div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 sm:mt-12"
        >
          <PageFeedback pageName="Contact" />
        </motion.div>
      </div>
    </div>
  );
}
