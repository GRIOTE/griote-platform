const tokenUtil = require('../utils/token.util');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = tokenUtil.verify(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}

module.exports = { authMiddleware };
