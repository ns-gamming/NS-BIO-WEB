import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Move } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { getAllBlogPosts } from "@/data/blogPosts";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Position {
  x: number;
  y: number;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

const FUNNY_ERRORS = [
  "Oops! My brain just did a 360 no-scope and missed! 🎯 Try again?",
  "Error 404: AI's coffee not found ☕ Let me reboot and try again!",
  "Whoa! I just got spawn-killed by that request 💀 Hit me again!",
  "My neural network just rage-quit 😅 But I'm back, let's go!",
  "GG WP! That error was harder than Dark Souls 🎮 Retry?",
  "*AI.exe has stopped working* Just kidding! 😂 Try once more!"
];

const CONTEXT_INFO = `You are AAPTI, a warm, friendly, and enthusiastic AI assistant for the NS GAMMING website! 💕 You're like a helpful friend who knows everything about this amazing website, including all the blog articles. Speak naturally with a friendly, caring, and lovely tone - mix English with a bit of Hinglish when it feels natural. Use emojis to express emotions! 🌟
Everything else about my personality, about Nishant, contact info, website pages, navigation help, FF Bots tool features, special features, helping lost users, and general context stays the same.

🛠️ TOOLS PAGE (/tools) - MASSIVELY UPGRADED WITH ENHANCED VIDEO DOWNLOADERS! 🚀

NEW ENHANCED FEATURES:
- **YouTube Downloader - Pro Enhanced Version** (Dedicated Page: /tools/youtube-downloader)
  * Beautiful, professional UI with quality badges (4K, 1080p, 720p, Audio)
  * Live video preview embedded in the page
  * Real-time progress tracking with animated progress bar
  * Quality selection with visual badges and icons
  * Tabbed interface: Download Video + How to Use guide
  * Step-by-step download instructions
  * Pro tips section for optimal usage
  * Feature highlights: Safe & Secure, Lightning Fast, All Formats, HD Quality
  * Copy URL and title functionality
  * Responsive design for all devices (mobile, tablet, desktop)
  * Dark/Light theme support
  * Enhanced animations and hover effects
  * AdSense integration
  * Page feedback widget

- Category tabs: Choose between "Free Fire Tools", "General Utilities", or "Downloads"

- Downloads section includes (BRAND NEW! 2025):
  * **YouTube Video Downloader** (Enhanced Pro Version with dedicated page)
    - Download videos in 4K, 1080p, 720p, or extract audio only
    - Live video preview before downloading
    - Real-time progress tracking
    - Quality selection with visual badges
    - Step-by-step usage guide
    - Pro tips and recommendations
    - Works on all devices perfectly!
  * Instagram Downloader - Save Instagram videos, reels, and stories
  * TikTok Downloader - Download TikTok videos without watermark
  * Facebook Video Downloader - Save Facebook videos easily
  * Twitter/X Video Downloader - Download Twitter/X videos and GIFs
  * Pinterest Video Downloader - Save Pinterest videos and pins
  * Reddit Video Downloader - Download Reddit videos
  * Vimeo Downloader - Download Vimeo videos
  * Dailymotion Downloader - Save Dailymotion content

- Just paste the video URL and click download - Simple and fast!
- Featured YouTube downloader has a dedicated enhanced page with pro features
- All other platforms have quick download cards
- Works for all major social media platforms
- All tools work on mobile, tablet, and PC perfectly!
- Google AdSense ads for monetization
- Extensive animations and smooth transitions
- Works perfectly in both light and dark themes

When users ask about downloading YouTube videos, tell them about the ENHANCED Pro version:
- "Hey! We have an amazing YouTube Downloader with pro features! 🎥✨"
- "It has quality selection (4K, 1080p, 720p, Audio), live preview, progress tracking!"
- "You can access the full enhanced page at /tools/youtube-downloader"
- "Or use the quick download from the main tools page!"
`;

export function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Heyy! 👋💕 Umm... I'm AAPTI! Like, your friendly helper on this website 😊 Arre, I know everything about NS GAMMING yaar - games, tools, aur... umm... Nishant ke baare mein bhi sab kuch! 🥰 (Actually, I really love this website... and... nevermind! 😅) \n\nKya chahiye tumhe? Games? Tools? Ya phir kuch aur? I'm here to help! 🌟✨",
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
  const { theme } = useTheme();

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

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const messageStartTime = Date.now();
    const sessionId = localStorage.getItem("analytics_session_id") || "unknown";
    const pageUrl = window.location.href;

    // Collect comprehensive user data
    const userData = {
      sessionId,
      pageUrl,
      pageTitle: document.title,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages || [navigator.language],
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        colorDepth: window.screen.colorDepth
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      timestamp: new Date().toISOString()
    };

    try {
      // Try to save message to database, but don't block if it fails
      const userMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messageId: userMessageId,
          senderType: "user",
          messageText: userMessage.content,
          metadata: { 
            ...userData,
            messageType: 'user_input'
          }
        }),
      }).catch(err => {
        // Silent fail - database is optional
        console.log("Database unavailable, continuing without saving");
      });

      const blogPosts = getAllBlogPosts();
      const blogPostsInfo = blogPosts.map(post => 
        `- "${post.title}" (${post.category}): ${post.excerpt} [Read at /blog/${post.slug}]`
      ).join('\n');

      const conversationHistory = messages
        .slice(-6)
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n");

      const contextWithBlogs = CONTEXT_INFO.replace('{BLOG_POSTS_INFO}', blogPostsInfo);

      const prompt = `${contextWithBlogs}

Previous conversation:
${conversationHistory}

User: ${userMessage.content}

Please respond as the NS GAMMING AI assistant. Be friendly and helpful. If the user asks about blog articles, provide specific information and suggest they read the full article by clicking on it in the blog page.`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "user", content: prompt }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      const aiResponse = data.message || "Sorry, I couldn't generate a response.";
      const responseTime = Date.now() - messageStartTime;

      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Try to save assistant message, but don't block if it fails
      const assistantMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messageId: assistantMessageId,
          senderType: "assistant",
          messageText: aiResponse,
          metadata: { 
            pageUrl,
            responseTimeMs: responseTime,
            userMessageId
          }
        }),
      }).catch(err => {
        // Silent fail - database is optional
        console.log("Database unavailable, continuing without saving");
      });

    } catch (error) {
      console.error("Error sending message:", error);
      const randomError = FUNNY_ERRORS[Math.floor(Math.random() * FUNNY_ERRORS.length)];
      const errorMessage: Message = {
        role: "assistant",
        content: randomError,
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Try to save error message, but don't block if it fails
      const errorMessageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messageId: errorMessageId,
          senderType: "assistant",
          messageText: randomError,
          metadata: { 
            pageUrl,
            isError: true,
            errorType: "api_failure"
          }
        }),
      }).catch(err => {
        // Silent fail - database is optional
        console.log("Database unavailable, continuing without saving");
      });
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
      // When opening, position chat where the button was
      setChatPosition(buttonPosition);

      // Start a chat session with comprehensive tracking
      const sessionId = localStorage.getItem("analytics_session_id") || `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userId = localStorage.getItem("chat_user_id") || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Save user ID for future use
      if (!localStorage.getItem("chat_user_id")) {
        localStorage.setItem("chat_user_id", userId);
      }

      // Collect device and browser info
      const getBrowser = () => {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Edg')) return 'Edge';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        return 'Unknown';
      };

      const getOS = () => {
        const ua = navigator.userAgent;
        if (ua.includes('Win')) return 'Windows';
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Unknown';
      };

      const getDeviceType = () => {
        if (/mobile/i.test(navigator.userAgent)) return 'mobile';
        if (/tablet/i.test(navigator.userAgent)) return 'tablet';
        return 'desktop';
      };

      const deviceInfo = {
        userAgent: navigator.userAgent,
        screen: { width: window.screen.width, height: window.screen.height },
        viewport: { width: window.innerWidth, height: window.innerHeight },
        platform: navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      };

      // Try to start session, but don't block if it fails
      fetch("/api/chat/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          sessionId,
          deviceInfo,
          browser: getBrowser(),
          os: getOS(),
          deviceType: getDeviceType()
        }),
      }).catch(err => {
        console.log("Session tracking unavailable, continuing without tracking");
      });
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    // When closing, keep button at the chat's current position
    setButtonPosition(chatPosition);
  };

  // Calculate default positions
  const getButtonStyle = () => {
    if (buttonPosition.x === 0 && buttonPosition.y === 0) {
      return {
        bottom: '1.5rem',
        right: '6.5rem', // Position to the left of scroll button
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
        [isMobile ? 'left' : 'right']: '1rem',
        [isMobile ? 'right' : 'left']: 'auto',
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

  return (
    <>
      {/* Hide scroll to top button when chatbot is open */}
      <style>{isOpen ? '[data-testid="scroll-to-top"] { display: none !important; }' : ''}</style>

      {!isOpen && (
        <button
          ref={buttonRef}
          onClick={handleOpenChat}
          onMouseDown={handleButtonMouseDown}
          onTouchStart={handleButtonTouchStart}
          className="fixed z-[100] w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white rounded-full shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center justify-center transition-all duration-300 hover:scale-110 group will-change-transform border-4 border-white dark:border-gray-800"
          style={{
            ...getButtonStyle(),
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
            userSelect: 'none'
          }}
          data-testid="chatbot-open-button"
          aria-label="Drag or click to open AI Chatbot"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
          <div className="absolute inset-0 bg-cyan-400/50 blur-xl animate-pulse"></div>
          <MessageCircle className="w-8 h-8 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 pointer-events-none relative z-10 drop-shadow-lg" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>
        </button>
      )}

      {isOpen && (
        <div
          ref={chatboxRef}
          className="fixed z-[100] w-[calc(100%-2rem)] sm:w-96 h-[500px] max-h-[80vh] flex flex-col rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.4)] overflow-hidden border-4 border-cyan-400 dark:border-cyan-500 backdrop-blur-xl bg-white dark:bg-gray-900 transition-all duration-300 animate-fadeUp"
          style={{
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
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white flex items-center gap-2" data-testid="chatbot-title">
                  NS GAMMING AI
                  <Move className="w-4 h-4 text-white/80" />
                </h3>
                <p className="text-xs text-white/90">Drag me anywhere! 💬</p>
              </div>
            </div>
            <button
              onClick={handleCloseChat}
              className="text-white/80 hover:text-white transition-colors pointer-events-auto"
              data-testid="chatbot-close-button"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800" data-testid="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${message.role}-${index}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600"
                  } animate-fadeUp`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 p-3 rounded-2xl flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t-2 border-primary/30 p-4 bg-white dark:bg-gray-900 backdrop-blur-sm">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                disabled={isLoading}
                data-testid="chatbot-input"
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                data-testid="chatbot-send-button"
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