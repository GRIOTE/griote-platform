const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Auth & Tokens
router.post('/register', authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

// Password management
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
