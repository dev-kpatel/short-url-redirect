# Use Node.js 20 slim image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Build TypeScript -> dist/
RUN npm run build

# Expose app port
EXPOSE 4000

# Start the app
CMD ["npm", "start"]