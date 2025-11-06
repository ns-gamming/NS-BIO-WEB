/**
 * EDITH (Even Death I Am The Hero) Chatbot Component
 * 
 * A professional, confident, and heroic AI assistant for NS GAMMING website.
 * Named after Iron Man's AI system, EDITH is designed to help users navigate
 * the website with intelligence and efficiency.
 * 
 * Features:
 * - Floating draggable chat interface
 * - Full-screen mode support
 * - Framer Motion animations
 * - Google Gemini AI integration
 * - Typing animations for responses
 * - Dark/Light theme support
 * - Mobile responsive design
 * - Message history management
 * 
 * Creator: Naboraj Sarkar (The New King)
 */

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Move, Maximize2 } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getAllBlogPosts } from "@/data/blogPosts";

// Message interface for type safety
interface Message {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

// Position interface for drag functionality
interface Position {
  x: number;
  y: number;
}

// Gemini API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

/**
 * Heroic error messages with tech/gaming culture references
 * EDITH keeps it professional but adds personality
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
  "Temporary setback. True heroes always rise! 🌟 Let's proceed!",
  "Data stream interrupted. Rerouting now! 🔄 Try again?",
  "Processing power redirected. All systems go! ⚡ Retry?",
  "Minor turbulence. The New King's creation adapts! 👑 Continue?",
  "Connection stabilizing. Excellence never quits! 🎖️ Try once more?",
];

/**
 * EDITH's context and personality configuration
 * Professional, confident, heroic AI assistant focused on helping users
 * Knowledge base includes all website pages, features, and blog content
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
- Draggable chat interface (me!)
- Full-screen chat mode (/chat)
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
 * Animates text character by character for realistic AI typing effect
 */
function TypingMessage({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 20); // 20ms per character for smooth typing
      
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <p className="text-sm whitespace-pre-wrap">
      {displayedText}
      <span className="animate-pulse">|</span>
    </p>
  );
}

/**
 * EdithChatbot Main Component
 * Floating draggable chat interface with full-screen capability
 */
