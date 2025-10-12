# Stage 1: Dependencies & Build
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Production
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY src/ ./src
EXPOSE 3001
CMD ["node", "src/server.js"]
