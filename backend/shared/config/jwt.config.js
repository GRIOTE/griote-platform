const jwt = require('jsonwebtoken');

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_in_production',
  ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  EMAIL_TOKEN_EXPIRES_IN: process.env.JWT_EMAIL_EXPIRES_IN || '1d',
  jwt,
};