export function EdithChatbot() {
  // Chat state management
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "EDITH online! 🚀 I'm your intelligent AI assistant for NS GAMMING. Need help navigating the site, finding tools, or exploring content? I'm here to assist! What can I help you discover today? 🎯",
      isTyping: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Drag functionality state
  const [isDragging, setIsDragging] = useState(false);
  const [chatPosition, setChatPosition] = useState<Position>({ x: 0, y: 0 });
  const [buttonPosition, setButtonPosition] = useState<Position>({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  // Refs for DOM elements
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Navigation and theme hooks
  const [, setLocation] = useLocation();
  const { theme } = useTheme();

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Handle full-screen button click
   * Navigates to dedicated /chat page
   */
  const handleFullScreen = () => {
    setLocation("/chat");
  };

  /**
   * Drag handlers for chat window
   */
  const handleChatMouseDown = (e: React.MouseEvent) => {
    if (!chatboxRef.current) return;
    const rect = chatboxRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleChatTouchStart = (e: React.TouchEvent) => {
    if (!chatboxRef.current) return;
    const touch = e.touches[0];
    const rect = chatboxRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    setIsDragging(true);
  };

  /**
   * Drag handlers for floating button
   */
  const handleButtonMouseDown = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    e.stopPropagation();
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleButtonTouchStart = (e: React.TouchEvent) => {
    if (!buttonRef.current) return;
    e.stopPropagation();
    const touch = e.touches[0];
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    setIsDragging(true);
  };

  /**
   * Global drag movement handlers
   * Handles both mouse and touch events for cross-device compatibility
   */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      if (isOpen && chatboxRef.current) {
        // Calculate boundaries for chat window
        const chatWidth = chatboxRef.current.offsetWidth;
        const chatHeight = chatboxRef.current.offsetHeight;
        const maxX = window.innerWidth - chatWidth;
        const maxY = window.innerHeight - chatHeight;

        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        // Keep within viewport bounds
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setChatPosition({ x: newX, y: newY });
      } else if (!isOpen && buttonRef.current) {
        // Calculate boundaries for floating button
        const buttonWidth = buttonRef.current.offsetWidth;
        const buttonHeight = buttonRef.current.offsetHeight;
        const maxX = window.innerWidth - buttonWidth;
        const maxY = window.innerHeight - buttonHeight;

        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        // Keep within viewport bounds
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setButtonPosition({ x: newX, y: newY });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const touch = e.touches[0];

      if (isOpen && chatboxRef.current) {
        const chatWidth = chatboxRef.current.offsetWidth;
        const chatHeight = chatboxRef.current.offsetHeight;
        const maxX = window.innerWidth - chatWidth;
        const maxY = window.innerHeight - chatHeight;

        let newX = touch.clientX - dragOffset.x;
        let newY = touch.clientY - dragOffset.y;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setChatPosition({ x: newX, y: newY });
      } else if (!isOpen && buttonRef.current) {
        const buttonWidth = buttonRef.current.offsetWidth;
        const buttonHeight = buttonRef.current.offsetHeight;
        const maxX = window.innerWidth - buttonWidth;
        const maxY = window.innerHeight - buttonHeight;

        let newX = touch.clientX - dragOffset.x;
        let newY = touch.clientY - dragOffset.y;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setButtonPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragOffset, isOpen]);

  /**
   * Send message to Gemini AI
   * Handles API call, context building, and response processing
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
      // Build blog posts context
      const blogPosts = getAllBlogPosts();
      const blogPostsInfo = blogPosts.map(post => 
        `- "${post.title}" (${post.category}): ${post.excerpt} [Read at /blog/${post.slug}]`
      ).join('\n');

      // Get conversation history (last 6 messages for context)
      const conversationHistory = messages
        .slice(-6)
        .map((msg) => `${msg.role === "user" ? "User" : "EDITH"}: ${msg.content}`)
        .join("\n");

      // Inject blog info into context
      const contextWithBlogs = EDITH_CONTEXT.replace('{BLOG_POSTS_INFO}', blogPostsInfo);

      // Build complete prompt with context and history
      const prompt = `${contextWithBlogs}

Previous conversation:
${conversationHistory}

User: ${userMessage.content}

Respond as EDITH - professional, confident, and helpful. Provide clear, concise guidance. If discussing blog articles, mention specific titles and suggest reading them on the blog page.`;

      // Call Gemini API
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
        isTyping: true, // Enable typing animation
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Error sending message:", error);
      
      // Context-aware error responses with heroic tone
      const userQuestion = userMessage.content.toLowerCase();
      let errorResponse = "";
      
      if (userQuestion.includes('nishant') || userQuestion.includes('naboraj') || userQuestion.includes('king')) {
        errorResponse = "Connection interrupted! 🛡️ But I can tell you - Naboraj Sarkar (The New King) is an amazing developer, gamer, and content creator from Siliguri. Check /about for his full story! 👑";
      } else if (userQuestion.includes('game')) {
        errorResponse = "Technical glitch! 🎮 No worries - we have 14+ free games at /games including Snake, 2048, Tic Tac Toe, and more. All mobile-optimized! Try them out! ⚡";
      } else if (userQuestion.includes('tool') || userQuestion.includes('free fire') || userQuestion.includes('ff')) {
        errorResponse = "System recalibrating! 🔧 Meanwhile - explore /tools for FF Name Generator, Sensitivity Calculator, and /ff-bots for Free Fire Likes & Info tools. All free! 🔥";
      } else if (userQuestion.includes('download') || userQuestion.includes('youtube') || userQuestion.includes('instagram')) {
        errorResponse = "Brief interruption! 📥 Head to /tools and check the Downloads section - YouTube, Instagram, TikTok, Facebook video downloaders all ready. Just paste the URL! 🚀";
      } else if (userQuestion.includes('blog') || userQuestion.includes('article')) {
        errorResponse = "Processing delay! 📚 Visit /blog for comprehensive guides on Free Fire strategies, YouTube growth, web development, and more. Quality content awaits! 📝";
      } else {
        // Random heroic error message
        const randomError = HEROIC_ERRORS[Math.floor(Math.random() * HEROIC_ERRORS.length)];
        errorResponse = randomError + " Meanwhile, explore the site or ask me anything about NS GAMMING! 💪";
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
   * Handle Enter key press to send message
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * Framer Motion animation variants
   */
  const chatWindowVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 100,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 100,
      transition: {
        duration: 0.2
      }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    hover: { 
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <>
      {/* Floating Chat Button - appears when chat is closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={buttonRef}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            whileHover="hover"
            whileTap="tap"
            onMouseDown={handleButtonMouseDown}
            onTouchStart={handleButtonTouchStart}
            onClick={() => !isDragging && setIsOpen(true)}
            style={{
              left: buttonPosition.x || 'auto',
              right: buttonPosition.x ? 'auto' : '1.5rem',
              top: buttonPosition.y || 'auto',
              bottom: buttonPosition.y ? 'auto' : '1.5rem',
            }}
            className="fixed z-50 p-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl hover:shadow-blue-500/50 transition-shadow cursor-move group"
            aria-label="Open EDITH Chat"
          >
            <MessageCircle className="w-6 h-6" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Chat with EDITH 🚀
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatboxRef}
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              left: chatPosition.x || 'auto',
              right: chatPosition.x ? 'auto' : '1.5rem',
              top: chatPosition.y || 'auto',
              bottom: chatPosition.y ? 'auto' : '1.5rem',
            }}
            className="fixed z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-2rem)] bg-background border-2 border-primary/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Chat Header - draggable area */}
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between cursor-move"
              onMouseDown={handleChatMouseDown}
              onTouchStart={handleChatTouchStart}
              whileHover={{ backgroundPosition: "right center" }}
              style={{ backgroundSize: "200% 100%" }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <MessageCircle className="w-6 h-6" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg">EDITH</h3>
                  <p className="text-xs opacity-90">Even Death I Am The Hero</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFullScreen}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Full Screen Mode"
                >
                  <Maximize2 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/95 backdrop-blur">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none border border-border"
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
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted p-3 rounded-2xl rounded-bl-none border border-border">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">EDITH is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask EDITH anything..."
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Created by Naboraj Sarkar - The New King 👑
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
