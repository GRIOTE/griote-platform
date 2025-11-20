// src/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const path = require('path');

const router = express.Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Griote Foundation User Service API',
      version: '1.0.0',
      description: 'API professionnelle pour la gestion des utilisateurs, profils, authentification, tokens, et sécurité.'
    },
    servers: [
      { url: 'http://localhost:3001' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(__dirname, 'routes', '*.js'),
    path.join(__dirname, 'controllers', '*.js'),
    path.join(__dirname, 'models', '*.js')
  ],
};

const specs = swaggerJsdoc(options);

// CHANGE ICI : MONTE SUR '/' DANS LE ROUTEUR
router.use('/', swaggerUi.serve, swaggerUi.setup(specs));

module.exports = router;