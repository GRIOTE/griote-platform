#!/bin/bash

# Script to set up the server directory structure and files for Griote platform deployment
# Run this script on the server to prepare the environment before CI/CD deployment

set -e

DEPLOY_PATH="/griote"

echo "Setting up Griote platform on server..."

# Create directories
echo "Creating directories..."
mkdir -p "$DEPLOY_PATH/backend"
mkdir -p "$DEPLOY_PATH/frontend"
mkdir -p "$DEPLOY_PATH/backend/grafana/provisioning/dashboards"
mkdir -p "$DEPLOY_PATH/backend/grafana/provisioning/datasources"
mkdir -p "$DEPLOY_PATH/backend/grafana/dashboards"

# Copy docker-compose.yml
echo "Creating docker-compose.yml..."
cat > "$DEPLOY_PATH/docker-compose.yml" << 'EOF'
# Docker Compose configuration for Griote platform production

services:
  # ====================== Traefik (Reverse Proxy) ======================
  traefik-griote:
    image: traefik:v2.10
    container_name: griote-traefik
    command:
      - "--api.insecure=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@griote.org"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - letsencrypt:/letsencrypt
    networks:
      - griote_network
    profiles:
      - prod

  # ====================== PostgreSQL ======================
  postgres-griote:
    image: postgres:16-alpine
    container_name: griote-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    networks:
      - griote_network

  # ====================== MinIO (S3 compatible) ======================
  minio-griote:
    image: minio/minio:latest
    container_name: griote-minio
    restart: unless-stopped
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.minio.rule=Host(`minio.griote.org`)"
      - "traefik.http.routers.minio.entrypoints=websecure"
      - "traefik.http.routers.minio.tls.certresolver=letsencrypt"
      - "traefik.http.services.minio.loadbalancer.server.port=9001"
    networks:
      - griote_network

  # ====================== Backend ======================
  backend-griote:
    image: brandonkamga237/backend-griote:latest
    container_name: griote-backend
    restart: unless-stopped
    env_file:
      - ./backend/.env.prod
    depends_on:
      postgres-griote:
        condition: service_healthy
      minio-griote:
        condition: service_healthy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(`api.griote.org`)"
      - "traefik.http.routers.backend.entrypoints=websecure"
      - "traefik.http.routers.backend.tls.certresolver=letsencrypt"
      - "traefik.http.services.backend.loadbalancer.server.port=3000"
    networks:
      - griote_network
    profiles:
      - prod

  # ====================== Frontend ======================
  frontend-griote:
    image: brandonkamga237/frontend-griote:latest
    container_name: griote-frontend
    restart: unless-stopped
    env_file:
      - ./frontend/.env
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`griote.org`)"
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
      - "traefik.http.services.frontend.loadbalancer.server.port=80"
    networks:
      - griote_network
    profiles:
      - prod

  # ====================== Prometheus ======================
  prometheus-griote:
    image: prom/prometheus:latest
    container_name: griote-prometheus
    restart: unless-stopped
    volumes:
      - ./backend/prometheus.yml:/etc/prometheus/prometheus.yml
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.prometheus.rule=Host(`prometheus.griote.org`)"
      - "traefik.http.routers.prometheus.entrypoints=websecure"
      - "traefik.http.routers.prometheus.tls.certresolver=letsencrypt"
      - "traefik.http.services.prometheus.loadbalancer.server.port=9090"
      - "traefik.http.routers.prometheus.middlewares=prometheus-auth"
      - "traefik.http.middlewares.prometheus-auth.basicauth.users=${PROMETHEUS_BASIC_AUTH}"
    depends_on:
      - backend-griote
    networks:
      - griote_network
    profiles:
      - prod

  # ====================== Grafana ======================
  grafana-griote:
    image: grafana/grafana:latest
    container_name: griote-grafana
    restart: unless-stopped
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_ADMIN_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
      - ./backend/grafana/provisioning:/etc/grafana/provisioning
      - ./backend/grafana/dashboards:/var/lib/grafana/dashboards
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.grafana.rule=Host(`grafana.griote.org`)"
      - "traefik.http.routers.grafana.entrypoints=websecure"
      - "traefik.http.routers.grafana.tls.certresolver=letsencrypt"
      - "traefik.http.services.grafana.loadbalancer.server.port=3000"
      - "traefik.http.routers.grafana.middlewares=grafana-auth"
      - "traefik.http.middlewares.grafana-auth.basicauth.users=${GRAFANA_BASIC_AUTH}"
    depends_on:
      - prometheus-griote
    networks:
      - griote_network
    profiles:
      - prod

