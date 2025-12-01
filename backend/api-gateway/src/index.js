// api-gateway/src/index.js
require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Proxy vers les services
app.use('/api/auth', createProxyMiddleware({
  target: 'http://user-service:3000',
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/api/auth' }
}));

app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3000',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/api/users' }
}));

app.use('/api/admin', createProxyMiddleware({
  target: 'http://user-service:3000',
  changeOrigin: true,
  pathRewrite: { '^/api/admin': '/api/admin' }
}));

app.use('/api/depot', createProxyMiddleware({
  target: 'http://depot-service:3000',
  changeOrigin: true,
  pathRewrite: { '^/api/depot': '/api' }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', gateway: 'running', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway en écoute sur http://localhost:${PORT}`);
});