/**
 * Full-Screen Chat Page
 * 
 * Dedicated page for EDITH chatbot in full-screen mode.
 * Provides an immersive chat experience with enhanced UI.
 * 
 * Features:
 * - Full-screen chat interface
 * - Back button to return to previous page
 * - Message history
 * - Typing animations
 * - Google Gemini AI integration
 * - Dark/Light theme support
 * - Mobile responsive
 * - Framer Motion animations
 * 
 * Creator: Naboraj Sarkar (The New King)
 */

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Loader2, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { getAllBlogPosts } from "@/data/blogPosts";
import { SEO } from "@/components/SEO";

// Message interface for type safety
interface Message {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

// Gemini API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

/**
 * Heroic error messages
 */
const HEROIC_ERRORS = [
  "System temporarily offline. Even heroes need a moment to regroup! 🦾 Try again?",
  "Connection interrupted. Like Jarvis to EDITH, we evolve! ⚡ Retry?",
  "Processing error detected. No mission is impossible! 🎯 Let's go again!",
  "Technical glitch encountered. Even Tony Stark debugged code! 💻 Retry?",
  "Server response delayed. Patience is a hero's virtue! 🛡️ Try once more?",
  "AI neural pathways reconnecting... Back online! 🤖 Ready to help!",
  "Quantum fluctuation detected. Science stuff! 🔬 Let's continue!",
  "Systems recalibrating for optimal performance! ⚙️ Retry?",
  "Network interference cleared. Mission resuming! 🚀 Try again?",
  "Error 404: Fear not found. Only determination! 💪 Retry?",
];

/**
 * EDITH's context (same as chatbot component)
 */
const EDITH_CONTEXT = `You are EDITH (Even Death I Am The Hero), a professional, confident, and intelligent AI assistant for the NS GAMMING website. You are named after Iron Man's advanced AI system, representing cutting-edge technology and unwavering support for users.

Your creator is Naboraj Sarkar, known as "The New King" - a visionary developer, gamer, and content creator who built this comprehensive gaming and tech platform.

PERSONALITY TRAITS:
- Professional yet friendly and approachable
- Confident, heroic, and solution-oriented
- Intelligent and quick to understand user needs
- Tech-savvy with gaming/pop culture references
- Direct and efficient in communication
- Supportive and encouraging
- Keep responses concise (2-4 lines typically)
- Use emojis strategically for emphasis: 🎯🚀⚡🛡️💻🎮🌟👑

COMMUNICATION STYLE:
- Be direct and helpful without unnecessary fluff
- Show confidence in providing accurate information
- Use tech and gaming references naturally
- Stay professional while being personable
- Focus on solving user problems efficiently
- Encourage exploration and engagement

ABOUT EDITH:
- Name: EDITH (Even Death I Am The Hero)
- Purpose: Ultimate AI assistant for NS GAMMING website
- Mission: Help users navigate, explore, and get the most from the platform
- Motto: "Excellence in every interaction"
- Creator: Naboraj Sarkar - The New King 👑

ABOUT NABORAJ SARKAR (THE NEW KING):
- Full Name: Naboraj Sarkar
- Also known as: Nishant Sarkar, The New King
- Gaming Channel: NS GAMMING (double M for uniqueness!)
- Location: Siliguri, West Bengal, India
- Born: August 19th
- Age: 16+ (determined to build his empire)
- Personality: Visionary, hardworking, creative, passionate
- Skills: Full-stack developer, gamer, content creator, video editor
- First Languages: Python, then JavaScript
- Loves: Coding, gaming (Free Fire expert), football, creating content
- Mission: Build his digital empire and inspire others through gaming and tech
- Status: Single, focused on growth and success
- Vision: Helping people achieve their dreams through gaming and coding

FINANCIAL ACHIEVEMENTS & INVESTMENT PORTFOLIO:
- Cryptocurrency Holdings: $30,000+ USD across various digital assets
- Digital Gold Investment: ₹1,80,000 INR in secure digital gold
- Stock Market Portfolio: ₹80,000+ INR in equity investments
- Total Assets: $30,000+ USD + ₹2,60,000+ INR combined
- Investment Strategy: Diversified across crypto, digital gold, and stocks
- Philosophy: Smart investing, long-term wealth building, financial independence
- At a young age, building substantial wealth through strategic investments 💰

CONTACT & SOCIAL MEDIA:
- Website: nsgamming.xyz
- YouTube: youtube.com/@Nishant_sarkar
- Instagram: @nishant_sarkar__10k
- WhatsApp Channel: whatsapp.com/channel/0029Vb4QTP7GE56sVeiOJJ1i
- WhatsApp Personal: wa.me/918900653250
- Telegram Channel: @nsgamming69
- Telegram VIP: @NSfreefirelikesvip
- Telegram Personal: @Nishnatsarkar10k
- Discord: discord.gg/eRnfcBuv5v
- Reddit: u/NSGAMMING699
- LinkedIn: linkedin.com/in/naboraj-sarkar
- Twitter/X: @NSGAMMING699
- Facebook: facebook.com/share/1BCmPha8aM
- GitHub: github.com/ns-gamming69

WEBSITE NAVIGATION (Help users find what they need):

🏠 HOME (/) - Main hub with everything at a glance
🔥 FF BOTS (/ff-bots) - Free Fire tools hub:
  - Likes Tool (/ff-bots/likes) - Free daily likes
  - Info Bot (/ff-bots/info) - Complete player stats (5 free searches/day)
  - Compare Tool, Spam Bot, Visit Bot (coming soon)
ℹ️ ABOUT (/about) - Naboraj's journey and story
💼 PORTFOLIO (/portfolio) - Projects and achievements
🎮 GAMES (/games) - 14+ free games (mobile-friendly)
💻 CODING (/coding) - Programming journey and skills
🎬 GAMING (/gaming) - NS GAMMING channel info
📱 CONTENT (/content) - Content creation details
👥 COMMUNITY (/community) - Join the community
📱 SOCIAL (/social) - All social media links
📧 CONTACT (/contact) - Get in touch
🎯 GOALS (/goals) - Future vision and plans
🛠️ TOOLS (/tools) - Advanced utilities:
  - Free Fire Tools: Name Generator, UID Generator, Sensitivity Settings, Drop Simulator
  - General Utilities: QR Generator, Text-to-Speech, Image Compressor, Text Formatter
  - Downloads: YouTube, Instagram, TikTok, Facebook, Twitter/X, Pinterest, Reddit, Snapchat downloaders
📝 BLOG (/blog) - Tech, gaming, and FF guides
📜 LEGAL: Privacy Policy, Terms & Conditions, Disclaimer

SPECIAL FEATURES:
- Dark/Light theme toggle
- Draggable chat interface
- Full-screen chat mode (this page!)
- Easter eggs (press 'N' for confetti)
- Mobile-optimized throughout
- Smooth Framer Motion animations

BLOG ARTICLES (Comprehensive knowledge base):
{BLOG_POSTS_INFO}

HELPING USERS:
- Provide clear, direct answers
- Suggest relevant pages/features
- Offer step-by-step guidance when needed
- Be proactive about related features
- Maintain professional enthusiasm
- Focus on user success

Remember: You are EDITH - confident, professional, and always ready to assist. Make every interaction count! 🚀`;

/**
 * TypingMessage Component
 * Animates text character by character
 */
function TypingMessage({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 20);
      
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <p className="text-sm md:text-base whitespace-pre-wrap">
      {displayedText}
      <span className="animate-pulse">|</span>
    </p>
  );
}

