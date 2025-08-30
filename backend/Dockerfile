# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and lockfile
COPY backend/package*.json ./

# Install all deps (including dev for build)
RUN npm install

# Copy backend source
COPY backend/ ./

# Build TypeScript -> dist/
RUN npm run build


# ---------- Stage 2: Runtime ----------
FROM node:20-alpine

WORKDIR /app

# Copy only package files for prod install
COPY backend/package*.json ./

# Install prod deps only
RUN npm install --omit=dev

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Copy anything else needed at runtime (e.g., config, sql)
COPY backend/sql ./sql

EXPOSE 4000
CMD ["node", "dist/index.js"]
