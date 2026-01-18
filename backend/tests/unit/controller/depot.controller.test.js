// tests/unit/controller/depot.controller.test.js
const depotController = require('../../../src/controllers/depot.controller');
const { Depot, Document } = require('../../../src/models');
const minioService = require('../../../src/services/minio.service');
const { mockRequest, mockResponse } = require('../../setup/mock');
const { validDepot, depots } = require('../../fixtures/depots.fixture');

jest.mock('../../../src/models');
jest.mock('../../../src/services/minio.service');

describe('Depot Controller - Unit Tests', () => {
  let req, res, mockTransaction;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();

    // Mock de la transaction Sequelize
    mockTransaction = {
      commit: jest.fn().mockResolvedValue(true),
      rollback: jest.fn().mockResolvedValue(true)
    };
    
    Depot.sequelize = {
      transaction: jest.fn().mockResolvedValue(mockTransaction),
      models: {
        DepotTagMapping: {
          bulkCreate: jest.fn().mockResolvedValue(true)
        }
      }
    };
  });

  describe('POST /depot', () => {
    it('devrait créer un dépôt avec fichiers', async () => {
      // Arrange
      req.user = { user_id: 1 };
      req.body = {
        title: 'Nouveau dépôt',
        description: 'Description',
        category_id: 1,
        tag_ids: [1, 2]
      };
      req.files = [
        {
          originalname: 'document.pdf',
          mimetype: 'application/pdf',
          size: 1024,
          fieldname: 'main_file'
        },
        {
          originalname: 'annexe.pdf',
          mimetype: 'application/pdf',
          size: 512,
          fieldname: 'other_file'
        }
      ];

      const createdDepot = { ...validDepot, depot_id: 5 };
      
      Depot.create.mockResolvedValue(createdDepot);
      minioService.upload.mockResolvedValue('http://minio.test/file.pdf');
      Document.bulkCreate.mockResolvedValue(true);

      // Act
      await depotController.create(req, res);

      // Assert
      expect(Depot.create).toHaveBeenCalledWith(
        {
          owner_id: 1,
          title: 'Nouveau dépôt',
          description: 'Description',
          category_id: 1,
          status: 'DRAFT'
        },
        { transaction: mockTransaction }
      );
      
      expect(minioService.upload).toHaveBeenCalledTimes(2);
      expect(Document.bulkCreate).toHaveBeenCalled();
      expect(Depot.sequelize.models.DepotTagMapping.bulkCreate).toHaveBeenCalled();
      expect(mockTransaction.commit).toHaveBeenCalled();
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        depot_id: 5,
        files_uploaded: 2
      });
    });

    it('devrait créer un dépôt sans fichiers', async () => {
      // Arrange
      req.user = { user_id: 1 };
      req.body = {
        title: 'Dépôt sans fichier',
        description: 'Description',
        category_id: 1
      };
      req.files = [];

      const createdDepot = { ...validDepot, depot_id: 6 };
      Depot.create.mockResolvedValue(createdDepot);
      Document.bulkCreate.mockResolvedValue(true);

      // Act
      await depotController.create(req, res);

      // Assert
      expect(minioService.upload).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        depot_id: 6,
        files_uploaded: 0
      });
    });

    it('devrait rollback en cas d\'erreur', async () => {
      // Arrange
      req.user = { user_id: 1 };
      req.body = {
        title: 'Test',
        description: 'Test',
        category_id: 1
      };
      req.files = [];

      Depot.create.mockRejectedValue(new Error('Database error'));

      // Act
      await depotController.create(req, res);

      // Assert
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error'
      });
    });

    it('devrait gérer les erreurs d\'upload MinIO', async () => {
      // Arrange
      req.user = { user_id: 1 };
      req.body = {
        title: 'Test',
        description: 'Test',
        category_id: 1
      };
      req.files = [
        {
          originalname: 'document.pdf',
          mimetype: 'application/pdf',
          size: 1024,
          fieldname: 'main_file'
        }
      ];

      Depot.create.mockResolvedValue({ ...validDepot, depot_id: 7 });
      minioService.upload.mockRejectedValue(new Error('MinIO upload failed'));

      // Act
      await depotController.create(req, res);

      // Assert
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('devrait créer un dépôt sans tags', async () => {
      // Arrange
      req.user = { user_id: 1 };
      req.body = {
        title: 'Dépôt sans tags',
        description: 'Description',
        category_id: 1,
        tag_ids: []
      };
      req.files = [];

      const createdDepot = { ...validDepot, depot_id: 8 };
      Depot.create.mockResolvedValue(createdDepot);
      Document.bulkCreate.mockResolvedValue(true);

      // Act
      await depotController.create(req, res);

      // Assert
      expect(Depot.sequelize.models.DepotTagMapping.bulkCreate).not.toHaveBeenCalled();
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('GET /depot/mine', () => {
    it('devrait retourner les dépôts de l\'utilisateur', async () => {
      // Arrange
      req.user = { user_id: 1 };
      
      Depot.findAll.mockResolvedValue(depots);

      // Act
      await depotController.mine(req, res);

      // Assert
      expect(Depot.findAll).toHaveBeenCalledWith({
        where: { owner_id: 1 },
        include: [
          'category',
          { model: Document, as: 'documents' },
          { model: expect.anything(), as: 'tags', through: { attributes: [] } }
        ],
        order: [['created_at', 'DESC']]
      });
      expect(res.json).toHaveBeenCalledWith(depots);
    });

    it('devrait retourner un tableau vide si aucun dépôt', async () => {
      // Arrange
      req.user = { user_id: 999 };
      Depot.findAll.mockResolvedValue([]);

      // Act
      await depotController.mine(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });
});