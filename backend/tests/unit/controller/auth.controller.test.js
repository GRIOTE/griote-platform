// tests/unit/controller/auth.controller.test.js
const authController = require('../../../src/controllers/auth.controller');
const authService = require('../../../src/services/auth.service');
const { mockRequest, mockResponse, mockUser, mockToken } = require('../../setup/mock');
const { validUser, adminUser, regularUser } = require('../../fixtures/users.fixture');

jest.mock('../../../src/services/auth.service');

describe('Auth Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('Must register a new user successfully', async () => {
      // Arrange
      req.body = {
        firstName: validUser.firstName,
        lastName: validUser.lastName,
        email: validUser.email,
        password: validUser.password
      };
      
      const mockResult = {
        user: mockUser({
          first_name: validUser.firstName,
          last_name: validUser.lastName,
          email: validUser.email
        }),
        emailToken: 'verification-token-123'
      };
      
      authService.registerUserWithEmailToken.mockResolvedValue(mockResult);

      // Act
      await authController.register(req, res);

      // Assert
      expect(authService.registerUserWithEmailToken).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered. Please verify your email.',
        emailToken: 'verification-token-123'
      });
    });

    it('Must return 400 if email is invalid', async () => {
      // Arrange
      req.body = { email: 'invalid-email' };

      // Act
      await authController.register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation error',
          details: expect.any(Array)
        })
      );
    });

    it('Must return 400 if email already exists', async () => {
      // Arrange
      req.body = {
        firstName: validUser.firstName,
        lastName: validUser.lastName,
        email: validUser.email,
        password: validUser.password
      };
      
      authService.registerUserWithEmailToken.mockRejectedValue(
        new Error('Email already exists')
      );

      // Act
      await authController.register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already exists'
      });
    });
  });

  describe('POST /login', () => {
    it('Must login a regular user successfully', async () => {
      // Arrange
      req.body = {
        email: regularUser.email,
        password: 'Password123!'
      };
      
      authService.login.mockResolvedValue({
        accessToken: mockToken.accessToken,
        refreshToken: mockToken.refreshToken,
        user: regularUser
      });

      // Act
      await authController.login(req, res);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(
        regularUser.email,
        'Password123!'
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken: mockToken.accessToken,
          refreshToken: mockToken.refreshToken,
          requiresInterfaceSelection: false,
          user: expect.objectContaining({
            user_id: regularUser.user_id,
            email: regularUser.email,
            role: 'USER'
          })
        })
      );
    });

    it('Must login an admin user successfully', async () => {
      // Arrange
      req.body = {
        email: adminUser.email,
        password: 'AdminPass123!'
      };
      
      authService.login.mockResolvedValue({
        accessToken: mockToken.accessToken,
        refreshToken: mockToken.refreshToken,
        user: adminUser
      });

      // Act
      await authController.login(req, res);

      // Assert
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
      // Arrange
      req.body = {
        email: 'wrong@example.com',
        password: 'wrongpass'
      };
      
      authService.login.mockRejectedValue(
        new Error('Invalid credentials')
      );

      // Act
      await authController.login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });
  });

  describe('GET /verify-email', () => {
    it('Must verify email with success', async () => {
      // Arrange
      req.query = { token: 'valid-token-123' };
      authService.verifyEmailToken.mockResolvedValue(true);

      // Act
      await authController.verifyEmail(req, res);

      // Assert
      expect(authService.verifyEmailToken).toHaveBeenCalledWith('valid-token-123');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email verified successfully'
      });
    });

    it('Must return 400 if token is invalid', async () => {
      // Arrange
      req.query = { token: 'invalid-token' };
      authService.verifyEmailToken.mockRejectedValue(
        new Error('Invalid or expired token')
      );

      // Act
      await authController.verifyEmail(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid or expired token'
      });
    });
  });

  describe('POST /refresh', () => {
    it('Must refresh tokens successfully', async () => {
      // Arrange
      req.body = { refreshToken: 'valid-refresh-token' };
      const newTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      };
      
      authService.refreshTokens.mockResolvedValue(newTokens);

      // Act
      await authController.refreshToken(req, res);

      // Assert
      expect(authService.refreshTokens).toHaveBeenCalledWith('valid-refresh-token');
      expect(res.json).toHaveBeenCalledWith(newTokens);
    });

    it('Must return 400 if refresh token is invalid', async () => {
      // Arrange
      req.body = { refreshToken: 'invalid-token' };
      authService.refreshTokens.mockRejectedValue(
        new Error('Invalid refresh token')
      );

      // Act
      await authController.refreshToken(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid refresh token'
      });
    });
  });

  describe('POST /logout', () => {
    it('Must logout with token in body', async () => {
      // Arrange
      req.body = { refreshToken: 'refresh-token-123' };
      authService.revokeRefresh.mockResolvedValue(true);

      // Act
      await authController.logout(req, res);

      // Assert
      expect(authService.revokeRefresh).toHaveBeenCalledWith('refresh-token-123');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logged out successfully'
      });
    });

    it('Must logout with token in header', async () => {
      // Arrange
      req.headers = { 'x-refresh-token': 'header-token-123' };
      req.body = {};
      authService.revokeRefresh.mockResolvedValue(true);

      // Act
      await authController.logout(req, res);

      // Assert
      expect(authService.revokeRefresh).toHaveBeenCalledWith('header-token-123');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logged out successfully'
      });
    });
  });

  describe('POST /request-password-reset', () => {
    it('Must send a password reset email', async () => {
      // Arrange
      req.body = { email: 'user@example.com' };
      authService.requestPasswordReset.mockResolvedValue(true);

      // Act
      await authController.requestPasswordReset(req, res);

      // Assert
      expect(authService.requestPasswordReset).toHaveBeenCalledWith('user@example.com');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password reset email sent'
      });
    });
  });

  describe('POST /reset-password', () => {
    it('Must reset password successfully', async () => {
      // Arrange
      req.body = {
        token: 'reset-token-123',
        newPassword: 'NewPassword123!'
      };
      authService.resetPassword.mockResolvedValue(true);

      // Act
      await authController.resetPassword(req, res);

      // Assert
      expect(authService.resetPassword).toHaveBeenCalledWith(
        'reset-token-123',
        'NewPassword123!'
      );
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password reset successful'
      });
    });
  });

  describe('PUT /change-password', () => {
    it('Must change password successfully', async () => {
      // Arrange
      req.user = { email: 'user@example.com' };
      req.body = {
        oldPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!'
      };
      authService.changePassword.mockResolvedValue(true);

      // Act
      await authController.changePassword(req, res);

      // Assert
      expect(authService.changePassword).toHaveBeenCalledWith(
        'user@example.com',
        'OldPassword123!',
        'NewPassword123!'
      );
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password changed successfully'
      });
    });
  });
});