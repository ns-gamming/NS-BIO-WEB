# Overview

This is NS GAMING, a personal portfolio and gaming website for Nishant Sarkar (Naboraj Sarkar). The project is a modern, multi-page gaming-themed portfolio with neon blue aesthetics, animations, and interactive elements. It serves as both a professional showcase and entertainment platform, featuring personal information, social links, games, and AdSense integration for monetization.

The website presents Nishant's identity as a creator, developer, and gamer from Siliguri, West Bengal, India, with a mission to "build his own empire and change the future" through coding, gaming content creation, and community building.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18 with TypeScript running on Vite for fast development and optimized builds. The application uses a single-page application (SPA) architecture with client-side routing via Wouter.

**Styling**: Tailwind CSS with a custom gaming theme featuring neon blue colors, glassmorphism effects, and extensive animations. The design system is built around shadcn/ui components with heavy customization for the gaming aesthetic.

**Component Structure**: Modular component architecture with reusable UI components, page components, and utility hooks. Key components include:
- Navigation system with mobile responsiveness
- Particle background system for visual effects
- Hero sections with consistent branding
- Gaming-specific components (games, social links)
- AdSense integration component

**State Management**: Uses @tanstack/react-query for server state and local React state for UI interactions. No complex global state management due to the static nature of the content.

**Animation System**: Custom CSS animations combined with interactive JavaScript effects including particle systems, hover effects, and easter eggs triggered by user interactions.

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

**AdSense Integration**: Google AdSense with client ID `ca-pub-4779140243670658` for monetization, implemented with proper responsive design.

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

**Mobile-First Responsive Design**: Tailwind breakpoint system ensures functionality across all device types, critical for gaming audience reach.

**Future Scalability**: Architecture allows for easy expansion into user-generated content, gaming features, or community interactions without major refactoring.