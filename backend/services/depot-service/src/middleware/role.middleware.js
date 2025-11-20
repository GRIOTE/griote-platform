function requireRole(allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(401).json({ message: 'Rôle manquant dans le token' });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(role)) {
      return res.status(403).json({
        message: 'Accès refusé',
        required: roles,
        current: role
      });
    }

    next();
  };
}

const requireAdmin = requireRole('ADMIN');

module.exports = { requireRole, requireAdmin };