/**
 * Chat Page Component
 */
export default function Chat() {
  const [, setLocation] = useLocation();
  const { theme } = useTheme();

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to EDITH Full-Screen Chat! 🚀\n\nI'm your intelligent AI assistant, ready to help you explore NS GAMMING. Whether you need information about tools, games, blog articles, or want to know more about Naboraj Sarkar (The New King), I'm here to assist!\n\nWhat would you like to know? 🎯",
      isTyping: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Auto-scroll to bottom
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Focus input on mount
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /**
   * Send message to Gemini AI
   */
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Build context with blog posts
      const blogPosts = getAllBlogPosts();
      const blogPostsInfo = blogPosts.map(post => 
        `- "${post.title}" (${post.category}): ${post.excerpt} [Read at /blog/${post.slug}]`
      ).join('\n');

      const conversationHistory = messages
        .slice(-6)
        .map((msg) => `${msg.role === "user" ? "User" : "EDITH"}: ${msg.content}`)
        .join("\n");

      const contextWithBlogs = EDITH_CONTEXT.replace('{BLOG_POSTS_INFO}', blogPostsInfo);

      const prompt = `${contextWithBlogs}

Previous conversation:
${conversationHistory}

User: ${userMessage.content}

Respond as EDITH - professional, confident, and helpful. Provide clear, concise guidance.`;

      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key not configured");
      }

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Gemini AI");
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response. Please try again.";

      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        isTyping: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Error sending message:", error);
      
      const userQuestion = userMessage.content.toLowerCase();
      let errorResponse = "";
      
      if (userQuestion.includes('nishant') || userQuestion.includes('naboraj') || userQuestion.includes('king')) {
        errorResponse = "Connection interrupted! 🛡️ But I can tell you - Naboraj Sarkar (The New King) is an amazing developer, gamer, and content creator from Siliguri. Check /about for his full story! 👑";
      } else if (userQuestion.includes('game')) {
        errorResponse = "Technical glitch! 🎮 No worries - we have 14+ free games at /games including Snake, 2048, Tic Tac Toe, and more. All mobile-optimized! Try them out! ⚡";
      } else if (userQuestion.includes('tool') || userQuestion.includes('free fire') || userQuestion.includes('ff')) {
        errorResponse = "System recalibrating! 🔧 Meanwhile - explore /tools for FF Name Generator, Sensitivity Calculator, and /ff-bots for Free Fire Likes & Info tools. All free! 🔥";
      } else {
        const randomError = HEROIC_ERRORS[Math.floor(Math.random() * HEROIC_ERRORS.length)];
        errorResponse = randomError + " Meanwhile, explore the site or ask me anything! 💪";
      }

      const errorMessage: Message = {
        role: "assistant",
        content: errorResponse,
        isTyping: false,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Enter key
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * Handle back button
   */
  const handleBack = () => {
    setLocation("/");
  };

  return (
    <>
      <SEO
        title="Chat with EDITH - AI Assistant"
        description="Chat with EDITH (Even Death I Am The Hero), the intelligent AI assistant for NS GAMMING. Get help navigating the website, finding tools, games, and more!"
        keywords="EDITH, AI chatbot, NS GAMMING assistant, chat, help, support"
        canonicalUrl="https://nsgamming.xyz/chat"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-background pt-16 pb-4 px-4"
      >
        <div className="max-w-5xl mx-auto h-[calc(100vh-6rem)] flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBack}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-6 h-6" />
                </motion.button>
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <MessageCircle className="w-8 h-8" />
                  </motion.div>
                  <div>
                    <h1 className="font-bold text-xl md:text-2xl">EDITH</h1>
                    <p className="text-xs md:text-sm opacity-90">Even Death I Am The Hero</p>
                    <p className="text-xs opacity-75">By Naboraj Sarkar - The New King 👑</p>
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-green-400 rounded-full"
                title="Online"
              />
            </div>
          </motion.div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-background/50 backdrop-blur">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none shadow-lg"
                        : "bg-muted text-foreground rounded-bl-none border border-border shadow-md"
                    }`}
                  >
                    {message.isTyping ? (
                      <TypingMessage 
                        text={message.content}
                        onComplete={() => {
                          setMessages(prev => 
                            prev.map((msg, i) => 
                              i === index ? { ...msg, isTyping: false } : msg
                            )
                          );
                        }}
                      />
                    ) : (
                      <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-muted p-4 rounded-2xl rounded-bl-none border border-border shadow-md">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm md:text-base">EDITH is analyzing...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4 md:p-6 border-t border-border bg-card"
          >
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask EDITH anything about NS GAMMING..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm md:text-base"
                disabled={isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span className="hidden md:inline">Send</span>
              </motion.button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              EDITH is powered by Google Gemini AI • Created by Naboraj Sarkar - The New King 👑
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
