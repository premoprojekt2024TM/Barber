# Step 1: Build Stage using Node (Vite)
FROM node:18 AS build

# Set the working directory for the app
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application
COPY . .

# Build the project (TypeScript + Vite)
RUN npm run build

# Step 2: Production Stage using Nginx to serve the app
FROM nginx:alpine

# Copy the built files from the build stage to Nginx's public directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose the default HTTP port for Nginx (which is 80)
EXPOSE 80

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
