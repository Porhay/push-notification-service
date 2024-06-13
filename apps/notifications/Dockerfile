# Build stage
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:16-alpine AS production

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production
EXPOSE 8000
CMD ["node", "dist/apps/notifications/main"]
