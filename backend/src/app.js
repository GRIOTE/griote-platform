// app.js
const express = require('express');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const depotRoutes = require('./routes/depot.routes');
const tagRoutes = require('./routes/tag.routes');

const app = express();

// CORS configuration for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/depot', depotRoutes);
app.use('/api/tags', tagRoutes);

if (process.env.NODE_ENV !== 'production') {
  const swaggerRouter = require('./docs/swagger.router');
  app.use('/api/docs', swaggerRouter);
}


// Route de santé (monitoring)
app.get('/api/health', (req, res) => res.json({ status: 'OK'}));

module.exports = app;
