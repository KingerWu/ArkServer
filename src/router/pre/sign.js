const express = require('express');
const router = express.Router();
const constant = require("../../constant");
const sign = require("../../libs/auth/sign");
const utils = require("../../utils/index")

// 验证接口的签名是否正确
router.all('/*', utils.asyncWrapper(async function (req, res, next) {
    let result = await sign.checkSign(req);
    if (result.result) {
        next();
    }
    else {
        if (result.type === "lost") {
            constant.ErrorMap.SignParamLost.to(res, {
                key: result.key
            });
        }
        else {
            constant.ErrorMap.SignCheckFail.to(res);
        }
    }
}));



module.exports = router;