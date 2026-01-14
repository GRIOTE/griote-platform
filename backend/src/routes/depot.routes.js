const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/depot.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/', authMiddleware, ctrl.createDepotController);
router.get('/', authMiddleware, ctrl.listDepotsController);
router.get('/:id', authMiddleware, ctrl.getDepotController);
router.put('/:id', authMiddleware, ctrl.updateDepotController);
router.delete('/:id', authMiddleware, ctrl.deleteDepotController);
router.post('/:id/documents', authMiddleware, upload.single, ctrl.addDocumentController);
router.get('/:id/documents', authMiddleware, ctrl.listDepotDocumentsController);

module.exports = router;
