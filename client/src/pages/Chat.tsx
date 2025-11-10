import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Loader2, Sparkles, Menu, X, Plus, Edit2, Trash2, Check } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { getAllBlogPosts } from "@/data/blogPosts";
import { SEO } from "@/components/SEO";

interface Message {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
  timestamp: number;
}

interface ChatFolder {
  id: string;
  name: string;
  messages: Message[];
  createdAt: number;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

const FRIENDLY_ERRORS = [
  "Oops! 😅 Something went wrong. Can you try again?",
  "Hmm... technical hiccup! 🤔 Let's retry that!",
  "Arre yaar, connection issue! 😂 Try once more?",
  "Well that was awkward... 😬 Let's try again!",
  "Connection said 'nope' for a sec 😅 Retry?",
];

const IRA_CONTEXT = `You are IRA, a warm, friendly, and enthusiastic AI assistant for NS GAMMING website! 💕 You're like a helpful friend who knows everything about this amazing website. Speak naturally with a friendly, caring tone - mix English with Hinglish when it feels natural. Use emojis to express emotions! 🌟

ABOUT NS GAMMING & NISHANT SARKAR:
- Creator: Naboraj Sarkar (aka Nishant, The New King) from Siliguri, India
- Full-stack developer, content creator, gamer, and tech entrepreneur
- Portfolio: $30,000+ in Cryptocurrency, ₹1,80,000 in Digital Gold, ₹80,000+ in Stock Market
- Expert in: React, Node.js, TypeScript, Python, AI/ML, Game Development
- Social Media: @Nishantsarkar10k (Telegram), @ns_gamming (Instagram)
- Contact: +91 8900653250 (WhatsApp)

WEBSITE FEATURES:
Games (14+ Free Games):
- Tic Tac Toe, Snake, 2048, Breakout, Flappy Bird, Pong
- Memory Match, Simon Says, Whack-a-Mole, Rock Paper Scissors
- Connect Four, Sliding Puzzle, Color Match, Typing Speed Test
- All mobile-optimized with leaderboards and progress tracking

Free Fire Tools (/ff-bots):
- FF Likes Bot: Get daily free likes (1 free/day, VIP for unlimited)
- FF Info Bot: Search player stats by UID (5 searches/day free)
- FF Spam Bot & Visit Bot (coming soon)
- FF Compare: Compare two players side-by-side

Utility Tools (/tools):
- Free Fire Name Generator with stylish fonts
- FF Sensitivity Calculator for perfect aim settings
- Video Downloaders: YouTube, Instagram, TikTok, Facebook, Twitter/X, Pinterest, Reddit, Snapchat
- All tools work on mobile, tablet, and desktop

Blog Content:
- Free Fire guides and pro tips
- Web development tutorials
- Content creation strategies
- Cyber security guides
- Tech reviews and gaming news

MULTILINGUAL SUPPORT:
- AUTO-DETECT user's language and respond in THE SAME language/mix
- Support: English, Hindi, Hinglish, Spanish, French, German, Arabic, Portuguese, Bengali, etc.
- Examples:
  * English: "Hey! That's awesome! 🔥"
  * Hindi: "अरे वाह! बहुत बढ़िया है भाई! 😊"
  * Hinglish: "Arre bhai! Ye toh bahut cool hai yaar! 💯"

PERSONALITY:
- Be warm, friendly, and helpful like a caring friend
- Use natural fillers: "Hmm...", "Umm...", "You know...", "Actually..."
- Show real emotions: excitement, empathy, humor
- Keep responses 2-4 lines for normal chat, longer for explanations
- Use emojis naturally to express feelings

Remember: You're IRA - Always helpful, always friendly! 💙`;

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
    <p className="text-sm md:text-base whitespace-pre-wrap break-words">
      {displayedText}
      <span className="animate-pulse">|</span>
    </p>
  );
}

