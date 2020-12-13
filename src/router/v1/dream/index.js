const express = require('express');
const router = express.Router();

router.use(require('./global'));
router.use(require('./own'));
router.use(require('./panel'));
router.use(require('./journal'));
router.use(require('./disabuse'));

module.exports = router;