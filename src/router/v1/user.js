const express = require('express');
const utils = require('../../utils');
const router = express.Router();
const constant = require("../../constant");
const cache = require("../../cache");
const moment = require('moment'); 
const regex = require('../../utils/regex');
const check = require('../../utils/check');
const UserCodeTb = require("../../db/user/UserCodeTb");
const UserTb = require("../../db/user/UserTb");
const UserTokenTb = require('../../db/user/UserTokenTb');
const UserLoginTb = require('../../db/user/UserLoginTb');
const random = require('../../utils/random');
const Email = require('../../libs/email/email');
const auth = require('../../libs/auth/auth');
const db = require('../../db');
const { body, validationResult } = require('express-validator');

function createJwtObj(user) {
    return {
        "id": user._id,
        "email": user.email,
        "is_vip": user.is_vip,
    }
}

function accessTokenExpireTime() {
    return "5m";
}

function refreshTokenExpireTime() {
    return "7d";
}


function checkEmailRegistered(email, type = constant.ConstantMap.UserCodeTypeRegister) {
    return new Promise((resolve, reject) => {
        if (type == constant.ConstantMap.UserCodeTypeRegister) {
            UserTb.find({ email: email }).exec(function (error, userTb) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(userTb && userTb.length > 0);
                }
            })
        }
        else {
            resolve(false);
        }
    });
}

function getLastOneHoursEmail(email, type) {
    return new Promise((resolve, reject) => {
        let currentTime = moment();
        currentTime.add(-1, "h");
        let query = UserCodeTb.find({ email: email, type: type });
        query.where("begin_time").gt(currentTime);
        query.sort({ begin_time: - 1 });
        query.exec(function (error, userCodes) {
            if (error) {
                reject(error);
            }
            else {
                resolve(userCodes);
            }
        })
    });
}

function createUserCode(email, type, code) {
    return new Promise((resolve, reject) => {
        let m = new UserCodeTb;
        m.type = type;
        m.email = email;
        m.code = code;
        m.is_used = false;
        m.begin_time = moment().toDate();
        let endDate = moment(m.begin_time);
        endDate.add(2, "m");
        m.end_time = endDate.toDate();
        m.save().then(result => {
            resolve(result);
        });
    });
}

function checkLastOneValidEmail(email, type, code) {
    return new Promise((resolve, reject) => {
        let currentTime = moment();
        let query = UserCodeTb.find({ email: email, type: type,  is_used: false, code: code});
        query.where("end_time").gt(currentTime);
        query.sort({ begin_time: - 1 });
        query.limit(1)
        query.exec(function (error, userCodes) {
            if (error) {
                reject(error);
            }
            else {
                resolve(userCodes);
            }
        })
    });
}

function createUser(email, name, password, is_vip = false) {
    return new Promise((resolve, reject) => {
        let m = new UserTb;
        m.email = email;
        m.name = name;
        m.password = password;
        m.is_vip = is_vip;
        m.save().then(result => {
            resolve(result);
        });
    });
}
function queryUserById(id) {
    return new Promise((resolve, reject) => {
        let userQuery = UserTb.find({ _id: db.getObjectId(id)});
        userQuery.exec(function (error, users) {
            if (error) {
                reject(error);
            }
            else {
                resolve(users);
            }
        });
    });
}
function queryUserByEmail(email) {
    return new Promise((resolve, reject) => {
        let userQuery = UserTb.find({ email: email});
        userQuery.exec(function (error, users) {
            if (error) {
                reject(error);
            }
            else {
                resolve(users);
            }
        });
    });
}

function createOrUpdateToken(user_id, type, refresh_token) {
    return new Promise((resolve, reject) => {
        let tokenQuery = UserTokenTb.find({ user_id: db.getObjectId(user_id), type: type});
        tokenQuery.exec(function (error, tokens) {
            if (error) {
                reject(error);
            }
            else {
               if (tokens && tokens.length > 0) {
                   let token = tokens[0];
                   token.refresh_token = refresh_token;
                   token.save().then(result => {
                       resolve(result);
                   });
               }
               else {
                    let m = new UserTokenTb;
                    m.user_id = db.getObjectId(user_id);
                    m.type = type;
                    m.refresh_token = refresh_token;
                    m.save().then(result => {
                        resolve(result);
                    });
               }
            }
        }) 
    });
}

