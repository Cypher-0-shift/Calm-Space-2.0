# Overview

Calm Space is a mental wellness application designed to provide users with a personal sanctuary for emotional support and mental health management. The app features mood tracking, AI-powered chat support, music therapy, journaling, breathing exercises, creative activities, and relaxation tools. Built as a full-stack web application, it prioritizes user privacy by storing data locally while providing a comprehensive suite of mental health resources.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript, using functional components and hooks
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Local state with React hooks, localStorage for persistence, and React Context for mood theming
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming and mood-based color schemes
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with proxy routes for external services
- **Development**: Hot module replacement via Vite middleware integration
- **Deployment**: esbuild for production bundling with platform-specific optimizations

## Data Storage Solutions
- **Primary Storage**: Browser localStorage for user data privacy and offline functionality
- **Database Schema**: Drizzle ORM with PostgreSQL schema definitions for future server-side storage
- **Database Provider**: Configured for Neon serverless PostgreSQL (currently using in-memory storage)
- **Data Models**: Users, moods, journal entries, music playlists, and chat messages with proper relationships

## Authentication and Authorization
- **Current Implementation**: Local storage based user profiles without traditional authentication
- **Privacy-First Approach**: All user data remains on device by default
- **Future-Ready**: Database schema includes user management for potential server-side authentication

## External Service Integrations
- **AI Chat**: Groq API integration for conversational AI support with llama3-70b-8192 model
- **Music Service**: YouTube API integration for music search and streaming
- **API Proxy**: Server-side proxy routes to handle API keys securely and avoid CORS issues
- **Environment Configuration**: Support for multiple API key sources (process.env and VITE_ prefixed)

## Design Patterns and Architecture Decisions

### Component Architecture
- **Separation of Concerns**: UI components separated from business logic
- **Reusable Components**: Shared UI components in dedicated component library
- **Custom Hooks**: Encapsulated state logic for mood themes, localStorage, and toast notifications

### Data Flow
- **Unidirectional Data Flow**: Props down, callbacks up pattern
- **Local State Management**: Each feature manages its own state independently
- **Global State**: Minimal global state only for mood theming via React Context

### Privacy and Security
- **Local-First Approach**: All sensitive data stored in browser localStorage
- **API Key Security**: Server-side proxy to protect API credentials
- **No Tracking**: No external analytics or user tracking implemented

### Scalability Considerations
- **Modular Architecture**: Features are self-contained and can be easily extended
- **Database Ready**: Complete schema definitions for future server-side migration
- **Progressive Enhancement**: Works offline with localStorage, can scale to server storage

### Performance Optimizations
- **Code Splitting**: Vite handles automatic code splitting
- **Lazy Loading**: Components and assets loaded on demand
- **Optimized Builds**: Production builds optimized for size and performance