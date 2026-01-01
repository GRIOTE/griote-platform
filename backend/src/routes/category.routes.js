const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/category.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

// PUBLIC
router.get('/', ctrl.list);

// ADMIN ONLY
router.post('/', authMiddleware, requireAdmin, ctrl.create);
router.patch('/:category_id', authMiddleware, requireAdmin, ctrl.update);
router.delete('/:category_id', authMiddleware, requireAdmin, ctrl.delete);

module.exports = router;
