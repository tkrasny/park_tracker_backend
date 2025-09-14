# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run start:dev` - Start development server with watch mode
- `npm run start:debug` - Start with debug mode and watch
- `npm run build` - Build the application
- `npm run start:prod` - Start production build

### Database
- `npm run migration:create -- src/migrations/MigrationName` - Create new migration
- `npm run migration:generate -- src/migrations/MigrationName` - Generate migration from entity changes
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration

### Testing & Quality
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Run ESLint and fix issues
- `npm run format` - Format code with Prettier

## Architecture

### Core Structure
This is a NestJS backend for a National Parks Tracker application with PostgreSQL database and Auth0 authentication.

**Main modules:**
- `ParksModule` - National park data management
- `UsersModule` - User profile and management
- `VisitsModule` - Park visit tracking
- `TrailsModule` - Trail information and tracking
- `PhotosModule` - Photo management for visits/trails
- `AuthModule` - Auth0 JWT authentication

### Database Configuration
- Uses TypeORM with PostgreSQL
- Development: Local PostgreSQL on port 5434
- Production: AWS RDS with SSL
- Database configuration in `src/config/typeorm.config.ts`
- Migrations in `src/migrations/`

### Authentication
- Auth0 JWT-based authentication
- Configuration in `src/common/auth/auth0.config.ts`
- Protected routes use Auth0 guards

### Entity Structure
All entities extend a base entity with:
- `id` (UUID primary key)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

Key relationships:
- Users have many Visits and Photos
- Parks have many Visits and Trails
- Trails belong to Parks and have many Photos
- Visits belong to Users and Parks

### Environment Variables
**Development:**
- `DB_HOST` (default: localhost)
- `DB_PORT` (default: 5434)
- `DB_USERNAME` (default: postgres)
- `DB_PASSWORD` (default: postgres)
- `DB_DATABASE` (default: park_tracker)

**Production:**
- `DATABASE_URL` or separate RDS variables
- `NODE_ENV=production`

**Auth0:**
- `AUTH0_DOMAIN`
- `AUTH0_AUDIENCE`

### Deployment
- Uses Fly.io for deployment (see `fly.toml`)
- Multi-stage Docker build optimized for production
- Exposes port 8080