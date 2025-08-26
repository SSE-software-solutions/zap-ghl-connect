# syntax=docker/dockerfile:1

# Install dependencies separately for better layer caching
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

# Development/runtime image
FROM node:20-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure Vite binds to all interfaces and uses the expected port
ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080

CMD ["npm","run","dev","--","--host","0.0.0.0","--port","8080"]


