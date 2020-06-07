const express = require('express');
const router = express.Router();
const Model = require("../../model");

router.use(function (req, res, next) {
    console.log("404", req.url);
    Model.ErrorMap.RouteNotExist.toResponse(res);
});

router.use(function (err, req, res, next) {
    console.log("500", err);
    Model.ErrorMap.ServerInnerError.toResponse(res);
});

module.exports = router;