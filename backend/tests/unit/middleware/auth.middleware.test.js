// tests/unit/middleware/auth.middleware.test.js
const authMiddleware = require('../../../src/middleware/auth.middleware');
const tokenUtil = require('../../../src/utils/token.util');

jest.mock('../../../src/utils/token.util');

describe('Auth Middleware - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() with valid Bearer token', () => {
    const payload = { id: 1, role: 'USER' };
    req.headers.authorization = 'Bearer valid-token';

    tokenUtil.verify.mockReturnValue(payload);

    authMiddleware(req, res, next);

    expect(tokenUtil.verify).toHaveBeenCalledWith('valid-token');
    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 401 for missing Authorization header', () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token manquant' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 for Authorization header not starting with Bearer', () => {
    req.headers.authorization = 'Basic token123';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token manquant' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 for invalid token', () => {
    req.headers.authorization = 'Bearer invalid-token';

    tokenUtil.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(req, res, next);

    expect(tokenUtil.verify).toHaveBeenCalledWith('invalid-token');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token invalide ou expiré' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 for expired token', () => {
    req.headers.authorization = 'Bearer expired-token';

    tokenUtil.verify.mockImplementation(() => {
      throw new Error('Token expired');
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token invalide ou expiré' });
    expect(next).not.toHaveBeenCalled();
  });
});