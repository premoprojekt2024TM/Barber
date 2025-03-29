# Use official Node.js LTS version as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install required system dependencies for canvas
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    pkg-config \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy tsconfig.json
COPY tsconfig.json ./

# Copy the rest of your application code into the container
COPY src/ ./src/

# Build TypeScript code
RUN npx tsc

# Expose the port the app will run on
EXPOSE 8080

CMD ["node", "dist/app.js"]
