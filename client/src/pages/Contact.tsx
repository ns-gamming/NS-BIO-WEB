
import { useState } from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import AdSenseAd from "@/components/AdSenseAd";
import { Mail, MessageCircle, Send, Eye, Code, Smartphone, Search, Target, CheckCircle, Star, MapPin, Clock, Globe } from "lucide-react";
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

  return (
    <div className="pt-16">
      <HeroSection 
        title="📩 Let's Connect"
        subtitle="Want to talk? I reply with love and respect! ✨"
      />

      <div className="container mx-auto px-6 pb-20">
        {/* Hero Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass rounded-xl p-4 text-center hover:scale-105 transition-transform">
              <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="glass rounded-xl p-4 text-center hover:scale-105 transition-transform">
              <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">&lt;1hr</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div className="glass rounded-xl p-4 text-center hover:scale-105 transition-transform">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">5.0</div>
              <div className="text-sm text-muted-foreground">Client Rating</div>
            </div>
            <div className="glass rounded-xl p-4 text-center hover:scale-105 transition-transform">
              <Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">Global</div>
              <div className="text-sm text-muted-foreground">Reach</div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Contact Methods Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6 mb-16" 
            data-testid="contact-methods"
          >
            {/* Business Email */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] group" data-testid="contact-email">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative text-center mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-cyan-400 rounded-2xl flex items-center justify-center mb-4 transform group-hover:rotate-12 transition-transform">
                    <Mail className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Business Email</h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-primary to-cyan-400 mx-auto mt-2 rounded-full"></div>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 text-center leading-relaxed">
                For business inquiries, collaborations, and professional work
              </p>
              <a 
                href="mailto:nishant.ns.business@gmail.com" 
                className="neon-btn w-full group-hover:animate-pulse"
                data-testid="email-link"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </a>
            </div>

            {/* WhatsApp Chat */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] group" data-testid="contact-whatsapp">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative text-center mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center mb-4 transform group-hover:rotate-12 transition-transform">
                    <SiWhatsapp className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">WhatsApp Chat</h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-400 mx-auto mt-2 rounded-full"></div>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 text-center leading-relaxed">
                Quick chats, instant replies, and friendly conversations! 💬
              </p>
              <a 
                href="https://wa.me/918900653250" 
                target="_blank" 
                rel="noopener noreferrer"
                className="neon-btn w-full bg-green-500/10 hover:bg-green-500/20 border-green-500/50 group-hover:animate-pulse"
                data-testid="whatsapp-link"
              >
                <SiWhatsapp className="w-5 h-5 mr-2" />
                Chat with Nishant
              </a>
            </div>

            {/* Telegram Chat */}
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] group" data-testid="contact-telegram">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative text-center mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-sky-400 rounded-2xl flex items-center justify-center mb-4 transform group-hover:rotate-12 transition-transform">
                    <SiTelegram className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Telegram Chat</h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-sky-400 mx-auto mt-2 rounded-full"></div>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 text-center leading-relaxed">
                Direct messaging for quick questions and support 📱
              </p>
              <a 
                href="https://t.me/Nishantsarkar10k" 
                target="_blank" 
                rel="noopener noreferrer"
                className="neon-btn w-full bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/50 group-hover:animate-pulse"
                data-testid="telegram-link"
              >
                <SiTelegram className="w-5 h-5 mr-2" />
                Message Me
              </a>
            </div>
          </motion.div>

          {/* Two Column Layout: Contact Form + Feedback Form */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-8 border-2 border-primary/30 hover:border-primary/50 transition-all" 
              data-testid="contact-form-section"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-primary mb-2">📨 Send Me a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form and I'll get back to you ASAP! 💬
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="animate-fadeUp">
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
                    className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-primary/30 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    data-testid="input-name"
                  />
                </div>

                <div className="animate-fadeUp" style={{ animationDelay: '0.1s' }}>
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
                    className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-primary/30 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    data-testid="input-email"
                  />
                </div>

                <div className="animate-fadeUp" style={{ animationDelay: '0.2s' }}>
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
                    className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none hover:border-primary/30 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    data-testid="input-message"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="neon-btn w-full py-6 text-lg animate-fadeUp disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ animationDelay: '0.3s' }}
                  data-testid="submit-button"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message
                    </span>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground animate-fadeUp" style={{ animationDelay: '0.4s' }}>
                  * All fields are required
                </p>
              </form>
            </motion.div>

            {/* Feedback Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-8 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">💭 Leave Feedback</h2>
                <p className="text-muted-foreground">
                  Share your thoughts about the website! 🌟
                </p>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                <div className="animate-fadeUp">
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
                    className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all hover:border-purple-500/30 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  />
                </div>

                <div className="animate-fadeUp" style={{ animationDelay: '0.1s' }}>
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
                    className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all hover:border-purple-500/30 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  />
                </div>

                <div className="animate-fadeUp" style={{ animationDelay: '0.2s' }}>
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
                    className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all hover:border-purple-500/30 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  />
                </div>

                <div className="animate-fadeUp" style={{ animationDelay: '0.3s' }}>
                  <label className="block text-sm font-bold text-foreground mb-3">
                    Rate Your Experience *
                  </label>
                  <div className="flex gap-2 justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackData(prev => ({ ...prev, rating: star }))}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-all duration-200 hover:scale-125"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= (hoveredRating || feedbackData.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-400 dark:text-gray-500"
                          } transition-colors duration-200`}
                        />
                      </button>
                    ))}
                  </div>
                  {feedbackData.rating > 0 && (
                    <p className="text-center text-sm text-purple-500 animate-fadeIn font-semibold">
                      {feedbackData.rating === 5 && "Awesome! 🎉"}
                      {feedbackData.rating === 4 && "Great! 😊"}
                      {feedbackData.rating === 3 && "Good 👍"}
                      {feedbackData.rating === 2 && "Could be better 😕"}
                      {feedbackData.rating === 1 && "Sorry to hear that 😔"}
                    </p>
                  )}
                </div>

                <div className="animate-fadeUp" style={{ animationDelay: '0.4s' }}>
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
                    className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none hover:border-purple-500/30 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isFeedbackSubmitting}
                  className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed animate-fadeUp"
                  style={{ animationDelay: '0.5s' }}
                >
                  {isFeedbackSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Star className="w-5 h-5" />
                      Submit Feedback
                    </span>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Commission Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-10 text-center border-2 border-primary/20 hover:border-primary/40 transition-all" 
            data-testid="commission-section"
          >
            <h2 className="text-4xl font-bold text-primary mb-6">🎨 Want a Website Like This?</h2>
            <p className="text-lg text-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
              I build custom websites, portfolios, and gaming projects with the same love and attention to detail you see here! 
              Whether it's a personal portfolio, business site, or gaming platform — I create digital experiences that matter.
              <span className="block mt-4 text-primary font-semibold text-xl">DM me on WhatsApp to discuss your project! 🚀</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a 
                href="https://wa.me/918900653250" 
                target="_blank" 
                rel="noopener noreferrer"
                className="neon-btn text-lg py-4 px-8"
                data-testid="commission-whatsapp"
              >
                <SiWhatsapp className="w-5 h-5 mr-2" />
                Commission Work
              </a>
              <Link href="/portfolio" className="neon-btn text-lg py-4 px-8" data-testid="view-work-link">
                <Eye className="w-5 h-5 mr-2" />
                View My Work
              </Link>
            </div>

            <div className="glass bg-muted/50 rounded-xl p-8 border border-border" data-testid="services-offered">
              <h3 className="text-2xl font-semibold text-foreground mb-6">What I Offer:</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-primary/10 transition-all">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Custom Websites</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-primary/10 transition-all">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Portfolio Sites</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-primary/10 transition-all">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Gaming Platforms</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-primary/10 transition-all">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Send className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Business Solutions</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-primary/10 transition-all">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">Mobile-Responsive</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-primary/10 transition-all">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">SEO Optimization</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Personal Touch */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 glass rounded-2xl p-10 border-2 border-primary/20" 
            data-testid="personal-touch"
          >
            <h2 className="text-3xl font-bold text-primary mb-6">Why Choose Me? 💙</h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
              I don't just build websites — I create digital homes for your ideas! Every project gets my personal attention, 
              love, and dedication.
              From concept to launch, you'll work directly with me, not a team of strangers.
              <span className="block mt-6 text-2xl text-primary font-bold">Let's build something amazing together! Chalo shuru karte hain! 🎯</span>
            </p>
          </motion.div>
        </div>

        {/* AdSense */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <AdSenseAd />
        </motion.div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12"
        >
          <PageFeedback pageName="Contact" />
        </motion.div>
      </div>
    </div>
  );
}
