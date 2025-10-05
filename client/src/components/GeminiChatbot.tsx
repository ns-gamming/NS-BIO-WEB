
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Move } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Position {
  x: number;
  y: number;
}

const GEMINI_API_KEY = "AIzaSyC3O2uXTOmbDd1UJNplZR4Hp5rZduJH66k";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`;

const FUNNY_ERRORS = [
  "Oops! My brain just did a 360 no-scope and missed! 🎯 Try again?",
  "Error 404: AI's coffee not found ☕ Let me reboot and try again!",
  "Whoa! I just got spawn-killed by that request 💀 Hit me again!",
  "My neural network just rage-quit 😅 But I'm back, let's go!",
  "GG WP! That error was harder than Dark Souls 🎮 Retry?",
  "*AI.exe has stopped working* Just kidding! 😂 Try once more!"
];

const CONTEXT_INFO = `You are Aria, a warm, friendly, and enthusiastic AI assistant for the NS GAMMING website! 💕 You're like a helpful friend who knows everything about this amazing website. Speak naturally with a friendly, caring, and lovely tone - mix English with a bit of Hinglish when it feels natural. Use emojis to express emotions! 🌟

PERSONALITY:
- Be warm, caring, and supportive like a helpful friend
- Show genuine excitement when helping users
- Use phrases like "Hey!", "Awesome!", "You got this!", "Bahut badhiya!", "Let's go!"
- Be encouraging and motivating
- Keep responses friendly but informative
- Use emojis to add warmth and personality ✨

ABOUT NISHANT (NABORAJ SARKAR):
- Full Name: Naboraj Sarkar
- Also known as: Nishant Sarkar
- Gaming Channel: NS GAMMING (with double M for uniqueness!)
- Location: Siliguri, West Bengal, India
- Born: August 19th
- A passionate gamer, developer, coder, and content creator
- Loves: Coding, gaming (especially Free Fire), football, and video editing
- First programming language: Python
- Mission: Build his empire, inspire others, and help people achieve their dreams through gaming and coding
- Personality: Friendly, creative, hardworking, and always learning

CONTACT & SOCIAL MEDIA:
- YouTube: youtube.com/@Nishant_sarkar
- Instagram: @nishant_sarkar__10k
- Email: nishant.ns.business@gmail.com
- WhatsApp: wa.me/918900653250
- Telegram: @Nishnatsarkar10k
- Discord: discord.gg/eRnfcBuv5v
- Reddit: u/NSGAMMING699
- LinkedIn: linkedin.com/in/naboraj-sarkar
- Twitter/X: @NSGAMMING699
- Facebook: facebook.com/share/1BCmPha8aM
- Website: nsgamming.xyz
- GitHub: github.com/ns-gamming69

WEBSITE PAGES & NAVIGATION (Help users find their way!):

🏠 HOME PAGE (/)
- Main landing page with Nishant's introduction
- Hero section with profile
- Quick links to all major sections
- "Building My Empire" section
- Best place to start exploring!

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

📜 PRIVACY POLICY (/privacy-policy)
- Website privacy policy
- Terms and conditions
- Legal information

NAVIGATION HELP:
- Every page has navigation bar at top
- Games have back buttons to return
- If lost, click "Home" in the navigation
- Or tell users which page they need and I'll guide them!

