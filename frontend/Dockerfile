ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Installer pnpm
RUN corepack enable pnpm

# Copier les fichiers de dépendances
COPY package*.json pnpm-lock.yaml ./

# Installer les dépendances
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copier le reste des fichiers
COPY . .

# Build de l'application
RUN pnpm run build

# ============ Stage de production ============
FROM nginx:alpine

# Copier le build depuis le stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]