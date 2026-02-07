const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const statsController = require('../controllers/stats.controller');
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

// Stats routes (must be before /:id routes)
router.get('/total-users', statsController.getTotalUsers);
router.get('/verified-users', statsController.getVerifiedUsers);
router.get('/total-depots', statsController.getTotalDepots);
router.get('/total-documents', statsController.getTotalDocuments);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createAdmin);
router.patch('/:id/role', userController.updateUserRole);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
