# api-gateway/Dockerfile → CELUI-LÀ MARCHE
FROM node:20-alpine

WORKDIR /app

COPY api-gateway/package*.json ./
RUN npm ci --only=production

COPY api-gateway/src ./src

EXPOSE 3000
CMD ["node", "src/index.js"]