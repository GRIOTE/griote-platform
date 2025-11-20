const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tag.controller');
const { requireAdmin } = require('../middleware/role.middleware');

router.post('/', requireAdmin, ctrl.create);
router.get('/', ctrl.list);
router.patch('/:tag_id', requireAdmin, ctrl.update);
router.delete('/:tag_id', requireAdmin, ctrl.delete);

module.exports = router;