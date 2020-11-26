const express = require('express');
const router = express.Router();
const utils = require("../../utils/index")
// 设置统一回复头
router.all('/*', utils.asyncWrapper(async function (req, res, next) {
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    next();
}));


module.exports = router;