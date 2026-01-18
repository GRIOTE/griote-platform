// tests/unit/dtos/register.dto.test.js
const { validateRegister, RegisterDTO } = require('../../../src/dtos/register.dto');

describe('Register DTO - Unit Tests', () => {
  describe('validateRegister', () => {
    it('should validate valid registration data', async () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        passwordConfirm: 'Password123!'
      };

      const result = await validateRegister(validData);

      expect(result).toEqual({ ...validData, role: 'USER' });
    });

    it('should validate with default role', async () => {
      const dataWithoutRole = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'SecurePass123!',
        passwordConfirm: 'SecurePass123!'
      };

      const result = await validateRegister(dataWithoutRole);

      expect(result.role).toBe('USER');
    });

    it('should reject invalid email', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'Password123!',
        passwordConfirm: 'Password123!'
      };

      await expect(validateRegister(invalidData)).rejects.toThrow();
    });

    it('should reject password too short', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Short1!',
        passwordConfirm: 'Short1!'
      };

      await expect(validateRegister(invalidData)).rejects.toThrow();
    });

    it('should reject password without uppercase', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123!',
        passwordConfirm: 'password123!'
      };

      await expect(validateRegister(invalidData)).rejects.toThrow();
    });

    it('should reject password without lowercase', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'PASSWORD123!',
        passwordConfirm: 'PASSWORD123!'
      };

      await expect(validateRegister(invalidData)).rejects.toThrow();
    });

    it('should reject password without numbers', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password!',
        passwordConfirm: 'Password!'
      };

      await expect(validateRegister(invalidData)).rejects.toThrow();
    });

    it('should reject password without special characters', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123',
        passwordConfirm: 'Password123'
      };

      await expect(validateRegister(invalidData)).rejects.toThrow();
    });

    it('should reject mismatched passwords', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        passwordConfirm: 'Different123!'
      };

      await expect(validateRegister(invalidData)).rejects.toThrow('Les mots de passe ne correspondent pas');
    });

    it('should reject missing required fields', async () => {
      const invalidData = {
        email: 'john@example.com',
        password: 'Password123!',
        passwordConfirm: 'Password123!'
      };

      await expect(validateRegister(invalidData)).rejects.toThrow();
    });

    it('should reject extra unknown fields', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        passwordConfirm: 'Password123!',
        extraField: 'not allowed'
      };

      await expect(validateRegister(invalidData)).rejects.toThrow();
    });

    it('should accept valid admin role', async () => {
      const validData = {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'AdminPass123!',
        passwordConfirm: 'AdminPass123!',
        role: 'ADMIN'
      };

      const result = await validateRegister(validData);

      expect(result.role).toBe('ADMIN');
    });

    it('should reject invalid role', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        passwordConfirm: 'Password123!',
        role: 'INVALID'
      };

      await expect(validateRegister(invalidData)).rejects.toThrow();
    });
  });

});