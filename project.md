# National Parks Tracker - Project Overview

## Project Summary
A personal web application to visually track and showcase national parks visited and hikes completed. The project is primarily focused on creating a visually impressive frontend for portfolio/interview purposes while improving React skills.

## Technology Stack
- **Frontend**: React with TypeScript
- **Backend**: NestJS
- **Database**: PostgreSQL (AWS RDS)
- **Authentication**: Auth0
- **Development Approach**: Using Cursor AI for code implementation, with external AI assistance for project planning
- **Styling**: 
  - Material-UI (MUI) for base components and layout structure
  - styled-components for custom components and unique styling needs
  - Google Fonts (Outfit) for modern typography
- **Map Library**: Mapbox GL JS (implemented)
- **Deployment**: GitHub Pages (frontend), AWS (backend)

## Current Progress
### Completed Features
1. **Interactive Map Interface** (Priority 1)
   - ✅ Mapbox GL JS integration
   - ✅ Custom map controls (zoom, style switcher)
   - ✅ Park markers with hover interactions
   - ✅ Modern, clean UI with glass-morphism effects
   - ✅ Responsive layout with overlay navigation
   - ✅ Satellite map view as default
   - ✅ Custom marker styling and popups
   - ✅ Basic park data integration
   - ✅ Parks List view implementation
   - ✅ GitHub Pages deployment

2. **UI/UX Improvements**
   - ✅ Modern navigation system with overlay design
   - ✅ Clean typography using Outfit font
   - ✅ Responsive design considerations
   - ✅ Smooth transitions and hover effects
   - ✅ Consistent styling across components

3. **Authentication & User Management**
   - ✅ Auth0 integration
   - ✅ Login/logout functionality
   - ✅ Protected routes
   - ✅ User session handling
   - ✅ Logout button with proper redirect

4. **API Architecture**
   - ✅ React Query integration
   - ✅ Type-safe API client
   - ✅ Error handling system
   - ✅ DTO type definitions
   - ✅ API response types

### In Progress
1. **User Profile Management**
   - 🔄 User profile UI components
   - 🔄 Profile data persistence
   - 🔄 User preferences storages
   - 🔄 Profile picture support

2. **Backend Infrastructure**
   - 🔄 AWS RDS PostgreSQL setup
   - 🔄 Database schema design
   - 🔄 API endpoints for park visit tracking
   - 🔄 User data persistence
   - 🔄 Trail tracking system
   - 🔄 Photo management system

3. **Map Features**
   - 🔄 Visit status tracking
   - 🔄 Custom marker states for visited/unvisited parks
   - 🔄 Interactive visit marking from map view
   - 🔄 Trail path visualization
   - 🔄 Photo location markers

## Next Steps
1. **User Profile Implementation**
   - Create user profile page
   - Add profile picture support
   - Implement user preferences
   - Add visit history tracking
   - Add trail completion tracking

2. **Database Implementation**
   - Set up AWS RDS PostgreSQL instance
   - Design and implement database schema
   - Create user and park visit tables
   - Add trail and photo tables
   - Set up database migrations
   - Implement data access layer

3. **Backend Development**
   - Set up NestJS project structure
   - Implement user authentication middleware
   - Create park visit tracking endpoints
   - Add trail management endpoints
   - Add photo management endpoints
   - Add data validation and error handling
   - Set up CORS and security configurations

4. **Frontend Enhancements**
   - Add visit marking functionality
   - Add visit status indicators on map
   - Add visit history tracking
   - Implement user preferences UI
   - Add trail tracking interface
   - Add photo upload and management
   - Implement weather data integration

## Data Types
### Base DTO
```typescript
interface BaseDto {
  id: string;          // UUID
  createdAt: Date;     // Creation timestamp
  updatedAt: Date;     // Last update timestamp
}
```

