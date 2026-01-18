// tests/unit/service/mail.service.test.js

const mockTransporter = {
  sendMail: jest.fn(),
  verify: jest.fn((callback) => callback && callback(null)) // Mock verify callback
};

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => mockTransporter)
}));

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
};

jest.mock('../../../src/config/logger.config', () => mockLogger);

describe('Mail Service - Unit Tests', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    
    // Clear tous les mocks
    jest.clearAllMocks();
    jest.resetModules(); // ✅ Important : reset le cache des modules
    
    const nodemailer = require('nodemailer');
    nodemailer.createTransport.mockReturnValue(mockTransporter);
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('sendVerificationEmail', () => {
    it('should log email in development mode (no transporter)', async () => {
      // ✅ Définir l'env AVANT de charger le module
      delete process.env.MAIL_USER;
      delete process.env.MAIL_PASS;
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASSWORD;
      process.env.FRONTEND_URL = 'http://localhost:3000';

      // ✅ Charger le module APRÈS avoir configuré l'env
      const mailService = require('../../../src/services/mail.service');
      
      const result = await mailService.sendVerificationEmail('test@example.com', 'token123');

      expect(result).toBe(true);
      expect(mockLogger.info).toHaveBeenCalledWith(
        'VERIFICATION EMAIL (dev mode – not sent)',
        { to: 'test@example.com' }
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Verification link → http://localhost:3000/verify-email?token=token123'
      );
    });

    it('should send verification email in production mode', async () => {
      // ✅ Définir l'env AVANT de charger le module
      process.env.MAIL_USER = 'user@example.com';
      process.env.MAIL_PASS = 'password';
      process.env.FRONTEND_URL = 'https://app.example.com';
      process.env.EMAIL_FROM = 'noreply@example.com';

      mockTransporter.sendMail.mockResolvedValue({ messageId: '123' });

      // ✅ Charger le module APRÈS avoir configuré l'env
      const mailService = require('../../../src/services/mail.service');
      
      const result = await mailService.sendVerificationEmail('user@example.com', 'token456');

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'noreply@example.com',
        to: 'user@example.com',
        subject: 'Verify your email – Griote Foundation',
        html: expect.stringContaining('Welcome to Griote Foundation!')
      });
      expect(mockTransporter.sendMail.mock.calls[0][0].html).toContain(
        'https://app.example.com/verify-email?token=token456'
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Verification email sent successfully',
        { to: 'user@example.com' }
      );
    });

    it('should handle send failure gracefully', async () => {
      process.env.MAIL_USER = 'user@example.com';
      process.env.MAIL_PASS = 'password';
      process.env.FRONTEND_URL = 'https://app.example.com';

      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP error'));

      const mailService = require('../../../src/services/mail.service');
      
      const result = await mailService.sendVerificationEmail('user@example.com', 'token');

      expect(result).toBe(true);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Failed to send verification email (registration continues anyway)',
        { to: 'user@example.com', error: 'SMTP error' }
      );
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should log password reset email in development mode', async () => {
      delete process.env.MAIL_USER;
      delete process.env.MAIL_PASS;
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASSWORD;
      process.env.FRONTEND_URL = 'http://localhost:3000';

      const mailService = require('../../../src/services/mail.service');
      
      const result = await mailService.sendPasswordResetEmail('test@example.com', 'resetToken');

      expect(result).toBe(true);
      expect(mockLogger.info).toHaveBeenCalledWith(
        'PASSWORD RESET EMAIL (dev mode – not sent)',
        { to: 'test@example.com' }
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Reset link → http://localhost:3000/reset-password?token=resetToken'
      );
    });

    it('should send password reset email in production mode', async () => {
      process.env.MAIL_USER = 'user@example.com';
      process.env.MAIL_PASS = 'password';
      process.env.FRONTEND_URL = 'https://app.example.com';

      mockTransporter.sendMail.mockResolvedValue({ messageId: '456' });

      const mailService = require('../../../src/services/mail.service');
      
      const result = await mailService.sendPasswordResetEmail('user@example.com', 'resetToken123');

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"Griote Foundation" <no-reply@griote.org>',
        to: 'user@example.com',
        subject: 'Reset your password – Griote Foundation',
        html: expect.stringContaining('Password reset request')
      });
      expect(mockTransporter.sendMail.mock.calls[0][0].html).toContain(
        'https://app.example.com/reset-password?token=resetToken123'
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Password reset email sent successfully',
        { to: 'user@example.com' }
      );
    });

    it('should handle password reset send failure gracefully', async () => {
      process.env.MAIL_USER = 'user@example.com';
      process.env.MAIL_PASS = 'password';
      process.env.FRONTEND_URL = 'https://app.example.com';

      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP error'));

      const mailService = require('../../../src/services/mail.service');
      
      const result = await mailService.sendPasswordResetEmail('user@example.com', 'token');

      expect(result).toBe(true);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Failed to send password reset email (operation continues)',
        { to: 'user@example.com', error: 'SMTP error' }
      );
    });
  });

  describe('transporter configuration', () => {
    it('should configure transporter with credentials', () => {
      process.env.MAIL_HOST = 'smtp.example.com';
      process.env.MAIL_PORT = '587';
      process.env.MAIL_SECURE = 'false';
      process.env.MAIL_USER = 'user@example.com';
      process.env.MAIL_PASS = 'password';

      const nodemailer = require('nodemailer');
      
      const mailService = require('../../../src/services/mail.service');
      
      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          host: 'smtp.example.com',
          port: 587,
          secure: false,
          auth: {
            user: 'user@example.com',
            pass: 'password'
          }
        })
      );
      expect(mailService.transporter).toBeDefined();
      expect(mailService.transporter).not.toBeNull();
    });

    it('should not configure transporter without credentials', () => {
      delete process.env.MAIL_USER;
      delete process.env.MAIL_PASS;
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASSWORD;

      const nodemailer = require('nodemailer');
      
      const mailService = require('../../../src/services/mail.service');
      
      // Le transporter ne devrait pas être créé
      expect(mailService.transporter).toBeNull();
    });
  });
});