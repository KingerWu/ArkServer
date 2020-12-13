const express = require('express');
const router = express.Router();

router.use('/v1', require('./user'));
router.use('/v1', require('./file'));
router.use('/v1/dream', require('./dream/index'));

module.exports = router;