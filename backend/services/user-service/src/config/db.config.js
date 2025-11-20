const { Sequelize } = require('sequelize');
const logger = require('./logger');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',
  logging: (msg) => logger.debug(msg),
  dialectOptions: {
    connectTimeout: 5000,
  },
});

module.exports = sequelize;
