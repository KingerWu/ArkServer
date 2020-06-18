const fs = require('fs');
const path = require('path');
const NodeRSA = require('node-rsa');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

function requireClass(dirPath, filterName = 'index.js') {
    const results = {};
    fs.readdirSync(dirPath).filter((value) => {
        return value !== filterName;
    }).map(value => {
        let result = require(dirPath + '/' + value);
        if (typeof result == 'function') {
            results[result.name] = result;
        }
        else {
            results[path.basename(value, ".js")] = result;
        }
    });

    return results;
}


function asyncWrapper(fn) {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next))
            .then(() => {
            })
            .catch((err) => {
                next(err)
            });
    }
}


function formatWithArg(str, ...arguments) {
    if (arguments.length == 0) return str;
    let param = arguments[0];
    let s = str;
    if (typeof (param) == 'object') {
        for (let key in param)
            s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
        return s;
    } else {
        for (let i = 0; i < arguments.length; i++)
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        return s;
    }
}



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

function sha256ToHex(message) {
    return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
}

function jwtSign(jwtObj, key, expiresIn) {
    let jwtToken = jwt.sign(jwtObj, key, { algorithm: 'RS256', expiresIn: expiresIn });
    return jwtToken;
}

function jwtVerify(jwtToken, key, callback) {
    jwt.verify(jwtToken, key, { algorithms: ['RS256'] }, callback);
}


module.exports = {
    requireClass,
    asyncWrapper,
    formatWithArg,
    rsaEncrypt,
    rsaDecrypt,
    sha256ToHex,
    jwtSign,
    jwtVerify
};