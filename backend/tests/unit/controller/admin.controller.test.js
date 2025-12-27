// tests/unit/controller/admin.controller.test.js
const adminController = require('../../../src/controllers/admin.controller');
const adminService = require('../../../src/services/admin.service');
const { mockRequest, mockResponse } = require('../../setup/mock');
const { adminUser, regularUser } = require('../../fixtures/users.fixture');

jest.mock('../../../src/services/admin.service');

describe('Admin Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
    // Mock console.error pour éviter les logs pendant les tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('GET /admin/users', () => {
    it('devrait retourner la liste des utilisateurs avec pagination', async () => {
      // Arrange
      req.query = { page: 1, limit: 10 };
      
      const mockResult = {
        users: [regularUser, adminUser],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1
        }
      };
      
      adminService.getAllUsers.mockResolvedValue(mockResult);

      // Act
      await adminController.getAllUsers(req, res);

      // Assert
      expect(adminService.getAllUsers).toHaveBeenCalledWith(
        1, 
        10, 
        { role: undefined, email: undefined, name: undefined }
      );
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('devrait filtrer par role', async () => {
      // Arrange
      req.query = { page: 1, limit: 10, role: 'ADMIN' };
      
      const mockResult = {
        users: [adminUser],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
      };
      
      adminService.getAllUsers.mockResolvedValue(mockResult);

      // Act
      await adminController.getAllUsers(req, res);

      // Assert
      expect(adminService.getAllUsers).toHaveBeenCalledWith(
        1, 
        10, 
        { role: 'ADMIN', email: undefined, name: undefined }
      );
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('devrait retourner 500 en cas d\'erreur', async () => {
      // Arrange
      req.query = {};
      adminService.getAllUsers.mockRejectedValue(new Error('Database error'));

      // Act
      await adminController.getAllUsers(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('GET /admin/users/:userId', () => {
    it('devrait retourner un utilisateur par ID', async () => {
      // Arrange
      req.params = { userId: '1' };
      adminService.getUserById.mockResolvedValue(regularUser);

      // Act
      await adminController.getUserById(req, res);

      // Assert
      expect(adminService.getUserById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(regularUser);
    });

    it('devrait retourner 404 si utilisateur non trouvé', async () => {
      // Arrange
      req.params = { userId: '999' };
      adminService.getUserById.mockRejectedValue(new Error('User not found'));

      // Act
      await adminController.getUserById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('POST /admin/create-admin', () => {
    it('devrait créer un nouvel admin', async () => {
      // Arrange
      req.body = {
        email: 'newadmin@example.com',
        firstName: 'New',
        lastName: 'Admin',
        password: 'AdminPass123!'
      };
      
      const newAdmin = {
        ...adminUser,
        email: 'newadmin@example.com'
      };
      
      adminService.createAdmin.mockResolvedValue(newAdmin);

      // Act
      await adminController.createAdmin(req, res);

      // Assert
      expect(adminService.createAdmin).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newAdmin);
    });

    it('devrait retourner 400 si données invalides', async () => {
      // Arrange
      req.body = { email: 'invalid' };
      adminService.createAdmin.mockRejectedValue(new Error('Invalid email'));

      // Act
      await adminController.createAdmin(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email' });
    });
  });

  describe('PUT /admin/users/:userId/role', () => {
    it('devrait mettre à jour le rôle d\'un utilisateur', async () => {
      // Arrange
      req.params = { userId: '2' };
      req.body = { role: 'ADMIN' };
      
      const updatedUser = { ...regularUser, role: 'ADMIN' };
      adminService.updateUserRole.mockResolvedValue(updatedUser);

      // Act
      await adminController.updateUserRole(req, res);

      // Assert
      expect(adminService.updateUserRole).toHaveBeenCalledWith('2', 'ADMIN');
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it('devrait retourner 400 si rôle invalide', async () => {
      // Arrange
      req.params = { userId: '2' };
      req.body = { role: 'INVALID_ROLE' };
      adminService.updateUserRole.mockRejectedValue(new Error('Invalid role'));

      // Act
      await adminController.updateUserRole(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid role' });
    });
  });

  describe('PUT /admin/users/:userId', () => {
    it('devrait mettre à jour les informations utilisateur', async () => {
      // Arrange
      req.params = { userId: '2' };
      req.body = {
        first_name: 'Updated',
        last_name: 'Name'
      };
      
      const updatedUser = {
        ...regularUser,
        first_name: 'Updated',
        last_name: 'Name'
      };
      
      adminService.updateUser.mockResolvedValue(updatedUser);

      // Act
      await adminController.updateUser(req, res);

      // Assert
      expect(adminService.updateUser).toHaveBeenCalledWith('2', req.body);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });
  });

  describe('DELETE /admin/users/:userId', () => {
    it('devrait supprimer un utilisateur', async () => {
      // Arrange
      req.params = { userId: '2' };
      adminService.deleteUser.mockResolvedValue({ message: 'User deleted' });

      // Act
      await adminController.deleteUser(req, res);

      // Assert
      expect(adminService.deleteUser).toHaveBeenCalledWith('2');
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted' });
    });

    it('devrait retourner 400 si suppression échoue', async () => {
      // Arrange
      req.params = { userId: '1' };
      adminService.deleteUser.mockRejectedValue(new Error('Cannot delete admin'));

      // Act
      await adminController.deleteUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cannot delete admin' });
    });
  });

  describe('GET /admin/stats', () => {
    it('devrait retourner les statistiques de la plateforme', async () => {
      // Arrange
      const mockStats = {
        totalUsers: 150,
        totalDepots: 45,
        totalDocuments: 230,
        usersByRole: {
          ADMIN: 5,
          USER: 145
        }
      };
      
      adminService.getPlatformStats.mockResolvedValue(mockStats);

      // Act
      await adminController.getPlatformStats(req, res);

      // Assert
      expect(adminService.getPlatformStats).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockStats);
    });

    it('devrait retourner 500 en cas d\'erreur', async () => {
      // Arrange
      adminService.getPlatformStats.mockRejectedValue(new Error('Stats error'));

      // Act
      await adminController.getPlatformStats(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Stats error' });
    });
  });

  describe('POST /admin/users/:userId/reset-password', () => {
    it('devrait réinitialiser le mot de passe', async () => {
      // Arrange
      req.params = { userId: '2' };
      req.body = { newPassword: 'NewSecurePass123!' };
      
      adminService.resetUserPassword.mockResolvedValue({
        message: 'Password reset successfully'
      });

      // Act
      await adminController.resetUserPassword(req, res);

      // Assert
      expect(adminService.resetUserPassword).toHaveBeenCalledWith(
        '2',
        'NewSecurePass123!'
      );
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password reset successfully'
      });
    });

    it('devrait retourner 400 si mot de passe trop court', async () => {
      // Arrange
      req.params = { userId: '2' };
      req.body = { newPassword: '12345' };

      // Act
      await adminController.resetUserPassword(req, res);

      // Assert
      expect(adminService.resetUserPassword).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password must be at least 6 characters long'
      });
    });

    it('devrait retourner 400 si mot de passe manquant', async () => {
      // Arrange
      req.params = { userId: '2' };
      req.body = {};

      // Act
      await adminController.resetUserPassword(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password must be at least 6 characters long'
      });
    });
  });
});