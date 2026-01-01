const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/depot.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');
const { array: upload } = require('../middleware/upload.middleware');

router.post('/', authMiddleware, upload, ctrl.create);
router.get('/mine', authMiddleware, ctrl.mine);

router.get('/', authMiddleware, requireAdmin, ctrl.listAll);
router.patch('/:depot_id', authMiddleware, requireAdmin, ctrl.update);
router.delete('/:depot_id', authMiddleware, requireAdmin, ctrl.delete);

module.exports = router;
