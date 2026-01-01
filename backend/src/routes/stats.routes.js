const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

router.get('/total-users', authMiddleware, requireAdmin, statsController.getTotalUsers);
router.get('/verified-users', authMiddleware, requireAdmin, statsController.getVerifiedUsers);
router.get('/total-depots', authMiddleware, requireAdmin, statsController.getTotalDepots);
router.get('/total-documents', authMiddleware, requireAdmin, statsController.getTotalDocuments);

module.exports = router;
