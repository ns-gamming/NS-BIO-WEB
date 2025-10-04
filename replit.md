# Overview

This is NS GAMING, a personal portfolio and gaming website for Nishant Sarkar (Naboraj Sarkar). The project is a modern, multi-page gaming-themed portfolio with neon blue aesthetics, animations, and interactive elements. It serves as both a professional showcase and entertainment platform, featuring personal information, social links, games, AdSense integration for monetization, and an AI chatbot assistant.

The website presents Nishant's identity as a creator, developer, and gamer from Siliguri, West Bengal, India. His first programming language was Python, and his mission is to "build his own empire and change the future" through coding, gaming content creation, and community building.

## Recent Updates (January 2025)

**Theme Switching**: Fully functional light/dark theme toggle with smooth transitions throughout the site. Users can switch between professional light mode and gaming dark mode.

**AI Chatbot Integration**: Gemini AI-powered chatbot that provides contextual information about Nishant and the website, with conversation memory and human-like responses.

**Mobile Optimization**: Complete mobile responsiveness with touch controls for all games (directional buttons for Snake, tap controls for Flappy), optimized particle effects for mobile performance, and responsive ad placement.

**Enhanced Animations**: Added shimmer, bounce, bounceIn, and scaleIn animations for a more modern and smooth user experience across all devices.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18 with TypeScript running on Vite for fast development and optimized builds. The application uses a single-page application (SPA) architecture with client-side routing via Wouter.

**Styling**: Tailwind CSS with a custom gaming theme featuring neon blue colors, glassmorphism effects, and extensive animations. The design system is built around shadcn/ui components with heavy customization for the gaming aesthetic.

**Component Structure**: Modular component architecture with reusable UI components, page components, and utility hooks. Key components include:
- Navigation system with mobile responsiveness and theme toggle
- Particle background system for visual effects (optimized for mobile with reduced particle count)
- Hero sections with consistent branding
- Gaming-specific components (games with mobile touch controls, social links)
- AdSense integration component (fully responsive)
- Gemini AI chatbot with floating UI (frontend-only implementation)
- Theme provider for light/dark mode switching

**State Management**: Uses @tanstack/react-query for server state and local React state for UI interactions. No complex global state management due to the static nature of the content.

**Animation System**: Extensive custom CSS animations including pulse-neon, float, glow, particle, typewriter, fadeUp, slideLeft, confetti, shimmer, bounce, bounceIn, and scaleIn. Combined with interactive JavaScript effects including particle systems, hover effects, and easter eggs triggered by user interactions. All animations are optimized for smooth performance across devices.

## Backend Architecture

**Server**: Express.js server with minimal API surface - currently set up for potential future expansion but primarily serving static content during development.

**Build System**: Dual build process where Vite handles frontend assets and esbuild handles server bundling for production deployment.

**Storage**: Currently uses in-memory storage with interfaces designed for future database integration. Includes user schema definitions ready for authentication features.

## Data Storage Solutions

**Database Setup**: Drizzle ORM configured for PostgreSQL with migration support. Schema includes user table with authentication fields (username/password) prepared for future user features.

**Current Storage**: Memory-based storage implementation for development, easily replaceable with database connectivity.

**Session Management**: Infrastructure in place for session handling with connect-pg-simple for PostgreSQL session storage when needed.

## Authentication and Authorization

**Prepared Infrastructure**: User schema and storage interfaces ready for authentication implementation, but currently not active since the site functions as a static portfolio.

**Future-Ready**: JWT or session-based authentication can be easily integrated using existing storage interfaces.

# External Dependencies

## Third-Party Services

**AdSense Integration**: Google AdSense with client ID `ca-pub-4779140243670658` for monetization, implemented with full responsive design and mobile optimization (1 ad per page, neatly placed).

**Gemini AI API**: Google Gemini Pro API integration for chatbot functionality (frontend-only implementation with API key: AIzaSyC3O2uXTOmbDd1UJNplZR4Hp5rZduJH66k). The chatbot provides contextual information about Nishant and the website with short-term conversation memory.

**Font Services**: Google Fonts integration for Orbitron (gaming aesthetic) and Inter (readability).

**Social Platform Links**: Direct integration with YouTube, Instagram, Telegram, Discord, and Reddit through external links.

## Development Services

**Replit Platform**: Configured for Replit deployment with specific vite plugins and banner integration for the development environment.

**Database Service**: Neon Database serverless PostgreSQL configured but not currently active.

## UI and Styling Dependencies

**Component Library**: shadcn/ui providing accessible, customizable components built on Radix UI primitives.

**Icons**: Lucide React for general icons and react-icons for brand-specific social media icons.

**Animation Libraries**: CSS-based animations with potential for framer-motion integration for complex interactions.

## Build and Development Tools

**Vite**: Primary build tool with React plugin and development server.

**TypeScript**: Full TypeScript implementation for type safety.

**Tailwind CSS**: Utility-first CSS framework with custom gaming theme configuration.

**ESBuild**: Server-side bundling for production builds.

## Notable Architectural Decisions

**Static-First Approach**: Despite having backend infrastructure, the site operates primarily as a static site with all content visible in the codebase, meeting the requirement for transparency.

**Gaming Aesthetic Priority**: All technical decisions prioritize the gaming theme, including particle effects, neon styling, and interactive elements that may impact performance but enhance user experience.

**Mobile-First Responsive Design**: Fully responsive across all devices with mobile-optimized touch controls for games (directional buttons for Snake, tap button for Flappy), responsive chatbot UI, adaptive particle effects (20 particles on mobile vs 50 on desktop), and flexible ad placement. Tailwind breakpoint system ensures seamless functionality across mobile, tablet, and desktop.

**Future Scalability**: Architecture allows for easy expansion into user-generated content, gaming features, or community interactions without major refactoring.

**Theme System**: Comprehensive light/dark theme implementation with localStorage persistence, smooth transitions, and full support across all components. Theme toggle available in navigation on both mobile and desktop.

**AI-First Approach**: Frontend-only Gemini AI chatbot integration demonstrates modern AI capabilities while maintaining simple architecture. Chatbot is contextually aware of site content and provides helpful, human-like responses.