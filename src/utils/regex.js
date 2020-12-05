const { getDb } = require("../db");

/**
 * 检查是否是邮箱
 * @param {*} email 
 */
function isEmail(email) {
    let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ;
    return reg.test(email);
}
/**
 * 匹配整数
 * 
 * @param {*} number 
 */
function isNumber(number) {
    let reg = /-?[1-9]\d*/;
    return reg.test(number);
}

/**
 * 校验密码的有效性
 * 
 * @param {*} pass 
 */
function checkPassValid(pass) {
    // 密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
    let reg = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?_]).*$/;
    return reg.test(pass);
}


module.exports = {
    isEmail,
    isNumber,
    checkPassValid
};