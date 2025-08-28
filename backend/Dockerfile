# Backend Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# If your backend has a TypeScript build step, ensure `npm run build` outputs to dist/
# Otherwise, replace with your production start command.
RUN npm run build || echo "No build step, proceeding to runtime"

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app .
EXPOSE 4000
# If you don't build to dist, change this to your start script, e.g. `npm start`
CMD ["node", "dist/index.js"]
