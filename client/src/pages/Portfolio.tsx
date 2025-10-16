
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Github, Youtube, ExternalLink, Code2, Sparkles, X, Calendar, Users, Globe, ArrowUp, Mail, Linkedin, Twitter } from "lucide-react";
import { SiHtml5, SiCss3, SiJavascript, SiReact, SiPython, SiCplusplus, SiNodedotjs, SiTypescript, SiTailwindcss, SiGit } from "react-icons/si";
import { FaJava } from "react-icons/fa";
import AdSenseAd from "../components/AdSenseAd";
import { SEO } from "../components/SEO";
import { useTheme } from "../components/ThemeProvider";

interface SkillData {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  history: string;
  uses: string[];
  frameworks: string[];
}

const skillsData: SkillData[] = [
  {
    name: "HTML5",
    icon: SiHtml5,
    color: "text-orange-500",
    description: "HyperText Markup Language is the standard markup language for creating web pages and web applications.",
    history: "HTML was created by Tim Berners-Lee in 1991. HTML5, released in 2014, brought semantic elements, multimedia support, and improved APIs for modern web development.",
    uses: ["Web page structure", "Semantic markup", "Accessibility", "SEO optimization", "Progressive Web Apps"],
    frameworks: ["Web Components", "AMP (Accelerated Mobile Pages)", "Semantic UI", "HTML Email Templates"]
  },
  {
    name: "CSS3",
    icon: SiCss3,
    color: "text-blue-500",
    description: "Cascading Style Sheets is used for styling and layout of web pages, making them visually appealing and responsive.",
    history: "CSS was first proposed in 1994. CSS3, introduced in 1999 and continuously evolved, added animations, flexbox, grid, and advanced selectors.",
    uses: ["Styling web pages", "Responsive design", "Animations", "Layout systems", "Custom themes"],
    frameworks: ["Tailwind CSS", "Bootstrap", "Sass/SCSS", "Material-UI", "Styled Components"]
  },
  {
    name: "JavaScript",
    icon: SiJavascript,
    color: "text-yellow-500",
    description: "A versatile programming language that enables interactive web pages and is an essential part of web applications.",
    history: "Created by Brendan Eich in 1995 in just 10 days. Modern JavaScript (ES6+) introduced classes, modules, arrow functions, and async/await.",
    uses: ["Interactive websites", "Web applications", "Game development", "Server-side programming", "Mobile apps"],
    frameworks: ["React", "Vue.js", "Angular", "Node.js", "Next.js", "Express.js"]
  },
  {
    name: "TypeScript",
    icon: SiTypescript,
    color: "text-blue-600",
    description: "A strongly typed programming language that builds on JavaScript, adding static type definitions for better code quality.",
    history: "Developed by Microsoft and released in 2012. TypeScript provides type safety and modern features for large-scale applications.",
    uses: ["Enterprise applications", "Type-safe development", "Better IDE support", "Large codebases", "Team collaboration"],
    frameworks: ["Angular", "NestJS", "TypeORM", "Prisma", "tRPC"]
  },
  {
    name: "React",
    icon: SiReact,
    color: "text-cyan-400",
    description: "A JavaScript library for building user interfaces with reusable components and efficient rendering.",
    history: "Created by Facebook in 2013. React revolutionized UI development with virtual DOM, component-based architecture, and hooks (2019).",
    uses: ["Single Page Applications", "Progressive Web Apps", "Mobile apps (React Native)", "Dashboard UIs", "E-commerce sites"],
    frameworks: ["Next.js", "Gatsby", "Remix", "React Native", "Redux", "React Router"]
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "text-teal-400",
    description: "A utility-first CSS framework for rapidly building custom user interfaces with pre-built classes.",
    history: "Created by Adam Wathan in 2017. Tailwind CSS has become one of the most popular CSS frameworks for modern web development.",
    uses: ["Rapid UI development", "Custom designs", "Responsive layouts", "Component libraries", "Design systems"],
    frameworks: ["Headless UI", "daisyUI", "Flowbite", "Shadcn/ui", "Tailwind UI"]
  },
  {
    name: "Python",
    icon: SiPython,
    color: "text-blue-600",
    description: "A high-level, interpreted programming language known for its simplicity and versatility in various domains.",
    history: "Created by Guido van Rossum in 1991. Python has become one of the most popular languages for AI, data science, and automation.",
    uses: ["Data Science", "Machine Learning", "Web development", "Automation", "Scientific computing"],
    frameworks: ["Django", "Flask", "FastAPI", "TensorFlow", "PyTorch", "Pandas"]
  },
  {
    name: "Java",
    icon: FaJava,
    color: "text-red-500",
    description: "A robust, object-oriented programming language designed for portability and used in enterprise applications.",
    history: "Developed by Sun Microsystems in 1995. Java's 'Write Once, Run Anywhere' philosophy made it popular for cross-platform development.",
    uses: ["Enterprise applications", "Android development", "Web servers", "Big Data", "Cloud computing"],
    frameworks: ["Spring Boot", "Hibernate", "Apache Struts", "JavaFX", "Apache Kafka"]
  },
  {
    name: "C++",
    icon: SiCplusplus,
    color: "text-blue-700",
    description: "A powerful, high-performance programming language used for system programming and game development.",
    history: "Created by Bjarne Stroustrup in 1985 as an extension of C. C++ combines low-level control with high-level abstractions.",
    uses: ["Game engines", "Operating systems", "Embedded systems", "High-performance computing", "Graphics applications"],
    frameworks: ["Qt", "Unreal Engine", "Boost", "OpenCV", "STL"]
  },
  {
    name: "Node.js",
    icon: SiNodedotjs,
    color: "text-green-500",
    description: "A JavaScript runtime built on Chrome's V8 engine for building scalable server-side applications.",
    history: "Created by Ryan Dahl in 2009. Node.js enabled JavaScript to run on servers, revolutionizing full-stack development.",
    uses: ["Backend APIs", "Real-time applications", "Microservices", "CLI tools", "IoT applications"],
    frameworks: ["Express.js", "NestJS", "Fastify", "Koa", "Socket.io"]
  },
  {
    name: "Git",
    icon: SiGit,
    color: "text-orange-600",
    description: "A distributed version control system for tracking changes in source code during software development.",
    history: "Created by Linus Torvalds in 2005. Git has become the standard for version control in modern software development.",
    uses: ["Version control", "Team collaboration", "Code review", "CI/CD pipelines", "Open source contribution"],
    frameworks: ["GitHub", "GitLab", "Bitbucket", "GitHub Actions", "Git Flow"]
  }
];

