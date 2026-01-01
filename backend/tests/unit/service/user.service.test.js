// tests/unit/service/user.service.test.js

// 🔑 Définir mockOp AVANT le mock de sequelize
const mockOp = {
  iLike: Symbol('iLike'),
  or: Symbol('or'),
  ne: Symbol('ne')
};

// 🔑 Mock sequelize avec mockOp
jest.mock('sequelize', () => ({
  Op: mockOp
}));

// 🔑 Mock bcrypt
const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn()
};

jest.mock('bcrypt', () => mockBcrypt);

// 🔑 Mock User model
const mockUser = {
  findByPk: jest.fn(),
  findOne: jest.fn(),
  findAndCountAll: jest.fn(),
  create: jest.fn()
};

jest.mock('../../../src/models/user.model', () => mockUser);

describe('User Service - Unit Tests', () => {
  let userService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    
    // Recharger le service après avoir nettoyé les mocks
    userService = require('../../../src/services/user.service');
  });

  // ==================== USER OPERATIONS ====================

  describe('getFullProfile', () => {
    it('should return user profile without password', async () => {
      const mockUserData = {
        user_id: 1,
        email: 'user@example.com',
        first_name: 'John',
        last_name: 'Doe'
      };

      mockUser.findByPk.mockResolvedValue(mockUserData);

      const result = await userService.getFullProfile(1);

      expect(mockUser.findByPk).toHaveBeenCalledWith(1, {
        attributes: { exclude: ['password_hash'] }
      });
      expect(result).toEqual(mockUserData);
    });

    it('should throw error if user not found', async () => {
      mockUser.findByPk.mockResolvedValue(null);

      await expect(userService.getFullProfile(999)).rejects.toThrow('User not found');
      expect(mockUser.findByPk).toHaveBeenCalledWith(999, {
        attributes: { exclude: ['password_hash'] }
      });
    });
  });

  describe('updateFullProfile', () => {
    it('should update user profile successfully', async () => {
      const existingUser = {
        user_id: 1,
        first_name: 'Old',
        last_name: 'Name',
        bio: 'Old bio',
        linkedin_url: null,
        github_url: null,
        website_url: null,
        date_of_birth: null,
        save: jest.fn().mockResolvedValue(true)
      };

      const updateData = {
        firstName: 'New',
        lastName: 'Updated',
        bio: 'New bio',
        linkedin_url: 'https://linkedin.com/in/user',
        github_url: 'https://github.com/user',
        website_url: 'https://example.com',
        date_of_birth: '1990-01-01'
      };

      const updatedUser = {
        user_id: 1,
        first_name: 'New',
        last_name: 'Updated',
        bio: 'New bio',
        linkedin_url: 'https://linkedin.com/in/user',
        github_url: 'https://github.com/user',
        website_url: 'https://example.com',
        date_of_birth: '1990-01-01'
      };

      // Premier appel : findByPk dans updateFullProfile
      // Deuxième appel : findByPk dans getFullProfile (appelé à la fin)
      mockUser.findByPk
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(updatedUser);

      const result = await userService.updateFullProfile(1, updateData);

      expect(existingUser.first_name).toBe('New');
      expect(existingUser.last_name).toBe('Updated');
      expect(existingUser.bio).toBe('New bio');
      expect(existingUser.linkedin_url).toBe('https://linkedin.com/in/user');
      expect(existingUser.github_url).toBe('https://github.com/user');
      expect(existingUser.website_url).toBe('https://example.com');
      expect(existingUser.date_of_birth).toBe('1990-01-01');
      expect(existingUser.save).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it('should update only provided fields', async () => {
      const existingUser = {
        user_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        bio: 'Old bio',
        save: jest.fn().mockResolvedValue(true)
      };

      const updateData = {
        bio: 'New bio only'
      };

      const updatedUser = {
        user_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        bio: 'New bio only'
      };

      mockUser.findByPk
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(updatedUser);

      const result = await userService.updateFullProfile(1, updateData);

      expect(existingUser.first_name).toBe('John'); // Unchanged
      expect(existingUser.last_name).toBe('Doe'); // Unchanged
      expect(existingUser.bio).toBe('New bio only'); // Updated
      expect(existingUser.save).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      mockUser.findByPk.mockResolvedValue(null);

      await expect(
        userService.updateFullProfile(999, { firstName: 'Test' })
      ).rejects.toThrow('User not found');
    });
  });

  describe('getUserById', () => {
    it('should return user by id without password', async () => {
      const mockUserData = {
        user_id: 1,
        email: 'user@example.com',
        first_name: 'Jane',
        last_name: 'Smith'
      };

      mockUser.findByPk.mockResolvedValue(mockUserData);

      const result = await userService.getUserById(1);

      expect(mockUser.findByPk).toHaveBeenCalledWith(1, {
        attributes: { exclude: ['password_hash'] }
      });
      expect(result).toEqual(mockUserData);
    });

    it('should throw error if user not found', async () => {
      mockUser.findByPk.mockResolvedValue(null);

      await expect(userService.getUserById(999)).rejects.toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockUserData = {
        user_id: 1,
        email: 'user@example.com',
        destroy: jest.fn().mockResolvedValue(true)
      };

      mockUser.findByPk.mockResolvedValue(mockUserData);

      const result = await userService.deleteUser(1);

      expect(mockUser.findByPk).toHaveBeenCalledWith(1);
      expect(mockUserData.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should throw error if user not found', async () => {
      mockUser.findByPk.mockResolvedValue(null);

      await expect(userService.deleteUser(999)).rejects.toThrow('User not found');
      expect(mockUser.findByPk).toHaveBeenCalledWith(999);
    });
  });

  // ==================== ADMIN OPERATIONS ====================

  describe('getAllUsers', () => {
    it('should return paginated users without filters', async () => {
      const mockUsers = [
        { user_id: 1, email: 'user1@example.com', first_name: 'User', last_name: 'One' },
        { user_id: 2, email: 'user2@example.com', first_name: 'User', last_name: 'Two' }
      ];

      mockUser.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockUsers
      });

      const result = await userService.getAllUsers(1, 10, {});

      expect(mockUser.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        limit: 10,
        offset: 0,
        order: [['created_at', 'DESC']],
        attributes: { exclude: ['password_hash'] }
      });

      expect(result).toEqual({
        users: mockUsers,
        totalUsers: 2,
        totalPages: 1,
        currentPage: 1
      });
    });

    it('should apply role filter', async () => {
      mockUser.findAndCountAll.mockResolvedValue({
        count: 0,
        rows: []
      });

      await userService.getAllUsers(1, 10, { role: 'ADMIN' });

      expect(mockUser.findAndCountAll).toHaveBeenCalledWith({
        where: { role: 'ADMIN' },
        limit: 10,
        offset: 0,
        order: [['created_at', 'DESC']],
        attributes: { exclude: ['password_hash'] }
      });
    });

    it('should apply email filter', async () => {
      mockUser.findAndCountAll.mockResolvedValue({
        count: 0,
        rows: []
      });

      await userService.getAllUsers(1, 10, { email: 'test' });

      expect(mockUser.findAndCountAll).toHaveBeenCalledWith({
        where: {
          email: { [mockOp.iLike]: '%test%' }
        },
        limit: 10,
        offset: 0,
        order: [['created_at', 'DESC']],
        attributes: { exclude: ['password_hash'] }
      });
    });

    it('should apply name filter', async () => {
      mockUser.findAndCountAll.mockResolvedValue({
        count: 0,
        rows: []
      });

      await userService.getAllUsers(1, 10, { name: 'John' });

      expect(mockUser.findAndCountAll).toHaveBeenCalledWith({
        where: {
          [mockOp.or]: [
            { first_name: { [mockOp.iLike]: '%John%' } },
            { last_name: { [mockOp.iLike]: '%John%' } }
          ]
        },
        limit: 10,
        offset: 0,
        order: [['created_at', 'DESC']],
        attributes: { exclude: ['password_hash'] }
      });
    });

    it('should apply multiple filters', async () => {
      mockUser.findAndCountAll.mockResolvedValue({
        count: 0,
        rows: []
      });

      await userService.getAllUsers(1, 10, {
        role: 'ADMIN',
        email: 'test',
        name: 'John'
      });

      expect(mockUser.findAndCountAll).toHaveBeenCalledWith({
        where: {
          role: 'ADMIN',
          email: { [mockOp.iLike]: '%test%' },
          [mockOp.or]: [
            { first_name: { [mockOp.iLike]: '%John%' } },
            { last_name: { [mockOp.iLike]: '%John%' } }
          ]
        },
        limit: 10,
        offset: 0,
        order: [['created_at', 'DESC']],
        attributes: { exclude: ['password_hash'] }
      });
    });

    it('should handle pagination correctly', async () => {
      const mockUsers = Array.from({ length: 5 }, (_, i) => ({
        user_id: i + 1,
        email: `user${i + 1}@example.com`
      }));

      mockUser.findAndCountAll.mockResolvedValue({
        count: 25,
        rows: mockUsers
      });

      const result = await userService.getAllUsers(2, 5, {});

      expect(mockUser.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        limit: 5,
        offset: 5, // (page 2 - 1) * 5 = 5
        order: [['created_at', 'DESC']],
        attributes: { exclude: ['password_hash'] }
      });

      expect(result).toEqual({
        users: mockUsers,
        totalUsers: 25,
        totalPages: 5,
        currentPage: 2
      });
    });
  });

  describe('createAdmin', () => {
    it('should create admin user successfully', async () => {
      const adminData = {
        email: 'admin@example.com',
        password: 'SecurePass123!',
        first_name: 'Admin',
        last_name: 'User'
      };

      const createdAdmin = {
        user_id: 1,
        email: 'admin@example.com',
        password_hash: 'hashedPassword',
        first_name: 'Admin',
        last_name: 'User',
        role: 'ADMIN',
        is_email_verified: true,
        toJSON: jest.fn().mockReturnValue({
          user_id: 1,
          email: 'admin@example.com',
          password_hash: 'hashedPassword',
          first_name: 'Admin',
          last_name: 'User',
          role: 'ADMIN',
          is_email_verified: true
        })
      };

      mockUser.findOne.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('hashedPassword');
      mockUser.create.mockResolvedValue(createdAdmin);

      const result = await userService.createAdmin(adminData);

      expect(mockUser.findOne).toHaveBeenCalledWith({
        where: { email: 'admin@example.com' }
      });
      expect(mockBcrypt.hash).toHaveBeenCalledWith('SecurePass123!', 10);
      expect(mockUser.create).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password_hash: 'hashedPassword',
        first_name: 'Admin',
        last_name: 'User',
        role: 'ADMIN',
        is_email_verified: true
      });

      expect(result).toEqual({
        user_id: 1,
        email: 'admin@example.com',
        first_name: 'Admin',
        last_name: 'User',
        role: 'ADMIN',
        is_email_verified: true
      });
      expect(result.password_hash).toBeUndefined();
    });

    it('should throw error if email already exists', async () => {
      const existingUser = {
        user_id: 1,
        email: 'existing@example.com'
      };

      mockUser.findOne.mockResolvedValue(existingUser);

      await expect(
        userService.createAdmin({
          email: 'existing@example.com',
          password: 'Password123!',
          first_name: 'Test',
          last_name: 'User'
        })
      ).rejects.toThrow('User with this email already exists');

      expect(mockBcrypt.hash).not.toHaveBeenCalled();
      expect(mockUser.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUserRole', () => {
    it('should update user role to ADMIN', async () => {
      const mockUserData = {
        user_id: 1,
        email: 'user@example.com',
        role: 'USER',
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          user_id: 1,
          email: 'user@example.com',
          role: 'ADMIN',
          password_hash: 'hashedPassword'
        })
      };

      mockUser.findByPk.mockResolvedValue(mockUserData);

      const result = await userService.updateUserRole(1, 'ADMIN');

      expect(mockUser.findByPk).toHaveBeenCalledWith(1);
      expect(mockUserData.role).toBe('ADMIN');
      expect(mockUserData.save).toHaveBeenCalled();
      expect(result).toEqual({
        user_id: 1,
        email: 'user@example.com',
        role: 'ADMIN'
      });
      expect(result.password_hash).toBeUndefined();
    });

    it('should update user role to USER', async () => {
      const mockUserData = {
        user_id: 1,
        email: 'admin@example.com',
        role: 'ADMIN',
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          user_id: 1,
          email: 'admin@example.com',
          role: 'USER',
          password_hash: 'hashedPassword'
        })
      };

      mockUser.findByPk.mockResolvedValue(mockUserData);

      const result = await userService.updateUserRole(1, 'USER');

      expect(mockUserData.role).toBe('USER');
      expect(mockUserData.save).toHaveBeenCalled();
      expect(result.role).toBe('USER');
    });

    it('should throw error for invalid role', async () => {
      await expect(
        userService.updateUserRole(1, 'SUPERADMIN')
      ).rejects.toThrow('Invalid role specified');

      await expect(
        userService.updateUserRole(1, 'INVALID')
      ).rejects.toThrow('Invalid role specified');

      expect(mockUser.findByPk).not.toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      mockUser.findByPk.mockResolvedValue(null);

      await expect(
        userService.updateUserRole(999, 'ADMIN')
      ).rejects.toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    it('should update user with allowed fields', async () => {
      const mockUserData = {
        user_id: 1,
        email: 'old@example.com',
        first_name: 'Old',
        last_name: 'Name',
        update: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          user_id: 1,
          email: 'new@example.com',
          first_name: 'New',
          last_name: 'Name',
          password_hash: 'hashedPassword'
        })
      };

      const updateData = {
        email: 'new@example.com',
        first_name: 'New',
        bio: 'Updated bio'
      };

      mockUser.findByPk.mockResolvedValue(mockUserData);
      mockUser.findOne.mockResolvedValue(null); // Email not in use

      const result = await userService.updateUser(1, updateData);

      expect(mockUser.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.findOne).toHaveBeenCalledWith({
        where: {
          email: 'new@example.com',
          user_id: { [mockOp.ne]: 1 }
        }
      });
      expect(mockUserData.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual({
        user_id: 1,
        email: 'new@example.com',
        first_name: 'New',
        last_name: 'Name'
      });
      expect(result.password_hash).toBeUndefined();
    });

    it('should filter out non-allowed fields', async () => {
      const mockUserData = {
        user_id: 1,
        email: 'user@example.com',
        update: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          user_id: 1,
          email: 'user@example.com',
          password_hash: 'hashedPassword'
        })
      };

      const updateData = {
        first_name: 'New',
        hacker_field: 'malicious', // Should be filtered out
        user_id: 999 // Should be filtered out
      };

      mockUser.findByPk.mockResolvedValue(mockUserData);

      await userService.updateUser(1, updateData);

      // Verify only first_name is passed to update
      expect(mockUserData.update).toHaveBeenCalledWith({
        first_name: 'New'
      });
    });

    it('should throw error if email already in use by another user', async () => {
      const mockUserData = {
        user_id: 1,
        email: 'old@example.com'
      };

      const existingUser = {
        user_id: 2,
        email: 'existing@example.com'
      };

      mockUser.findByPk.mockResolvedValue(mockUserData);
      mockUser.findOne.mockResolvedValue(existingUser);

      await expect(
        userService.updateUser(1, { email: 'existing@example.com' })
      ).rejects.toThrow('Email already in use');

      expect(mockUser.findOne).toHaveBeenCalledWith({
        where: {
          email: 'existing@example.com',
          user_id: { [mockOp.ne]: 1 }
        }
      });
    });

    it('should allow updating to same email', async () => {
      const mockUserData = {
        user_id: 1,
        email: 'same@example.com',
        update: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          user_id: 1,
          email: 'same@example.com',
          first_name: 'Updated',
          password_hash: 'hashedPassword'
        })
      };

      mockUser.findByPk.mockResolvedValue(mockUserData);

      const result = await userService.updateUser(1, {
        first_name: 'Updated'
        // No email change
      });

      // findOne should not be called since email is not being changed
      expect(mockUser.findOne).not.toHaveBeenCalled();
      expect(result.first_name).toBe('Updated');
    });

    it('should throw error if user not found', async () => {
      mockUser.findByPk.mockResolvedValue(null);

      await expect(
        userService.updateUser(999, { first_name: 'Test' })
      ).rejects.toThrow('User not found');
    });
  });

  describe('resetUserPassword', () => {
    it('should reset user password successfully', async () => {
      const mockUserData = {
        user_id: 1,
        email: 'user@example.com',
        update: jest.fn().mockResolvedValue(true)
      };

      mockUser.findByPk.mockResolvedValue(mockUserData);
      mockBcrypt.hash.mockResolvedValue('newHashedPassword');

      const result = await userService.resetUserPassword(1, 'NewSecurePass123!');

      expect(mockUser.findByPk).toHaveBeenCalledWith(1);
      expect(mockBcrypt.hash).toHaveBeenCalledWith('NewSecurePass123!', 10);
      expect(mockUserData.update).toHaveBeenCalledWith({
        password_hash: 'newHashedPassword'
      });
      expect(result).toEqual({
        message: 'Password reset successfully'
      });
    });

    it('should throw error if user not found', async () => {
      mockUser.findByPk.mockResolvedValue(null);

      await expect(
        userService.resetUserPassword(999, 'NewPassword123!')
      ).rejects.toThrow('User not found');

      expect(mockBcrypt.hash).not.toHaveBeenCalled();
    });
  });
});