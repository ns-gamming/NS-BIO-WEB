# NS GAMMING - Nishant Sarkar's Portfolio & Gaming Website

## Overview

NS GAMMING is a full-stack web application serving as a personal portfolio, gaming hub, Free Fire tools platform, and content creation showcase for Nishant Sarkar (Naboraj Sarkar). The site combines a professional developer portfolio with interactive games, Free Fire power tools (FF Bots), social media integration, and an AI-powered chatbot assistant. Built with modern web technologies, it showcases coding projects, gaming content, community engagement tools, and exclusive FF gaming utilities while maintaining a vibrant, gaming-inspired aesthetic with neon blue theming and natural Hinglish content throughout.

## User Preferences

Preferred communication style: Simple, everyday language with natural Hinglish phrases (especially for FF Bots section).

## Recent Changes (October 7, 2025)

**FF Bots Hub Implementation**
- Created comprehensive Free Fire tools platform with 4 bot pages
- Reordered navigation: FF Bots positioned after Portfolio, before Games
- Added eye-catching FF Bots promotional section on Home page with gradient animations
- Implemented stunning hub page with gradient cards, animations, and Hinglish content
- Created individual pages for each bot:
  - FF Likes Bot (Live): Fully functional with Supabase rate limiting
  - FF Info Bot (Coming Soon): Player stats lookup
  - FF Spam Bot (Coming Soon): Profile engagement boost
  - FF Visit Bot (Coming Soon): Profile visits and followers
- Enhanced Privacy Policy for Google AdSense approval with:
  - FF Bots data usage and IP tracking disclosure
  - Third-party services enumeration (Supabase, AdSense, Vercel Analytics)
  - Children's privacy compliance for Free Fire users (12+ age rating)
  - Updated timestamp: October 7, 2025
- Strategic ad placements on all FF Bots pages for monetization
- Full responsive design with maximum animations and micro-interactions
- Natural Hinglish integration: "Game badlo yaar!", "Sab kuch free hai boss!", etc.

## System Architecture

### Frontend Architecture

**Framework & UI Library**
- **React 18+ with TypeScript**: Component-based SPA architecture using functional components and hooks
- **Vite**: Modern build tool for fast development and optimized production builds
- **Wouter**: Lightweight client-side routing (chosen over React Router for smaller bundle size)
- **Tailwind CSS**: Utility-first styling with custom design tokens and CSS variables for theming
- **Shadcn/ui Components**: Radix UI primitives with custom styling for accessible, pre-built components

**Design System**
- **Theme System**: Dark/light mode toggle with CSS variables for dynamic theming
- **Primary Color**: Neon blue (hsl 193, 100%, 50%) as brand color, customizable via CSS variables
- **Typography**: Orbitron font for headers (gaming aesthetic), Inter for body text
- **Animation System**: Custom CSS animations including particles, neon glow effects, and smooth transitions
- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop

**State Management**
- **TanStack Query (React Query)**: Server state management and caching
- **Local Component State**: React hooks (useState, useEffect) for UI state
- **Context API**: Theme provider for global theme state

**Special Features**
- **Particle Background System**: Canvas-based animated background with cursor interaction
- **Easter Eggs**: Hidden interactive elements triggered by user actions
- **Time-based Greetings**: Dynamic welcome messages based on time of day with Hinglish phrases

### Backend Architecture

**Server Framework**
- **Express.js**: Node.js web framework for API routes and middleware
- **TypeScript**: Type-safe backend development
- **Vite SSR Integration**: Development server with HMR (Hot Module Replacement)

**API Structure**
- **RESTful API Pattern**: Routes prefixed with `/api`
- **Middleware Pipeline**: Request logging, JSON parsing, error handling
- **Storage Interface**: Abstract storage layer (currently in-memory, designed for database expansion)

