// tests/unit/controller/category.controller.test.js
const categoryController = require('../../../src/controllers/category.controller');
const { DepotCategory } = require('../../../src/models');
const { mockRequest, mockResponse } = require('../../setup/mock');
const { validCategory, categories } = require('../../fixtures/categories.fixture');

jest.mock('../../../src/models');

describe('Category Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('POST /categories', () => {
    it('devrait créer une catégorie', async () => {
      // Arrange
      req.body = {
        name: 'Nouvelle Catégorie',
        description: 'Description de la catégorie'
      };
      
      DepotCategory.create.mockResolvedValue({
        category_id: 4,
        ...req.body
      });

      // Act
      await categoryController.create(req, res);

      // Assert
      expect(DepotCategory.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        category_id: 4,
        name: 'Nouvelle Catégorie',
        description: 'Description de la catégorie'
      });
    });

    it('devrait retourner 400 si validation échoue', async () => {
      // Arrange
      req.body = { name: '' };
      
      const validationError = {
        errors: [{ message: 'Name cannot be empty' }]
      };
      
      DepotCategory.create.mockRejectedValue(validationError);

      // Act
      await categoryController.create(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Name cannot be empty'
      });
    });

    it('devrait gérer les erreurs sans tableau errors', async () => {
      // Arrange
      req.body = { name: 'Test' };
      DepotCategory.create.mockRejectedValue(new Error('Database error'));

      // Act
      await categoryController.create(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error'
      });
    });
  });

  describe('GET /categories', () => {
    it('devrait retourner toutes les catégories triées', async () => {
      // Arrange
      DepotCategory.findAll.mockResolvedValue(categories);

      // Act
      await categoryController.list(req, res);

      // Assert
      expect(DepotCategory.findAll).toHaveBeenCalledWith({
        order: [['name', 'ASC']]
      });
      expect(res.json).toHaveBeenCalledWith(categories);
    });

    it('devrait retourner un tableau vide si aucune catégorie', async () => {
      // Arrange
      DepotCategory.findAll.mockResolvedValue([]);

      // Act
      await categoryController.list(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('PUT /categories/:category_id', () => {
    it('devrait mettre à jour une catégorie', async () => {
      // Arrange
      req.params = { category_id: '1' };
      req.body = {
        name: 'Nom mis à jour',
        description: 'Description mise à jour'
      };
      
      const updatedCategory = {
        ...validCategory,
        ...req.body
      };
      
      DepotCategory.update.mockResolvedValue([1]); // 1 ligne affectée
      DepotCategory.findByPk.mockResolvedValue(updatedCategory);

      // Act
      await categoryController.update(req, res);

      // Assert
      expect(DepotCategory.update).toHaveBeenCalledWith(req.body, {
        where: { category_id: '1' }
      });
      expect(DepotCategory.findByPk).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(updatedCategory);
    });

    it('devrait retourner 404 si catégorie non trouvée', async () => {
      // Arrange
      req.params = { category_id: '999' };
      req.body = { name: 'Test' };
      
      DepotCategory.update.mockResolvedValue([0]); // 0 ligne affectée

      // Act
      await categoryController.update(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
      expect(DepotCategory.findByPk).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /categories/:category_id', () => {
    it('devrait supprimer une catégorie', async () => {
      // Arrange
      req.params = { category_id: '1' };
      DepotCategory.destroy.mockResolvedValue(1); // 1 ligne supprimée

      // Act
      await categoryController.delete(req, res);

      // Assert
      expect(DepotCategory.destroy).toHaveBeenCalledWith({
        where: { category_id: '1' }
      });
      expect(res.json).toHaveBeenCalledWith({ ok: true });
    });

    it('devrait retourner 404 si catégorie non trouvée', async () => {
      // Arrange
      req.params = { category_id: '999' };
      DepotCategory.destroy.mockResolvedValue(0); // 0 ligne supprimée

      // Act
      await categoryController.delete(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });
});