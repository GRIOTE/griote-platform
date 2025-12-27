const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/depot.controller');
const auth = require('../middleware/auth.middleware');
const { array: upload } = require('../middleware/upload.middleware');

router.post('/', auth, upload, ctrl.create);
router.get('/mine', auth, ctrl.mine);

module.exports = router;