**Session & Security**
- Headers configured for security (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- CORS and credential handling for API requests
- Prepared for session management with connect-pg-simple

### Data Architecture

**Database Schema** (PostgreSQL with Drizzle ORM)
- **Users Table**: Basic user authentication structure with id, username, password
- **Drizzle Kit**: Schema management and migrations in `./migrations` directory
- **Type Safety**: Drizzle-Zod integration for runtime validation matching database schema

**Current Storage**
- In-memory storage implementation (MemStorage class)
- Interface-based design allows easy swap to PostgreSQL/Neon database
- CRUD operations abstracted through IStorage interface

### Component Architecture

**Core Components**
- **Navigation**: Sticky header with logo, menu items, theme toggle
- **HeroSection**: Reusable page header with animated title and subtitle
- **GeminiChatbot**: Floating AI assistant with context awareness
- **ParticleBackground**: Interactive animated background
- **ScrollToTop**: Smooth scroll-to-top button with animations
- **TimeGreeting**: Dynamic time-based welcome messages

**Page Structure**
- Home: Landing page with profile card, FF Bots promo section, and CTAs
- About: Biography, skills showcase, values
- Portfolio: GitHub projects, YouTube content, tech stack
- FF Bots Hub: Central hub for Free Fire tools with stunning gradient cards
  - FF Likes Bot: Live tool for getting free FF likes (1 use/day per IP via Supabase)
  - FF Info Bot: Coming soon - Player stats and details lookup
  - FF Spam Bot: Coming soon - Profile visibility and engagement boost
  - FF Visit Bot: Coming soon - Profile visits and follower growth
- Games: 14+ playable browser games grid
- Social: Social media links and community stats
- Contact: Email contact form with validation
- Goals: Personal/professional objectives
- Coding/Content/Gaming/Community: Specialized content pages
- PrivacyPolicy: Legal compliance page with Google AdSense and FF Bots disclosures

**Game Components**
- 14 interactive games including: TicTacToe, Snake, Memory, Flappy Bird, 2048, Pong, Breakout, and more
- Each game as separate route with dedicated component
- Shared game UI patterns and controls

### Routing Strategy

**Client-Side Routing**
- Wouter for lightweight SPA routing
- Route definitions in App.tsx
- 404 handling with custom NotFound page
- Vercel configuration for SPA support (rewrites to index.html)

**SEO Optimization**
- Meta tags for social sharing (Open Graph, Twitter Cards)
- Canonical URLs and robots.txt
- Semantic HTML structure
- Dynamic page titles and descriptions

### Build & Deployment

**Development**
- `npm run dev`: Vite dev server with HMR
- TypeScript type checking with `npm run check`
- Hot reload for client and server code

**Production Build**
- Client: Vite builds to `dist/public`
- Server: esbuild bundles to `dist/index.js`
- ESM module format throughout
- Asset optimization and code splitting

**Hosting Configuration**
- Vercel-ready with vercel.json
- Static file serving for production
- Environment variable support (DATABASE_URL)
- Security headers configuration

## External Dependencies

### Third-Party Services

**AI Integration**
- **Google Gemini API**: Powers the chatbot assistant (gemini-2.0-flash-exp model)
- API Key: Hardcoded in GeminiChatbot component
- Context: Website information injected into prompts for accurate responses

**Advertising**
- **Google AdSense**: Monetization through display ads
- Publisher ID: ca-pub-4779140243670658
- AdSense component with auto-refresh logic

**Analytics & Fonts**
- **Google Fonts**: Orbitron and Inter font families
- **Font Awesome**: Icon library via CDN
- Google Analytics integration (mentioned in privacy policy)

### Database & Infrastructure

**Database**
- **Neon Serverless PostgreSQL**: Configured via @neondatabase/serverless
- Connection via DATABASE_URL environment variable
- Drizzle ORM for queries and migrations

**Deployment Platforms**
- **Vercel**: Primary hosting platform (based on configuration)
- Alternative: Netlify support mentioned in requirements
- Static asset hosting from attached_assets directory

### Key NPM Packages

**UI & Styling**
- @radix-ui/*: Accessible component primitives (30+ packages)
- tailwindcss: Utility CSS framework
- class-variance-authority: Component variant management
- embla-carousel-react: Carousel functionality

**Data & Forms**
- @tanstack/react-query: Server state management
- @hookform/resolvers: Form validation
- drizzle-orm & drizzle-zod: Database ORM and validation
- zod: Schema validation

**Development**
- vite: Build tool and dev server
- typescript: Type safety
- tsx: TypeScript execution
- @replit/vite-plugin-*: Replit-specific development tools

**Date & Time**
- date-fns: Date manipulation and formatting for time-based greetings

### Social Media Integrations

**Platforms**
- YouTube: @Nishant_sarkar
- Instagram: @nishant_sarkar__10k
- Telegram: Channel and VIP group
- Discord, Reddit, LinkedIn, X (Twitter), Facebook
- WhatsApp business contact
- GitHub: ns-gamming

**Contact Methods**
- Email: nishant.ns.business@gmail.com (mailto links)
- WhatsApp click-to-chat integration
- Social media direct links with react-icons/si library