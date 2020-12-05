
/**
 * 获取随机验证码
 * @param {*} len 
 */
function randomCode(len) {
    var chars = '0123456789';
    var maxPos = chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}


module.exports = {
    randomCode,
};