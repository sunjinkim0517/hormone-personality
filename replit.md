# Personality Test Application

## Overview

This is a full-stack personality test application that determines whether users have an "estrogen" or "testosterone" personality type based on their responses to a series of questions. The application is built with a React frontend and Express backend, using PostgreSQL for data storage and Drizzle ORM for database management.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints for test questions and results
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Validation**: Zod for request/response validation
- **Session Management**: Session-based tracking for test completion

### Database Schema
- **users**: User authentication (id, username, password)
- **test_questions**: Test questions with multiple choice options (id, text, options, order)
- **test_results**: Test completion results (id, sessionId, answers, scores, resultType, completedAt)

## Key Components

### Test Flow Components
1. **WelcomeScreen**: Introduction and test start
2. **TestScreen**: Question presentation and answer collection
3. **ResultsScreen**: Score display and result interpretation

### Scoring System
- Each question option has estrogen and testosterone scores
- Final scores are calculated by summing option scores
- Result types: strong_estrogen, moderate_estrogen, balanced, moderate_testosterone, strong_testosterone

### Storage Layer
- **MemStorage**: In-memory storage implementation for development
- **IStorage Interface**: Abstraction for different storage backends
- Pre-loaded test questions with Korean language content

## Data Flow

1. User starts test → Frontend fetches questions from `/api/questions`
2. User answers questions → Answers stored in local state with localStorage backup
3. Test completion → Answers sent to `/api/submit-test`
4. Backend calculates scores → Returns result type and percentages
5. Results displayed → Option to retake or share results

## External Dependencies

### Core Framework Dependencies
- React 18 with TypeScript support
- Express.js for backend API
- Drizzle ORM with PostgreSQL dialect
- Neon Database for serverless PostgreSQL

### UI/UX Dependencies
- Shadcn/ui component library
- Radix UI primitives for accessibility
- Tailwind CSS for styling
- Lucide React for icons

### Development Dependencies
- Vite for build tooling and dev server
- ESBuild for production builds
- PostCSS with Autoprefixer

## Deployment Strategy

### Build Process
- **Development**: `npm run dev` - Runs TSX server with Vite dev server
- **Production Build**: `npm run build` - Vite build + ESBuild server bundle
- **Production Start**: `npm run start` - Runs bundled server

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable
- **Deployment Target**: Autoscale deployment on Replit
- **Port Configuration**: Internal port 5000, external port 80

### Database Management
- **Schema Push**: `npm run db:push` for schema updates
- **Migrations**: Generated in `./migrations` directory
- **Connection**: Serverless PostgreSQL via Neon Database

## Changelog

Changelog:
- June 15, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.