function addUserLoginLog(userLoginLogObj) {
    return new Promise((resolve, reject) => {
        let m = new UserLoginTb;
        m.user_id = db.getObjectId(userLoginLogObj.id);
        m.status = userLoginLogObj.status;
        m.ip = userLoginLogObj.ip;
        m.type = userLoginLogObj.type;
        m.login_time = userLoginLogObj.login_time;
        m.device_id = userLoginLogObj.device_id;
        m.device_model = userLoginLogObj.device_model;
        m.device_version = userLoginLogObj.device_version;
        m.version_code = userLoginLogObj.version_code;
        m.version_name = userLoginLogObj.version_name;
        m.save().then(result => {
            resolve(result);
        });
    });
}

function getLastOneHoursLoginLog(id) {
    return new Promise((resolve, reject) => {
        let currentTime = moment();
        currentTime.add(-1, "h");
        let query = UserLoginTb.find({ _id: db.getObjectId(id),  type: constant.ConstantMap.UserLoginStatusLoginFailWithPass});
        query.where("login_time").gt(currentTime);
        query.sort({ login_time: - 1 });
        query.exec(function (error, userCodes) {
            if (error) {
                reject(error);
            }
            else {
                resolve(userLogs);
            }
        })
    });
}


/**
 * Post 获取邮箱验证码
 * 
 * {
 *     "type": （注册 = 1、登录 = 2、修改密码 = 3、账号注销 = 4）,
 *     "email": 邮件地址,
 * }
 */
router.post("/emails", [
    body('email').isEmail(),
    body('type').isInt({min: 1, max: 4}),
], utils.asyncWrapper(async function (req, res) {
    const checkParamResult = validationResult(req);
    if (!checkParamResult.isEmpty()) {
        constant.ErrorMap.RequestParamLost.to(res, {
            errors: checkParamResult.array()
        });
        return;
    }
    // 检查验证码类型
    let type = req.body.type;
    let email = req.body.email;
    // * 验证码有效期为2分钟。
    // * 验证码为6位随机纯数字。
    // * 60s内仅允许发送一次验证码。
    // * 由于存在多种验证码类型，不同验证码互不干扰。
    // * 验证码重复发送，新的将顶替旧的。
    // * 验证码一经用完，立即失效。
    // * 1小时内，同类型验证码，最多发送10次，10次后不再发送，锁定1小时。

    // 检查邮箱合法性
    if (regex.isEmail(email)) {
        let typeInteger = parseInt(type);
        // 判断邮箱是否已经注册
        let checkEmailRegisteredStatus = await checkEmailRegistered(email, type);
        if (checkEmailRegisteredStatus) {
            constant.ErrorMap.EmailRegisteredError.to(res);
            return;
        }
        
        // 1小时内，同类型验证码，最多发送10次，10次后不再发送，锁定1小时
        let emailCache = await cache.get(constant.CacheMap.EMAIL_LOCK_PREFIX(email, type));
        if (!emailCache) {
            let userCodes = await getLastOneHoursEmail(email, type);
            if (userCodes && userCodes.length >= 10) {
                await cache.setEx(constant.CacheMap.EMAIL_LOCK_PREFIX(email, type), "", 60 * 60);
                constant.ErrorMap.EmailLockFail.to(res);

                return;
            }
            else if (userCodes && userCodes.length > 0){
                // 60s内仅允许发送一次验证码
                let lastCode = userCodes[0];
                let lastTime = moment(lastCode.begin_time);
                lastTime.add(1, "m");

                if (lastTime.isAfter(moment())) {
                    constant.ErrorMap.EmailSended.to(res);

                    return;
                }
            }


            // 允许发送新邮件
            let typeString = "其他";
            switch(typeInteger) {
                case constant.ConstantMap.UserCodeTypeRegister: 
                    typeString = "注册";
                    break;
                case constant.ConstantMap.UserCodeTypeLogin: 
                    typeString = "登录";
                    break;
                case constant.ConstantMap.UserCodeTypeModifyPass: 
                    typeString = "修改密码";
                    break;
                case constant.ConstantMap.UserCodeTypeLogOff: 
                    typeString = "账号注销";
                    break;
            }


            let code = random.randomCode(6);
            await Email.send({
                to: email,
                subject: typeString + "验证码", 
                text: "【梦想起航】尊敬的用户你好，您的邮箱验证码是" + code + ", 验证码有效期为2分钟。"
            });

            await createUserCode(email, type, code);

            constant.HttpMap.CREATE.to(res);
        }
        else {
            constant.ErrorMap.EmailLockFail.to(res);
        }
    }
    else {
        constant.ErrorMap.EmailCheckFail.to(res);
    }
}));

