const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Profil utilisateur
router.get('/me', authMiddleware, userController.getProfile);
router.put('/me', authMiddleware, userController.updateProfile);

module.exports = router;
