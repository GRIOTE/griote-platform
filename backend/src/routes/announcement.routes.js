const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcement.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

// Public routes
router.get('/annonces', announcementController.getAllPublished);
router.get('/annonces/:id', announcementController.getById);

// Admin routes
router.use('/admin', authMiddleware);
router.use('/admin', requireAdmin);

router.post('/admin/annonces', announcementController.create);
router.put('/admin/annonces/:id', announcementController.update);
router.delete('/admin/annonces/:id', announcementController.remove);
router.put('/admin/annonces/:id/publish', announcementController.publish);
router.put('/admin/annonces/:id/archive', announcementController.archive);

module.exports = router;