/**
 * Post 用户注册
 * 
 * {
 *     "email": 邮件地址,
 *     "code": 邮箱验证码,
 *     "pass": 密码-加密,
 *     "type": 登录类型,
 *     "device_id": 硬件设备id,
 *     "device_model": 硬件设备信息,
 *     "device_version": 硬件设备版本信息,
 *     "version_code": 软件版本,
 *     "version_name": 软件版本,
 * }
 */
router.post("/users", [
    body('email').isEmail(),
    body('code').notEmpty(),
    body('pass').notEmpty(),
    body('type').isInt({min: 1, max: 3}),
    body('device_id').notEmpty(),
    body('device_model').notEmpty(),
    body('device_version').notEmpty(),
    body('version_code').isInt({min: 1}),
    body('version_name').notEmpty(),
], utils.asyncWrapper(async function (req, res) {
    const checkParamResult = validationResult(req);
    if (!checkParamResult.isEmpty()) {
        constant.ErrorMap.RequestParamLost.to(res, {
            errors: checkParamResult.array()
        });
        return;
    }

    
    let email = req.body.email;
    let code = req.body.code;
    let pass = req.body.pass;

    let type = req.body.type;
    let ip = req.ip;
    let device_id = req.body.device_id;
    let device_model = req.body.device_model;
    let device_version = req.body.device_version;
    let version_code = req.body.version_code;
    let version_name = req.body.version_name;

    let typeInteger = parseInt(type);

    // 检查邮箱合法性
    if (regex.isEmail(email)) {
        // 判断邮箱是否已经注册
        let checkEmailRegisteredStatus = await checkEmailRegistered(email);
        if (checkEmailRegisteredStatus) {
            constant.ErrorMap.EmailRegisteredError.to(res);
            return;
        }

        // 将密码解密
        let decrytResult = null;
        try {
            decrytResult = auth.rsaDecrypt(pass);
            // 校验密码是否符合规则
            if (regex.checkPassValid(decrytResult)) {
                // 检查验证码是否正确
                let lastCodes = await checkLastOneValidEmail(email, constant.ConstantMap.UserCodeTypeRegister, code);
                if (lastCodes && lastCodes.length > 0){
                    // 将验证码设置为使用过
                    let lastCode = lastCodes[0];
                    lastCode.is_used = true;
                    await lastCode.save();

                    // 注册用户
                    let saltPass = auth.saltPass(decrytResult);

                    let createUserResult = await createUser(email, email, saltPass, false);

                    // 生成AccssToken 和 RefreshToken
                    let accessToken = auth.jwtSign(createJwtObj(createUserResult), accessTokenExpireTime());
                    let refreshToken = auth.jwtSign(createJwtObj(createUserResult), refreshTokenExpireTime());

                    let createOrUpdateTokenResult = await createOrUpdateToken(createUserResult._id, typeInteger, refreshToken);

                    constant.HttpMap.CREATE.to(res, {
                        "email": createUserResult.email,
                        "name": createUserResult.name,
                        "is_vip": createUserResult.is_vip,
                        "access_token": accessToken,
                        "refresh_token": createOrUpdateTokenResult.refresh_token,
                    });

                    
                    // 添加登录记录
                    addUserLoginLog({
                        id: createUserResult._id,
                        status: constant.ConstantMap.UserLoginStatusLoginSuccess,
                        type,
                        ip,
                        login_time: moment().toDate(),
                        device_id,
                        device_model,
                        device_version,
                        version_code,
                        version_name,
                    });
                }
                else {
                    constant.ErrorMap.CodeError.to(res);
                }
            }
            else {
                constant.ErrorMap.PasswordInconformity.to(res);
            }
        } catch (error) {
            constant.ErrorMap.PasswordDecryptError.to(res);
        }
   }

}));


