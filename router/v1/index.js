const express = require('express');
const router = express.Router();
const Model = require("../../model");

// 拦截后面的Api
router.all('/v1/*', function (req, res) {
    Model.ErrorMap.ApiTooLow.toResponse(res);
});

router.use('/v1', require('./song'));
router.use('/v1', require('./user'));
router.use('/v1', require('./fav'));


module.exports = router;