volumes:
  postgres_data:
    name: griote_postgres_data
  minio_data:
    name: griote_minio_data
  grafana_data:
    name: griote_grafana_data
  letsencrypt:
    name: griote_letsencrypt

networks:
  griote_network:
    external: true
EOF

# Create backend/.env.prod
echo "Creating backend/.env.prod..."
cat > "$DEPLOY_PATH/backend/.env.prod" << EOF
# APPLICATION
NODE_ENV=production
PORT=3000

# DATABASE (PostgreSQL)
DB_USER=${DB_USER:-griote}
DB_PASSWORD=${DB_PASSWORD:-your_secure_db_password}
DB_NAME=${DB_NAME:-griote}
DB_URI=postgresql://\${DB_USER}:\${DB_PASSWORD}@postgres:5432/\${DB_NAME}

# JWT & AUTH
JWT_SECRET=${JWT_SECRET:-your_jwt_secret}
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email configuration
MAIL_HOST=${MAIL_HOST:-your_mail_host}
MAIL_PORT=${MAIL_PORT:-587}
MAIL_USER=${MAIL_USER:-your_mail_user}
MAIL_PASS=${MAIL_PASS:-your_mail_pass}
MAIL_SECURE=true

EMAIL_FROM=noreply@griote.org

# MINIO / S3 (stockage des documents)
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_PUBLIC_URL=https://minio.griote.org
MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY:-your_minio_access_key}
MINIO_SECRET_KEY=${MINIO_SECRET_KEY:-your_minio_secret_key}
MINIO_BUCKET=griote-documents
MINIO_USE_SSL=true

# JWT & TOKENS
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
EMAIL_TOKEN_EXPIRES_IN=1h

LOKI_HOST=http://prometheus:3100

# FRONTEND
FRONTEND_URL=https://griote.org

# LOGGING
LOG_LEVEL=info
EOF

# Create frontend/.env
echo "Creating frontend/.env..."
cat > "$DEPLOY_PATH/frontend/.env" << EOF
VITE_API_BASE_URL=https://api.griote.org
VITE_APP_ENV=production
EOF

# Copy prometheus.yml (assuming it's available or create basic one)
echo "Creating backend/prometheus.yml..."
cat > "$DEPLOY_PATH/backend/prometheus.yml" << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'backend'
    static_configs:
      - targets: ['backend-griote:3000']
EOF

# Create basic grafana provisioning files
echo "Creating Grafana provisioning files..."
cat > "$DEPLOY_PATH/backend/grafana/provisioning/datasources/prometheus.yml" << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus-griote:9090
    isDefault: true
EOF

cat > "$DEPLOY_PATH/backend/grafana/provisioning/dashboards/dashboard.yml" << EOF
apiVersion: 1

providers:
  - name: 'default'
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /var/lib/grafana/dashboards
EOF

# Create a basic dashboard (placeholder)
echo "Creating basic Grafana dashboard..."
cat > "$DEPLOY_PATH/backend/grafana/dashboards/backend-monitoring.json" << EOF
{
  "dashboard": {
    "title": "Backend Monitoring",
    "tags": ["griote", "backend"],
    "timezone": "browser",
    "panels": [],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "timepicker": {},
    "templating": {
      "list": []
    },
    "annotations": {
      "list": []
    },
    "refresh": "5s",
    "schemaVersion": 16,
    "version": 0,
    "links": []
  }
}
EOF

# Create Docker network if it doesn't exist
echo "Creating Docker network..."
docker network create griote_network || echo "Network already exists"

echo "Setup complete! The server is ready for CI/CD deployment."
echo "Make sure to set the following environment variables before running docker-compose:"
echo "- DB_USER"
echo "- DB_PASSWORD"
echo "- DB_NAME"
echo "- JWT_SECRET"
echo "- MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS"
echo "- MINIO_ACCESS_KEY, MINIO_SECRET_KEY"
echo "- PROMETHEUS_BASIC_AUTH"
echo "- GRAFANA_ADMIN_PASSWORD"
echo "- GRAFANA_BASIC_AUTH"