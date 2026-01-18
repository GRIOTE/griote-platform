// tests/setup/integrationSetup.js
const path = require('path');
const dotenv = require('dotenv');

// Charger les variables d'environnement de test
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });
process.env.NODE_ENV = 'test';

// Mock des services externes (MinIO, Mail) mais PAS de la DB ni des services métier
jest.mock('../../src/services/minio.service', () => ({
  initialize: jest.fn().mockResolvedValue(true),
  upload: jest.fn().mockResolvedValue('http://test.com/file.pdf'),
  deleteFile: jest.fn().mockResolvedValue(true)
}));

jest.mock('../../src/services/mail.service', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true)
}));

jest.mock('../../src/config/logger.config', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));