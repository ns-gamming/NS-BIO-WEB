import { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Github, Youtube, ExternalLink, Code2, Sparkles, X, Calendar, Users, Globe, ArrowUp, Mail, Linkedin, Twitter, Heart, GraduationCap, Trophy, Zap, Code, BookOpen, Award, Briefcase } from "lucide-react";
// Lazy-load the AdSenseAd component
const AdSenseAd = lazy(() => import("../components/AdSenseAd"));
import PageFeedback from "../components/PageFeedback";
import { SEO } from "../components/SEO";
import { useTheme } from "../components/ThemeProvider";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { trackEvent } from "../lib/analytics";

interface SkillDetail {
  name: string;
  icon: string;
  color: string;
  description: string;
  detailedHistory: string;
  useCases: string[];
  expertise: string;
  projects: string[];
  resources: { name: string; url: string }[];
}

export default function Portfolio() {
  const { playSound } = useSoundEffects();
  const { theme } = useTheme();
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillDetail | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Live counter animation for investment values
  const [cryptoValue, setCryptoValue] = useState(30000);
  const [digitalGoldValue, setDigitalGoldValue] = useState(180000);
  const [stockValue, setStockValue] = useState(80000);

  useEffect(() => {
    let isMounted = true;

    // Crypto counter - fluctuates between $29,800 - $30,200
    const cryptoInterval = setInterval(() => {
      if (isMounted) {
        setCryptoValue(prev => {
          const change = (Math.random() - 0.5) * 60;
          const newValue = prev + change;
          return Math.max(29800, Math.min(30200, newValue));
        });
      }
    }, 4000);

    // Digital Gold counter - fluctuates between ₹179,000 - ₹181,000
    const goldInterval = setInterval(() => {
      if (isMounted) {
        setDigitalGoldValue(prev => {
          const change = (Math.random() - 0.5) * 300;
          const newValue = prev + change;
          return Math.max(179000, Math.min(181000, newValue));
        });
      }
    }, 5000);

    // Stock counter - fluctuates between ₹79,000 - ₹81,000
    const stockInterval = setInterval(() => {
      if (isMounted) {
        setStockValue(prev => {
          const change = (Math.random() - 0.5) * 300;
          const newValue = prev + change;
          return Math.max(79000, Math.min(81000, newValue));
        });
      }
    }, 4500);

    return () => {
      isMounted = false;
      clearInterval(cryptoInterval);
      clearInterval(goldInterval);
      clearInterval(stockInterval);
    };
  }, []);

  // Scroll to top handler
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSkillClick = (skill: SkillDetail) => {
    setSelectedSkill(skill);
    trackEvent('skill_detail_viewed', { skill: skill.name });
  };

  const skillsData: SkillDetail[] = [
    {
      name: "React",
      icon: "⚛️",
      color: "from-blue-500/20 to-cyan-500/20",
      description: "JavaScript library for building user interfaces.",
      detailedHistory: "Started learning React in 2022, quickly falling in love with its component-based architecture. Built numerous projects including this website, mastering hooks, state management, and modern React patterns. React transformed how I approach web development, making complex UIs manageable and maintainable.",
      expertise: "Advanced - 2+ years experience",
      useCases: ["Single Page Applications", "Dynamic Web Apps", "Real-time Dashboards", "E-commerce Platforms"],
      projects: ["NS GAMMING Website", "Free Fire Tools Hub", "AI Chatbot Interface", "Portfolio Showcase"],
      resources: [
        { name: "React Docs", url: "https://react.dev" },
        { name: "React Patterns", url: "https://reactpatterns.com" }
      ]
    },
    {
      name: "Next.js",
      icon: "▲",
      color: "from-gray-500/20 to-black/20",
      description: "React framework for production.",
      detailedHistory: "Adopted Next.js to take my React skills to the next level. The server-side rendering, file-based routing, and API routes made building full-stack applications incredibly smooth. Used it for SEO-optimized projects and high-performance web apps.",
      expertise: "Intermediate - 1+ year experience",
      useCases: ["SEO-optimized websites", "Full-stack applications", "Static site generation", "E-commerce"],
      projects: ["Blog Platform", "Marketing Websites", "API-driven Apps"],
      resources: [
        { name: "Next.js Docs", url: "https://nextjs.org/docs" },
        { name: "Next.js Tutorial", url: "https://nextjs.org/learn" }
      ]
    },
    {
      name: "Tailwind CSS",
      icon: "🎨",
      color: "from-cyan-500/20 to-blue-500/20",
      description: "Utility-first CSS framework.",
      detailedHistory: "Tailwind CSS revolutionized my styling workflow. No more writing custom CSS for every element - just compose utilities. Built responsive, beautiful designs faster than ever. The utility-first approach made prototyping lightning-fast.",
      expertise: "Advanced - 2+ years experience",
      useCases: ["Rapid UI Development", "Responsive Design", "Custom Design Systems", "Dark Mode"],
      projects: ["NS GAMMING UI", "Free Fire Tools Interface", "Gaming Hub Design"],
      resources: [
        { name: "Tailwind Docs", url: "https://tailwindcss.com/docs" },
        { name: "Tailwind Components", url: "https://tailwindui.com" }
      ]
    },
    {
      name: "JavaScript",
      icon: "🟨",
      color: "from-yellow-500/20 to-orange-500/20",
      description: "The language of the web.",
      detailedHistory: "My foundation in web development. Started with vanilla JS, learned ES6+ features, async/await, promises, and modern JavaScript patterns. JavaScript opened the door to both frontend and backend development for me.",
      expertise: "Expert - 3+ years experience",
      useCases: ["Web Development", "Interactive UIs", "API Integration", "Browser Automation"],
      projects: ["All Web Projects", "Free Fire Bots", "Utility Tools", "Games"],
      resources: [
        { name: "MDN JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
        { name: "JavaScript.info", url: "https://javascript.info" }
      ]
    },
    {
      name: "Python",
      icon: "🐍",
      color: "from-blue-600/20 to-yellow-500/20",
      description: "Versatile programming language for AI and automation.",
      detailedHistory: "Python was my first programming language. Used it for automation scripts, data analysis, AI/ML experiments, and backend development. Its simplicity and power made coding accessible and fun.",
      expertise: "Advanced - 3+ years experience",
      useCases: ["Automation", "AI/ML", "Data Analysis", "Backend Development", "Scripting"],
      projects: ["Bot Development", "Data Scripts", "AI Experiments", "Automation Tools"],
      resources: [
        { name: "Python Docs", url: "https://docs.python.org" },
        { name: "Real Python", url: "https://realpython.com" }
      ]
    },
    {
      name: "HTML",
      icon: "📄",
      color: "from-orange-500/20 to-red-500/20",
      description: "Structure of web content.",
      detailedHistory: "HTML was where my web journey began. From basic tags to semantic HTML5, I've built countless web pages. Understanding HTML deeply helps me create accessible, SEO-friendly websites.",
      expertise: "Expert - 4+ years experience",
      useCases: ["Web Structure", "SEO Optimization", "Accessibility", "Content Organization"],
      projects: ["Every Website Built", "Landing Pages", "Web Applications"],
      resources: [
        { name: "MDN HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
        { name: "HTML5 Guide", url: "https://www.w3schools.com/html/" }
      ]
    },
    {
      name: "CSS",
      icon: "🎭",
      color: "from-blue-500/20 to-purple-500/20",
      description: "Styling of web content.",
      detailedHistory: "CSS brings designs to life. Mastered flexbox, grid, animations, transitions, and responsive design. From basic styling to complex animations, CSS is my creative playground.",
      expertise: "Advanced - 3+ years experience",
      useCases: ["Responsive Design", "Animations", "UI Styling", "Custom Themes"],
      projects: ["Website Designs", "UI Components", "Animation Effects"],
      resources: [
        { name: "MDN CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
        { name: "CSS Tricks", url: "https://css-tricks.com" }
      ]
    },
    {
      name: "AI Using",
      icon: "🤖",
      color: "from-purple-500/20 to-pink-500/20",
      description: "Leveraging AI tools and models for smart solutions.",
      detailedHistory: "Embraced AI tools like ChatGPT, Gemini, and Claude to enhance productivity. Built AI-powered chatbots, content generators, and automation tools. AI is not replacing developers - it's making us superhuman.",
      expertise: "Intermediate - 1+ year experience",
      useCases: ["AI Chatbots", "Content Generation", "Code Assistance", "Automation"],
      projects: ["Aapti AI Chatbot", "Content Tools", "AI-powered Features"],
      resources: [
        { name: "OpenAI Docs", url: "https://platform.openai.com/docs" },
        { name: "Google AI", url: "https://ai.google.dev" }
      ]
    },
    {
      name: "Prompt Engineering",
      icon: "✨",
      color: "from-pink-500/20 to-violet-500/20",
      description: "Crafting effective prompts for AI systems.",
      detailedHistory: "Discovered that the right prompt can unlock AI's true potential. Learned to craft precise, context-rich prompts that generate exactly what's needed. This skill amplifies everything I build with AI.",
      expertise: "Advanced - 1+ year experience",
      useCases: ["AI Communication", "Content Creation", "Problem Solving", "Automation"],
      projects: ["AI Chatbot Responses", "Content Generation", "Code Generation"],
      resources: [
        { name: "Prompt Engineering Guide", url: "https://www.promptingguide.ai" },
        { name: "Learn Prompting", url: "https://learnprompting.org" }
      ]
    },
    {
      name: "AWS",
      icon: "☁️",
      color: "from-orange-600/20 to-yellow-600/20",
      description: "Cloud computing and deployment services.",
      detailedHistory: "Learned AWS to scale applications beyond local hosting. Worked with S3, Lambda, EC2, and other services. Cloud computing opened new possibilities for deployment and scalability.",
      expertise: "Beginner - 6+ months experience",
      useCases: ["Cloud Hosting", "File Storage", "Serverless Functions", "Scalable Apps"],
      projects: ["Cloud Deployments", "File Storage Systems"],
      resources: [
        { name: "AWS Docs", url: "https://docs.aws.amazon.com" },
        { name: "AWS Training", url: "https://aws.amazon.com/training/" }
      ]
    },
    {
      name: "Vercel",
      icon: "▲",
      color: "from-black/20 to-gray-500/20",
      description: "Modern web hosting and deployment platform.",
      detailedHistory: "Vercel became my go-to deployment platform. The seamless Git integration, automatic deployments, and edge network make deploying Next.js apps effortless. This website runs on Vercel!",
      expertise: "Intermediate - 1+ year experience",
      useCases: ["Web Hosting", "CI/CD", "Edge Functions", "Analytics"],
      projects: ["NS GAMMING Website", "Portfolio Sites", "Web Apps"],
      resources: [
        { name: "Vercel Docs", url: "https://vercel.com/docs" },
        { name: "Vercel Guide", url: "https://vercel.com/guides" }
      ]
    },
    {
      name: "Figma",
      icon: "🎨",
      color: "from-red-500/20 to-purple-500/20",
      description: "Interface design tool.",
      detailedHistory: "Figma transformed how I design. Before coding, I prototype in Figma - creating wireframes, mockups, and design systems. Collaboration features make working with teams seamless.",
      expertise: "Intermediate - 1+ year experience",
      useCases: ["UI/UX Design", "Prototyping", "Design Systems", "Collaboration"],
      projects: ["Website Mockups", "App Designs", "UI Components"],
      resources: [
        { name: "Figma Learn", url: "https://www.figma.com/resources/learn-design/" },
        { name: "Figma Community", url: "https://www.figma.com/community" }
      ]
    },
    {
      name: "Git",
      icon: "🔀",
      color: "from-orange-500/20 to-red-600/20",
      description: "Version control system.",
      detailedHistory: "Git is essential for any developer. Learned branching, merging, pull requests, and collaboration workflows. Version control saves projects and enables team collaboration.",
      expertise: "Advanced - 2+ years experience",
      useCases: ["Version Control", "Team Collaboration", "Code History", "Deployment"],
      projects: ["All Projects", "Open Source Contributions"],
      resources: [
        { name: "Git Docs", url: "https://git-scm.com/doc" },
        { name: "Learn Git", url: "https://learngitbranching.js.org" }
      ]
    },
    {
      name: "Node.js",
      icon: "🟢",
      color: "from-green-600/20 to-lime-500/20",
      description: "JavaScript runtime environment.",
      detailedHistory: "Node.js brought JavaScript to the backend. Built APIs, real-time applications, and server-side logic. The same language for frontend and backend makes full-stack development smooth.",
      expertise: "Advanced - 2+ years experience",
      useCases: ["Backend APIs", "Real-time Apps", "Microservices", "CLI Tools"],
      projects: ["API Development", "Backend Services", "Bot Servers"],
      resources: [
        { name: "Node.js Docs", url: "https://nodejs.org/docs" },
        { name: "Node.js Guide", url: "https://nodejs.dev/learn" }
      ]
    },
    {
      name: "Team Handling",
      icon: "👥",
      color: "from-indigo-500/20 to-blue-500/20",
      description: "Leading and managing development teams.",
      detailedHistory: "Built NS GAMMING community from scratch. Learned to coordinate teams, delegate tasks, and maintain project momentum. Leadership is about empowering others to succeed.",
      expertise: "Intermediate - 1+ year experience",
      useCases: ["Project Management", "Team Coordination", "Community Building", "Mentoring"],
      projects: ["NS GAMMING Community", "Team Projects", "Collaborative Builds"],
      resources: [
        { name: "Team Leadership", url: "https://www.atlassian.com/team-playbook" },
        { name: "Project Management", url: "https://www.pmi.org/learning" }
      ]
    },
    {
      name: "Selling",
      icon: "💼",
      color: "from-green-500/20 to-emerald-500/20",
      description: "Marketing and client relationship management.",
      detailedHistory: "Learned that great products need great marketing. Built skills in client communication, value proposition, and sales strategies. Understanding business helps create better solutions.",
      expertise: "Beginner - 6+ months experience",
      useCases: ["Client Relations", "Marketing", "Product Promotion", "Business Development"],
      projects: ["Website Sales", "Service Offerings", "Client Projects"],
      resources: [
        { name: "Marketing Guide", url: "https://blog.hubspot.com" },
        { name: "Sales Skills", url: "https://www.salesforce.com/resources/" }
      ]
    },
    {
      name: "Video Creator",
      icon: "🎬",
      color: "from-red-500/20 to-pink-500/20",
      description: "Content creation and video production.",
      detailedHistory: "Started NS GAMMING YouTube channel to share knowledge. Learned video editing, scripting, thumbnail design, and audience engagement. Content creation is about storytelling and value.",
      expertise: "Intermediate - 2+ years experience",
      useCases: ["YouTube Videos", "Tutorials", "Gaming Content", "Educational Videos"],
      projects: ["NS GAMMING Channel", "Tutorial Series", "Gaming Videos"],
      resources: [
        { name: "YouTube Creator", url: "https://www.youtube.com/creators/" },
        { name: "Video Editing", url: "https://www.adobe.com/products/premiere.html" }
      ]
    },
    {
      name: "Project Management",
      icon: "📊",
      color: "from-purple-500/20 to-indigo-500/20",
      description: "Planning and executing projects efficiently.",
      detailedHistory: "Managing multiple projects taught me planning, prioritization, and execution. From ideation to deployment, effective project management ensures success and timely delivery.",
      expertise: "Intermediate - 1+ year experience",
      useCases: ["Project Planning", "Task Management", "Timeline Tracking", "Resource Allocation"],
      projects: ["Website Development", "Tool Creation", "Content Planning"],
      resources: [
        { name: "PM Guide", url: "https://www.pmi.org" },
        { name: "Agile Methods", url: "https://www.atlassian.com/agile" }
      ]
    },
  ];

  const projects = [
    {
      id: 1,
      title: "NS finsight",
      description: "A comprehensive finance tracking application to monitor daily expenses, income, and financial goals. Features intuitive visualizations, budget planning, and expense categorization to help you understand your financial habits and build a better future.",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop",
      tech: ["React", "TypeScript", "Chart.js", "Tailwind CSS"],
      github: "https://github.com/nishant-app/ns-finsight",
      live: "https://www.nsfinsight.xyz",
      category: "fullstack",
      featured: true
    },
    {
      id: 2,
      title: "AI Pro Sales Agent",
      description: "An intelligent AI-powered sales agent platform that can be customized to sell any product. Features direct dashboard access, seamless integration with Telegram and WhatsApp, automated responses, lead management, and conversion tracking for enhanced sales performance.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
      tech: ["Next.js", "AI/ML", "Telegram API", "WhatsApp API", "TypeScript"],
      github: "https://github.com/nishant-app/ai-sales-agent",
      live: "https://ai-pro-sales-agent.vercel.app/",
      category: "fullstack",
      featured: true
    },
    {
      id: 3,
      title: "NS GAMMING Website",
      description: "A full-stack portfolio website with blog, games, tools, and AI chatbot integration. Built with React, TypeScript, and modern web technologies.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Gemini AI"],
      link: "https://nsgamming.xyz",
      icon: Globe,
      external: true
    },
    {
      id: 4,
      title: "Free Fire Stats Dashboard",
      description: "Advanced tools for Free Fire players including sensitivity calculator, name generator, and profile boosting bots.",
      tech: ["React", "TypeScript", "API Integration", "Responsive Design"],
      link: "/ff-bots",
      icon: Sparkles,
      external: false
    },
    {
      id: 5,
      title: "Gaming Content Hub",
      description: "A centralized platform for all my gaming content, including videos, streams, and articles. Stay updated with the latest in the gaming world and connect with a community of passionate gamers.",
      tech: ["React", "Content Management", "Video Integration", "Community Features"],
      link: "/gaming",
      icon: Youtube,
      external: false
    },
    {
      id: 6,
      title: "Interactive Web Games",
      description: "Collection of browser-based games including Snake, Tic-Tac-Toe, 2048, and more. Pure JavaScript game development.",
      tech: ["JavaScript", "Canvas API", "Game Logic", "Responsive UI"],
      link: "/games",
      icon: Code2,
      external: false
    }
  ];

  return (
    <div className="pt-16 overflow-hidden min-h-screen">
      <SEO
        title="Portfolio - Nishant Sarkar (Naboraj Sarkar) | Full Stack Developer & Content Creator"
        description="Explore the complete portfolio of Nishant Sarkar (Naboraj Sarkar), creator of NS GAMMING. Full Stack Developer, Gaming Content Creator, and Tech Enthusiast from Siliguri. View projects, skills in React, JavaScript, Python, journey, achievements, and investment portfolio."
        keywords="Nishant Sarkar portfolio, Naboraj Sarkar projects, NS GAMMING creator, full stack developer portfolio, React developer, JavaScript developer, Python programmer, gaming content creator, web developer Siliguri, tech portfolio India, investment portfolio, crypto assets, digital gold, stock market, developer journey"
        type="profile"
        author="Nishant Sarkar (Naboraj Sarkar)"
      />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12 md:py-20 relative z-10"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              Nishant Sarkar (NABORAJ)
            </h1>
            <div className="flex items-center justify-center gap-2 text-xl md:text-2xl text-muted-foreground">
              <Code2 className="w-6 h-6 text-primary animate-pulse" />
              <p>Full Stack Developer & Content Creator</p>
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg lg:text-xl text-foreground/80 max-w-3xl mx-auto mb-8 leading-relaxed px-4"
          >
            Passionate about building innovative web solutions, AI-powered applications, financial tools,
            and creating engaging gaming content. From full-stack development to content creation — every
            project is built with love, dedication, and cutting-edge technology! 💻🎮🚀
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <a
              href="https://github.com/ns-gamming"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => playSound('click')}
            >
              <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              GitHub Projects
            </a>
            <a
              href="https://youtube.com/@Nishant_sarkar"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => playSound('click')}
            >
              <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
              YouTube Channel
            </a>
            <Link
              href="/contact"
              className="group flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => playSound('click')}
            >
              <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* About Me / Biography Section */}
      <div className="container mx-auto px-4 sm:px-6 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-6 sm:p-8 mb-12 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 relative overflow-hidden group" 
            data-testid="biography-section"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient"></div>
            <div className="absolute inset-[2px] bg-background/95 dark:bg-background/95 rounded-2xl"></div>

            <div className="relative z-10">
              <motion.div 
                initial={{ x: -20 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-3 mb-4"
              >
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-spin-slow" />
                <h2 className="text-2xl sm:text-3xl font-bold text-primary animate-textShine">My Journey 🌟</h2>
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-spin-slow" />
              </motion.div>
              <div className="prose prose-lg text-foreground leading-relaxed space-y-4 sm:space-y-6">
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-sm sm:text-base"
                >
                  Siliguri ke ek ladke ki kahani hai ye — a small town dreamer with big ambitions! Growing up in West Bengal, I always believed code could change the world. 
                  Every late night spent learning PYTHON, every failed project that taught me something new, every small victory that pushed me forward — sab kuch iss empire ke liye hai.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-primary font-semibold animate-textShine text-sm sm:text-base"
                >
                  "My mission is to build my OWN EMPIRE, change the future, keep learning, and build things I love."
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-sm sm:text-base"
                >
                  From playing Free Fire with games to creating content, from learning my first programming language to building communities — 
                  har step mein I've tried to spread love and learning. Football keeps me grounded, coding keeps me excited, and my community keeps me motivated.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-sm sm:text-base"
                >
                  Chalo saath banayein kuch naya — let's build something amazing together! This website isn't just a portfolio, it's a testament to believing in dreams and working hard to achieve them. ❤️
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* AdSense Ad */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Suspense fallback={<div className="h-32 glass rounded-lg animate-pulse" />}>
              <AdSenseAd />
            </Suspense>
          </motion.div>

          {/* Timeline */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12" 
            data-testid="timeline-section"
          >
            <motion.h2 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold text-primary mb-8 text-center flex items-center justify-center gap-3"
            >
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 animate-wiggle" />
              Milestones 🎯
            </motion.h2>
            <div className="space-y-6 sm:space-y-8 relative">
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary animate-shimmer hidden sm:block"></div>

              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass rounded-lg p-4 sm:p-6 hover:scale-105 transition-all duration-500 hover:shadow-xl hover:shadow-primary/30 group relative overflow-hidden" 
                data-testid="milestone-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center text-black font-bold shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                      <Code className="w-4 h-4 sm:w-5 sm:h-5" />
                      First Lines of Code
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300">Started with PYTHON — the magic of creating something from nothing</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass rounded-lg p-4 sm:p-6 hover:scale-105 transition-all duration-500 hover:shadow-xl hover:shadow-accent/30 group relative overflow-hidden" 
                data-testid="milestone-2"
              >
                <div className="absolute inset-0 bg-gradient-to-l from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 animate-pulse flex-shrink-0" style={{ animationDelay: '0.2s' }}>2</div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-accent transition-colors duration-300 flex items-center gap-2">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                      YouTube Journey Begins
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300">NS GAMMING channel — sharing knowledge with gaming vibes</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="glass rounded-lg p-4 sm:p-6 hover:scale-105 transition-all duration-500 hover:shadow-xl hover:shadow-primary/30 group relative overflow-hidden" 
                data-testid="milestone-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center text-black font-bold shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse flex-shrink-0" style={{ animationDelay: '0.4s' }}>3</div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                      Community Building
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300">Growing a family of learners and creators</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Financial Achievements / Investment Portfolio */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 sm:p-8 mb-12 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 relative overflow-hidden group" 
            data-testid="financial-achievements"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-yellow-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient"></div>
            <div className="absolute inset-[2px] bg-background/95 dark:bg-background/95 rounded-2xl"></div>

            <div className="relative z-10">
              <motion.h2 
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl font-bold text-primary mb-6 flex items-center justify-center gap-3"
              >
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 animate-spin-slow" />
                Investment Portfolio 💰
              </motion.h2>
              <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 sm:p-6 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 hover:scale-105 group/card"
                >
                  <div className="text-3xl sm:text-4xl mb-3 group-hover/card:animate-bounce">💎</div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 text-yellow-600 dark:text-yellow-400">Cryptocurrency</h3>
                  <p className="text-xl sm:text-2xl font-bold mb-2 transition-all duration-500">
                    ${cryptoValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}+
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Diversified portfolio across Bitcoin, Ethereum, and promising altcoins</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl p-4 sm:p-6 border-2 border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 hover:scale-105 group/card"
                >
                  <div className="text-3xl sm:text-4xl mb-3 group-hover/card:animate-bounce">🪙</div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 text-amber-600 dark:text-amber-400">Digital Gold</h3>
                  <p className="text-xl sm:text-2xl font-bold mb-2 transition-all duration-500">
                    ₹{digitalGoldValue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}+
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Stable wealth preservation through digital precious metals</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 sm:p-6 border-2 border-green-500/30 hover:border-green-500/60 transition-all duration-300 hover:scale-105 group/card"
                >
                  <div className="text-3xl sm:text-4xl mb-3 group-hover/card:animate-bounce">📈</div>
                  <h3 className="font-bold text-lg sm:text-xl mb-2 text-green-600 dark:text-green-400">Stock Market</h3>
                  <p className="text-xl sm:text-2xl font-bold mb-2 transition-all duration-500">
                    ₹{stockValue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}+
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Growing equity portfolio with dividend-paying stocks</p>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20"
              >
                <p className="text-center text-sm sm:text-base text-foreground">
                  <span className="font-bold text-primary">Total Portfolio Value:</span> 
                  <span className="transition-all duration-500"> ${cryptoValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}+ USD + ₹{(digitalGoldValue + stockValue).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} INR</span> across crypto, digital gold, and stocks 🚀
                </p>
                <p className="text-center text-xs sm:text-sm text-muted-foreground mt-2">
                  Young investor building wealth through smart diversification and long-term strategy
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Values Cards */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-16" 
            data-testid="values-section"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass rounded-lg p-4 sm:p-6 text-center hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/30 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-rotateGlow"></div>
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-accent mb-4 mx-auto animate-heartbeat group-hover:scale-125 transition-transform duration-300 relative z-10" />
              <h3 className="font-bold text-base sm:text-lg text-foreground mb-2 relative z-10 group-hover:text-accent transition-colors duration-300">Passion</h3>
              <p className="text-sm sm:text-base text-muted-foreground relative z-10 group-hover:text-foreground transition-colors duration-300">Everything I do comes from the heart</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass rounded-lg p-4 sm:p-6 text-center hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-rotateGlow"></div>
              <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-primary mb-4 mx-auto animate-bounce group-hover:scale-125 transition-transform duration-300 relative z-10" />
              <h3 className="font-bold text-base sm:text-lg text-foreground mb-2 relative z-10 group-hover:text-primary transition-colors duration-300">Learning</h3>
              <p className="text-sm sm:text-base text-muted-foreground relative z-10 group-hover:text-foreground transition-colors duration-300">Never stop growing and improving</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass rounded-lg p-4 sm:p-6 text-center hover:scale-110 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/30 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-rotateGlow"></div>
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-secondary mb-4 mx-auto animate-wiggle group-hover:scale-125 transition-transform duration-300 relative z-10" />
              <h3 className="font-bold text-base sm:text-lg text-foreground mb-2 relative z-10 group-hover:text-secondary transition-colors duration-300">Community</h3>
              <p className="text-sm sm:text-base text-muted-foreground relative z-10 group-hover:text-foreground transition-colors duration-300">Building connections that matter</p>
            </motion.div>
          </motion.div>

          {/* AdSense Ad */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Suspense fallback={<div className="h-32 glass rounded-lg animate-pulse" />}>
              <AdSenseAd />
            </Suspense>
          </motion.div>

          {/* Skills Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16" 
            data-testid="skills-section"
          >
            <motion.h2 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold text-primary mb-8 text-center flex items-center justify-center gap-3"
            >
              <Code className="w-6 h-6 sm:w-8 sm:h-8 animate-spin-slow" />
              Skills & Expertise 💻
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {skillsData.map((skill, index) => (
                <motion.div 
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-2xl p-3 sm:p-4 md:p-6 hover:scale-110 transition-all duration-500 cursor-pointer group relative overflow-hidden"
                  data-testid={`skill-${skill.name.toLowerCase().replace(' ', '-')}`}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  onClick={() => { handleSkillClick(skill); playSound('click'); }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient`}></div>

                  {hoveredSkill === skill.name && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary/50 animate-ripple"></div>
                  )}

                  <div className="relative z-10">
                    <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 group-hover:scale-125 transition-transform duration-300 animate-bounce-slow">
                      {skill.icon}
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm md:text-lg text-foreground mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300 animate-textShine">
                      {skill.name}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm group-hover:text-foreground transition-colors duration-300 line-clamp-2">
                      {skill.description}
                    </p>
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-spin-slow" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Projects Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-12 relative z-10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary mb-8 md:mb-12 flex items-center justify-center gap-2 md:gap-3 px-4"
          >
            <Globe className="w-6 h-6 md:w-8 md:h-8 animate-spin-slow" />
            Featured Projects 🚀
          </motion.h2>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (project.id - 1) * 0.1 }}
                onHoverStart={() => playSound('hover')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="glass rounded-2xl overflow-hidden h-full flex flex-col group"
              >
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    {project.icon && (
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <project.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                      </div>
                    )}
                    <h3 className="text-lg md:text-xl font-bold text-foreground">{project.title}</h3>
                  </div>
                  <p className="text-sm md:text-base text-foreground/80 mb-4 leading-relaxed flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-2 py-1 md:px-3 bg-primary/20 text-primary rounded-full text-xs md:text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6 flex justify-end gap-3 bg-foreground/5">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 glass rounded-lg hover:bg-primary/20 transition-colors"
                      onClick={(e) => { e.stopPropagation(); playSound('click'); }}
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 glass rounded-lg hover:bg-primary/20 transition-colors"
                      onClick={(e) => { e.stopPropagation(); playSound('click'); }}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                  {project.link && (
                    project.external ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 glass rounded-lg hover:bg-primary/20 transition-colors"
                        onClick={(e) => { e.stopPropagation(); playSound('click'); }}
                      >
                        <project.icon className="h-5 w-5" />
                      </a>
                    ) : (
                      <Link
                        href={project.link}
                        className="p-2 glass rounded-lg hover:bg-primary/20 transition-colors"
                        onClick={(e) => { e.stopPropagation(); playSound('click'); }}
                      >
                        <project.icon className="h-5 w-5" />
                      </Link>
                    )
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* AdSense Ad */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8 relative z-10"
      >
        <Suspense fallback={<div className="h-32 glass rounded-lg animate-pulse" />}>
          <AdSenseAd />
        </Suspense>
      </motion.div>

      {/* Social Links */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-12 relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Let's Connect! 🤝
            </h2>
            <p className="text-lg text-foreground/80 mb-8">
              Follow me on social media and let's build something amazing together!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://github.com/ns-gamming"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full hover:scale-105 transition-all"
                onClick={() => playSound('click')}
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
              <a
                href="https://youtube.com/@Nishant_sarkar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:scale-105 transition-all"
                onClick={() => playSound('click')}
              >
                <Youtube className="w-5 h-5" />
                YouTube
              </a>
              <a
                href="https://linkedin.com/in/naboraj-sarkar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:scale-105 transition-all"
                onClick={() => playSound('click')}
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
              <a
                href="https://twitter.com/NSGAMMING699"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-full hover:scale-105 transition-all"
                onClick={() => playSound('click')}
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setSelectedSkill(null); playSound('click'); }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="glass rounded-2xl p-4 sm:p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => { setSelectedSkill(null); playSound('click'); }}
                className="absolute top-4 right-4 p-2 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl sm:text-5xl md:text-6xl">{selectedSkill.icon}</div>
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">{selectedSkill.name}</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">{selectedSkill.description}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-accent" />
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">My Journey</h3>
                  </div>
                  <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">{selectedSkill.detailedHistory}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-primary" />
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">Expertise Level</h3>
                  </div>
                  <p className="text-sm sm:text-base text-primary font-semibold">{selectedSkill.expertise}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-accent" />
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">Use Cases</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.useCases.map((useCase, idx) => (
                      <span key={idx} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs sm:text-sm">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">Projects Built</h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedSkill.projects.map((project, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm sm:text-base text-foreground/80">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        {project}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ExternalLink className="w-5 h-5 text-accent" />
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">Learning Resources</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {selectedSkill.resources.map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors text-xs sm:text-sm text-primary"
                        onClick={(e) => { e.stopPropagation(); playSound('click'); }}
                      >
                        {resource.name}
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => { scrollToTop(); playSound('click'); }}
            className="fixed bottom-8 right-8 p-4 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-all z-40"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Page Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-12 relative z-10"
      >
        <PageFeedback pageName="Portfolio" />
      </motion.div>
    </div>
  );
}
