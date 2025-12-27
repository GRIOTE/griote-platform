// tests/unit/controller/document.controller.test.js
const documentController = require('../../../src/controllers/document.controller');
const { Document } = require('../../../src/models');
const minioService = require('../../../src/services/minio.service');
const { mockRequest, mockResponse } = require('../../setup/mock');

jest.mock('../../../src/models');
jest.mock('../../../src/services/minio.service');

describe('Document Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('POST /documents/upload → upload()', () => {
    it('devrait uploader un fichier avec succès', async () => {
      req.user = { user_id: 1 };
      req.body = { depot_id: '10' };
      req.file = {
        originalname: 'contrat.pdf',
        mimetype: 'application/pdf',
        size: 2048000,
        buffer: Buffer.from('fake pdf')
      };

      const mockDocument = { document_id: 42, filename: 'contrat.pdf', url: 'http://minio/test.pdf' };

      minioService.uploadFile.mockResolvedValue('http://minio/test.pdf');
      Document.create.mockResolvedValue(mockDocument);

      // LA BONNE FONCTION SELON TON CODE
      await documentController.upload(req, res);

      expect(minioService.uploadFile).toHaveBeenCalled();
      expect(Document.create).toHaveBeenCalledWith(expect.objectContaining({
        depot_id: 10,
        owner_id: 1,
        filename: 'contrat.pdf'
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'File uploaded successfully'
      }));
    });

    it('devrait refuser sans fichier', async () => {
      req.user = { user_id: 1 };
      req.body = { depot_id: '10' };
      req.file = null;

      await documentController.upload(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded' });
    });
  });

  describe('GET /documents/:id → getById()', () => {
    it('devrait retourner un document', async () => {
      req.params = { document_id: '33' };
      const doc = { document_id: 33, filename: 'test.pdf' };
      Document.findByPk.mockResolvedValue(doc);

      await documentController.getById(req, res);

      expect(Document.findByPk).toHaveBeenCalledWith('33', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith(doc);
    });

    it('devrait retourner 404 si pas trouvé', async () => {
      req.params = { document_id: '999' };
      Document.findByPk.mockResolvedValue(null);

      await documentController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('GET /documents/depot/:depot_id → getByDepotDocuments()', () => {
    it('devrait retourner les documents du dépôt', async () => {
      req.params = { depot_id: '20' };
      const docs = [{ document_id: 1 }, { document_id: 2 }];
      Document.findAll.mockResolvedValue(docs);

      await documentController.getDepotDocuments(req, res);

      expect(Document.findAll).toHaveBeenCalledWith({
        where: { depot_id: '20' },
        order: [['created_at', 'DESC']]
      });
      expect(res.json).toHaveBeenCalledWith(docs);
    });
  });

  describe('DELETE /documents/:id → deleteDocument()', () => {
    it('devrait supprimer le document + fichier MinIO', async () => {
      req.params = { document_id: '88' };
      req.user = { user_id: 1 };

      const mockDoc = {
        document_id: 88,
        url: 'http://minio/bucket/file.pdf',
        destroy: jest.fn().mockResolvedValue(true)
      };

      Document.findByPk.mockResolvedValue(mockDoc);
      minioService.deleteFile.mockResolvedValue(true);

      await documentController.deleteDocument(req, res);

      expect(minioService.deleteFile).toHaveBeenCalledWith(expect.stringContaining('file.pdf'));
      expect(mockDoc.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Document deleted successfully' });
    });
  });
});