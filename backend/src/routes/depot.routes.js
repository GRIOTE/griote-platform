const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/depot.controller');
const statsController = require('../controllers/stats.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/', authMiddleware, ctrl.createDepotController);
router.get('/', authMiddleware, ctrl.listDepotsController);
router.get('/:id', authMiddleware, ctrl.getDepotController);
router.put('/:id', authMiddleware, ctrl.updateDepotController);
router.delete('/:id', authMiddleware, ctrl.deleteDepotController);
router.post('/:id/documents', authMiddleware, upload.single, ctrl.addDocumentController);
router.get('/:id/documents', authMiddleware, ctrl.listDepotDocumentsController);

// Admin stats routes
router.get('/stats/total-depots', authMiddleware, requireAdmin, statsController.getTotalDepots);
router.get('/stats/total-documents', authMiddleware, requireAdmin, statsController.getTotalDocuments);

module.exports = router;
