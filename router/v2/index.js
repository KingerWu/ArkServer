const express = require('express');
const router = express.Router();

router.use('/v2', require('./user'));
router.use('/v2', require('./fav'));
router.use('/v2', require('./song'));


module.exports = router;