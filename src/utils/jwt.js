const jwt = require('jsonwebtoken');

/**
 * jwt 签名
 * @param {*} jwtObj 
 * @param {*} key 
 * @param {*} expiresIn 
 */
function jwtSign(jwtObj, key, expiresIn) {
    let jwtToken = jwt.sign(jwtObj, key, { algorithm: 'RS256', expiresIn: expiresIn });
    return jwtToken;
}

/**
 * jwt 解签
 * @param {*} jwtToken 
 * @param {*} key 
 * @param {*} callback 
 */
function jwtVerify(jwtToken, key, callback) {
    jwt.verify(jwtToken, key, { algorithms: ['RS256'] }, callback);
}

module.exports = {
    jwtSign,
    jwtVerify
};