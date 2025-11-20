const express = require('express');
const cors = require('cors');
const depotRoutes = require('./src/routes/depot.routes');
const categoryRoutes = require('./src/routes/category.routes');
const tagRoutes = require('./src/routes/tag.routes');
const documentRoutes = require('./src/routes/document.routes');
const swaggerRouter = require('./src/swagger');
const { sequelize } = require('./src/models');
const logger = require('./src/config/logger');

const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/depots', depotRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api-docs', swaggerRouter);

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

module.exports = { app, sequelize };