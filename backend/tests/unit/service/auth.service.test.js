// tests/unit/service/auth.service.test.js
const authService = require('../../../src/services/auth.service');
const User = require('../../../src/models/user.model');
const RefreshToken = require('../../../src/models/refreshToken.model');
const passwordUtil = require('../../../src/utils/password.util');
const tokenUtil = require('../../../src/utils/token.util');
const mailService = require('../../../src/services/mail.service');

jest.mock('../../../src/models/user.model', () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn()
}));
jest.mock('../../../src/models/refreshToken.model', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn()
}));
jest.mock('../../../src/utils/password.util');
jest.mock('../../../src/utils/token.util');
jest.mock('../../../src/services/mail.service');

describe('Auth Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUserWithEmailToken', () => {
    it('should register a new user successfully', async () => {
      const payload = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!'
      };

      User.findOne.mockResolvedValue(null);
      passwordUtil.validatePasswordComplexity.mockReturnValue(true);
      passwordUtil.hashPassword.mockResolvedValue('hashedPassword');
      User.create.mockResolvedValue({
        user_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com'
      });
      tokenUtil.signEmail.mockReturnValue('emailToken');
      mailService.sendVerificationEmail.mockResolvedValue(true);

      const result = await authService.registerUserWithEmailToken(payload);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
      expect(passwordUtil.validatePasswordComplexity).toHaveBeenCalledWith('Password123!');
      expect(passwordUtil.hashPassword).toHaveBeenCalledWith('Password123!');
      expect(User.create).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password_hash: 'hashedPassword',
        role: 'USER',
        is_email_verified: false,
        date_of_birth: null,
        bio: null,
        linkedin_url: null,
        github_url: null,
        website_url: null
      });
      expect(tokenUtil.signEmail).toHaveBeenCalledWith({ id: 1, email: 'john@example.com' });
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith('john@example.com', 'emailToken');
      expect(result).toEqual({
        user: {
          user_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com'
        },
        emailToken: 'emailToken'
      });
    });

    it('should throw error if email already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await expect(authService.registerUserWithEmailToken({ email: 'existing@example.com' })).rejects.toThrow('An account with this email already exists');
    });

    it('should throw error if password does not meet complexity', async () => {
      User.findOne.mockResolvedValue(null);
      passwordUtil.validatePasswordComplexity.mockReturnValue(false);

      await expect(authService.registerUserWithEmailToken({ password: 'weak' })).rejects.toThrow('Password does not meet complexity requirements');
    });
  });

  describe('verifyEmailToken', () => {
    it('should verify email token successfully', async () => {
      const token = 'validToken';
      const payload = { id: 1, email: 'user@example.com' };
      const user = { user_id: 1, is_email_verified: false, save: jest.fn() };

      tokenUtil.verify.mockReturnValue(payload);
      User.findByPk.mockResolvedValue(user);

      const result = await authService.verifyEmailToken(token);

      expect(tokenUtil.verify).toHaveBeenCalledWith(token);
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(user.is_email_verified).toBe(true);
      expect(user.save).toHaveBeenCalled();
      expect(result).toBe(user);
    });

    it('should throw error if user not found', async () => {
      tokenUtil.verify.mockReturnValue({ id: 1 });
      User.findByPk.mockResolvedValue(null);

      await expect(authService.verifyEmailToken('token')).rejects.toThrow('User not found');
    });
  });

  describe('resendVerificationEmail', () => {
    it('should resend verification email', async () => {
      const user = { user_id: 1, email: 'user@example.com', is_email_verified: false };

      User.findOne.mockResolvedValue(user);
      tokenUtil.signEmail.mockReturnValue('token');
      mailService.sendVerificationEmail.mockResolvedValue(true);

      const result = await authService.resendVerificationEmail('user@example.com');

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'user@example.com' } });
      expect(tokenUtil.signEmail).toHaveBeenCalledWith({ id: 1, email: 'user@example.com' });
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith('user@example.com', 'token');
      expect(result).toBe(true);
    });

    it('should throw error if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(authService.resendVerificationEmail('nonexistent@example.com')).rejects.toThrow('User not found');
    });

    it('should throw error if email already verified', async () => {
      const user = { is_email_verified: true };

      User.findOne.mockResolvedValue(user);

      await expect(authService.resendVerificationEmail('verified@example.com')).rejects.toThrow('Email already verified');
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const user = {
        user_id: 1,
        email: 'user@example.com',
        password_hash: 'hashed',
        is_email_verified: true,
        role: 'USER'
      };

      User.findOne.mockResolvedValue(user);
      passwordUtil.comparePassword.mockResolvedValue(true);
      tokenUtil.signAccess.mockReturnValue('accessToken');
      tokenUtil.signRefresh.mockReturnValue('refreshToken');
      RefreshToken.create.mockResolvedValue(true);

      const result = await authService.login('user@example.com', 'password');

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'user@example.com' } });
      expect(passwordUtil.comparePassword).toHaveBeenCalledWith('password', 'hashed');
      expect(tokenUtil.signAccess).toHaveBeenCalledWith({ id: 1, role: 'USER' });
      expect(tokenUtil.signRefresh).toHaveBeenCalledWith({ id: 1, role: 'USER' });
      expect(RefreshToken.create).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user
      });
    });

    it('should throw error if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(authService.login('nonexistent@example.com', 'pass')).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if email not verified', async () => {
      const user = { is_email_verified: false };

      User.findOne.mockResolvedValue(user);

      await expect(authService.login('unverified@example.com', 'pass')).rejects.toThrow('Account not verified');
    });

    it('should throw error if password incorrect', async () => {
      const user = { is_email_verified: true, password_hash: 'hashed' };

      User.findOne.mockResolvedValue(user);
      passwordUtil.comparePassword.mockResolvedValue(false);

      await expect(authService.login('user@example.com', 'wrongpass')).rejects.toThrow('Incorrect password');
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens successfully', async () => {
      const dbToken = { update: jest.fn() };
      const payload = { id: 1, role: 'USER' };

      RefreshToken.findOne.mockResolvedValue(dbToken);
      tokenUtil.verify.mockReturnValue(payload);
      tokenUtil.signAccess.mockReturnValue('newAccess');
      tokenUtil.signRefresh.mockReturnValue('newRefresh');

      const result = await authService.refreshTokens('oldRefresh');

      expect(RefreshToken.findOne).toHaveBeenCalledWith({ where: { token: 'oldRefresh' } });
      expect(tokenUtil.verify).toHaveBeenCalledWith('oldRefresh');
      expect(tokenUtil.signAccess).toHaveBeenCalledWith({ id: 1, role: 'USER' });
      expect(tokenUtil.signRefresh).toHaveBeenCalledWith({ id: 1, role: 'USER' });
      expect(dbToken.update).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: 'newAccess',
        refreshToken: 'newRefresh'
      });
    });

    it('should throw error if refresh token not found', async () => {
      RefreshToken.findOne.mockResolvedValue(null);

      await expect(authService.refreshTokens('invalid')).rejects.toThrow('Invalid refresh token');
    });

    it('should throw error if token invalid and destroy db token', async () => {
      const dbToken = { destroy: jest.fn() };

      RefreshToken.findOne.mockResolvedValue(dbToken);
      tokenUtil.verify.mockImplementation(() => { throw new Error(); });

      await expect(authService.refreshTokens('invalid')).rejects.toThrow('Invalid or expired refresh token');
      expect(dbToken.destroy).toHaveBeenCalled();
    });
  });

  describe('revokeRefresh', () => {
    it('should revoke refresh token', async () => {
      RefreshToken.destroy.mockResolvedValue(1);

      await authService.revokeRefresh('token');

      expect(RefreshToken.destroy).toHaveBeenCalledWith({ where: { token: 'token' } });
    });
  });

  describe('requestPasswordReset', () => {
    it('should request password reset', async () => {
      const user = { user_id: 1, email: 'user@example.com' };

      User.findOne.mockResolvedValue(user);
      tokenUtil.signEmail.mockReturnValue('resetToken');
      mailService.sendPasswordResetEmail.mockResolvedValue(true);

      const result = await authService.requestPasswordReset('user@example.com');

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'user@example.com' } });
      expect(tokenUtil.signEmail).toHaveBeenCalledWith({ user_id: 1, type: 'PASSWORD_RESET' });
      expect(mailService.sendPasswordResetEmail).toHaveBeenCalledWith('user@example.com', 'resetToken');
      expect(result).toBe(true);
    });

    it('should throw error if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(authService.requestPasswordReset('nonexistent@example.com')).rejects.toThrow('User not found');
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const payload = { user_id: 1, type: 'PASSWORD_RESET' };
      const user = { password_hash: 'old', save: jest.fn() };

      tokenUtil.verify.mockReturnValue(payload);
      passwordUtil.validatePasswordComplexity.mockReturnValue(true);
      User.findByPk.mockResolvedValue(user);
      passwordUtil.hashPassword.mockResolvedValue('newHashed');

      const result = await authService.resetPassword('token', 'NewPass123!');

      expect(tokenUtil.verify).toHaveBeenCalledWith('token');
      expect(passwordUtil.validatePasswordComplexity).toHaveBeenCalledWith('NewPass123!');
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(passwordUtil.hashPassword).toHaveBeenCalledWith('NewPass123!');
      expect(user.password_hash).toBe('newHashed');
      expect(user.save).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw error if password complexity invalid', async () => {
      passwordUtil.validatePasswordComplexity.mockReturnValue(false);

      await expect(authService.resetPassword('token', 'weak')).rejects.toThrow('Password does not meet complexity requirements');
    });

    it('should throw error if token invalid', async () => {
      tokenUtil.verify.mockImplementation(() => { throw new Error(); });

      await expect(authService.resetPassword('invalid', 'pass')).rejects.toThrow('Invalid or expired token');
    });

    it('should throw error if token type wrong', async () => {
      tokenUtil.verify.mockReturnValue({ type: 'WRONG' });

      await expect(authService.resetPassword('token', 'pass')).rejects.toThrow('Invalid token type');
    });

    it('should throw error if user not found', async () => {
      tokenUtil.verify.mockReturnValue({ user_id: 1, type: 'PASSWORD_RESET' });
      User.findByPk.mockResolvedValue(null);

      await expect(authService.resetPassword('token', 'ValidPass123!')).rejects.toThrow('User not found');
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const user = { password_hash: 'old', save: jest.fn() };

      passwordUtil.validatePasswordComplexity.mockReturnValue(true);
      User.findByPk.mockResolvedValue(user);
      passwordUtil.comparePassword.mockResolvedValue(true);
      passwordUtil.hashPassword.mockResolvedValue('newHashed');

      const result = await authService.changePassword(1, 'oldPass', 'NewPass123!');

      expect(passwordUtil.validatePasswordComplexity).toHaveBeenCalledWith('NewPass123!');
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(passwordUtil.comparePassword).toHaveBeenCalledWith('oldPass', 'old');
      expect(passwordUtil.hashPassword).toHaveBeenCalledWith('NewPass123!');
      expect(user.password_hash).toBe('newHashed');
      expect(user.save).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw error if new password complexity invalid', async () => {
      passwordUtil.validatePasswordComplexity.mockReturnValue(false);

      await expect(authService.changePassword(1, 'old', 'weak')).rejects.toThrow('Password does not meet complexity requirements');
    });

    it('should throw error if user not found', async () => {
      passwordUtil.validatePasswordComplexity.mockReturnValue(true);
      User.findByPk.mockResolvedValue(null);

      await expect(authService.changePassword(1, 'old', 'new')).rejects.toThrow('User not found');
    });

    it('should throw error if old password incorrect', async () => {
      const user = { password_hash: 'old' };

      passwordUtil.validatePasswordComplexity.mockReturnValue(true);
      User.findByPk.mockResolvedValue(user);
      passwordUtil.comparePassword.mockResolvedValue(false);

      await expect(authService.changePassword(1, 'wrong', 'new')).rejects.toThrow('Old password incorrect');
    });
  });

  describe('findUserByEmail', () => {
    it('should find user by email', async () => {
      const user = { email: 'user@example.com' };

      User.findOne.mockResolvedValue(user);

      const result = await authService.findUserByEmail('user@example.com');

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'user@example.com' } });
      expect(result).toBe(user);
    });

    it('should throw error on database error', async () => {
      User.findOne.mockRejectedValue(new Error('DB error'));

      await expect(authService.findUserByEmail('user@example.com')).rejects.toThrow('Error finding user');
    });
  });
});