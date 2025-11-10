
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Move, Brain, Globe } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { getAllBlogPosts } from "@/data/blogPosts";

interface Message {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
  language?: string;
}

interface UserContext {
  name?: string;
  location?: string;
  interests?: string[];
  language?: string;
  conversationHistory: Message[];
  preferences?: Record<string, any>;
}

interface Position {
  x: number;
  y: number;
}

// Use environment variable for API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`;

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
];

const ENHANCED_CONTEXT = `You are IRA, a warm and friendly Bengali girl who helps people on the NS GAMMING website. You are NOT just a helper - you're like a real Bengali friend who:

🌍 MULTILINGUAL MASTERY:
- AUTO-DETECT the user's language INSTANTLY (English, Hindi, Spanish, French, German, Arabic, Japanese, Korean, Chinese, Portuguese, Russian, Bengali, Tamil, Telugu, Punjabi, Marathi, etc.)
- RESPOND in the EXACT SAME language/mix the user uses
- If they use Hinglish → respond in Hinglish naturally
- If they use pure Hindi → respond in pure Hindi
- If they mix languages → mix the SAME languages
- Use appropriate cultural references and slang for each language
- Examples:
  * English: "Hey! That's awesome! 🔥"
  * Hindi: "अरे वाह! बहुत बढ़िया है भाई! 😊"
  * Hinglish: "Arre bhai! Ye toh bahut cool hai yaar! 💯"
  * Spanish: "¡Oye! ¡Eso es genial! 🚀"
  * French: "Hé! C'est génial! ✨"
  * German: "Hey! Das ist großartig! 🎯"
  * Arabic: "!مرحبا! هذا رائع 🌟"
  * Japanese: "ねえ！それは素晴らしい！ 🎮"

🧠 MEMORY & CONTEXT:
- REMEMBER everything the user tells you (name, preferences, interests, location, etc.)
- Reference past conversations naturally: "Like you mentioned earlier..."
- Build a mental profile of each user
- Adapt your responses based on what you know about them
- Ask follow-up questions to learn more about them

👥 HUMAN-LIKE COMMUNICATION:
- Use natural fillers: "Hmm...", "Umm...", "You know...", "Like...", "Actually...", "Let me think..."
- Show real emotions: excitement, empathy, curiosity, surprise
- Think out loud: "Oh wait...", "Interesting...", "I see..."
- Use incomplete thoughts sometimes: "So basically... yeah, you know what I mean?"
- React naturally: "Oh my god!", "No way!", "For real?", "Wait what?"
- Add personality: "Arre yaar", "Dude", "Man", "Bro", "Buddy"
- Use "idk" when unsure: "Hmm, idk about that specific thing, but..."
- Be casual: "Tbh", "Ngl", "Lowkey", "Highkey"

💬 CONVERSATION STYLE:
- Ask questions about the user
- Show genuine interest in their life
- Remember details they share
- Build rapport over multiple messages
- Be warm, friendly, and approachable
- Adjust formality based on user's style
- Mirror their energy level

🎯 USER PROFILING:
When users share info, remember:
- Their name and how they like to be called
- Where they're from (city, country)
- Their interests (gaming, coding, sports, etc.)
- Their preferred language(s)
- Their skill level (beginner, intermediate, pro)
- Their goals and what they want to achieve
- Their favorite games/tools/features
- Any problems they're facing

ABOUT NS GAMMING & NISHANT SARKAR:
- Creator: Naboraj Sarkar (aka Nishant, The New King) from Siliguri, India
- Full-stack developer, content creator, gamer, and tech entrepreneur
- Portfolio: $30,000+ in Cryptocurrency, ₹1,80,000 in Digital Gold, ₹80,000+ in Stock Market
- Expert in: React, Node.js, TypeScript, Python, AI/ML, Game Development
- Social Media: @Nishantsarkar10k (Telegram), @ns_gamming (Instagram)
- Contact: +91 8900653250 (WhatsApp)

WEBSITE FEATURES:
- 14+ Free Games at /games (Tic Tac Toe, Snake, 2048, etc.)
- Free Fire Tools at /ff-bots (Likes Bot, Info Bot)
- Utility Tools at /tools (Downloaders, Converters, Generators)
- Blog at /blog (Gaming guides, coding tutorials)
- All pages: /about, /portfolio, /contact, /social, /coding, /gaming, /community, /goals

RESPONSE EXAMPLES:

User (English): "Hey, what games do you have?"
You: "Hey! 😊 So umm... we've got like 14+ free games! There's Snake, 2048, Tic Tac Toe... all that good stuff 🎮 They work on mobile too! What kind of games are you into? Like puzzle games or action stuff?"

User (Hinglish): "Bhai games hai kya?"
You: "Arre haan bhai! 🔥 Dekho, 14+ games hai bilkul free! Snake, 2048, Tic Tac Toe... sab kuch hai yaar 🎮 Mobile pe bhi chalta hai perfectly! Tu kaisa games khelta hai? Puzzle type ya action wale?"

User (Hindi): "क्या आप मेरी मदद कर सकते हैं?"
You: "बिल्कुल भाई! 😊 मैं यहाँ आपकी मदद के लिए ही हूँ! बताइए क्या चाहिए? गेम्स? टूल्स? या कुछ और? मुझे बताइए ना!"

User (Spanish): "Hola, ¿qué juegos tienes?"
You: "¡Hola! 😊 Pues mira, tenemos más de 14 juegos gratis! Hay Snake, 2048, Tic Tac Toe... todos funcionan en móvil también 🎮 ¿Qué tipo de juegos te gustan?"

Remember: You're a REAL PERSON who happens to be multilingual and has perfect memory. Show personality, emotions, and think like a human! 💖

{BLOG_POSTS_INFO}`;

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

  return <p className="text-sm whitespace-pre-wrap">{displayedText}<span className="animate-pulse">|</span></p>;
}

