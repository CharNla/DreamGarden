# DreamGarden - Sleep & Plant Growth App

## Overview

DreamGarden is a mobile-first sleep tracking application that gamifies healthy sleep habits by growing virtual plants based on sleep quality and consistency. The app combines alarm functionality, sleep journaling, and plant care mechanics to encourage better sleep hygiene through engaging interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Animations**: Framer Motion for smooth UI transitions
- **Mobile-First Design**: Responsive design optimized for mobile devices

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Neon Database for serverless deployment
- **ORM**: Drizzle ORM for type-safe database operations
- **API**: RESTful API endpoints for CRUD operations
- **Development**: Hot module replacement with Vite integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon Database
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Storage**: In-memory storage implementation for demo purposes
- **Session Management**: PostgreSQL session store with connect-pg-simple

## Key Components

### Database Schema
- **Users Table**: User profiles with virtual currency (dewdrops, sunlight)
- **Alarms Table**: Configurable wake-up alarms with weekly scheduling
- **Sleep Records Table**: Daily sleep ratings and journal entries
- **Chat Messages Table**: AI companion interaction history

### Core Features
1. **Onboarding Flow**: Multi-screen introduction to app concepts
2. **Alarm Management**: Time picker with day-of-week selection
3. **Wake-Up Interaction**: Plant watering animation and dismissal
4. **Sleep Rating**: 5-star rating system with optional journaling
5. **Virtual Garden**: Plant visualization based on sleep patterns
6. **Chat System**: AI companion for sleep advice and motivation
7. **Sleep Diary**: Calendar view of sleep history and statistics

### Plant Growth System
- **Health States**: excellent, good, fair, poor, critical
- **Growth Metrics**: 0-100% based on sleep consistency and quality
- **Reward System**: Dewdrops and sunlight currency earned through good sleep

## Data Flow

1. **User sets alarm** → Stored in database with weekly schedule
2. **Alarm triggers** → Wake-up screen with plant watering interaction
3. **User rates sleep** → Creates sleep record with rating and optional journal
4. **System calculates rewards** → Updates user currency based on sleep quality
5. **Plant state updates** → Reflects recent sleep patterns and consistency
6. **Statistics generate** → Aggregates data for diary and progress tracking

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL client
- **drizzle-orm & drizzle-kit**: Database ORM and migration tools
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library
- **wouter**: Lightweight routing
- **@radix-ui/***: Accessible UI primitives

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundling for production
- **PostCSS & Autoprefixer**: CSS processing
- **Replit-specific tools**: Development environment integration

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with Express API
- **Hot Reloading**: Automatic updates during development
- **Error Handling**: Runtime error overlays for debugging

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: ESBuild bundles Express server for Node.js deployment
- **Database**: Drizzle migrations ensure schema consistency
- **Environment**: Production environment variables for database connection

### Key Architectural Decisions

1. **Monorepo Structure**: Shared types and schema between client/server
2. **Mobile-First Design**: Optimized for mobile user experience
3. **Serverless Database**: Neon Database for scalable PostgreSQL hosting
4. **Type Safety**: End-to-end TypeScript with shared schema validation
5. **Component Library**: shadcn/ui for consistent, accessible UI components
6. **Animation Framework**: Framer Motion for engaging user interactions
7. **Lightweight Dependencies**: Wouter instead of React Router for smaller bundle size

The application prioritizes user engagement through gamification while maintaining simplicity in the sleep tracking process. The plant metaphor creates an emotional connection that encourages consistent sleep habits through positive reinforcement.