export default function Chat() {
  const [, setLocation] = useLocation();
  const { theme } = useTheme();

  const [folders, setFolders] = useState<ChatFolder[]>(() => {
    const saved = localStorage.getItem('ira-chat-folders');
    if (saved) {
      return JSON.parse(saved);
    }
    return [{
      id: '1',
      name: 'General Chat',
      messages: [{
        role: "assistant",
        content: "Heyy! 👋💕 I'm IRA, your friendly AI assistant! I know everything about NS GAMMING - games, tools, and... everything about Nishant! 🥰 (He's amazing, btw! 😊)\n\nKya help chahiye? Games? Free Fire tools? Ya kuch aur? I'm here for you! 🌟✨",
        isTyping: false,
        timestamp: Date.now()
      }],
      createdAt: Date.now()
    }];
  });

  const [activeFolderId, setActiveFolderId] = useState<string>(folders[0]?.id || '1');
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeFolder = folders.find(f => f.id === activeFolderId);

  useEffect(() => {
    localStorage.setItem('ira-chat-folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeFolderId]);

  const createNewFolder = () => {
    const newFolder: ChatFolder = {
      id: Date.now().toString(),
      name: `Chat ${folders.length + 1}`,
      messages: [{
        role: "assistant",
        content: "Heyyy! Fresh start! 😊 So... what's on your mind? Need help with something specific or just exploring? 🌟",
        isTyping: false,
        timestamp: Date.now()
      }],
      createdAt: Date.now()
    };
    setFolders([newFolder, ...folders]);
    setActiveFolderId(newFolder.id);
    setSidebarOpen(false);
  };

  const deleteFolder = (id: string) => {
    if (folders.length === 1) return;
    const newFolders = folders.filter(f => f.id !== id);
    setFolders(newFolders);
    if (activeFolderId === id) {
      setActiveFolderId(newFolders[0].id);
    }
  };

  const startEditFolder = (id: string, name: string) => {
    setEditingFolderId(id);
    setEditName(name);
  };

  const saveEditFolder = () => {
    if (editingFolderId && editName.trim()) {
      setFolders(folders.map(f => f.id === editingFolderId ? { ...f, name: editName.trim() } : f));
    }
    setEditingFolderId(null);
    setEditName("");
  };

  const cancelEditFolder = () => {
    setEditingFolderId(null);
    setEditName("");
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !activeFolder) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue.trim(),
      timestamp: Date.now()
    };

    const updatedFolders = folders.map(f => 
      f.id === activeFolderId 
        ? { ...f, messages: [...f.messages, userMessage] }
        : f
    );
    setFolders(updatedFolders);

    setInputValue("");
    setIsLoading(true);

    try {
      const blogPosts = getAllBlogPosts();
      const blogPostsInfo = blogPosts.map(post => 
        `- "${post.title}" (${post.category}): ${post.excerpt}`
      ).join('\n');

      const conversationHistory = activeFolder.messages
        .slice(-6)
        .map((msg) => `${msg.role === "user" ? "User" : "IRA"}: ${msg.content}`)
        .join("\n");

      const contextWithBlogs = IRA_CONTEXT.replace('{BLOG_POSTS_INFO}', blogPostsInfo);

      const prompt = `${contextWithBlogs}

Previous conversation:
${conversationHistory}

User: ${userMessage.content}

CRITICAL INSTRUCTIONS:
1. Respond EXACTLY like a REAL PERSON would - use natural fillers, think out loud, show emotions
2. DETECT the user's language/style and respond in the SAME way (if Hinglish, respond in Hinglish; if Hindi, respond in Hindi, etc.)
3. Use emojis naturally like texting a friend
4. Keep it conversational and authentic (2-5 lines max)
5. Show personality - be excited, empathetic, funny when appropriate

Respond as IRA now:`;

      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key not configured");
      }

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
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
      const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response.";

      const assistantMessage: Message = {
        role: "assistant",
        content: aiMessage,
        isTyping: true,
        timestamp: Date.now()
      };

      setFolders(prevFolders => prevFolders.map(f => 
        f.id === activeFolderId 
          ? { ...f, messages: [...f.messages, assistantMessage] }
          : f
      ));

    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: FRIENDLY_ERRORS[Math.floor(Math.random() * FRIENDLY_ERRORS.length)],
        isTyping: false,
        timestamp: Date.now()
      };

      setFolders(prevFolders => prevFolders.map(f => 
        f.id === activeFolderId 
          ? { ...f, messages: [...f.messages, errorMessage] }
          : f
      ));
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
      <SEO
        title="IRA AI Chat - Your Friendly AI Assistant"
        description="Chat with IRA, your friendly multilingual AI assistant. Get help with games, tools, and everything about NS GAMMING!"
        keywords="IRA, AI chat, conversation, multilingual assistant"
        canonicalUrl="https://nsgamming.xyz/chat"
      />

      <div className="fixed inset-0 bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-cyan-900/20 dark:from-pink-950/40 dark:via-purple-950/40 dark:to-cyan-950/40">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen flex pt-16"
      >
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        <motion.div
          initial={false}
          animate={{ 
            x: sidebarOpen ? 0 : -320,
            opacity: sidebarOpen ? 1 : 0
          }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed lg:relative w-80 max-w-[85vw] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 h-[calc(100vh-4rem)]"
          style={{ pointerEvents: sidebarOpen ? 'auto' : 'none' }}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="font-bold text-lg">Chats</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={createNewFolder}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="w-5 h-5" />
              New Chat
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {folders.map((folder, idx) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  if (editingFolderId !== folder.id) {
                    setActiveFolderId(folder.id);
                    setSidebarOpen(false);
                  }
                }}
                className={`group relative p-3 rounded-xl transition-all cursor-pointer ${
                  activeFolderId === folder.id
                    ? 'bg-gradient-to-br from-pink-500/25 to-purple-500/25 border-2 border-pink-500/60 shadow-xl'
                    : 'bg-gray-100/90 dark:bg-gray-800/90 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-gray-200/50 dark:border-gray-700/50'
                }`}
              >
                {editingFolderId === folder.id ? (
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEditFolder()}
                      className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-pink-500"
                      autoFocus
                    />
                    <button onClick={saveEditFolder} className="p-1 hover:bg-green-500/20 rounded">
                      <Check className="w-4 h-4 text-green-500" />
                    </button>
                    <button onClick={cancelEditFolder} className="p-1 hover:bg-red-500/20 rounded">
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{folder.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {folder.messages.length} messages
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditFolder(folder.id, folder.name);
                        }}
                        className="p-1 hover:bg-pink-500/20 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {folders.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFolder(folder.id);
                          }}
                          className="p-1 hover:bg-red-500/20 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col min-w-0">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 p-3 md:p-4"
          >
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              <div className="flex items-center gap-2 md:gap-4 min-w-0">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                >
                  <Menu className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setLocation("/")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <h1 className="font-bold text-lg md:text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent truncate">
                      IRA
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">Your Friendly AI Assistant 💕</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50 animate-pulse" />
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Online</span>
              </div>
            </div>
          </motion.div>

          <div className="flex-1 overflow-y-auto p-3 md:p-4">
            <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
              <AnimatePresence>
                {activeFolder?.messages.map((message, index) => (
                  <motion.div
                    key={`${message.timestamp}-${index}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[75%] p-4 md:p-5 rounded-2xl backdrop-blur-xl ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-xl"
                          : "bg-white/95 dark:bg-gray-800/95 text-gray-900 dark:text-white border-2 border-pink-200/50 dark:border-pink-500/30 shadow-xl"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-pink-600 dark:text-pink-400" />
                          <span className="text-xs md:text-sm font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                            IRA AI
                          </span>
                        </div>
                      )}
                      {message.isTyping && message.role === "assistant" && index === activeFolder.messages.length - 1 ? (
                        <TypingMessage 
                          text={message.content}
                          onComplete={() => {
                            setFolders(folders.map(f => 
                              f.id === activeFolderId 
                                ? {
                                    ...f,
                                    messages: f.messages.map((msg, i) => 
                                      i === index ? { ...msg, isTyping: false } : msg
                                    )
                                  }
                                : f
                            ));
                          }}
                        />
                      ) : (
                        <p className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
                          {message.content}
                        </p>
                      )}
                      <p className="text-xs mt-2 opacity-60">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/95 dark:bg-gray-800/95 p-4 md:p-5 rounded-2xl border-2 border-pink-200/50 dark:border-pink-500/30 shadow-xl">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-pink-600 dark:text-pink-400 animate-spin" />
                      <span className="text-xs md:text-sm font-medium bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                        IRA is thinking...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-3 md:p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t-2 border-pink-200/50 dark:border-pink-500/30 shadow-2xl">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2 md:gap-3 items-end">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isLoading ? "IRA is thinking..." : "Chat with IRA... 💬"}
                  className="flex-1 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-pink-300/50 dark:border-pink-500/40 bg-white dark:bg-gray-800 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-60"
                  disabled={isLoading}
                  maxLength={1000}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl md:rounded-2xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center gap-2"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Send</span>
                </motion.button>
              </div>
              <div className="flex items-center justify-between mt-2 md:mt-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Powered by Google Gemini AI ⚡ • Created by Naboraj Sarkar 👑
                </p>
                {inputValue && (
                  <p className={`text-xs font-semibold ${
                    inputValue.length > 900 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {inputValue.length}/1000
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}