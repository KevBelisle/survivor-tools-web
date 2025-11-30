# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application (skip standalone tsc check - Vite handles type checking)
RUN npx vite build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy environment injection script to nginx entrypoint directory
# This script runs automatically when the container starts and injects
# the API_BASE_URL environment variable into a JavaScript file
COPY inject-env.sh /docker-entrypoint.d/01-inject-env.sh
RUN chmod +x /docker-entrypoint.d/01-inject-env.sh

# Copy nginx configuration for SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
