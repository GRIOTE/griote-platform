// tests/unit/service/minio.service.test.js

// 🔑 Mocks des modules avant tout import
const mockMinioClient = {
  bucketExists: jest.fn(),
  makeBucket: jest.fn(),
  putObject: jest.fn(),
  removeObject: jest.fn()
};

jest.mock('../../../src/config/minio.config', () => mockMinioClient);

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
};

jest.mock('../../../src/config/logger.config', () => mockLogger);

describe('Minio Service - Unit Tests', () => {
  let minioService;
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    jest.clearAllMocks();
    jest.resetModules();

    // Variables d'environnement par défaut
    process.env.MINIO_BUCKET = 'test-bucket';
    process.env.MINIO_PUBLIC_URL = 'http://minio.example.com';
    process.env.MINIO_ENDPOINT = 'localhost';
    process.env.MINIO_PORT = '9000';

    // Charger le service après avoir configuré les mocks et env
    minioService = require('../../../src/services/minio.service');
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  /* ========================= INITIALIZE ========================= */
  describe('initialize', () => {
    it('should create bucket if it does not exist', async () => {
      mockMinioClient.bucketExists.mockResolvedValue(false);
      mockMinioClient.makeBucket.mockResolvedValue(true);

      await minioService.initialize();

      expect(mockMinioClient.bucketExists).toHaveBeenCalledWith('test-bucket');
      expect(mockMinioClient.makeBucket).toHaveBeenCalledWith('test-bucket');
      expect(mockLogger.info).toHaveBeenCalledWith('Bucket créé : test-bucket');
    });

    it('should not create bucket if it already exists', async () => {
      mockMinioClient.bucketExists.mockResolvedValue(true);

      await minioService.initialize();

      expect(mockMinioClient.bucketExists).toHaveBeenCalledWith('test-bucket');
      expect(mockMinioClient.makeBucket).not.toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith('Bucket déjà existant : test-bucket');
    });

    it('should throw error on initialization failure', async () => {
      const error = new Error('Connection failed');
      mockMinioClient.bucketExists.mockRejectedValue(error);

      await expect(minioService.initialize()).rejects.toThrow('Connection failed');
      expect(mockLogger.error).toHaveBeenCalledWith(
        "Impossible d'initialiser MinIO",
        error
      );
    });
  });

  /* ========================= UPLOAD ========================= */
  describe('upload', () => {
    it('should upload file without prefix', async () => {
      const file = { originalname: 'test.pdf', buffer: Buffer.from('test content'), size: 123, mimetype: 'application/pdf' };
      mockMinioClient.putObject.mockResolvedValue(true);

      const result = await minioService.upload(file);

      expect(mockMinioClient.putObject).toHaveBeenCalledWith(
        'test-bucket',
        expect.stringMatching(/^\d+-\d+-test\.pdf$/),
        file.buffer,
        123,
        { 'Content-Type': 'application/pdf' }
      );

      expect(result).toMatch(/^http:\/\/minio\.example\.com\/test-bucket\/\d+-\d+-test\.pdf$/);
    });

    it('should upload file with prefix', async () => {
      const file = { originalname: 'document.pdf', buffer: Buffer.from('content'), size: 456, mimetype: 'application/pdf' };
      mockMinioClient.putObject.mockResolvedValue(true);

      const result = await minioService.upload(file, 'documents');

      expect(mockMinioClient.putObject).toHaveBeenCalledWith(
        'test-bucket',
        expect.stringMatching(/^documents\/\d+-\d+-document\.pdf$/),
        file.buffer,
        456,
        { 'Content-Type': 'application/pdf' }
      );

      expect(result).toMatch(/^http:\/\/minio\.example\.com\/test-bucket\/documents\/\d+-\d+-document\.pdf$/);
    });

    it('should use default URL when MINIO_PUBLIC_URL is not set', async () => {
      delete process.env.MINIO_PUBLIC_URL;
      jest.resetModules();
      minioService = require('../../../src/services/minio.service');

      const file = { originalname: 'test.jpg', buffer: Buffer.from('image'), size: 789, mimetype: 'image/jpeg' };
      mockMinioClient.putObject.mockResolvedValue(true);

      const result = await minioService.upload(file);

      expect(result).toMatch(/^http:\/\/localhost:9000\/test-bucket\/\d+-\d+-test\.jpg$/);
    });

    it('should throw error on upload failure', async () => {
      const file = { originalname: 'test.pdf', buffer: Buffer.from('content'), size: 100, mimetype: 'application/pdf' };
      const error = new Error('Upload failed');
      mockMinioClient.putObject.mockRejectedValue(error);

      await expect(minioService.upload(file)).rejects.toThrow('Upload failed');
    });

    it('should handle special characters in filename', async () => {
      const file = { originalname: 'test file (1).pdf', buffer: Buffer.from('content'), size: 100, mimetype: 'application/pdf' };
      mockMinioClient.putObject.mockResolvedValue(true);

      const result = await minioService.upload(file);

      expect(mockMinioClient.putObject).toHaveBeenCalledWith(
        'test-bucket',
        expect.stringMatching(/^\d+-\d+-test file \(1\)\.pdf$/),
        file.buffer,
        100,
        { 'Content-Type': 'application/pdf' }
      );

      expect(result).toBeTruthy();
    });
  });

  /* ========================= UPLOAD FILE (ALIAS) ========================= */
  describe('uploadFile', () => {
    it('should call upload method without prefix', async () => {
      const file = { originalname: 'test.pdf', buffer: Buffer.from('content'), size: 100, mimetype: 'application/pdf' };
      mockMinioClient.putObject.mockResolvedValue(true);

      const result = await minioService.uploadFile(file);

      expect(mockMinioClient.putObject).toHaveBeenCalledWith(
        'test-bucket',
        expect.stringMatching(/^\d+-\d+-test\.pdf$/),
        file.buffer,
        100,
        { 'Content-Type': 'application/pdf' }
      );

      expect(result).toMatch(/^http:\/\/minio\.example\.com\/test-bucket\/\d+-\d+-test\.pdf$/);
    });

    it('should call upload method with prefix', async () => {
      const file = { originalname: 'test.pdf', buffer: Buffer.from('content'), size: 100, mimetype: 'application/pdf' };
      mockMinioClient.putObject.mockResolvedValue(true);

      const result = await minioService.uploadFile(file, 'folder');

      expect(mockMinioClient.putObject).toHaveBeenCalledWith(
        'test-bucket',
        expect.stringMatching(/^folder\/\d+-\d+-test\.pdf$/),
        file.buffer,
        100,
        { 'Content-Type': 'application/pdf' }
      );

      expect(result).toMatch(/^http:\/\/minio\.example\.com\/test-bucket\/folder\/\d+-\d+-test\.pdf$/);
    });
  });

  /* ========================= DELETE ========================= */
  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      const fileUrl = 'http://minio.example.com/test-bucket/documents/123-456-file.pdf';
      mockMinioClient.removeObject.mockResolvedValue(true);

      await minioService.deleteFile(fileUrl);

      expect(mockMinioClient.removeObject).toHaveBeenCalledWith(
        'test-bucket',
        'documents/123-456-file.pdf'
      );
    });

    it('should delete file with complex path', async () => {
      const fileUrl = 'http://minio.example.com/test-bucket/folder/subfolder/123-456-file.pdf';
      mockMinioClient.removeObject.mockResolvedValue(true);

      await minioService.deleteFile(fileUrl);

      expect(mockMinioClient.removeObject).toHaveBeenCalledWith(
        'test-bucket',
        'folder/subfolder/123-456-file.pdf'
      );
    });

    it('should throw error for invalid URL', async () => {
      const invalidUrl = 'http://wrong-domain.com/bucket/file.pdf';

      await expect(minioService.deleteFile(invalidUrl)).rejects.toThrow('Invalid URL');
      expect(mockMinioClient.removeObject).not.toHaveBeenCalled();
    });

    it('should throw error for URL from different bucket', async () => {
      const invalidUrl = 'http://minio.example.com/wrong-bucket/file.pdf';

      await expect(minioService.deleteFile(invalidUrl)).rejects.toThrow('Invalid URL');
      expect(mockMinioClient.removeObject).not.toHaveBeenCalled();
    });

    it('should throw error on deletion failure', async () => {
      const fileUrl = 'http://minio.example.com/test-bucket/file.pdf';
      const error = new Error('Deletion failed');
      mockMinioClient.removeObject.mockRejectedValue(error);

      await expect(minioService.deleteFile(fileUrl)).rejects.toThrow('Deletion failed');
    });

    it('should handle default URL pattern when deleting', async () => {
      delete process.env.MINIO_PUBLIC_URL;
      jest.resetModules();
      minioService = require('../../../src/services/minio.service');

      const fileUrl = 'http://localhost:9000/test-bucket/documents/file.pdf';
      mockMinioClient.removeObject.mockResolvedValue(true);

      await minioService.deleteFile(fileUrl);

      expect(mockMinioClient.removeObject).toHaveBeenCalledWith(
        'test-bucket',
        'documents/file.pdf'
      );
    });
  });
});
