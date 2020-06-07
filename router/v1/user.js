const express = require('express');
const router = express.Router();
const Model = require("../../model");
const Utils = require("../../utils/utils");

router.post('/users', Utils.asyncWrapper(async function (req, res) {
    let user = req.body.user;
    let pass = req.body.pass;

    // 检查用户名
    // 用户名正则，4到16位（字母，数字，下划线）
    let namePattern = /^[a-zA-Z0-9_]{4,16}$/;
    if (namePattern.test(user)) {
        // 检查密码
        // 密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
        let passPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?_]).*$/;

        if (passPattern.test(pass)) {
            // 检查是否注册过
            let result = await Model.UserTb.findOne({ name: user });

            if (result) {
                Model.ErrorMap.UserNameExist.toResponse(res);
            }
            else {
                let result = await Model.UserTb.register(user, pass);
                res.status(201);
                res.json({
                    "user": result.name
                });
            }
        }
        else {
            Model.ErrorMap.PasswordInconformity.toResponse(res);
        }
    }
    else {
        Model.ErrorMap.UserNameInconformity.toResponse(res);
    }
}));


router.post('/users/sessions/:user', Utils.asyncWrapper(async function (req, res) {
    let user = req.params.user;
    let pass = req.body.pass;

    let result = await Model.UserTb.findOne({ name: user, pass: pass });
    if (result) {
        res.status(201);
        res.json({
            "user": user
        });
    }
    else {
        Model.ErrorMap.UserNameNotExist.toResponse(res);
    }
}));


module.exports = router;