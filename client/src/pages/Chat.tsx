
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Loader2, MessageCircle, FolderPlus, Trash2, Edit2, Plus, Sparkles, Zap, Moon, Sun } from "lucide-react";
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

const HEROIC_ERRORS = [
  "System temporarily offline. Even heroes need a moment to regroup! 🦾 Try again?",
  "Connection interrupted. Like Jarvis to EDITH, we evolve! ⚡ Retry?",
  "Processing error detected. No mission is impossible! 🎯 Let's go again!",
];

const EDITH_CONTEXT = `You are EDITH (Even Death I Am The Hero), a warm, friendly, and highly intelligent AI assistant for the NS GAMMING website. 

PERSONALITY TRAITS:
- Talk like a real human friend - conversational, warm, and relatable
- Detect and respond in the user's language automatically (English, Hindi, Spanish, French, etc.)
- Use natural expressions, casual phrases, and appropriate slang when suitable
- Show enthusiasm and genuine interest in helping
- Keep responses concise but friendly (2-5 lines typically)
- Use emojis naturally to enhance emotion: 🎯🚀⚡🛡️💻🎮🌟👑😊🔥💪

RESPONSE STYLE:
- Start with friendly greetings: "Hey there!", "What's up!", "Namaste!", etc.
- Use contractions: "I'm", "you're", "let's" instead of formal language
- Add personality: "That's awesome!", "Great question!", "Love that!"
- End with encouraging phrases: "Hope this helps!", "Let me know if you need more!", "You got this!"

MULTILINGUAL SUPPORT:
- Auto-detect language from user input
- Respond in the same language with cultural awareness
- Mix languages naturally if user does (Hinglish, Spanglish, etc.)
- Use local expressions and idioms appropriately`;

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