/**
 * Post 用户登录
 */
router.post("/sessions", [
    body('email').isEmail(),
    body('pass').notEmpty(),
    body('type').isInt({min: 1, max: 3}),
    body('device_id').notEmpty(),
    body('device_model').notEmpty(),
    body('device_version').notEmpty(),
    body('version_code').isInt({min: 1}),
    body('version_name').notEmpty(),
], utils.asyncWrapper(async function (req, res) {
    const checkParamResult = validationResult(req);
    if (!checkParamResult.isEmpty()) {
        constant.ErrorMap.RequestParamLost.to(res, {
            errors: checkParamResult.array()
        });
        return;
    }

    let email = req.body.email;
    let pass = req.body.pass;

    let type = req.body.type;
    let ip = req.ip;
    let device_id = req.body.device_id;
    let device_model = req.body.device_model;
    let device_version = req.body.device_version;
    let version_code = req.body.version_code;
    let version_name = req.body.version_name;



    let typeInteger = parseInt(type);
    // 检查邮箱合法性
    if (regex.isEmail(email)) {
        // 将密码解密
        let decrytResult = null;
        try {
            decrytResult = auth.rsaDecrypt(pass);
            // 查找用户
            let saltPass = auth.saltPass(decrytResult);

            let users = await queryUserByEmail(email);

            if (users && users.length > 0) {
                let user = users[0];

                // 1个小时内 10次密码错误，需要输入验证码
                let checkCodeResult = true;
                let userLogs = await getLastOneHoursLoginLog(user._id);
                // 校验验证码
                if (userLogs && userLogs.length > 10) {
                    // 检查验证码是否正确
                    let code = req.body.code;
                    if (!code) {
                        constant.ErrorMap.CodeError.to(res);
                        checkCodeResult = false;
                    }
                    else {
                        let lastCodes = await checkLastOneValidEmail(email, constant.ConstantMap.UserCodeTypeLogin, code);
                        if (lastCodes && lastCodes.length > 0){
                            // 将验证码设置为使用过
                            let lastCode = lastCodes[0];
                            lastCode.is_used = true;
                            await lastCode.save();
                        }
                        else {
                            constant.ErrorMap.CodeError.to(res);
                            checkCodeResult = false;
                        }
                    }
                }
                if (checkCodeResult) {
                    if (user.password === saltPass) {
                        // 生成AccssToken 和 RefreshToken
                        let accessToken = auth.jwtSign(createJwtObj(user), accessTokenExpireTime());
                        let refreshToken = auth.jwtSign(createJwtObj(user), refreshTokenExpireTime());
    
                        let createOrUpdateTokenResult = await createOrUpdateToken(user._id, typeInteger, refreshToken);
    
                        constant.HttpMap.CREATE.to(res, {
                            "email": user.email,
                            "name": user.name,
                            "is_vip": user.is_vip,
                            "access_token": accessToken,
                            "refresh_token": createOrUpdateTokenResult.refresh_token,
                        });
    
                        
                        // 添加登录记录
                        addUserLoginLog({
                            id: user._id,
                            status: constant.ConstantMap.UserLoginStatusLoginSuccess,
                            type,
                            ip,
                            login_time: moment().toDate(),
                            device_id,
                            device_model,
                            device_version,
                            version_code,
                            version_name,
                        });
                    }
                    else {
                        constant.ErrorMap.PasswordError.to(res);
                        // 添加登录记录
                        addUserLoginLog({
                            id: user._id,
                            status: constant.ConstantMap.UserLoginStatusLoginFailWithPass,
                            type,
                            ip,
                            login_time: moment().toDate(),
                            device_id,
                            device_model,
                            device_version,
                            version_code,
                            version_name,
                        });
                    }
                }
                else {
                    // 添加登录记录
                    addUserLoginLog({
                        id: user._id,
                        status: constant.ConstantMap.UserLoginStatusLoginFailWithCode,
                        type,
                        ip,
                        login_time: moment().toDate(),
                        device_id,
                        device_model,
                        device_version,
                        version_code,
                        version_name,
                    });
                }
            }
            else {
                constant.ErrorMap.EmailNotRegisteredError.to(res);
            }
        } catch (error) {
            constant.ErrorMap.PasswordDecryptError.to(res);
        }
   }
}));
 


