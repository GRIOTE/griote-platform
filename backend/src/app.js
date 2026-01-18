const express = require('express');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const depotRoutes = require('./routes/depot.routes');
const tagRoutes = require('./routes/tag.routes');
const categoryRoutes = require('./routes/category.routes');
const announcementRoutes = require('./routes/announcement.routes');
const cookieParser = require('cookie-parser');
const logger = require('./config/logger.config');
const promClient = require('prom-client');


const app = express();

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_request_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestErrorsTotal = new promClient.Counter({
  name: 'http_request_errors_total',
  help: 'Total number of HTTP request errors',
  labelNames: ['method', 'route', 'status_code'],
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  const start = Date.now();
  logger.info('Incoming request', { context: { method: req.method, url: req.url } });

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.url;
    const statusCode = res.statusCode.toString();

    httpRequestDuration.observe({ method: req.method, route, status_code: statusCode }, duration);
    httpRequestTotal.inc({ method: req.method, route, status_code: statusCode });

    if (res.statusCode >= 400) {
      httpRequestErrorsTotal.inc({ method: req.method, route, status_code: statusCode });
    }
  });

  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/depots', depotRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', announcementRoutes);

if (process.env.NODE_ENV !== 'production') {
  const swaggerRouter = require('./docs/swagger.router');
  app.use('/api/docs', swaggerRouter);
}

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.use((err, req, res, next) => {
  logger.error('Global error', { context: { error: err.message, stack: err.stack, url: req.url, method: req.method } });
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
