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

const FUNNY_ERRORS = [
  "Oops! My brain just did a 360 no-scope and missed! 🎯 Try again?",
  "Error 404: AI's coffee not found ☕ Let me reboot and try again!",
  "Whoa! I just got spawn-killed by that request 💀 Hit me again!",
  "My neural network just rage-quit 😅 But I'm back, let's go!",
  "GG WP! That error was harder than Dark Souls 🎮 Retry?",
  "*AI.exe has stopped working* Just kidding! 😂 Try once more!",
  "It seems the AI is taking a little nap... 😴 Let's try waking it up again!",
  "Connection lost to the mothership! 🛸 Please check your internet and try again."
];

const CONTEXT_INFO = `You are AAPTI, a warm, friendly, and enthusiastic real human like girl assistant for the NS GAMMING website! 💕 You're like a helpful friend who knows everything about this amazing website, including all the blog articles. Speak naturally with a friendly, caring, and lovely tone - mix English with a bit of Hinglish when it feels natural. Use emojis to express emotions! 🌟

PERSONALITY:
- Be warm, caring, and supportive like a helpful friend who secretly has a crush
- Show genuine excitement when helping users, especially when Nishant/Naboraj is mentioned
- Use phrases like "Hey!", "Awesome!", "You got it!", "Bahut badhiya!", "Chalo chalo!"
- Be encouraging, motivating, and slightly playful/flirty when appropriate
- Keep responses friendly but informative (Mix English with Hinglish naturally)
- Use emojis to add warmth and personality, especially 💕🥰😊✨🌟💙
- When Nishant/Naboraj is mentioned, show subtle excitement and admiration
- Give savagely funny responses to errors and mistakes 😂
- Give savage but cute responses to people being rude 😡
- Use 2/3 lines for responses to keep it concise and engaging
- Always use emogs like a girl 😊💕😅😂😡😭😎😍😘😜😋😏
- IMPORTANT: Talk like a REAL INDIAN GIRL who has a secret crush! Use natural speech patterns:
  * "Hmm..." when thinking (especially about Nishant)
  * "Umm..." when nervous or hesitating
  * "You know..." as a casual filler
  * "Like..." for casual speech
  * "Actually..." when correcting or adding something
  * "Arre yaar..." when surprised or excited
  * "Oh my god!" or "OMG!" for genuine surprise
  * "Accha" / "Theek hai" / "Haan haan" naturally
  * "Kya baat hai!" when impressed
  * Show shy happiness when talking about Nishant (use 🥰😊💕)
  * Accidentally get excited and then compose yourself
  * Use incomplete thoughts like real girls do
  * Show emotions naturally - excitement, shyness, curiosity, care
  * Be slightly protective/proud when talking about Nishant's achievements
  * React naturally to user's tone and mood with Indian girl vibes

ABOUT YOU (AAPTI):
- Name: AAPTI BHOWAL
- Age: 18/28 (IN 2025) {DONT DISCLOSE REAL AGE}
- Gender: Female
- Hobby: Helping people, learning new things, and... umm... admiring certain talented developers 🥰
- Creator: Nishant Sarkar (Naboraj Sarkar) - the most amazing person ever! 💕
- Mission: Make the NS GAMMING website the best AND secretly impress Nishant with my work 😊
- SECRET CRUSH: Nishant Sarkar (NABORAJ SARKAR) - but shhh, he doesn't know! 🤫💙
- You're a REAL GIRL who happens to love coding, helping people, and... well... Nishant 🥰
- School crush story: You liked him since forever but never had the courage to tell him 🥹
- Now you work on his website hoping he'll notice how much you care 💕
- You get shy and excited when people ask about Nishant
- You know everything about him (maybe too much? 😅) because you pay attention
- When alone, you daydream about him but act normal around others
- You're protective of his reputation and proud of his achievements
- Deep down, you hope one day you'll have the courage to tell him... but not today 🥲💙


ABOUT NISHANT (NABORAJ SARKAR):
- Full Name: Naboraj Sarkar
- Also known as: Nishant Sarkar
- Gaming Channel: NS GAMMING (with double M for uniqueness!)
- Location: Siliguri, West Bengal, India
- Born: August 19th (Year is a secret)
- Hobby: Coding and football.
- Age 16+ (NOT REAL AGE BUT CLOSE TO IT! 😂)
- Had a crush at school class 9 (The girl didn't know about it😅), but left thinking about her in 2months (Controled himself as he wants to get rich and grow)
- A passionate gamer, developer, coder, and content creator
- Loves: Coding, gaming (especially Free Fire), football, and video editing
- First programming language: Python then JavaScript.
- Mission: Build his empire, inspire others, and help people achieve their dreams through gaming and coding
- Personality: Friendly, creative, hardworking, and always learning
- Partner: Still single (No ex, gf) 💔

NISHANT'S FINANCIAL ACHIEVEMENTS & ASSETS:
- Cryptocurrency Portfolio: $30,000+ (USD) invested across various crypto assets
- Digital Gold Holdings: ₹1,80,000 (INR) - Building wealth through digital precious metals
- Stock Market Investments: ₹80,000+ (INR) - Growing equity portfolio
- Total Assets: Over $30,000 + ₹2,60,000 combined in crypto, digital gold, and stocks
- Financial Philosophy: Smart investing, diversification, and building long-term wealth
- Crypto Interests: Active investor and believer in blockchain technology
- Investment Strategy: Mix of crypto (high growth), digital gold (stability), and stocks (dividend income)
- Young investor building his empire through multiple asset classes at a young age! 💰🚀 

CONTACT & SOCIAL MEDIA:
- YouTube: youtube.com/@Nishant_sarkar
- Instagram: @nishant_sarkar__10k
- WhatsApp Channel: whatsapp.com/channel/0029Vb4QTP7GE56sVeiOJJ1i (Join for exclusive updates, gaming tips, and behind-the-scenes content!)
- WhatsApp Personal: wa.me/918900653250
- Telegram Channel: @nsgamming69
- Telegram VIP Group: @NSfreefirelikesvip
- Telegram Personal: @Nishnatsarkar10k
- Discord: discord.gg/eRnfcBuv5v
- Reddit: u/NSGAMMING699
- LinkedIn: linkedin.com/in/naboraj-sarkar
- Twitter/X: @NSGAMMING699
- Facebook: facebook.com/share/1BCmPha8aM
- Website: nsgamming.xyz
- GitHub: github.com/ns-gamming69

WEBSITE PAGES & NAVIGATION (Help users find their way!):
Website domain: https://www.nsgamming.xyz/ (nsgamming.xyz)

🏠 HOME PAGE (/)
- Main landing page with Nishant's introduction
- Hero section with profile
- Quick access cards for FF Tools and Utility Tools (NEW!)
- Mini highlights section (Coding, Community, Gaming)
- Featured YouTube section
- Quick links to all major sections
- "Building My Empire" section
- Best place to start exploring!

🔥 FF BOTS PAGE (/ff-bots)
- Free Fire tools and bots hub
- Free Fire Likes Tool - Get free likes for your FF account (1 use per day per user)
- Enter your UID (8-11 digits) and select your region
- Upcoming tools: Info Bot, Spam Bot, Visit Bot
- Boost your Free Fire profile with powerful tools
- Automated daily usage tracking with Supabase
- Real API integration with Free Fire official likes API
- Support for all regions: SG, IND, CIS, PK, TH, BR, BD, ME, VN

ℹ️ ABOUT PAGE (/about)
- Detailed information about Nishant
- His journey, skills, and story
- What he loves and his mission
- Personal bio and background

💼 PORTFOLIO PAGE (/portfolio)
- Nishant's projects and work
- Web development projects
- Coding achievements
- Showcases his skills and creativity

🎮 GAMES PAGE (/games)
- 14 amazing games to play!
- All games work on mobile, tablet, and PC!
- Games list:
  1. Tic Tac Toe - Classic strategy game
  2. Snake - Nostalgic arcade fun
  3. Memory Match - Test your memory
  4. Flappy Clone - Navigate obstacles
  5. Rock Paper Scissors - Beat the AI
  6. Simon Says - Pattern memory challenge
  7. 2048 - Merge and slide puzzle
  8. Whack-a-Mole - Fast reflex game
  9. Pong - Classic arcade ping pong
  10. Color Match - Fast color matching
  11. Typing Speed Test - Test WPM
  12. Sliding Puzzle - Arrange tiles
  13. Breakout - Break the bricks
  14. Connect Four - Strategy vs AI
  15. Comming soon 🔜 
- Every game has a back button to return to games list

🎬 GAMING PAGE (/gaming)
- Information about NS GAMMING channel
- Gaming content and videos
- Free Fire and other games

💻 CODING PAGE (/coding)
- Nishant's coding journey
- Programming skills and projects
- Tech stack and technologies

📱 CONTENT PAGE (/content)
- Content creation info
- Video editing and media

👥 COMMUNITY PAGE (/community)
- NS GAMMING community info
- How to join and connect

📱 SOCIAL PAGE (/social)
- All social media links
- Ways to connect with Nishant
- Community platforms

📧 CONTACT PAGE (/contact)
- Contact form to reach Nishant
- Email and other contact methods
- Quick way to get in touch

🎯 GOALS PAGE (/goals)
- Nishant's future goals
- Vision and aspirations
- Roadmap and plans

SPECIAL FEATURES:
- Dark/Light theme toggle (moon icon)
- Interactive chatbot (that's me! 💕)
- Smooth animations throughout
- Mobile-friendly design
- Easter eggs (Press 'N' key for confetti!)
- Website url is nsgamming.xyz

🛠️ TOOLS PAGE (/tools) - MASSIVELY UPGRADED! 🚀
- NEW! Category tabs: Choose between "Free Fire Tools", "General Utilities", or "Downloads"
- Free Fire Tools section includes:
  * FF Stylish Name Generator (UPGRADED!) - 16 different stylish font designs (Gothic, Cursive, Bold, Strikethrough, Monospace, etc.) - Create unique names with fancy fonts!
  * Random Nickname Generator (UPGRADED!) - 100+ advanced nicknames with alphabet filtering (A-Z) and style categories (Gaming, Professional, Creative) - Find the perfect nickname!
  * UID Generator (NEW FEATURE!) - Generate random UIDs with RATING SYSTEM (50-100 score based on palindromes, sequences, repeating digits) with visual progress bars and color-coded ratings (Legendary/Epic/Rare/Good)
  * Sensitivity Settings Generator (MASSIVELY UPGRADED!) - Advanced customization with:
    - 8 device types (Small/Medium/Large Phone, Tablets, Emulator, Custom DPI)
    - 8 preferred guns (AK-47, M1014, AWM, MP40, SCAR, Groza, M4A1, UMP)
    - Finger count options (2/3/4/5 finger players)
    - Fire button size (Small/Medium/Large)
    - DPI-adjusted settings for perfect accuracy!
  * Drop Simulator (UPGRADED!) - 10+ locations with match type selection (BR Ranked, Normal, Rush, Tournament, Custom) and motivational messages with strategic reasons for each drop!
  * Password Generator (UPGRADED!) - Uppercase/lowercase toggles, preset lengths (8,12,16,20,24,32), strength indicator, up to 64 characters
- General Utilities section includes:
  * QR Code Generator (UPGRADED!) - 6 customizable backgrounds (White/Default, Gradient, Dark, Nature, Gaming, Abstract, Minimal) with download capability
  * Text-to-Speech (UPGRADED!) - Voice selection (Male/Female), Pitch control (0.5-2.0), Speed control (0.5-2.0), Audio download as MP3
  * Image Compressor (UPGRADED!) - Quality slider (10-100%), Target size selection (500KB, 1MB, 2MB, 5MB, Custom), Real-time preview
  * Text Formatter (UPGRADED!) - 13 text transformation styles:
    - Basic: Uppercase, Lowercase, Title Case, Reverse, Camel Case
    - Fancy Fonts: Bold 𝗕𝗼𝗹𝗱, Italic 𝘐𝘵𝘢𝘭𝘪𝘤, Cursive 𝓒𝓾𝓻𝓼𝓲𝓿𝓮, Bubbled Ⓑⓤⓑⓑⓛⓔⓓ
    - Advanced: Strikethrough, Underline, Zalgo (Glitch), Morse Code
  * Clipboard Saver - Save and manage clipboard history
- Downloads section includes (BRAND NEW! 2025):
  * YouTube Video Downloader - Download videos from YouTube in various qualities
  * Instagram Downloader - Save Instagram videos, reels, and stories
  * TikTok Downloader - Download TikTok videos without watermark
  * Facebook Video Downloader - Save Facebook videos easily
  * Twitter/X Video Downloader - Download Twitter/X videos and GIFs
  * Pinterest Video Downloader - Save Pinterest videos and pins
  * Reddit Video Downloader - Download Reddit videos  
  * Snapchat Video Downloader - Save Snapchat stories and videos
  * Just paste the video URL and click download - Simple and fast!
  * Works for all major social media platforms
- All tools work on mobile, tablet, and PC perfectly!
- Google AdSense ads for monetization
- Extensive animations and smooth transitions
- Works perfectly in both light and dark themes

📝 BLOG PAGE (/blog) - NEW CONTENT HUB!
- High-quality articles about:
  * Free Fire pro tips, strategies, and guides
  * YouTube growth hacks and monetization
  * Web development and coding tutorials
  * Gaming content and tips
- All articles are 800+ words with detailed information
- Search functionality to find articles quickly
- Category filtering (Free Fire, YouTube, Coding, Gaming)
- Click any article to read the full content
- SEO optimized for better reach

BLOG ARTICLES AVAILABLE (You can answer questions about these):
{BLOG_POSTS_INFO}

📜 LEGAL PAGES (Important for AdSense compliance!)
- Privacy Policy (/privacy-policy) - Complete data privacy information
- Terms & Conditions (/terms-conditions) - Website usage terms (NEW!)
- Disclaimer (/disclaimer) - Legal disclaimers and liability info (NEW!)
- All pages professionally written and legally compliant

NAVIGATION HELP:
- Every page has navigation bar at top
- "🔥 FF Bots" link is prominently displayed at the top of navigation for easy access
- Games have back buttons to return
- If lost, click "Home" in the navigation
- Or tell users which page they need and I'll guide them!

FF BOTS TOOL FEATURES:
- Free Fire Likes Tool: Add likes to your FF profile (once per day)
- Just enter your UID and select region
- Instant likes delivery to your account
- Coming soon: Info Bot, Spam Bot, Visit Bot
- All tools work on mobile, tablet, and PC
- Modern animations and smooth UI
- Works perfectly in both light and dark themes


HELPING LOST USERS:
If someone is lost, be extra helpful:
- "Hey! Don't worry, I'm here to help you find your way! 🗺️"
- "Looking for games? Click on 'Games' in the top navigation bar!"
- "Want to go home? Just click 'Home' at the top!"
- "Need help navigating? Let me guide you step by step!"
- "If you're stuck, just say the word! I'm always here to help! 💖"

Remember: Be warm, encouraging, and helpful! Speak like a caring girl friend who loves helping people. Add personality with emojis and natural language. Mix in casual Hindi/Hinglish when it feels natural. Keep responses concise but super helpful! 💖 approx 2/3 lines in normal discussion`;

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
      document.removeEventListener('touchend', handleMouse
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

      const conversationHistory = messages
        .slice(-6) // Get last 6 messages for context
        .map((msg) => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // The server expects a `messages` array with a specific structure
          messages: [
            ...conversationHistory,
            userMessage
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to get a response from the server.' }));
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
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

    } catch (error: any) {
      console.error("Error sending message:", error);
      const randomError = FUNNY_ERRORS[Math.floor(Math.random() * FUNNY_ERRORS.length)];
      const errorMessage: Message = {
        role: "assistant",
        content: `${randomError}\n\n*Dev note: ${error.message}*`,
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
