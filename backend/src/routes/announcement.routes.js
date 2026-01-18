const express = require('express');
const router = express.Router();

const announcementController = require('../controllers/announcement.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const { single: uploadSingle } = require('../middleware/upload.middleware');

/* =======================
   PUBLIC
======================= */
router.get('/annonces', announcementController.getAllPublished);
router.get('/annonces/:id', announcementController.getById);

/* =======================
   ADMIN
======================= */
const adminRouter = express.Router();

// Auth + role admin
adminRouter.use(authMiddleware);
adminRouter.use(requireAdmin);

// Images standalone
adminRouter.post(
  '/annonces/images',
  uploadSingle,
  announcementController.uploadImage
);

// CRUD + support upload direct dans create/update
adminRouter.get('/annonces', announcementController.getAllForAdmin);
adminRouter.post('/annonces', uploadSingle, announcementController.create);
adminRouter.put('/annonces/:id', uploadSingle, announcementController.update);
adminRouter.delete('/annonces/:id', announcementController.remove);

// State
adminRouter.put('/annonces/:id/publish', announcementController.publish);
adminRouter.put('/annonces/:id/archive', announcementController.archive);

// Mount admin router
router.use('/admin', adminRouter);

module.exports = router;
