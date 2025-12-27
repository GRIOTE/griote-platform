// src/config/db.config.js
const { Sequelize } = require('sequelize');
const logger = require('./logger.config');
require('dotenv').config();

if (!process.env.DB_URI) {
  logger.error('DB_URI manquant dans .env');
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',
  logging: (msg) => logger.debug(msg),
  dialectOptions: {
    connectTimeout: 10000,
  },
  define: {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  ...(process.env.NODE_ENV === 'development' && {
    logging: (msg) => logger.debug('[SQL]', msg),
  }),
});

module.exports = sequelize;