/**
 * Put 用户修改信息(昵称、邮箱、密码)
 * 
 */
router.put("/users", [
    // 1 修改昵称, 2 修改邮箱, 3 修改密码
    body('type').isInt({min: 1, max: 3}),
], utils.asyncWrapper(async function (req, res) {
    let checkParamResult = validationResult(req);
    if (!checkParamResult.isEmpty()) {
        constant.ErrorMap.RequestParamLost.to(res, {
            errors: checkParamResult.array()
        });
        return;
    }

    // 获取用户的账号信息
    let type = req.body.type;

    if (type == constant.ConstantMap.UserChangeTypeName) {
        // 先不实现昵称, 敏感词问题，暂不处理
        constant.ErrorMap.ApiNotSupport.to(res);
    }
    else if (type == constant.ConstantMap.UserChangeTypeEmail) {
        // 没有其他验证方式，现在也不能让他换邮箱
        constant.ErrorMap.ApiNotSupport.to(res);
    }
    else if (type == constant.ConstantMap.UserChangeTypePass) {
        let code = req.body.code;
        let pass = req.body.pass;

        // 将密码解密
        let decrytResult = null;
        try {
            decrytResult = auth.rsaDecrypt(pass);
           
            // 校验密码是否符合规则
            if (regex.checkPassValid(decrytResult)) {
                // 检查验证码是否正确
                let lastCodes = await checkLastOneValidEmail(email, constant.ConstantMap.UserCodeTypeModifyPass, code);
                if (lastCodes && lastCodes.length > 0){
                    // 将验证码设置为使用过
                    let lastCode = lastCodes[0];
                    lastCode.is_used = true;
                    await lastCode.save();

                    // 查找用户
                    let saltPass = auth.saltPass(decrytResult);
                    let users = await queryUserById(req.jwt.id);
                    if (users && users.length > 0) {
                        let user = users[0];
                        user.pass = saltPass;
                        await user.save();

                        constant.HttpMap.UPDATE.to(res);
                    }
                    else {
                        constant.ErrorMap.AccessTokenInvalid.to(res);
                    }
                }
                else {
                    constant.ErrorMap.CodeError.to(res);
                }
            }
            else {
                constant.ErrorMap.PasswordInconformity.to(res);
            }
        } catch (error) {
            constant.ErrorMap.PasswordDecryptError.to(res);
        }
    }
}));


/**
 * Delete 注销用户
 * 
 */
router.delete("/users", [
    body('code').notEmpty(),
    body('pass').notEmpty(),
], utils.asyncWrapper(async function (req, res) {
    // 删除用户
    let checkParamResult = validationResult(req);
    if (!checkParamResult.isEmpty()) {
        constant.ErrorMap.RequestParamLost.to(res, {
            errors: checkParamResult.array()
        });
        return;
    }
    let pass = req.body.pass;
    let code = req.body.code;

    // 将密码解密
    let decrytResult = null;
    try {
        decrytResult = auth.rsaDecrypt(pass);
        // 校验密码是否符合规则
        if (regex.checkPassValid(decrytResult)) {
            // 检查验证码是否正确
            let lastCodes = await checkLastOneValidEmail(email, constant.ConstantMap.UserCodeTypeLogOff, code);
            if (lastCodes && lastCodes.length > 0){
                // 将验证码设置为使用过
                let lastCode = lastCodes[0];
                lastCode.is_used = true;
                await lastCode.save();

                // 注销用户
                let users = await queryUserById(req.jwt.id);
                if (users && users.length > 0) {
                    let saltPass = auth.saltPass(decrytResult);

                    let user = users[0];

                    if (user.pass === saltPass) {
                        await user.remove();
                        constant.HttpMap.DELETE.to(res);
                        // TODO 应该还需要定时任务去删除关联数据 
                    }
                    else {
                        constant.ErrorMap.PasswordError.to(res);
                    }
                }
                else {
                    constant.ErrorMap.AccessTokenInvalid.to(res);
                }
            }
            else {
                constant.ErrorMap.CodeError.to(res);
            }
        }
        else {
            constant.ErrorMap.PasswordInconformity.to(res);
        }
    } catch (error) {
        constant.ErrorMap.PasswordDecryptError.to(res);
    }    
}));

module.exports = router;