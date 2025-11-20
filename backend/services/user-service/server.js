require('dotenv').config({ debug: true });

const { app, initDb } = require('./app');
const logger = require('./src/config/logger');
const rabbit = require('./src/events/rabbitmq.publisher');

const PORT = process.env.PORT || 3000;

async function startServer(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log('Step 1: Init DB...');
      await initDb();
      console.log('Step 2: Connect RabbitMQ...');
      console.log('RABBITMQ_URL:', process.env.RABBITMQ_URL);
      await rabbit.connect();
      console.log('Step 3: Start server...');
      app.listen(PORT, () => console.log(`User service listening on ${PORT}`));
      return; 
    } catch (err) {
      logger.error(`Startup error (attempt ${i + 1}/${retries}):`, err.message, err.stack);
      if (i < retries - 1) {
        logger.info(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        logger.error('Max retries reached. Exiting...');
        process.exit(1);
      }
    }
  }
}

startServer();