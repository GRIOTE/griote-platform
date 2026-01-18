// tests/unit/controller/user.controller.test.js
const userController = require('../../../src/controllers/user.controller');
const userService = require('../../../src/services/user.service');
const { mockRequest, mockResponse } = require('../../setup/mock');
const { regularUser } = require('../../fixtures/users.fixture');

jest.mock('../../../src/services/user.service');

describe('User Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('GET /users/profile', () => {
    it('devrait retourner le profil complet de l\'utilisateur', async () => {
      // Arrange
      req.user = { id: 1 };
      
      const fullProfile = {
        ...regularUser,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      };
      
      userService.getFullProfile.mockResolvedValue(fullProfile);

      // Act
      await userController.getProfile(req, res);

      // Assert
      expect(userService.getFullProfile).toHaveBeenCalledWith(1);
      expect(userService.getFullProfile).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fullProfile);
    });

    it('devrait retourner 404 si utilisateur non trouvé', async () => {
      // Arrange
      req.user = { id: 999 };
      
      userService.getFullProfile.mockRejectedValue(
        new Error('User not found')
      );

      // Act
      await userController.getProfile(req, res);

      // Assert
      expect(userService.getFullProfile).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found'
      });
    });

    it('devrait retourner 404 en cas d\'erreur du service', async () => {
      // Arrange
      req.user = { id: 1 };
      
      userService.getFullProfile.mockRejectedValue(
        new Error('Database connection error')
      );

      // Act
      await userController.getProfile(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Database connection error'
      });
    });
  });

  describe('PUT /users/profile', () => {
    it('devrait mettre à jour le profil avec succès', async () => {
      // Arrange
      req.user = { id: 1 };
      req.body = {
        first_name: 'UpdatedName',
        last_name: 'UpdatedLastName'
      };
      
      const updatedProfile = {
        ...regularUser,
        first_name: 'UpdatedName',
        last_name: 'UpdatedLastName',
        updated_at: new Date().toISOString()
      };
      
      userService.updateFullProfile.mockResolvedValue(updatedProfile);

      // Act
      await userController.updateProfile(req, res);

      // Assert
      expect(userService.updateFullProfile).toHaveBeenCalledWith(1, {
        first_name: 'UpdatedName',
        last_name: 'UpdatedLastName'
      });
      expect(userService.updateFullProfile).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedProfile);
    });

    it('devrait retourner 400 si données invalides', async () => {
      // Arrange
      req.user = { id: 1 };
      req.body = {
        first_name: '', // Nom vide invalide
        last_name: 'Doe'
      };
      
      userService.updateFullProfile.mockRejectedValue(
        new Error('First name cannot be empty')
      );

      // Act
      await userController.updateProfile(req, res);

      // Assert
      expect(userService.updateFullProfile).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'First name cannot be empty'
      });
    });

    it('devrait retourner 400 si email existe déjà', async () => {
      // Arrange
      req.user = { id: 1 };
      req.body = {
        email: 'existing@example.com'
      };
      
      userService.updateFullProfile.mockRejectedValue(
        new Error('Email already in use')
      );

      // Act
      await userController.updateProfile(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already in use'
      });
    });

    it('devrait mettre à jour uniquement les champs fournis', async () => {
      // Arrange
      req.user = { id: 1 };
      req.body = {
        first_name: 'OnlyFirstName'
        // last_name non fourni
      };
      
      const updatedProfile = {
        ...regularUser,
        first_name: 'OnlyFirstName'
      };
      
      userService.updateFullProfile.mockResolvedValue(updatedProfile);

      // Act
      await userController.updateProfile(req, res);

      // Assert
      expect(userService.updateFullProfile).toHaveBeenCalledWith(1, {
        first_name: 'OnlyFirstName'
      });
      expect(res.json).toHaveBeenCalledWith(updatedProfile);
    });

    it('devrait gérer la mise à jour du mot de passe', async () => {
      // Arrange
      req.user = { id: 1 };
      req.body = {
        password: 'NewSecurePassword123!'
      };
      
      const updatedProfile = {
        ...regularUser,
        updated_at: new Date().toISOString()
      };
      
      userService.updateFullProfile.mockResolvedValue(updatedProfile);

      // Act
      await userController.updateProfile(req, res);

      // Assert
      expect(userService.updateFullProfile).toHaveBeenCalledWith(1, {
        password: 'NewSecurePassword123!'
      });
      expect(res.json).toHaveBeenCalledWith(updatedProfile);
    });
  });
});