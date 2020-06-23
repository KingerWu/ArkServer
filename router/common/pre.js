const express = require('express');
const router = express.Router();
const requestSign = require("../../lib/auth/requestSign");
const Model = require("../../model");
const Utils = require("../../utils/utils");
const Auth = require("../../lib/auth/auth");

// 允许通过的AccessToken 列表
const allowLists = [
    /\/v2\/users$/,
    /\/v1\/users\/sessions\/[\s\S]*$/,
    /\/v1\/songs\/search$/,
    /\/v1\/songs\/[\s\S]*$/,

    /\/v2\/users$/,
    /\/v2\/users\/sessions\/[\s\S]*$/,
    /\/v2\/songs\/search$/,
    /\/v2\/songs\/[\s\S]*$/,
];

// 设置统一回复头
router.all('/*', Utils.asyncWrapper(async function (req, res, next) {
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    next();
}));

// 验证接口的签名是否正确
router.all('/*', Utils.asyncWrapper(async function (req, res, next) {
    // 不处理v1的接口
    if (req.path.startsWith("/v1/")) {
        next();
    }
    else {
        let result = await requestSign.checkSign(req);
        if (result.result) {
            next();
        }
        else {
            if (result.type === "lost") {
                Model.ErrorMap.SignParamLost.toResponse(res, result.key);
            }
            else {
                Model.ErrorMap.SignCheckFail.toResponse(res);
            }
        }
    }
}));

// check access token
router.all('/*', Utils.asyncWrapper(async function (req, res, next) {
    let allow = false;
    allowLists.forEach(allowItem => {
        if (allowItem.test(req.path)) {
            allow = true;
        }
    })

    if (allow) {
        next();
    }
    else {
        let xArkToken = req.get('X-Ark-Token');
        if (xArkToken) {
            let jwtResult = await Auth.jwtVerify(xArkToken).catch(function (error) {
                try {
                    if (error.name === "TokenExpiredError") {
                        Model.ErrorMap.AccessTokenExpired.toResponse(res);
                    }
                    else {
                        Model.ErrorMap.AccessTokenInvalid.toResponse(res);
                    }
                } catch (error) {
                    Model.ErrorMap.AccessTokenInvalid.toResponse(res);
                }
            });

            if (jwtResult) {
                req.jwt = jwtResult;
                next();
            }
        }
        else {
            Model.ErrorMap.AccessTokenNull.toResponse(res);
        }
    }
}));

// 添加对应的offset 和 limit
router.all('/*', function (req, res, next) {
    let offset = 0;
    let limit = 30;
    if (req.query) {
        offset = req.query.page ? parseInt(req.query.page) : offset;
        limit = req.query.per_page ? parseInt(req.query.per_page) : limit;
    }
    req.offset = offset;
    req.limit = limit;

    next();
});

module.exports = router;