const jwt = require('jsonwebtoken');
const { JWT_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } = require('../config/jwt.config');

function signAccess(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

function signRefresh(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

function verify(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signAccess, signRefresh, verify };