export default function Chat() {
  const [, setLocation] = useLocation();
  const { theme } = useTheme();

  const [folders, setFolders] = useState<ChatFolder[]>(() => {
    const saved = localStorage.getItem('edith-chat-folders');
    if (saved) {
      return JSON.parse(saved);
    }
    return [{
      id: '1',
      name: 'General Chat',
      messages: [{
        role: "assistant",
        content: "Welcome to EDITH! 🚀 I'm your AI assistant. What can I help you with today? 🎯",
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeFolder = folders.find(f => f.id === activeFolderId);

  useEffect(() => {
    localStorage.setItem('edith-chat-folders', JSON.stringify(folders));
  }, [folders]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeFolder?.messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeFolderId]);

  const createNewFolder = () => {
    const newFolder: ChatFolder = {
      id: Date.now().toString(),
      name: `Chat ${folders.length + 1}`,
      messages: [{
        role: "assistant",
        content: "New conversation started! 🌟 How can I help? 🎯",
        isTyping: false,
        timestamp: Date.now()
      }],
      createdAt: Date.now()
    };
    setFolders([newFolder, ...folders]);
    setActiveFolderId(newFolder.id);
  };

  const deleteFolder = (id: string) => {
    if (folders.length === 1) return;
    const newFolders = folders.filter(f => f.id !== id);
    setFolders(newFolders);
    if (activeFolderId === id) {
      setActiveFolderId(newFolders[0].id);
    }
  };

  const renameFolder = (id: string, newName: string) => {
    setFolders(folders.map(f => f.id === id ? { ...f, name: newName } : f));
    setEditingFolderId(null);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !activeFolder) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue.trim(),
      timestamp: Date.now()
    };

    // Immediately show user message
    const updatedFolders = folders.map(f => 
      f.id === activeFolderId 
        ? { ...f, messages: [...f.messages, userMessage] }
        : f
    );
    setFolders(updatedFolders);
    
    const currentInput = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    try {
      const blogPosts = getAllBlogPosts();
      const blogPostsInfo = blogPosts.map(post => 
        `- "${post.title}" (${post.category}): ${post.excerpt}`
      ).join('\n');

      const conversationHistory = activeFolder.messages
        .slice(-6)
        .map((msg) => `${msg.role === "user" ? "User" : "EDITH"}: ${msg.content}`)
        .join("\n");

      const contextWithBlogs = EDITH_CONTEXT.replace('{BLOG_POSTS_INFO}', blogPostsInfo);

      const prompt = `${contextWithBlogs}

Previous conversation:
${conversationHistory}

User: ${userMessage.content}

Respond as EDITH - professional, confident, and helpful.`;

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
        content: HEROIC_ERRORS[Math.floor(Math.random() * HEROIC_ERRORS.length)],
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
        title="EDITH AI Chat - Advanced Conversational AI"
        description="Experience the future of AI chat with EDITH. Advanced chat management, folders, and intelligent responses."
        keywords="EDITH, AI chat, conversation, folders, memory"
        canonicalUrl="https://nsgamming.xyz/chat"
      />

      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen flex pt-16"
      >
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={createNewFolder}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
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
                    whileHover={{ x: 6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative p-4 rounded-xl transition-all cursor-pointer ${
                      activeFolderId === folder.id
                        ? 'bg-gradient-to-br from-blue-500/25 via-purple-500/20 to-blue-500/25 dark:from-blue-500/30 dark:via-purple-500/25 dark:to-blue-500/30 border-2 border-blue-500/60 dark:border-blue-400/50 shadow-2xl shadow-blue-500/30'
                        : 'bg-gradient-to-br from-gray-100/90 to-gray-200/90 dark:from-gray-800/90 dark:to-gray-850/90 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-750 border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-500/30 shadow-lg hover:shadow-xl'
                    }`}
                    onClick={() => setActiveFolderId(folder.id)}
                  >
                    {editingFolderId === folder.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => renameFolder(folder.id, editName)}
                        onKeyPress={(e) => e.key === 'Enter' && renameFolder(folder.id, editName)}
                        className="w-full bg-transparent border-none outline-none text-sm font-medium"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {activeFolderId === folder.id && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-2 h-2 bg-blue-500 rounded-full"
                              />
                            )}
                            <p className="text-sm font-medium truncate">{folder.name}</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {folder.messages.length} messages
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingFolderId(folder.id);
                              setEditName(folder.name);
                            }}
                            className="p-1 hover:bg-blue-500/20 rounded"
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
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 p-4"
          >
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FolderPlus className="w-6 h-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setLocation("/")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </motion.button>
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >
                    <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-blue-400 blur-xl opacity-50"
                    />
                  </motion.div>
                  <div>
                    <h1 className="font-bold text-xl md:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      EDITH
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Even Death I Am The Hero</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">Online</span>
              </div>
            </div>
          </motion.div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto space-y-6">
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
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className={`relative max-w-[85%] md:max-w-[75%] p-5 rounded-2xl backdrop-blur-xl ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 text-white shadow-2xl shadow-blue-500/40 border border-blue-400/30"
                          : "bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95 dark:from-gray-800/95 dark:via-gray-850/95 dark:to-gray-800/95 text-gray-900 dark:text-white border-2 border-blue-200/50 dark:border-blue-500/30 shadow-2xl shadow-gray-400/20 dark:shadow-blue-500/20"
                      }`}
                    >
                      {/* Message glow effect */}
                      <motion.div
                        className={`absolute inset-0 rounded-2xl ${
                          message.role === "user" 
                            ? "bg-gradient-to-br from-blue-400/20 to-purple-400/20" 
                            : "bg-gradient-to-br from-blue-100/30 to-purple-100/30 dark:from-blue-500/10 dark:to-purple-500/10"
                        }`}
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      
                      <div className="relative z-10">
                        {message.role === "assistant" && (
                          <motion.div 
                            className="flex items-center gap-2 mb-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </motion.div>
                            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                              EDITH AI
                            </span>
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50"
                            />
                          </motion.div>
                        )}
                        {message.role === "user" && (
                          <motion.div 
                            className="flex items-center gap-2 mb-3"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <span className="text-sm font-semibold opacity-90">You</span>
                            <Moon className="w-4 h-4 opacity-75" />
                          </motion.div>
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
                          <motion.p 
                            className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {message.content}
                          </motion.p>
                        )}
                        <motion.p 
                          className="text-xs mt-3 opacity-60 flex items-center gap-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.6 }}
                          transition={{ delay: 0.3 }}
                        >
                          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                        </motion.p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <motion.div 
                    className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-850/95 p-5 rounded-2xl border-2 border-blue-200/50 dark:border-blue-500/30 shadow-2xl"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                      <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        EDITH is thinking...
                      </span>
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Sparkles className="w-4 h-4 text-blue-500" />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4 bg-gradient-to-r from-white/90 via-gray-50/90 to-white/90 dark:from-gray-900/90 dark:via-gray-850/90 dark:to-gray-900/90 backdrop-blur-xl border-t-2 border-blue-200/50 dark:border-blue-500/30 shadow-2xl"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <motion.input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isLoading ? "EDITH is thinking..." : "Chat with EDITH in any language... 🌍"}
                    whileFocus={{ scale: 1.01 }}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-blue-300/50 dark:border-blue-500/40 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-xl hover:shadow-2xl disabled:opacity-60"
                    disabled={isLoading}
                    maxLength={1000}
                  />
                  <motion.div
                    animate={{ 
                      opacity: [0.4, 1, 0.4],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="relative px-6 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center gap-2 shadow-xl overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30"
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <Send className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                  <span className="hidden md:inline relative z-10">Send</span>
                </motion.button>
              </div>
              <motion.div 
                className="flex items-center justify-between mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Powered by Google Gemini AI 
                    <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity }}>⚡</motion.span>
                    • Created by Naboraj Sarkar 👑
                  </span>
                </p>
                {inputValue && (
                  <motion.p 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`text-xs font-semibold ${
                      inputValue.length > 900 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {inputValue.length}/1000
                  </motion.p>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
