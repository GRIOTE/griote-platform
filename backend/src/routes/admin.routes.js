const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

router.use(authMiddleware);
router.use(requireAdmin);

router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserById);
router.post('/users', adminController.createAdmin);
router.put('/users/:userId', adminController.updateUser);
router.patch('/users/:userId/role', adminController.updateUserRole);
router.patch('/users/:userId/reset-password', adminController.resetUserPassword);
router.delete('/users/:userId', adminController.deleteUser);
router.get('/stats', adminController.getPlatformStats);

module.exports = router;
