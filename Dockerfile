# Stage 1: Build the React application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the application
# Note: In Vite, environment variables need to be present during the build step.
# If you are building this in a CI/CD pipeline (like GitLab CI or GitHub Actions),
# make sure to pass the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY as build args or env vars.
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (for React Router SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
