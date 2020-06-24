const express = require('express');
const router = express.Router();
const Model = require("../../model");

router.use('/v2', require('./user'));
router.use('/v2', require('./fav'));

// 拦截后面的Api
router.all('/v2/*', function (req, res) {
    Model.ErrorMap.ApiTooLow.toResponse(res);
});
router.use('/v2', require('./song'));


module.exports = router;