// tests/unit/utils/password.util.test.js

// 🔑 Mock bcrypt au niveau du fichier
const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn()
};

jest.mock('bcrypt', () => mockBcrypt);

// 🔑 Mock du logger au niveau du fichier
const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
};

jest.mock('../../../src/config/logger.config', () => mockLogger);

describe('Password Util - Unit Tests', () => {
  let passwordUtil;
  let originalEnv;

  beforeEach(() => {
    // Sauvegarder l'environnement
    originalEnv = { ...process.env };
    
    // Clear tous les mocks
    jest.clearAllMocks();
    jest.resetModules();
    
    // Recharger le module
    passwordUtil = require('../../../src/utils/password.util');
  });

  afterEach(() => {
    // Restaurer l'environnement
    process.env = originalEnv;
  });

  describe('hashPassword', () => {
    it('should hash password successfully with default salt rounds', async () => {
      process.env.BCRYPT_SALT = '10';
      const plainPassword = 'MyPassword123!';
      const hashedPassword = 'hashedPassword123';

      mockBcrypt.hash.mockResolvedValue(hashedPassword);

      // Recharger le module après configuration de l'env
      const passwordUtil = require('../../../src/utils/password.util');
      const result = await passwordUtil.hashPassword(plainPassword);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should hash password with custom salt rounds', async () => {
      process.env.BCRYPT_SALT = '12';
      const plainPassword = 'MyPassword123!';

      mockBcrypt.hash.mockResolvedValue('hashed');

      const passwordUtil = require('../../../src/utils/password.util');
      await passwordUtil.hashPassword(plainPassword);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(plainPassword, 12);
    });

    it('should use default salt rounds for invalid BCRYPT_SALT', async () => {
      process.env.BCRYPT_SALT = 'invalid';
      const plainPassword = 'MyPassword123!';

      mockBcrypt.hash.mockResolvedValue('hashed');

      const passwordUtil = require('../../../src/utils/password.util');
      await passwordUtil.hashPassword(plainPassword);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Valeur BCRYPT_SALT invalide, utilisation de la valeur par défaut: 10'
      );
    });

    it('should use default salt rounds for out-of-range BCRYPT_SALT', async () => {
      process.env.BCRYPT_SALT = '15'; // Too high
      const plainPassword = 'MyPassword123!';

      mockBcrypt.hash.mockResolvedValue('hashed');

      const passwordUtil = require('../../../src/utils/password.util');
      await passwordUtil.hashPassword(plainPassword);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Valeur BCRYPT_SALT invalide, utilisation de la valeur par défaut: 10'
      );
    });

    it('should throw error for invalid password input', async () => {
      await expect(passwordUtil.hashPassword(null)).rejects.toThrow(
        'Le mot de passe doit être une chaîne de caractères valide'
      );
      await expect(passwordUtil.hashPassword('')).rejects.toThrow(
        'Le mot de passe doit être une chaîne de caractères valide'
      );
      await expect(passwordUtil.hashPassword(123)).rejects.toThrow(
        'Le mot de passe doit être une chaîne de caractères valide'
      );
    });

    it('should throw error on bcrypt failure', async () => {
      mockBcrypt.hash.mockRejectedValue(new Error('Hash failed'));

      const passwordUtil = require('../../../src/utils/password.util');
      
      await expect(passwordUtil.hashPassword('password')).rejects.toThrow(
        'Erreur lors de la création du compte. Veuillez réessayer.'
      );
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      const plain = 'MyPassword123!';
      const hash = 'hashedPassword';

      mockBcrypt.compare.mockResolvedValue(true);

      const result = await passwordUtil.comparePassword(plain, hash);

      expect(mockBcrypt.compare).toHaveBeenCalledWith(plain, hash);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const plain = 'WrongPassword';
      const hash = 'hashedPassword';

      mockBcrypt.compare.mockResolvedValue(false);

      const result = await passwordUtil.comparePassword(plain, hash);

      expect(result).toBe(false);
    });

    it('should return false for invalid inputs', async () => {
      expect(await passwordUtil.comparePassword(null, 'hash')).toBe(false);
      expect(await passwordUtil.comparePassword('', 'hash')).toBe(false);
      expect(await passwordUtil.comparePassword('pass', null)).toBe(false);
      expect(await passwordUtil.comparePassword('pass', '')).toBe(false);
      expect(await passwordUtil.comparePassword(123, 'hash')).toBe(false);
      expect(await passwordUtil.comparePassword('pass', 123)).toBe(false);
    });

    it('should return false on bcrypt error', async () => {
      mockBcrypt.compare.mockRejectedValue(new Error('Compare failed'));

      const result = await passwordUtil.comparePassword('pass', 'hash');

      expect(result).toBe(false);
    });
  });

  describe('validatePasswordComplexity', () => {
    it('should return true for valid complex password', () => {
      const validPasswords = [
        'Password123!',
        'MySecurePass1@',
        'Complex123$',
        'Stronger2#',
        'ValidPass999?'
      ];

      validPasswords.forEach(password => {
        const result = passwordUtil.validatePasswordComplexity(password);
        expect(result).toBe(true);
      });
    });

    it('should return false for invalid passwords', () => {
      const invalidPasswords = [
        null,
        '',
        123,
        'short', // Too short
        'nouppercase123!', // No uppercase
        'NOLOWERCASE123!', // No lowercase
        'NoNumbers!', // No numbers
        'NoSpecial123', // No special characters
        'AlmostValid123' // Missing special character
      ];

      invalidPasswords.forEach(password => {
        expect(passwordUtil.validatePasswordComplexity(password)).toBe(false);
      });
    });

    it('should return false for passwords shorter than 8 characters', () => {
      expect(passwordUtil.validatePasswordComplexity('Pass1!')).toBe(false);
      expect(passwordUtil.validatePasswordComplexity('Short1!')).toBe(false);
    });
  });
});