## Setup

### Prerequisites

- Docker and Docker Compose installed
- Node.js (for local development)
- Git

### Clone the Repository

```bash
git clone https://github.com/GRIOTE/griote-platform.git
cd griote-platform
```

### Environment Variables

Copy the example environment files and configure them:

```bash
cp backend/.env.prod backend/.env
cp frontend/.env.development frontend/.env
```

Edit the `.env` files with your configuration (database, MinIO, etc.).

### Install Dependencies

For local development:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Running the Application

#### Development

For backend-only development with monitoring:

```bash
cd backend
docker compose -f compose.yaml up --build
```

This starts:
- PostgreSQL
- MinIO
- Backend API (http://localhost:3000)
- Prometheus (http://localhost:9090)
- Grafana (http://localhost:3001)

#### Production

For full production deployment:

```bash
docker compose --profile prod up --build
```

This starts all services behind Traefik reverse proxy.

### Monitoring Setup

The project includes integrated monitoring with Prometheus, Grafana, and logging with Winston and Loki.

#### Components

- **Winston**: Logging library configured to send structured logs to Loki.
- **Loki**: Log aggregation system (not containerized; run separately if needed).
- **Prometheus**: Scrapes metrics from the backend `/metrics` endpoint.
- **Grafana**: Visualization dashboard for metrics.

#### Accessing Monitoring Tools

- **Prometheus**: http://localhost:9090 (dev) or https://prometheus.griote.org (prod)
- **Grafana**: http://localhost:3001 (dev, admin/admin) or https://grafana.griote.org (prod)

#### Using the Dashboard

1. Open Grafana in your browser.
2. Log in with admin credentials.
3. Navigate to Dashboards > Browse.
4. Select "Griote Backend Monitoring".
5. View panels for HTTP request rate, duration, and errors.

#### Loki Logs

Logs are sent to Loki but visualization requires adding Loki as a datasource in Grafana (not currently configured). Run Loki separately if needed.

### Testing

```bash
cd backend
npm test
```
