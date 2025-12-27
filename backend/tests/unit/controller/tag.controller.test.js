// tests/unit/controller/tag.controller.test.js
const tagController = require('../../../src/controllers/tag.controller');
const { DepotTag } = require('../../../src/models');
const { mockRequest, mockResponse } = require('../../setup/mock');
const { validTag, tags } = require('../../fixtures/tags.fixture');

jest.mock('../../../src/models');

describe('Tag Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('POST /tags', () => {
    it('devrait créer un tag', async () => {
      // Arrange
      req.body = { name: 'Nouveau Tag' };
      
      const createdTag = {
        tag_id: 4,
        name: 'Nouveau Tag',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      DepotTag.create.mockResolvedValue(createdTag);

      // Act
      await tagController.create(req, res);

      // Assert
      expect(DepotTag.create).toHaveBeenCalledWith({ name: 'Nouveau Tag' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdTag);
    });

    it('devrait gérer les erreurs de création', async () => {
      // Arrange
      req.body = { name: 'Test' };
      
      const error = new Error('Tag already exists');
      DepotTag.create.mockRejectedValue(error);

      // Act & Assert
      await expect(tagController.create(req, res)).rejects.toThrow('Tag already exists');
      expect(DepotTag.create).toHaveBeenCalledWith({ name: 'Test' });
    });

    it('devrait créer un tag avec un nom vide si non validé', async () => {
      // Arrange
      req.body = { name: '' };
      
      const createdTag = {
        tag_id: 5,
        name: ''
      };
      
      DepotTag.create.mockResolvedValue(createdTag);

      // Act
      await tagController.create(req, res);

      // Assert
      expect(DepotTag.create).toHaveBeenCalledWith({ name: '' });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /tags', () => {
    it('devrait retourner tous les tags triés', async () => {
      // Arrange
      DepotTag.findAll.mockResolvedValue(tags);

      // Act
      await tagController.list(req, res);

      // Assert
      expect(DepotTag.findAll).toHaveBeenCalledWith({
        order: [['name', 'ASC']]
      });
      expect(res.json).toHaveBeenCalledWith(tags);
    });

    it('devrait retourner un tableau vide si aucun tag', async () => {
      // Arrange
      DepotTag.findAll.mockResolvedValue([]);

      // Act
      await tagController.list(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('devrait gérer les erreurs de récupération', async () => {
      // Arrange
      const error = new Error('Database error');
      DepotTag.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(tagController.list(req, res)).rejects.toThrow('Database error');
    });
  });

  describe('PUT /tags/:tag_id', () => {
    it('devrait mettre à jour un tag', async () => {
      // Arrange
      req.params = { tag_id: '1' };
      req.body = { name: 'Tag Modifié' };
      
      const updatedTag = {
        ...validTag,
        name: 'Tag Modifié',
        updated_at: new Date().toISOString()
      };
      
      DepotTag.update.mockResolvedValue([1]); // 1 ligne affectée
      DepotTag.findByPk.mockResolvedValue(updatedTag);

      // Act
      await tagController.update(req, res);

      // Assert
      expect(DepotTag.update).toHaveBeenCalledWith(
        { name: 'Tag Modifié' },
        { where: { tag_id: '1' } }
      );
      expect(DepotTag.findByPk).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(updatedTag);
    });

    it('devrait retourner 404 si tag non trouvé', async () => {
      // Arrange
      req.params = { tag_id: '999' };
      req.body = { name: 'Test' };
      
      DepotTag.update.mockResolvedValue([0]); // 0 ligne affectée

      // Act
      await tagController.update(req, res);

      // Assert
      expect(DepotTag.update).toHaveBeenCalledWith(
        { name: 'Test' },
        { where: { tag_id: '999' } }
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
      expect(DepotTag.findByPk).not.toHaveBeenCalled();
    });

    it('devrait mettre à jour plusieurs champs', async () => {
      // Arrange
      req.params = { tag_id: '1' };
      req.body = {
        name: 'Nouveau Nom',
        description: 'Nouvelle description'
      };
      
      const updatedTag = {
        ...validTag,
        name: 'Nouveau Nom',
        description: 'Nouvelle description'
      };
      
      DepotTag.update.mockResolvedValue([1]);
      DepotTag.findByPk.mockResolvedValue(updatedTag);

      // Act
      await tagController.update(req, res);

      // Assert
      expect(DepotTag.update).toHaveBeenCalledWith(req.body, {
        where: { tag_id: '1' }
      });
      expect(res.json).toHaveBeenCalledWith(updatedTag);
    });

    it('devrait gérer les erreurs de mise à jour', async () => {
      // Arrange
      req.params = { tag_id: '1' };
      req.body = { name: 'Test' };
      
      const error = new Error('Update failed');
      DepotTag.update.mockRejectedValue(error);

      // Act & Assert
      await expect(tagController.update(req, res)).rejects.toThrow('Update failed');
    });
  });

  describe('DELETE /tags/:tag_id', () => {
    it('devrait supprimer un tag', async () => {
      // Arrange
      req.params = { tag_id: '1' };
      DepotTag.destroy.mockResolvedValue(1); // 1 ligne supprimée

      // Act
      await tagController.delete(req, res);

      // Assert
      expect(DepotTag.destroy).toHaveBeenCalledWith({
        where: { tag_id: '1' }
      });
      expect(res.json).toHaveBeenCalledWith({ ok: true });
      expect(res.status).not.toHaveBeenCalled();
    });

    it('devrait retourner 404 si tag non trouvé', async () => {
      // Arrange
      req.params = { tag_id: '999' };
      DepotTag.destroy.mockResolvedValue(0); // 0 ligne supprimée

      // Act
      await tagController.delete(req, res);

      // Assert
      expect(DepotTag.destroy).toHaveBeenCalledWith({
        where: { tag_id: '999' }
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });

    it('devrait gérer les erreurs de suppression', async () => {
      // Arrange
      req.params = { tag_id: '1' };
      
      const error = new Error('Foreign key constraint');
      DepotTag.destroy.mockRejectedValue(error);

      // Act & Assert
      await expect(tagController.delete(req, res)).rejects.toThrow('Foreign key constraint');
    });
  });
});