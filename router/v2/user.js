const express = require('express');
const router = express.Router();
const Model = require("../../model");
const Utils = require("../../utils/utils");
const Auth = require("../../lib/auth/auth");

function createJwtObj(user) {
    return {
        "user": user,
    }
}

function accessTokenExpireTime() {
    return "5m";
}

function refreshTokenExpireTime() {
    return "7d";
}


router.post('/users', Utils.asyncWrapper(async function (req, res) {
    let user = req.body.user;
    let pass = req.body.pass;

    // 检查用户名
    // 用户名正则，4到16位（字母，数字，下划线）
    let namePattern = /^[a-zA-Z0-9_]{4,16}$/;
    if (namePattern.test(user)) {
        // 将密码解密
        let decrytResult = null;
        try {
            decrytResult = Auth.rsaDecrypt(pass);
        } catch (error) {
            decrytResult = null;
            Model.ErrorMap.PasswordDecryptError.toResponse(res);
        }

        if (decrytResult) {
            // 检查密码
            // 密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
            let passPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?_]).*$/;

            if (passPattern.test(decrytResult)) {
                // 检查是否注册过
                let result = await Model.UserTb.findOne({ name: user });

                if (result) {
                    Model.ErrorMap.UserNameExist.toResponse(res);
                }
                else {
                    let saltPass = Auth.saltPass(decrytResult);

                    let result = await Model.UserTb.register(user, saltPass);

                    // 生成AccssToken 和 RefreshToken
                    let accessToken = Auth.jwtSign(createJwtObj(result.name), accessTokenExpireTime());
                    let refreshToken = Auth.jwtSign(createJwtObj(result.name), refreshTokenExpireTime());

                    let tokenResult = await Model.UserTokenTb.findOne({ user_id: result.id });
                    if (tokenResult) {
                        tokenResult = await Model.UserTokenTb.update(result.id, refreshToken);
                    }
                    else {
                        tokenResult = await Model.UserTokenTb.create(result.id, refreshToken);
                    }

                    res.status(201);
                    res.json({
                        "user": result.name,
                        "access_token": accessToken,
                        "refresh_token": tokenResult.refreshToken,
                    });
                }
            }
            else {
                Model.ErrorMap.PasswordInconformity.toResponse(res);
            }
        }
    }
    else {
        Model.ErrorMap.UserNameInconformity.toResponse(res);
    }
}));


router.post('/users/sessions/:user', Utils.asyncWrapper(async function (req, res) {
    let user = req.params.user;
    let pass = req.body.pass;

    // 将密码解密
    let decrytResult = null;
    try {
        decrytResult = Auth.rsaDecrypt(pass);
    } catch (error) {
        decrytResult = null;
        Model.ErrorMap.PasswordDecryptError.toResponse(res);
    }

    if (decrytResult) {
        let saltPass = Auth.saltPass(decrytResult);

        let result = await Model.UserTb.findOne({ name: user, pass: saltPass });
        if (result) {
            // 生成AccssToken 和 RefreshToken
            let accessToken = Auth.jwtSign(createJwtObj(result.name), accessTokenExpireTime());
            let refreshToken = Auth.jwtSign(createJwtObj(result.name), refreshTokenExpireTime());

            let tokenFindResult = await Model.UserTokenTb.findOne({ user_id: result.id });
            let tokenResult = null;
            if (tokenFindResult) {
                await Model.UserTokenTb.update(tokenFindResult.id, refreshToken);
            }
            else {
                tokenResult = await Model.UserTokenTb.create(result.id, refreshToken);
            }

            res.status(201);
            res.json({
                "user": result.name,
                "access_token": accessToken,
                "refresh_token": refreshToken,
            });
        }
        else {
            Model.ErrorMap.UserNameNotExist.toResponse(res);
        }
    }
}));

router.put('/users/sessions/:user', Utils.asyncWrapper(async function (req, res) {
    let user = req.params.user;
    let refresh_token = req.body.refresh_token;

    // verify
    let jwtResult = await Auth.jwtVerify(refresh_token).catch(error => Model.ErrorMap.RefreshTokenInvalid.toResponse(res));
    if (user === jwtResult.user) {
        let result = await Model.UserTb.findOne({ name: user });
        if (result) {
            // check RefreshToken
            let tokenResult = await Model.UserTokenTb.findOne({ user_id: result.id, refresh_token: refresh_token });
            if (tokenResult) {
                let accessToken = Auth.jwtSign(createJwtObj(result.name), accessTokenExpireTime());

                res.status(201);
                res.json({
                    "user": result.name,
                    "access_token": accessToken,
                    "refresh_token": tokenResult.refreshToken,
                });
            }
            else {
                Model.ErrorMap.RefreshTokenInvalid.toResponse(res);
            }
        }
        else {
            Model.ErrorMap.UserNameNotExist.toResponse(res);
        }
    }
    else {
        Model.ErrorMap.RefreshTokenNotMatch.toResponse(res);
    }
}));

router.delete('/users/sessions/:user', Utils.asyncWrapper(async function (req, res) {
    let xArkToken = req.get('X-Ark-Token');
    if (xArkToken) {
        let jwtResult = await Auth.jwtVerify(xArkToken).catch(function(error) {
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

        let result = await Model.UserTb.findOne({ name: jwtResult.user });
        if (result) {
            await Model.UserTokenTb.delete(result.id);
            res.status(204);
            res.end();
        }
        else {
            Model.ErrorMap.UserNameNotExist.toResponse(res);
        }
    }
    else {
        Model.ErrorMap.AccessTokenNull.toResponse(res);
    }
}));



module.exports = router;