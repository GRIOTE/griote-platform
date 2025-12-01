const User = require('../models/user.model');

/**
 * Middleware to check if user has required role(s)
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 * @returns {Function} Express middleware function
 */
function requireRole(allowedRoles) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.user_id) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Get user from database to ensure we have the latest role information
      const user = await User.findByPk(req.user.user_id);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Normalize allowedRoles to array
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      // Check if user's role is in the allowed roles
      if (!roles.includes(user.role)) {
        return res.status(403).json({ 
          message: 'Insufficient permissions',
          required: roles,
          current: user.role
        });
      }

      // Add user info to request for use in controllers
      req.user.role = user.role;
      req.user.fullUser = user;
      
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}

/**
 * Middleware specifically for admin access
 */
const requireAdmin = requireRole('ADMIN');

/**
 * Middleware for admin or specific roles
 */
const requireAdminOrRole = (additionalRoles = []) => {
  const roles = ['ADMIN', ...additionalRoles];
  return requireRole(roles);
};

module.exports = {
  requireRole,
  requireAdmin,
  requireAdminOrRole
};
