const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tag.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

router.get('/', ctrl.list);

router.post('/', authMiddleware, requireAdmin, ctrl.create);
router.patch('/:tag_id', authMiddleware, requireAdmin, ctrl.update);
router.delete('/:tag_id', authMiddleware, requireAdmin, ctrl.delete);

module.exports = router;