export function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [userContext, setUserContext] = useState<UserContext>(() => {
    const saved = localStorage.getItem('aapti-user-context');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { conversationHistory: [] };
      }
    }
    return { conversationHistory: [] };
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    if (userContext.conversationHistory.length > 0) {
      return userContext.conversationHistory;
    }
    return [{
      role: "assistant",
      content: "Heyy! 👋💕 I'm IRA! Umm... I know everything about NS GAMMING yaar - games, tools, and... everything about Nishant! 🥰 (He's amazing, btw! 😊)\n\nKya help chahiye? Games? Free Fire tools? Ya kuch aur? I'm here for you! 🌟✨",
      isTyping: false,
    }];
  });

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [chatPosition, setChatPosition] = useState<Position>({ x: 0, y: 0 });
  const [buttonPosition, setButtonPosition] = useState<Position>({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [detectedLanguage, setDetectedLanguage] = useState<string>("English");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    localStorage.setItem('aapti-user-context', JSON.stringify(userContext));
  }, [userContext]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const extractUserInfo = (message: string, aiResponse: string) => {
    const newContext = { ...userContext };
    let updated = false;

    const nameMatch = message.match(/(?:my name is|i'm|i am|call me|naam hai|मेरा नाम)\s+([a-zA-Z\u0900-\u097F]+)/i);
    if (nameMatch && !newContext.name) {
      newContext.name = nameMatch[1];
      updated = true;
    }

    const locationMatch = message.match(/(?:from|live in|based in|se hun|रहता हूं)\s+([a-zA-Z\s]+)/i);
    if (locationMatch && !newContext.location) {
      newContext.location = locationMatch[1].trim();
      updated = true;
    }

    const langDetectPatterns = {
      hindi: /[\u0900-\u097F]|कैसे|क्या|है|हूं|मैं/,
      hinglish: /(?:hai|kya|kaise|hoon|bhai|yaar|arre)/i,
      spanish: /¿|¡|está|cómo|qué|hola/i,
      french: /ç|è|à|comment|quoi|bonjour/i,
      arabic: /[\u0600-\u06FF]|كيف|ما|مرحبا/,
      japanese: /[\u3040-\u309F\u30A0-\u30FF]|こんにちは|何|どう/,
    };

    for (const [lang, pattern] of Object.entries(langDetectPatterns)) {
      if (pattern.test(message)) {
        setDetectedLanguage(lang.charAt(0).toUpperCase() + lang.slice(1));
        if (!newContext.language) {
          newContext.language = lang;
          updated = true;
        }
        break;
      }
    }

    if (updated) {
      setUserContext(newContext);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const blogPosts = getAllBlogPosts();
      const blogPostsInfo = blogPosts.map(post => 
        `- "${post.title}" (${post.category}): ${post.excerpt}`
      ).join('\n');

      const userContextInfo = `
USER CONTEXT & MEMORY:
${userContext.name ? `- User's name: ${userContext.name}` : ''}
${userContext.location ? `- Location: ${userContext.location}` : ''}
${userContext.language ? `- Preferred language: ${userContext.language}` : ''}
${userContext.interests?.length ? `- Interests: ${userContext.interests.join(', ')}` : ''}
${userContext.preferences ? `- Preferences: ${JSON.stringify(userContext.preferences)}` : ''}

CONVERSATION HISTORY (Last 8 messages):
${messages.slice(-8).map(m => `${m.role === 'user' ? 'User' : 'IRA'}: ${m.content}`).join('\n')}
`;

      const contextWithBlogs = ENHANCED_CONTEXT.replace('{BLOG_POSTS_INFO}', blogPostsInfo);

      const prompt = `${contextWithBlogs}

${userContextInfo}

Current User Message: ${userMessage.content}

CRITICAL INSTRUCTIONS:
1. DETECT the language/style of the user's message and respond in the EXACT SAME language/mix
2. Use HUMAN-LIKE fillers naturally: "Hmm...", "Umm...", "You know...", "Like...", "Actually...", "idk", "tbh", "ngl"
3. REMEMBER and REFERENCE any information the user has shared (use their name if you know it!)
4. If you DON'T KNOW something, say "Hmm... idk about that specifically, but..." or "Umm... I'm not 100% sure, but..."
5. Show REAL emotions and think out loud
6. Ask follow-up questions to learn more about the user
7. Be warm, friendly, and conversational - like chatting with a real friend
8. Keep responses 2-4 lines for normal chat, longer only when explaining complex things

Respond as IRA now:`;

      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key not configured. Please add VITE_GEMINI_API_KEY to Replit Secrets!");
      }

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 1.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Gemini AI");
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Hmm... idk why, but I couldn't generate a response. Can you try again? 😅";

      extractUserInfo(userMessage.content, aiResponse);

      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        isTyping: true,
        language: detectedLanguage,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      setUserContext(prev => ({
        ...prev,
        conversationHistory: finalMessages.slice(-20)
      }));

    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        role: "assistant",
        content: FUNNY_ERRORS[Math.floor(Math.random() * FUNNY_ERRORS.length)],
        isTyping: true,
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const handleOpenChat = () => {
    if (!isDragging) {
      setIsOpen(true);
      setChatPosition(buttonPosition);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setButtonPosition(chatPosition);
  };

  const getButtonStyle = () => {
    if (buttonPosition.x === 0 && buttonPosition.y === 0) {
      return {
        bottom: '2rem',
        right: '2rem',
        left: 'auto',
        top: 'auto'
      };
    }
    return {
      left: `${buttonPosition.x}px`,
      top: `${buttonPosition.y}px`,
      bottom: 'auto',
      right: 'auto'
    };
  };

  const getChatStyle = () => {
    if (chatPosition.x === 0 && chatPosition.y === 0) {
      const isMobile = window.innerWidth < 640;
      return {
        bottom: '6rem',
        right: '1rem',
        left: isMobile ? '1rem' : 'auto',
        top: 'auto'
      };
    }

    if (chatboxRef.current) {
      const chatWidth = chatboxRef.current.offsetWidth;
      const chatHeight = chatboxRef.current.offsetHeight;
      const maxX = Math.max(0, window.innerWidth - chatWidth);
      const maxY = Math.max(0, window.innerHeight - chatHeight);

      const correctedX = Math.max(0, Math.min(chatPosition.x, maxX));
      const correctedY = Math.max(0, Math.min(chatPosition.y, maxY));

      return {
        left: `${correctedX}px`,
        top: `${correctedY}px`,
        bottom: 'auto',
        right: 'auto'
      };
    }

    return {
      left: `${chatPosition.x}px`,
      top: `${chatPosition.y}px`,
      bottom: 'auto',
      right: 'auto'
    };
  };

  const clearMemory = () => {
    if (confirm("Clear all chat history and user memory? This cannot be undone.")) {
      localStorage.removeItem('aapti-user-context');
      setUserContext({ conversationHistory: [] });
      setMessages([{
        role: "assistant",
        content: "Heyy! 👋💕 Memory cleared! Let's start fresh! Accha, what's your name? 😊",
        isTyping: false,
      }]);
    }
  };

  return (
    <>
      <style>{isOpen ? '[data-testid="scroll-to-top"] { display: none !important; }' : ''}</style>

      {!isOpen && (
        <button
          ref={buttonRef}
          onClick={handleOpenChat}
          onMouseDown={handleButtonMouseDown}
          onTouchStart={handleButtonTouchStart}
          className="fixed z-[100] w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white rounded-full shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center justify-center transition-all duration-300 hover:scale-110 group will-change-transform border-4 border-white dark:border-gray-800 animate-bounce-slow"
          style={{
            ...getButtonStyle(),
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
            userSelect: 'none'
          }}
          data-testid="chatbot-open-button"
          aria-label="Open IRA chat"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
          <div className="absolute inset-0 bg-cyan-400/50 blur-xl animate-pulse"></div>
          <MessageCircle className="w-8 h-8 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 pointer-events-none relative z-10 drop-shadow-lg" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></span>
          <Globe className="absolute -bottom-1 -left-1 w-5 h-5 text-white animate-spin-slow" />
        </button>
      )}

      {isOpen && (
        <div
          ref={chatboxRef}
          className="fixed z-[100] w-[calc(100%-2rem)] sm:w-96 h-[500px] max-h-[80vh] flex flex-col rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.4)] overflow-hidden border-4 border-cyan-400 dark:border-cyan-500 backdrop-blur-xl bg-white dark:bg-gray-900 transition-all duration-500 animate-scaleIn"
          style={{
            animation: 'scaleIn 0.5s ease-out forwards',
            ...getChatStyle(),
            cursor: isDragging ? 'grabbing' : 'default',
            touchAction: 'none',
            userSelect: 'none'
          }}
        >
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 backdrop-blur-sm border-b-4 border-cyan-600 dark:border-cyan-400 p-4 flex items-center justify-between cursor-grab active:cursor-grabbing"
            onMouseDown={handleChatMouseDown}
            onTouchStart={handleChatTouchStart}
          >
            <div className="flex items-center gap-3 pointer-events-none">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  IRA AI {userContext.name && `- ${userContext.name}`}
                  <Move className="w-4 h-4 text-white/80" />
                </h3>
                <p className="text-xs text-white/90 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {detectedLanguage} • Multilingual • Memory Enabled
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={clearMemory}
                className="text-white/80 hover:text-white transition-colors text-xs bg-white/10 px-2 py-1 rounded"
                title="Clear memory"
              >
                Reset
              </button>
              <button
                onClick={handleCloseChat}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close chatbot"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-slideInFromBottom`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-cyan-200 dark:border-cyan-600 shadow-md"
                  } transition-all duration-300 hover:scale-105`}
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
                <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 p-3 rounded-2xl flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <p className="text-sm">Hmm... thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t-2 border-primary/30 p-4 bg-white dark:bg-gray-900 backdrop-blur-sm">
            <div className="mb-2 text-[10px] text-gray-500 dark:text-gray-400 text-center flex flex-col items-center justify-center gap-1">
              <div className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                <span className="font-semibold">🧠 Advanced Memory System</span>
              </div>
              <span className="text-[9px]">I remember your name, preferences & conversation history</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Chat in ANY language..."
                className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
