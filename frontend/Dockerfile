# Frontend Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Serve using Vite preview (simple) – alternatively use nginx for static hosting
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app .
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host"]
