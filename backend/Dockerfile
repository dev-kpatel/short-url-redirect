# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and lockfile
COPY backend/package*.json ./

# Install ALL deps (including dev, e.g. typescript, tsc-alias)
RUN npm install

# Copy backend source code
COPY backend/ ./

# Build with tsc and resolve path aliases
RUN npm run build


# ---------- Stage 2: Runtime ----------
FROM node:20-alpine

WORKDIR /app

# Copy package.json & lockfile
COPY backend/package*.json ./

# Install ONLY production deps
RUN npm install --omit=dev

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Copy runtime extras (sql, configs, etc.)
COPY backend/sql ./sql

EXPOSE 4000
CMD ["node", "dist/index.js"]
