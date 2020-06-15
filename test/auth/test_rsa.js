const NodeRSA = require('node-rsa');
const path = require("path");
const fs = require('fs');
const pubKey = fs.readFileSync(path.join(__dirname, 'rsa_1024_pub.pem'), 'utf-8');
const privKey = fs.readFileSync(path.join(__dirname, 'rsa_1024_priv.pem'), 'utf-8');
console.log("公钥", pubKey);
console.log("私钥", privKey);




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


const Password = "Ark_123456";

console.log("密码", Password);
let encrypt = rsaEncrypt(pubKey, Password);
let decrypt = rsaDecrypt(privKey, encrypt);


console.log("密文", encrypt);
console.log("明文", decrypt);