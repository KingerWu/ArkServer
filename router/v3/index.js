const express = require('express');
const router = express.Router();

router.use('/v3', require('./song'));

module.exports = router;