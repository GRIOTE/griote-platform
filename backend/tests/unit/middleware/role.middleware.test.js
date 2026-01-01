// tests/unit/middleware/role.middleware.test.js
const { requireRole, requireAdmin } = require('../../../src/middleware/role.middleware');

describe('Role Middleware - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('requireRole', () => {
    it('should call next() for user with allowed role (single role)', () => {
      req.user = { role: 'ADMIN' };
      const middleware = requireRole('ADMIN');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should call next() for user with allowed role (array of roles)', () => {
      req.user = { role: 'MODERATOR' };
      const middleware = requireRole(['ADMIN', 'MODERATOR']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 for missing role in token', () => {
      req.user = {}; // No role
      const middleware = requireRole('ADMIN');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Rôle manquant dans le token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for null user', () => {
      req.user = null;
      const middleware = requireRole('ADMIN');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Rôle manquant dans le token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 for insufficient role (single role)', () => {
      req.user = { role: 'USER' };
      const middleware = requireRole('ADMIN');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Accès refusé',
        required: ['ADMIN'],
        current: 'USER'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 for insufficient role (array of roles)', () => {
      req.user = { role: 'USER' };
      const middleware = requireRole(['ADMIN', 'MODERATOR']);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Accès refusé',
        required: ['ADMIN', 'MODERATOR'],
        current: 'USER'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should convert single role string to array', () => {
      req.user = { role: 'ADMIN' };
      const middleware = requireRole('ADMIN');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    it('should call next() for admin user', () => {
      req.user = { role: 'ADMIN' };

      requireAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 for non-admin user', () => {
      req.user = { role: 'USER' };

      requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Accès refusé',
        required: ['ADMIN'],
        current: 'USER'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});