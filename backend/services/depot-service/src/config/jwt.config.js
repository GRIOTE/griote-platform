require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production',
  ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};