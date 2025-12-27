// src/server.js
require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db.config');
const minioService = require('./services/minio.service');
const logger = require('./config/logger.config');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Init Minio
    await minioService.initialize();
    logger.info('MinIO initialized');

    // Init DB + CRÉATION AUTOMATIQUE DES TABLES
    await sequelize.authenticate();
    logger.info('Database connection established');

    // LIGNE MAGIQUE QUI MANQUAIT
    await sequelize.sync({ force: true }); // En dev → force: true (re-crée tout à chaque redémarrage)
    // Plus tard en prod tu mettras : await sequelize.sync({ alter: true });
    logger.info('Toutes les tables ont été créées/synchronisées (users, depots, documents, etc.)');

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Fatal error: cannot start server', err);
    process.exit(1);
  }
}

startServer();