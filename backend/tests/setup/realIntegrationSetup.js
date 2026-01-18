// tests/setup/realIntegrationSetup.js
const path = require('path');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

// Charger les variables d'environnement de test
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });
process.env.NODE_ENV = 'test';

// IMPORTANT: NE PAS mocker la base de données ni les services métier
// Seulement les services externes (MinIO, Mail)

jest.mock('../../src/services/minio.service', () => ({
  initialize: jest.fn().mockResolvedValue(true),
  upload: jest.fn().mockResolvedValue('http://test-minio.com/file.pdf'),
  deleteFile: jest.fn().mockResolvedValue(true),
  getFileUrl: jest.fn().mockReturnValue('http://test-minio.com/file.pdf')
}));

jest.mock('../../src/services/mail.service', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
  sendEmail: jest.fn().mockResolvedValue(true)
}));

// Logger silencieux pour les tests
jest.mock('../../src/config/logger.config', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

// NE PAS mocker les modèles - utiliser la vraie DB
let sequelize;

beforeAll(async () => {
  // Connexion à la vraie base de données de test
  const sequelizeInstance = require('../../src/config/db.config');
  sequelize = sequelizeInstance;
  
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to test database');
    
    // Synchroniser les modèles (créer les tables)
    await sequelize.sync({ force: true }); // force: true = drop & recreate
    console.log('✅ Database tables created');
  } catch (error) {
    console.error('❌ Unable to connect to test database:', error);
    throw error;
  }
});

afterAll(async () => {
  // Nettoyer et fermer la connexion
  if (sequelize) {
    await sequelize.close();
    console.log('✅ Database connection closed');
  }
});

// Nettoyer les données entre chaque test
afterEach(async () => {
  if (sequelize) {
    // Supprimer toutes les données mais garder la structure
    const models = Object.values(sequelize.models);
    for (const model of models) {
      await model.destroy({ where: {}, truncate: true, cascade: true });
    }
  }
});