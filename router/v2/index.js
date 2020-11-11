const express = require('express');
const router = express.Router();
const Model = require("../../model");

router.use('/v2', require('./user'));

// 拦截后面的Api
router.all('/v2/*', function (req, res) {
    Model.ErrorMap.ApiTooLow.toResponse(res);
});


module.exports = router;