# Base image for build stage
FROM node:22-alpine as build

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Build application
RUN npm run build

# Production image
FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy build files from build stage
COPY --from=build /usr/src/app/dist ./dist

# If using TypeORM with migrations
COPY --from=build /usr/src/app/dist/migrations ./dist/migrations

# Expose port
EXPOSE 8080

# Start command
CMD ["node", "dist/main"]
