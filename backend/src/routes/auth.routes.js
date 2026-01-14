const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
