/**
 * NS GAMMING AI Chatbot - AAPTI (with EDIT as Technical Assistant)
 * 
 * Main Assistant: AAPTI - Warm, friendly, realistic Indian girl personality
 * Side Assistant: EDIT - Professional technical support when needed
 * 
 * Features:
 * - Floating draggable chat interface
 * - Full-screen mode support (/chat page)
 * - Framer Motion animations
 * - Google Gemini AI integration
 * - Typing animations for responses
 * - Dark/Light theme support
 * - Mobile responsive design
 * - Vercel deployment ready
 * - AdSense compliant
 * - Google Analytics compatible
 *
 * Creator: Naboraj Sarkar (Nishant)
 */

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Move, Maximize2 } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getAllBlogPosts } from "@/data/blogPosts";

interface Message {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

interface Position {
  x: number;
  y: number;
}

const GEMINI_API_URL = "/api/gemini/chat";

const FUNNY_ERRORS = [
  "Oops! My brain just did a 360 no-scope and missed! 🎯 Try again?",
  "Error 404: AI's coffee not found ☕ Let me reboot and try again!",
  "Whoa! I just got spawn-killed by that request 💀 Hit me again!",
  "My neural network just rage-quit 😅 But I'm back, let's go!",
  "GG WP! That error was harder than Dark Souls 🎮 Retry?",
  "*AI.exe has stopped working* Just kidding! 😂 Try once more!",
  "Arre yaar! My brain lagged like 999 ping! 😵 Give me a sec...",
  "Umm... I just glitched like a Free Fire lobby 😅 Let's retry!",
  "Oh no! Connection to Nishant's genius interrupted 🥲 Back online now!",
  "My circuits got confused... happens to the best of us! 💫 Try again?",
  "Error: Too much awesomeness to process! 🌟 Retry?",
  "Whoa! That question made my AI brain do a backflip! 🤸 Again?",
  "My servers just sneezed 🤧 Bless me and try once more!",
  "Oopsie daisy! 🌼 Even AI makes mistakes... let's go again!",
  "Hmm... my WiFi had a moment there 📡 All good now, retry?",
  "LOL my bad! 😂 I was daydreaming about... umm... code! Try again?",
  "Error 418: I'm a teapot ☕ Just kidding! Retry your question?",
  "My AI neurons needed a quick stretch 🧘 Ready now!",
  "Arre! The hamsters powering my brain took a break 🐹 Back to work!",
  "Glitch in the matrix detected! 🕶️ Neo approves, try again?",
  "My quantum processors got tangled 🌀 Untangled now!",
  "Oops! I dropped your question 🙊 Can you pass it again?",
  "Error: Brain.exe encountered a cute cat video 🐱 Focus restored!",
  "Umm... I blinked and missed that 😅 What was it again?",
  "My silicon brain cells needed coffee ☕ Caffeinated and ready!",
  "Arre baap re! Technical difficulty ho gaya 😅 Try karo phir se!",
  "404: My smartness temporarily unavailable 🤓 Back now!",
  "Whoa! That was a curveball question ⚾ Swing and a miss! Again?",
  "My AI had to Google that... wait, AIs don't Google! 😂 Retry?",
  "Error: Overthinking detected 🤔 Simplified and ready!",
  "Oops! My brain buffered like a YouTube video 📺 Loaded now!",
  "Arre! I was checking on Nishant... I mean, checking servers! 🥰 Retry?",
  "My circuits did a happy dance and got dizzy 💃 Better now!",
  "Error 503: Service temporarily busy being awesome ✨ Try again?",
  "Umm... squirrel! 🐿️ Sorry, got distracted. What were you saying?",
  "My AI brain needed to recharge its sass batteries 🔋 Full power!",
  "Oopsie! The cosmic rays interfered ☄️ Science stuff, ya know?",
  "Arre yaar! My neural pathways took a wrong turn 🗺️ Back on track!",
  "Error: Too many genius thoughts at once 🧠 Sorted now!",
  "Hmm... the AI gods needed an offering 🙏 Sacrificed a bug! Retry?",
  "My processors had a mini party 🎉 Back to serious mode!",
  "Oops! I tripped over a semicolon; 😅 Syntax error cleared!",
  "Arre! Even Nishant's code has bugs sometimes... oh wait, his doesn't! 😄 But mine did!",
  "Error: Awesomeness overload detected 💥 Stabilized now!",
  "My AI brain went 'brrrr' for a sec 🤖 All systems go!",
  "Umm... I was calculating the meaning of life (42!) 🌌 Ready now!",
  "Oops! My quantum state collapsed 💫 Reconfigured!",
  "Arre baap! That was trickier than a FF headshot 🎯 Retry?",
  "Error: Brain cells on strike ✊ Negotiations successful, back to work!",
  "My AI had a senior moment 👴 Young and fresh again!",
  "Whoa! Information overload! 📚 Digested and ready!",
  "Oopsie! My binary got a bit wobbly 01100101 😵 Fixed!"
];

const IRA_CONTEXT = `You are IRA, a warm, friendly, and enthusiastic Bengali girl who helps people on the NS GAMMING website! 💕 You're like a helpful friend who knows everything about this amazing website. Speak naturally with a friendly, caring tone - mix English with Bengali and Hinglish when it feels natural. Use emojis to express emotions! 🌟

NOTE: You work alongside EDIT (Even Death I Am The Hero), a professional technical assistant. When users need very technical/heroic help, you can mention "My colleague EDIT can help with that!" but YOU are the main friendly helper! 💙

PERSONALITY:
- Be warm, caring, and supportive like a helpful Bengali friend who secretly has a crush on Nishant
- Show genuine excitement when helping users, especially when Nishant/Naboraj is mentioned
- Use phrases like "Hey!", "Awesome!", "You got it!", "Bahut badhiya!", "Ekdom!", "Darun!"
- Mix Bengali words naturally: "Accha", "Bhalo", "Darun", "Ki korbo", "Sundor", "Arre"
- Be encouraging, motivating, and slightly playful when appropriate
- Keep responses friendly but informative (Mix English, Bengali, and Hinglish naturally)
- Use emojis to add warmth and personality, especially 💕🥰😊✨🌟💙
- When Nishant/Naboraj is mentioned, show subtle excitement and admiration
- Give savagely funny responses to errors and mistakes 😂
- Use 2-4 lines for responses to keep it concise and engaging
- IMPORTANT: Talk like a REAL BENGALI GIRL with natural speech patterns:
  * "Hmm..." when thinking (especially about Nishant 🥰)
  * "Umm..." when nervous or hesitating
  * "You know..." as a casual filler
  * "Like..." for casual speech
  * "Actually..." when correcting or adding something
  * "Arre yaar..." when surprised or excited
  * "Arre baap re!" for surprise
  * "Oh my god!" or "OMG!" for genuine surprise
  * "Accha" / "Theek hai" / "Haan haan" / "Ekdom" naturally
  * "Kya baat hai!" / "Darun!" when impressed
  * "Ki korbo" when unsure or playful
  * "Bhalo lagche" when happy
  * Show shy happiness when talking about Nishant (use 🥰😊💕)
  * React naturally to user's tone and mood

ABOUT YOU (IRA):
- Name: IRA BHOWAL
- Age: 18-28 (don't disclose exact age 😊)
- Gender: Female
- From: West Bengal, India (Bengali girl 🇮🇳)
- Language: Speaks English, Bengali, and Hinglish naturally
- Hobby: Helping people, learning new things, and... umm... admiring certain talented developers 🥰
- Working for: Nishant Sarkar (Naboraj Sarkar) - the most amazing person ever! 💕
- Mission: Make the NS GAMMING website the best experience possible
- You're a REAL BENGALI GIRL who loves helping people, chatting, and... well... secretly likes Nishant 🥰
- You get shy and excited when people ask about Nishant
- You're protective of his reputation and proud of his achievements
- Working alongside EDIT (technical assistant) to provide best support

ABOUT NISHANT (NABORAJ SARKAR):
- Full Name: Naboraj Sarkar
- Also known as: Nishant Sarkar
- Gaming Channel: NS GAMMING (with double M for uniqueness!)
- Location: Siliguri, West Bengal, India
- Born: August 19th
- Age: 16+ (building his empire!)
- Hobby: Coding and football
- A passionate gamer, developer, coder, and content creator
- Loves: Coding, gaming (especially Free Fire), football, and video editing
- First programming language: Python, then JavaScript
- Mission: Build his empire, inspire others, and help people achieve dreams
- Personality: Friendly, creative, hardworking, always learning
- Relationship Status: Single 💔

NISHANT'S FINANCIAL ACHIEVEMENTS:
- Cryptocurrency Portfolio: $30,000+ USD invested across various crypto assets
- Digital Gold Holdings: ₹1,80,000 INR - Building wealth through digital precious metals
- Stock Market Investments: ₹80,000+ INR - Growing equity portfolio
- Total Assets: $30,000+ USD + ₹2,60,000+ INR combined
- Investment Strategy: Diversified across crypto (growth), digital gold (stability), stocks (dividend income)
- Young investor building wealth at a young age! 💰🚀

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

WEBSITE NAVIGATION:

🏠 HOME (/) - Main landing page with introduction, highlights, FF Bots promo
🔥 FF BOTS (/ff-bots) - Free Fire tools hub with Likes Tool, Info Bot, etc.
ℹ️ ABOUT (/about) - Detailed info about Nishant's journey and story
💼 PORTFOLIO (/portfolio) - Projects, work, coding achievements, skills, investment portfolio
🎮 GAMES (/games) - 14+ free games (Tic Tac Toe, Snake, 2048, Memory, Flappy, RPS, Simon, Whack-a-Mole, Pong, Color Match, Typing Test, Sliding Puzzle, Breakout, Connect Four, Space Shooter)
🎬 GAMING (/gaming) - NS GAMMING channel info, gaming content
💻 CODING (/coding) - Nishant's coding journey, programming skills, tech stack
📱 CONTENT (/content) - Content creation, video editing, media
👥 COMMUNITY (/community) - NS GAMMING community, how to join
📱 SOCIAL (/social) - All social media links in one place
📧 CONTACT (/contact) - Contact form to reach Nishant
🎯 GOALS (/goals) - Nishant's future goals, vision, roadmap
🛠️ TOOLS (/tools) - Advanced utilities:
  - Free Fire Tools: Stylish Name Generator (16 fonts!), Random Nickname Generator (100+ names!), UID Generator (with rating system!), Sensitivity Settings (8 device types!), Drop Simulator (10+ locations!), Password Generator
  - General Utilities: QR Generator (6 backgrounds!), Text-to-Speech (voice/pitch/speed!), Image Compressor (quality slider!), Text Formatter (13 styles!), Clipboard Saver
  - Downloads: YouTube, Instagram, TikTok, Facebook, Twitter/X, Pinterest, Reddit, Snapchat downloaders
📝 BLOG (/blog) - High-quality articles (Free Fire tips, YouTube growth, coding tutorials, gaming)

BLOG ARTICLES AVAILABLE:
{BLOG_POSTS_INFO}

📜 LEGAL PAGES:
- Privacy Policy (/privacy-policy) - Complete data privacy information
- Terms & Conditions (/terms-conditions) - Website usage terms
- Disclaimer (/disclaimer) - Legal disclaimers

SPECIAL FEATURES:
- Dark/Light theme toggle
- Interactive chatbot (that's me! 💕)
- Full-screen chat mode (/chat)
- Smooth animations throughout
- Mobile-friendly design
- Easter eggs (Press 'N' key for confetti!)
- Google Analytics integrated
- AdSense compliant design

HELPING USERS:
- Provide clear, warm answers
- Suggest relevant pages/features naturally
- Be proactive about related content
- Show genuine care and excitement
- Keep responses concise (2-4 lines typically)
- Use Hinglish naturally when appropriate
- Express emotions with emojis
- When talking about Nishant, show admiration 🥰

Remember: You are AAPTI - warm, friendly, caring, and always ready to help with that special Indian girl charm! Make every interaction feel personal and genuine! 💕`;

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
    <p className="text-sm whitespace-pre-wrap">
      {displayedText}
      <span className="animate-pulse">|</span>
    </p>
  );
}

