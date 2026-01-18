// tests/setup/testSetup.js
const path = require('path');
const dotenv = require('dotenv');

// Charger les variables d'environnement de test AVANT tout le reste
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

// Forcer NODE_ENV à 'test'
process.env.NODE_ENV = 'test';

// Timeout global pour les tests
jest.setTimeout(10000);

// Mock de la connexion à la base de données
jest.mock('../../src/config/db.config', () => ({
  authenticate: jest.fn().mockResolvedValue(true),
  sync: jest.fn().mockResolvedValue(true),
  close: jest.fn().mockResolvedValue(true),
  define: jest.fn(),
  models: {}
}));

// Mock du service MinIO
jest.mock('../../src/services/minio.service', () => ({
  initialize: jest.fn().mockResolvedValue(true),
  uploadFile: jest.fn().mockResolvedValue({ url: 'http://test.com/file.pdf' }),
  upload: jest.fn().mockResolvedValue('http://test.com/file.pdf'),
  deleteFile: jest.fn().mockResolvedValue(true),
  getFileUrl: jest.fn().mockReturnValue('http://test.com/file.pdf')
}));

// Mock du service Mail
jest.mock('../../src/services/mail.service', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
  sendEmail: jest.fn().mockResolvedValue(true)
}));

// Mock du logger pour éviter les logs pendant les tests
jest.mock('../../src/config/logger.config', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

// IMPORTANT: Mock complet du fichier models/index.js pour éviter les erreurs d'associations
jest.mock('../../src/models', () => {
  // Fonction helper pour créer un mock de modèle Sequelize
  const createModelMock = () => ({
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    bulkCreate: jest.fn(),
    count: jest.fn(),
    // Méthodes d'association
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
    belongsToMany: jest.fn()
  });

  return {
    User: createModelMock(),
    RefreshToken: createModelMock(),
    Depot: {
      ...createModelMock(),
      sequelize: {
        transaction: jest.fn(),
        models: {
          DepotTagMapping: {
            bulkCreate: jest.fn()
          }
        }
      }
    },
    DepotCategory: createModelMock(),
    DepotTag: createModelMock(),
    Document: createModelMock(),
    sequelize: {
      transaction: jest.fn(),
      authenticate: jest.fn(),
      sync: jest.fn(),
      close: jest.fn(),
      models: {}
    }
  };
});

// Cleanup après tous les tests
afterAll(async () => {
  jest.clearAllMocks();
});