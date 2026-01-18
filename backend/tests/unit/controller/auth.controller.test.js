const authController = require('../../../src/controllers/auth.controller');
const authService = require('../../../src/services/auth.service');
const { mockRequest, mockResponse, mockUser, mockToken } = require('../../setup/mock');
const { validUser, adminUser, regularUser } = require('../../fixtures/users.fixture');
const { validateRegister } = require('../../../src/dtos/register.dto');

/* ========================= MOCKS ========================= */

jest.mock('../../../src/services/auth.service');

jest.mock('../../../src/dtos/register.dto', () => ({
  RegisterDTO: jest.fn().mockImplementation(data => data),
  validateRegister: jest.fn()
}));

jest.mock('../../../src/dtos/login.dto', () =>
  jest.fn().mockImplementation(data => data)
);

jest.mock('../../../src/dtos/changePassword.dto', () =>
  jest.fn().mockImplementation(data => data)
);

jest.mock('../../../src/dtos/refresh.dto', () =>
  jest.fn().mockImplementation(data => data)
);

jest.mock('../../../src/dtos/logout.dto', () =>
  jest.fn().mockImplementation(data => data)
);

jest.mock('../../../src/dtos/requestPasswordReset.dto', () =>
  jest.fn().mockImplementation(data => data)
);

jest.mock('../../../src/dtos/resetPassword.dto', () =>
  jest.fn().mockImplementation(data => data)
);

/* ========================= TESTS ========================= */

describe('Auth Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    req.cookies = {};
    jest.clearAllMocks();
  });

  /* ========================= REGISTER ========================= */

  describe('POST /register', () => {
    it('Must register a new user successfully', async () => {
      validateRegister.mockResolvedValueOnce(true);

      req.body = {
        firstName: validUser.firstName,
        lastName: validUser.lastName,
        email: validUser.email,
        password: validUser.password
      };

      authService.registerUserWithEmailToken.mockResolvedValue({
        user: mockUser(),
        emailToken: 'verification-token-123'
      });

      await authController.register(req, res);

      expect(authService.registerUserWithEmailToken).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered. Please verify your email.',
        emailToken: 'verification-token-123'
      });
    });

    it('Must return 400 if email is invalid', async () => {
      validateRegister.mockRejectedValueOnce({
        isJoi: true,
        details: [{ path: ['email'], message: 'Invalid email' }]
      });

      req.body = { email: 'invalid-email' };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation error',
          details: expect.any(Array)
        })
      );
    });

    it('Must return 400 if email already exists', async () => {
      validateRegister.mockResolvedValueOnce(true);

      req.body = {
        firstName: validUser.firstName,
        lastName: validUser.lastName,
        email: validUser.email,
        password: validUser.password
      };

      authService.registerUserWithEmailToken.mockRejectedValueOnce(
        new Error('Email already exists')
      );

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already exists'
      });
    });
  });

  /* ========================= LOGIN ========================= */

  describe('POST /login', () => {
    it('Must login a regular user successfully', async () => {
      req.body = {
        email: regularUser.email,
        password: 'Password123!'
      };

      authService.login.mockResolvedValueOnce({
        accessToken: mockToken.accessToken,
        refreshToken: mockToken.refreshToken,
        user: regularUser
      });

      await authController.login(req, res);

      expect(authService.login).toHaveBeenCalledWith(
        regularUser.email,
        'Password123!'
      );

      expect(res.cookie).toHaveBeenCalledWith(
        'rt',
        mockToken.refreshToken,
        expect.any(Object)
      );

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken: mockToken.accessToken,
          requiresInterfaceSelection: false,
          user: expect.objectContaining({
            email: regularUser.email,
            role: 'USER'
          })
        })
      );
    });

    it('Must login an admin user successfully', async () => {
      req.body = {
        email: adminUser.email,
        password: 'AdminPass123!'
      };

      authService.login.mockResolvedValueOnce({
        accessToken: mockToken.accessToken,
        refreshToken: mockToken.refreshToken,
        user: adminUser
      });

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          requiresInterfaceSelection: true,
          user: expect.objectContaining({
            role: 'ADMIN'
          })
        })
      );
    });

    it('Must return 400 if login fails', async () => {
      req.body = {
        email: 'wrong@example.com',
        password: 'wrongpass'
      };

      authService.login.mockRejectedValueOnce(
        new Error('Invalid credentials')
      );

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });
  });

  /* ========================= VERIFY EMAIL ========================= */

  describe('GET /verify-email', () => {
    it('Must verify email successfully', async () => {
      req.query = { token: 'valid-token' };

      authService.verifyEmailToken.mockResolvedValueOnce(true);

      await authController.verifyEmail(req, res);

      expect(authService.verifyEmailToken).toHaveBeenCalledWith('valid-token');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email verified successfully'
      });
    });

    it('Must return 400 if token invalid', async () => {
      req.query = { token: 'invalid-token' };

      authService.verifyEmailToken.mockRejectedValueOnce(
        new Error('Invalid or expired token')
      );

      await authController.verifyEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid or expired token'
      });
    });
  });

  /* ========================= REFRESH ========================= */

  describe('POST /refresh', () => {
    it('Must refresh token successfully', async () => {
      req.cookies = { rt: 'valid-refresh-token' };

      authService.refreshTokens.mockResolvedValueOnce({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      });

      await authController.refreshToken(req, res);

      expect(authService.refreshTokens).toHaveBeenCalledWith('valid-refresh-token');
      expect(res.cookie).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        accessToken: 'new-access-token'
      });
    });

    it('Must return 401 if refresh token invalid', async () => {
      req.cookies = { rt: 'invalid-token' };

      authService.refreshTokens.mockRejectedValueOnce(
        new Error('Invalid refresh token')
      );

      await authController.refreshToken(req, res);

      expect(res.clearCookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid refresh token'
      });
    });
  });

  /* ========================= LOGOUT ========================= */

  describe('POST /logout', () => {
    it('Must logout with token in body', async () => {
      req.body = { refreshToken: 'refresh-token-123' };

      authService.revokeRefresh.mockResolvedValueOnce(true);

      await authController.logout(req, res);

      expect(authService.revokeRefresh).toHaveBeenCalledWith('refresh-token-123');
      expect(res.clearCookie).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logged out successfully'
      });
    });

    it('Must logout with token in header', async () => {
      req.headers = { 'x-refresh-token': 'header-token-123' };

      authService.revokeRefresh.mockResolvedValueOnce(true);

      await authController.logout(req, res);

      expect(authService.revokeRefresh).toHaveBeenCalledWith('header-token-123');
      expect(res.clearCookie).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logged out successfully'
      });
    });
  });

  /* ========================= PASSWORD ========================= */

  describe('PUT /change-password', () => {
    it('Must change password successfully', async () => {
      req.user = { id: 1 };
      req.body = {
        oldPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!'
      };

      authService.changePassword.mockResolvedValueOnce(true);

      await authController.changePassword(req, res);

      expect(authService.changePassword).toHaveBeenCalledWith(
        1,
        'OldPassword123!',
        'NewPassword123!'
      );

      expect(res.json).toHaveBeenCalledWith({
        message: 'Password changed successfully'
      });
    });
  });
});
