const NodeRSA = require('node-rsa');
const CryptoJS = require('crypto-js');


/**
 * 加密获得签名，key公钥，text加密对字符串内容
 * @param {*} key 
 * @param {*} text 
 */
function rsaEncrypt(key, text) {
    let encrypt = new NodeRSA(key);
    return encrypt.encrypt(text, 'base64');
}

/**
 * 解密获得明文，key私钥，text加密后的签名
 * @param {*} key 
 * @param {*} texts 
 */
function rsaDecrypt(key, text) {
    let decrypt = new NodeRSA(key);
    return decrypt.decrypt(text, 'utf8');
}

/**
 * sha256 to hex string
 * 
 * @param {*} message 
 */
function sha256ToHex(message) {
    return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
}


module.exports = {
    rsaEncrypt,
    rsaDecrypt,
    sha256ToHex,
};