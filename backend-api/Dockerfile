FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build
RUN npm run build

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]
