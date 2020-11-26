const express = require('express');
const log = require("../../log");
const router = express.Router();
const constant = require("../../constant");

router.use(function (req, res, next) {
    log.w("404", req.url);
    constant.ErrorMap.RouteNotExist.to(res);
});


router.use(function (err, req, res, next) {
    log.e("500", req.url);
    log.e("500", err);

    constant.ErrorMap.ServerInnerError.to(res);
});


module.exports = router;