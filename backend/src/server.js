// src/server.js
require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/db.config');
const minioService = require('./services/minio.service');
const logger = require('./config/logger.config');
const bcrypt = require('bcrypt');
const { User, DepotCategory, DepotTag } = require('./models');

// AJOUT OBLIGATOIRE

const PORT = process.env.PORT || 3000;

async function seedInitialData() {
  try {
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      email: 'admin@griote.com',
      password_hash: adminPassword,
      first_name: 'Admin',
      last_name: 'Griote',
      role: 'ADMIN',
      is_email_verified: true
    });

    await DepotCategory.bulkCreate([
      { name: 'Littérature', description: 'Œuvres littéraires' },
      { name: 'Histoire', description: 'Documents historiques' },
      { name: 'Science', description: 'Documents scientifiques' },
      { name: 'Art', description: 'Œuvres artistiques' }
    ]);

    await DepotTag.bulkCreate([
      { name: 'Afrique' },
      { name: 'Tradition' },
      { name: 'Moderne' },
      { name: 'Éducation' },
      { name: 'Culture' }
    ]);

    logger.info('Données initiales créées avec succès');
  } catch (error) {
    logger.error('Erreur lors du seeding:', error);
  }
}

async function startServer() {
  try {
    await minioService.initialize();
    logger.info('MinIO initialized');

    await sequelize.authenticate();
    logger.info('Database connection established');

    await sequelize.sync({ force: true });
    logger.info('Toutes les tables ont été créées/synchronisées');

    await seedInitialData();
    logger.info('Données initiales créées');

    // === CRUCIAL : AJOUTER cookie-parser AVANT app.listen() ===


    // Démarrage du serveur
    const server = app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });

    // Gestion propre de l'arrêt
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received: closing server...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

  } catch (err) {
    logger.error('Fatal error: cannot start server', err);
    process.exit(1);
  }
}

startServer();