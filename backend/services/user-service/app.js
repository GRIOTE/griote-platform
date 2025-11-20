const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const adminRoutes = require('./src/routes/admin.routes');
const swaggerRouter = require('./src/swagger');
const sequelize = require('./src/config/db.config');
const logger = require('./src/config/logger');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:4173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Swagger
app.use('/api-docs', swaggerRouter);

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

async function initDb() {
  try {
    console.log('DB: Starting authenticate...');
    await sequelize.authenticate();
    console.log('DB: Authenticate succeeded.');
    
    console.log('DB: Starting sync...');
    await sequelize.sync({ alter: true });
    console.log('DB: Sync succeeded.');

    logger.info('Database connected and synced');
  } catch (error) {
    logger.error('Database connection failed', error);
    throw error;
  }
}

module.exports = { app, initDb };