require('dotenv').config({ debug: true });
const minioService = require('./src/services/minio.service');
const { app, sequelize } = require('./app');
const logger = require('../../shared/config/logger');

const PORT = process.env.PORT || 3002;

async function startServer(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      // Connexion à la base de données
      console.log('Init DB...');
      await sequelize.authenticate();
      console.log('DB OK.');

      // Synchronisation des modèles
      await sequelize.sync({ alter: true });
      console.log('Models synced.');

      // Initialisation du bucket MinIO
      await minioService.initBucket();

      // Démarrage du serveur
      app.listen(PORT, () => logger.info(`Depot service running on port ${PORT}`));
      return;
    } catch (err) {
      logger.error(`Startup error (${i + 1}/${retries}):`, err.message);
      if (i < retries - 1) {
        logger.info(`Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        logger.error('Max retries reached. Exiting...');
        process.exit(1);
      }
    }
  }
}

startServer();