const projects = [
  {
    title: "NS GAMMING Website",
    description: "A full-stack portfolio website with blog, games, tools, and AI chatbot integration. Built with React, TypeScript, and modern web technologies.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Gemini AI"],
    link: "https://nsgamming.xyz",
    icon: Globe
  },
  {
    title: "Free Fire Tools Hub",
    description: "Advanced tools for Free Fire players including sensitivity calculator, name generator, and profile boosting bots.",
    tech: ["React", "TypeScript", "API Integration", "Responsive Design"],
    link: "/ff-bots",
    icon: Sparkles
  },
  {
    title: "Interactive Gaming Portal",
    description: "Collection of browser-based games including Snake, Tic-Tac-Toe, 2048, and more. Pure JavaScript game development.",
    tech: ["JavaScript", "Canvas API", "Game Logic", "Responsive UI"],
    link: "/games",
    icon: Code2
  }
];

export default function Portfolio() {
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { theme } = useTheme();

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show scroll button after scrolling
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setShowScrollTop(window.scrollY > 300);
    });
  }

  return (
    <>
      <SEO
        title="Portfolio - Nishant Sarkar | Full Stack Developer & Content Creator"
        description="Explore the portfolio of Nishant Sarkar (NS GAMMING) - Full Stack Developer, Gaming Content Creator, and Tech Enthusiast from Siliguri. View projects, skills in React, JavaScript, Python, and more."
        keywords="Nishant Sarkar portfolio, NS GAMMING developer, full stack developer portfolio, React developer, JavaScript developer, Python programmer, gaming content creator, web developer Siliguri, Naboraj Sarkar projects, tech portfolio India"
        type="profile"
        author="Nishant Sarkar (Naboraj Sarkar)"
      />

      <div className="pt-16 min-h-screen">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-12 md:py-20"
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Nishant Sarkar
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
              className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Passionate about building innovative web solutions, creating engaging gaming content, 
              and sharing knowledge with the community. From coding to content creation — every project 
              is built with love and dedication! 💻🎮
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
              >
                <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                GitHub Projects
              </a>
              <a 
                href="https://youtube.com/@Nishant_sarkar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                YouTube Channel
              </a>
              <Link 
                href="/contact"
                className="group flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Get in Touch
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* About Me Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 py-12"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 flex items-center gap-3">
                <Users className="w-8 h-8" />
                About Me
              </h2>
              <div className="space-y-4 text-foreground/90 leading-relaxed">
                <p className="text-lg">
                  Hi! I'm <span className="text-primary font-semibold">Nishant Sarkar</span> (also known as <span className="text-primary font-semibold">Naboraj Sarkar</span>), 
                  a passionate developer and content creator from Siliguri, West Bengal. I love building things that make a difference!
                </p>
                <p>
                  My journey started with gaming and evolved into coding, web development, and content creation. 
                  I believe in learning by doing, sharing knowledge openly, and building communities that support each other's growth.
                </p>
                <p>
                  Whether it's developing full-stack applications, creating gaming content, or helping others learn to code — 
                  I pour my heart into everything I do. My mission is to build my own empire while helping others achieve their dreams! 🚀
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 py-12"
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center text-primary mb-12 flex items-center justify-center gap-3"
            >
              <Code2 className="w-8 h-8 animate-pulse" />
              Technical Skills
              <Sparkles className="w-8 h-8 animate-pulse" />
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {skillsData.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedSkill(skill)}
                  className="glass rounded-2xl p-6 cursor-pointer group hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
                >
                  <div className={`${skill.color} mb-4 flex justify-center`}>
                    <skill.icon className="w-12 h-12 md:w-16 md:h-16 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-center font-semibold text-foreground group-hover:text-primary transition-colors">
                    {skill.name}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 py-12"
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center text-primary mb-12 flex items-center justify-center gap-3"
            >
              <Globe className="w-8 h-8 animate-spin-slow" />
              Featured Projects
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <project.icon className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                  </div>
                  <p className="text-foreground/80 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target={project.link.startsWith('http') ? "_blank" : undefined}
                    rel={project.link.startsWith('http') ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all"
                  >
                    View Project
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Social Links */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 py-12"
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
                  href="https://github.com/ns-gamming69" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full hover:scale-105 transition-all"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
                <a 
                  href="https://youtube.com/@Nishant_sarkar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:scale-105 transition-all"
                >
                  <Youtube className="w-5 h-5" />
                  YouTube
                </a>
                <a 
                  href="https://linkedin.com/in/naboraj-sarkar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:scale-105 transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
                <a 
                  href="https://twitter.com/NSGAMMING699" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-full hover:scale-105 transition-all"
                >
                  <Twitter className="w-5 h-5" />
                  Twitter
                </a>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* AdSense */}
        <div className="container mx-auto px-4 py-8">
          <AdSenseAd />
        </div>

        {/* Skill Detail Modal */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSkill(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border-2 border-primary/20 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <selectedSkill.icon className={`w-12 h-12 md:w-16 md:h-16 ${selectedSkill.color}`} />
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">{selectedSkill.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Description</h4>
                    <p className="text-foreground/80 leading-relaxed">{selectedSkill.description}</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      History & Development
                    </h4>
                    <p className="text-foreground/80 leading-relaxed">{selectedSkill.history}</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Modern Use Cases</h4>
                    <ul className="space-y-2">
                      {selectedSkill.uses.map((use) => (
                        <li key={use} className="flex items-center gap-2 text-foreground/80">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-primary mb-2">Related Frameworks & Libraries</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkill.frameworks.map((framework) => (
                        <span key={framework} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                          {framework}
                        </span>
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
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 p-4 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-all z-40"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
