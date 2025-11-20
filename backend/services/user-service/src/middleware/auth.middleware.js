const tokenUtil = require('../utils/token.util');

function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'Token missing' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const payload = tokenUtil.verify(token);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;