### User DTOs
```typescript
interface CreateUserDto {
  username: string;    // 3-30 chars
  displayName?: string; // 2-50 chars, optional
}

interface UserDto extends BaseDto {
  username: string;
  displayName?: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  isAdmin: boolean;
}
```

### Park DTOs
```typescript
interface CreateParkDto {
  name: string;        // Full name of the national park
  code: string;        // National Park Service code
  location?: Point;    // GeoJSON Point
  description?: string;
  state?: string;
  region?: string;
  imageUrl?: string;
  websiteUrl?: string;
}

interface ParkDto extends BaseDto {
  name: string;
  state: string;
  establishedYear?: number;
  area?: number;
  annualVisitors?: number;
  description?: string;
}
```

### Trail DTOs
```typescript
interface CreateTrailDto {
  name: string;
  length?: number;     // in miles
  difficulty?: 'Easy' | 'Moderate' | 'Difficult' | 'Strenuous';
  elevationGain?: number; // in feet
  trailPath?: any;     // GeoJSON LineString
  parkId: string;      // UUID
}
```

### Visit DTOs
```typescript
interface CreateVisitDto {
  visitDate: Date;
  notes?: string;
  weatherData?: any;   // Custom weather data object
  parkId: string;      // UUID
}

interface VisitDto extends BaseDto {
  visitDate: Date;
  notes?: string;
  weatherData?: any;
  parkId: string;
  userId: string;
}
```

### Photo DTOs
```typescript
interface CreatePhotoDto {
  url: string;         // URL to stored photo
  caption?: string;
  dateTaken?: Date;
  location?: Point;    // GeoJSON Point
  visitId?: string;    // UUID
  hikeRecordId?: string; // UUID
}

interface PhotoDto extends BaseDto {
  url: string;
  caption?: string;
  dateTaken?: Date;
  location?: Point;
  visitId?: string;
  hikeRecordId?: string;
}
```

### Common Types
```typescript
interface Point {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}
```

## Technical Debt & Improvements
- Add loading states for map operations
- Implement error boundaries
- Add unit tests for components
- Optimize map performance
- Add API error handling
- Implement request caching
- Set up monitoring and logging
- Add photo upload progress indicators
- Implement offline support
- Add data validation on frontend

## Development Notes
### Authentication Implementation Details
- Using Auth0 for secure authentication
- Implemented protected routes
- Added logout functionality with proper redirect
- Integrated Auth0 provider in frontend
- Added user session management

### Map Implementation Details
- Using Mapbox GL JS for advanced mapping features
- Custom marker system with hover interactions
- Disabled free zooming for better UX
- Implemented zoom-to-park on marker click
- Satellite view as default map style
- Custom controls for zoom and map style switching

### UI Design Decisions
- Overlay navigation system for clean map view
- Glass-morphism effects for modern look
- Outfit font for clean typography
- Responsive design with mobile considerations
- Subtle animations and transitions
- Consistent color scheme and styling

### Known Issues & Considerations
- Map performance optimization needed for large datasets
- Need to implement proper loading states
- Consider adding map clustering for dense areas
- May need to implement custom map style for better branding
- Need to handle authentication state persistence
- Consider adding user profile picture support
- Need to implement user preferences storage
- Consider adding photo compression before upload
- Need to implement trail path visualization
- Consider adding weather data integration

## Development Environment
- Node.js and npm for package management
- Vite for development and building
- ESLint and Prettier for code quality
- Git for version control
- AWS CLI for cloud management
- Docker for local development

## Project Goals
1. Improve React/TypeScript skills through practical application
2. Create a visually impressive project for technical interviews
3. Build a useful tool for personal use to track national park visits
4. Implement best practices for frontend development
5. Gain experience with cloud infrastructure
6. Implement secure authentication and data persistence
7. Add trail and photo tracking capabilities
8. Implement weather data integration

## Deployment
- Frontend: GitHub Pages (implemented)
- Backend: AWS (planned)
- Database: AWS RDS (planned)
- Authentication: Auth0 (implemented) 