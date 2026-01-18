const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const { single: uploadSingle } = require('../middleware/upload.middleware');

router.use(authMiddleware);

/* ========================= USER ROUTES ========================= */
router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.delete('/me', userController.deleteMyAccount);

// Upload / update profile picture
router.post('/me/profile-picture', uploadSingle, userController.setProfilePicture);
router.delete('/me/profile-picture', userController.removeProfilePicture);

// Change password for current user
router.post('/me/change-password', userController.changePassword);

/* ========================= ADMIN ROUTES ========================= */
router.use(requireAdmin);

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createAdmin);
router.patch('/users/:id/role', userController.updateUserRole);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
