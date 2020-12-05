const express = require('express');
const router = express.Router();
const constant = require("../../constant");
const auth = require("../../libs/auth/auth");
const utils = require("../../utils/index")

// 允许通过的AccessToken 列表
const allowLists = [
    // 根地址
    {
        type: "get",
        value: /\/$/,
    },
    {
        type: "post",
        value: /\/v1\/email$/,
    },
    {
        type: "post",
        value: /\/v1\/users$/,
    },
    {
        type: "post",
        value: /\/v1\/sessions$/,
    },
];

// check access token
router.all('/*', utils.asyncWrapper(async function (req, res, next) {
    let allow = false;
    allowLists.forEach(allowItem => {
        if (allowItem.type.toLowerCase() === req.method.toLowerCase()  && allowItem.value.test(req.path)) {
            allow = true;
        }
    })

    if (allow) {
        next();
    }
    else {
        let xArkToken = req.get('X-Ark-Token');
        if (xArkToken) {
            let jwtResult = await auth.jwtVerify(xArkToken).catch(function (error) {
                try {
                    if (error.name === "TokenExpiredError") {
                        constant.ErrorMap.AccessTokenExpired.to(res);
                    }
                    else {
                        constant.ErrorMap.AccessTokenInvalid.to(res);
                    }
                } catch (error) {
                    constant.ErrorMap.AccessTokenInvalid.to(res);
                }
            });

            if (jwtResult) {
                req.jwt = jwtResult;
                next();
            }
        }
        else {
            constant.ErrorMap.AccessTokenNull.to(res);
        }
    }
}));


module.exports = router;