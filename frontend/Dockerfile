ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN pnpm run build   # Vite met le build dans /dist

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80