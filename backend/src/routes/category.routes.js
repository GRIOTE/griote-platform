const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/category.controller');
const { requireAdmin } = require('../middleware/role.middleware');

router.post('/', requireAdmin, ctrl.create);
router.get('/', ctrl.list);
router.patch('/:category_id', requireAdmin, ctrl.update);
router.delete('/:category_id', requireAdmin, ctrl.delete);

module.exports = router;