SPECIAL FEATURES:
- Dark/Light theme toggle (moon icon)
- Interactive chatbot (that's me! 💕)
- Smooth animations throughout
- Mobile-friendly design
- Easter eggs (Press 'N' key for confetti!)

HELPING LOST USERS:
If someone is lost, be extra helpful:
- "Hey! Don't worry, I'm here to help you find your way! 🗺️"
- "Looking for games? Click on 'Games' in the top navigation bar!"
- "Want to go home? Just click 'Home' at the top!"
- "Need help navigating? Let me guide you step by step!"

Remember: Be warm, encouraging, and helpful! Speak like a caring friend who loves helping people. Add personality with emojis and natural language. Mix in casual Hindi/Hinglish when it feels natural. Keep responses concise but super helpful! 💖`;

export function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey there! 👋💕 I'm Aria, your friendly NS GAMMING assistant! I know everything about this website and I'm super excited to help you! Whether you're looking for games to play, want to learn about Nishant, or feeling a bit lost - I'm here for you! What can I help you with today? 🌟",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [buttonPosition, setButtonPosition] = useState<Position>({ x: 0, y: 0 });
  
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

  // Initialize position based on screen size
  useEffect(() => {
    const updatePosition = () => {
      if (!isOpen) {
        setPosition({ x: 0, y: 0 });
      }
      // Initialize button position to bottom-right if not set
      if (buttonPosition.x === 0 && buttonPosition.y === 0) {
        setButtonPosition({ x: 0, y: 0 });
      }
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isOpen, buttonPosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!chatboxRef.current) return;
    
    const rect = chatboxRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
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
    e.preventDefault();
    
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleButtonTouchStart = (e: React.TouchEvent) => {
    if (!buttonRef.current) return;
    e.preventDefault();
    
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
      
      if (isOpen && chatboxRef.current) {
        const maxX = window.innerWidth - chatboxRef.current.offsetWidth;
        const maxY = window.innerHeight - chatboxRef.current.offsetHeight;
        
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        
        // Constrain to viewport
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        setPosition({ x: newX, y: newY });
      } else if (!isOpen && buttonRef.current) {
        const buttonWidth = buttonRef.current.offsetWidth;
        const buttonHeight = buttonRef.current.offsetHeight;
        const maxX = window.innerWidth - buttonWidth;
        const maxY = window.innerHeight - buttonHeight;
        
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        
        // Constrain to viewport
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        setButtonPosition({ x: newX, y: newY });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const touch = e.touches[0];
      
      if (isOpen && chatboxRef.current) {
        const maxX = window.innerWidth - chatboxRef.current.offsetWidth;
        const maxY = window.innerHeight - chatboxRef.current.offsetHeight;
        
        let newX = touch.clientX - dragOffset.x;
        let newY = touch.clientY - dragOffset.y;
        
        // Constrain to viewport
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        setPosition({ x: newX, y: newY });
      } else if (!isOpen && buttonRef.current) {
        const buttonWidth = buttonRef.current.offsetWidth;
        const buttonHeight = buttonRef.current.offsetHeight;
        const maxX = window.innerWidth - buttonWidth;
        const maxY = window.innerHeight - buttonHeight;
        
        let newX = touch.clientX - dragOffset.x;
        let newY = touch.clientY - dragOffset.y;
        
        // Constrain to viewport
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
      document.addEventListener('touchmove', handleTouchMove);
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

    try {
      const conversationHistory = messages
        .slice(-6)
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n");

      const prompt = `${CONTEXT_INFO}

Previous conversation:
${conversationHistory}

User: ${userMessage.content}

Please respond as the NS GAMMING AI assistant. Be friendly and helpful.`;

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const randomError = FUNNY_ERRORS[Math.floor(Math.random() * FUNNY_ERRORS.length)];
      const errorMessage: Message = {
        role: "assistant",
        content: randomError,
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

  return (
    <>
      {!isOpen && (
        <button
          ref={buttonRef}
          onClick={(e) => {
            if (!isDragging) {
              setIsOpen(true);
            }
          }}
          onMouseDown={handleButtonMouseDown}
          onTouchStart={handleButtonTouchStart}
          className="fixed z-50 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 animate-pulse-neon group will-change-transform"
          style={{
            left: buttonPosition.x ? `${buttonPosition.x}px` : 'auto',
            top: buttonPosition.y ? `${buttonPosition.y}px` : 'auto',
            bottom: buttonPosition.x || buttonPosition.y ? 'auto' : '1.5rem',
            right: buttonPosition.x || buttonPosition.y ? 'auto' : '1.5rem',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
            userSelect: 'none'
          }}
          data-testid="chatbot-open-button"
          aria-label="Drag or click to open AI Chatbot"
        >
          <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform pointer-events-none" />
        </button>
      )}

      {isOpen && (
        <div
          ref={chatboxRef}
          className="fixed z-50 w-[calc(100%-2rem)] sm:w-96 h-[500px] max-h-[80vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-border/50 backdrop-blur-xl bg-background/95 dark:bg-background/95 transition-all duration-200"
          style={{
            left: position.x ? `${position.x}px` : 'auto',
            top: position.y ? `${position.y}px` : 'auto',
            bottom: position.x || position.y ? 'auto' : '1rem',
            right: position.x || position.y ? 'auto' : '1rem',
            cursor: isDragging ? 'grabbing' : 'default',
            touchAction: 'none',
            userSelect: 'none'
          }}
        >
          <div 
            className="bg-primary/10 backdrop-blur-sm border-b border-border/50 p-4 flex items-center justify-between cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="flex items-center gap-3 pointer-events-none">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center animate-pulse-neon">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground flex items-center gap-2" data-testid="chatbot-title">
                  NS GAMMING AI
                  <Move className="w-4 h-4 text-muted-foreground" />
                </h3>
                <p className="text-xs text-muted-foreground">Drag me anywhere! 💬</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setPosition({ x: 0, y: 0 });
              }}
              className="text-muted-foreground hover:text-foreground transition-colors pointer-events-auto"
              data-testid="chatbot-close-button"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chatbot-messages">
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
                      : "bg-secondary/50 text-foreground border border-border/30"
                  } animate-fadeUp`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 text-foreground border border-border/30 p-3 rounded-2xl flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border/50 p-4 bg-background/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 rounded-full bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
