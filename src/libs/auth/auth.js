const path = require("path");
const fs = require('fs');
const crypto = require("../../utils/crypto");
const jwt = require("../../utils/jwt");

const pubKey = fs.readFileSync(path.join(__dirname, "../../config/key/rsa_1024_pub.pem"), 'utf-8');
const privKey = fs.readFileSync(path.join(__dirname, "../../config/key/rsa_1024_priv.pem"), 'utf-8');
const salt = fs.readFileSync(path.join(__dirname, "../../config/key/salt.txt"), 'utf-8');

function rsaDecrypt(txt) {
    return crypto.rsaDecrypt(privKey, txt);
}

function saltPass(pass) {
    let shaPwd = crypto.sha256ToHex(pass);
    let saltPwd = crypto.sha256ToHex(shaPwd + salt);
    return saltPwd;
}

function jwtSign(jwtObj, expiresIn) {
    return jwt.jwtSign(jwtObj, privKey, expiresIn);
}

function jwtVerify(jwtToken) {
    return new Promise((resolve, reject) => {
        jwt.jwtVerify(jwtToken, pubKey, function (err, payload) {
            if (err) {
                reject(err);
            }
            else {
                resolve(payload);
            }
        });
    });
}


module.exports = {
    rsaDecrypt,
    saltPass,
    jwtSign,
    jwtVerify
}