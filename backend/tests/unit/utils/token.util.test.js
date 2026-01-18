// tests/unit/utils/token.util.test.js
const tokenUtil = require('../../../src/utils/token.util');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');
jest.mock('../../../src/config/jwt.config', () => ({
  JWT_SECRET: 'test-secret-key',
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  EMAIL_TOKEN_EXPIRES_IN: '1h'
}));

describe('Token Util - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signAccess', () => {
    it('should sign access token with correct payload and expiration', () => {
      const payload = { id: 1, role: 'USER' };
      const expectedToken = 'access-token-123';

      jwt.sign.mockReturnValue(expectedToken);

      const result = tokenUtil.signAccess(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, 'test-secret-key', { expiresIn: '15m' });
      expect(result).toBe(expectedToken);
    });
  });

  describe('signRefresh', () => {
    it('should sign refresh token with correct payload and expiration', () => {
      const payload = { id: 1, role: 'USER' };
      const expectedToken = 'refresh-token-456';

      jwt.sign.mockReturnValue(expectedToken);

      const result = tokenUtil.signRefresh(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, 'test-secret-key', { expiresIn: '7d' });
      expect(result).toBe(expectedToken);
    });
  });

  describe('signEmail', () => {
    it('should sign email token with correct payload and expiration', () => {
      const payload = { id: 1, email: 'user@example.com' };
      const expectedToken = 'email-token-789';

      jwt.sign.mockReturnValue(expectedToken);

      const result = tokenUtil.signEmail(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, 'test-secret-key', { expiresIn: '1h' });
      expect(result).toBe(expectedToken);
    });
  });

  describe('verify', () => {
    it('should verify token successfully', () => {
      const token = 'valid-token';
      const expectedPayload = { id: 1, role: 'USER' };

      jwt.verify.mockReturnValue(expectedPayload);

      const result = tokenUtil.verify(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, 'test-secret-key');
      expect(result).toBe(expectedPayload);
    });

    it('should throw error for invalid token', () => {
      const token = 'invalid-token';

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => tokenUtil.verify(token)).toThrow('Invalid token');
    });

    it('should throw error for expired token', () => {
      const token = 'expired-token';

      jwt.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      expect(() => tokenUtil.verify(token)).toThrow('Token expired');
    });
  });
});