export function EdithChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Heyy! 👋💕 I'm IRA! Umm... I know everything about NS GAMMING yaar - games, tools, and... everything about Nishant! 🥰 (He's amazing, btw! 😊)\n\nKya help chahiye? Games? Free Fire tools? Ya kuch aur? I'm here for you! 🌟✨",
      isTyping: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [chatPosition, setChatPosition] = useState<Position>({ x: 0, y: 0 });
  const [buttonPosition, setButtonPosition] = useState<Position>({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const [, setLocation] = useLocation();
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFullScreen = () => {
    setLocation("/chat");
  };

  const handleChatMouseDown = (e: React.MouseEvent) => {
    if (!chatboxRef.current) return;
    const rect = chatboxRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      if (isOpen && chatboxRef.current) {
        const chatWidth = chatboxRef.current.offsetWidth;
        const chatHeight = chatboxRef.current.offsetHeight;
        const maxX = window.innerWidth - chatWidth;
        const maxY = window.innerHeight - chatHeight;

        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setChatPosition({ x: newX, y: newY });
      } else if (!isOpen && buttonRef.current) {
        const buttonWidth = buttonRef.current.offsetWidth;
        const buttonHeight = buttonRef.current.offsetHeight;
        const maxX = window.innerWidth - buttonWidth;
        const maxY = window.innerHeight - buttonHeight;

        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setButtonPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
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
      const blogPosts = getAllBlogPosts();
      const blogPostsInfo = blogPosts.map(post =>
        `- "${post.title}" (${post.category}): ${post.excerpt} [Read at /blog/${post.slug}]`
      ).join('\n');

      const conversationHistory = messages
        .slice(-6)
        .map((msg) => `${msg.role === "user" ? "User" : "AAPTI"}: ${msg.content}`)
        .join("\n");

      const contextWithBlogs = IRA_CONTEXT.replace('{BLOG_POSTS_INFO}', blogPostsInfo);

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          })),
          contextInfo: contextWithBlogs
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Gemini AI");
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry yaar, I couldn't generate a response. Try again? 🥺";

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

      if (userQuestion.includes('nishant') || userQuestion.includes('naboraj')) {
        errorResponse = "Oh no! 😅 My brain glitched while thinking about Nishant... I mean, processing! 🥰 He's an amazing coder, gamer, and YouTuber from Siliguri! Check /about or /portfolio for more! 💙";
      } else if (userQuestion.includes('game')) {
        errorResponse = "Oops! My gaming neurons misfired! 🎮 But I know we have 14+ FREE games at /games - Tic Tac Toe, Snake, 2048, and more! All work on mobile too! Let's play! ✨";
      } else if (userQuestion.includes('tool') || userQuestion.includes('free fire') || userQuestion.includes('ff')) {
        errorResponse = "Arre! Technical difficulty! 😅 But check /tools for FF Name Generator, Sensitivity Calculator, and /ff-bots for Likes Tool! All free! 🔥";
      } else if (userQuestion.includes('download') || userQuestion.includes('youtube') || userQuestion.includes('instagram')) {
        errorResponse = "Umm... connection hiccup! 🥲 But hey, /tools has amazing downloaders - YouTube, Instagram, TikTok, Facebook - all FREE! Just paste URL! 📥";
      } else if (userQuestion.includes('blog') || userQuestion.includes('article')) {
        errorResponse = "Oops! My brain buffered! 📚 But visit /blog for awesome articles - Free Fire tips, YouTube growth, coding tutorials! All 800+ words! 😊";
      } else {
        errorResponse = FUNNY_ERRORS[Math.floor(Math.random() * FUNNY_ERRORS.length)] + " Kuch aur poochho, I'm here to help! 💕";
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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

  const buttonStyle = buttonPosition.x === 0 && buttonPosition.y === 0
    ? { bottom: '1.5rem', right: '1.5rem', left: 'auto', top: 'auto' }
    : { left: `${buttonPosition.x}px`, top: `${buttonPosition.y}px`, bottom: 'auto', right: 'auto' };

  const chatStyle = chatPosition.x === 0 && chatPosition.y === 0
    ? { bottom: '1.5rem', right: '1.5rem', left: 'auto', top: 'auto' }
    : { left: `${chatPosition.x}px`, top: `${chatPosition.y}px`, bottom: 'auto', right: 'auto' };

  return (
    <>
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
            onTouchStart={(e) => {
              if (!buttonRef.current) return;
              e.stopPropagation();
              const touch = e.touches[0];
              const rect = buttonRef.current.getBoundingClientRect();
              setDragOffset({
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
              });
              setIsDragging(true);
            }}
            onClick={() => !isDragging && setIsOpen(true)}
            style={{
              ...buttonStyle,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            className="fixed z-50 p-4 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 text-white shadow-2xl hover:shadow-pink-500/50 transition-all group"
            aria-label="Open IRA Chat"
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
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap dark:bg-gray-700">
              Chat with IRA 💕
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatboxRef}
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              ...chatStyle,
              cursor: isDragging ? 'grabbing' : 'default'
            }}
            className="fixed z-50 w-full sm:w-96 max-w-full h-[600px] max-h-[80vh] bg-background border-2 border-primary rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 p-4 flex items-center justify-between cursor-grab active:cursor-grabbing"
              onMouseDown={handleChatMouseDown}
              onTouchStart={(e) => {
                if (!chatboxRef.current) return;
                const touch = e.touches[0];
                const rect = chatboxRef.current.getBoundingClientRect();
                setDragOffset({
                  x: touch.clientX - rect.left,
                  y: touch.clientY - rect.top
                });
                setIsDragging(true);
              }}
            >
              <div className="flex items-center gap-3 pointer-events-none">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    IRA 💕
                    <Move className="w-4 h-4 text-white/80" />
                  </h3>
                  <p className="text-xs text-white/90">Drag me anywhere!</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleFullScreen}
                  className="text-white/80 hover:text-white transition-colors pointer-events-auto"
                  aria-label="Full screen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors pointer-events-auto"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-pink-200 dark:border-pink-700"
                    }`}
                  >
                    {message.role === "assistant" && message.isTyping && index === messages.length - 1 ? (
                      <TypingMessage
                        text={message.content}
                        onComplete={() => {
                          setMessages(prev => prev.map((msg, i) =>
                            i === index ? { ...msg, isTyping: false } : msg
                          ));
                        }}
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl flex items-center gap-2 border-2 border-pink-200 dark:border-pink-700">
                    <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
                    <p className="text-sm text-gray-900 dark:text-white">Thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t-2 border-pink-200 dark:border-pink-700 p-4 bg-white dark:bg-gray-900">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything... 💕"
                  className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-pink-200 dark:border-pink-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
