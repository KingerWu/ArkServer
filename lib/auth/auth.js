const path = require("path");
const fs = require('fs');
const Utils = require("../../utils/utils");

const pubKey = fs.readFileSync(path.join(__dirname, "../../key/rsa_1024_pub.pem"), 'utf-8');
const privKey = fs.readFileSync(path.join(__dirname, "../../key/rsa_1024_priv.pem"), 'utf-8');
const salt = fs.readFileSync(path.join(__dirname, "../../key/salt.txt"), 'utf-8');

function rsaDecrypt(txt) {
    return Utils.rsaDecrypt(privKey, txt);
}

function saltPass(pass) {
    let shaPwd = Utils.sha256ToHex(pass);
    let saltPwd = Utils.sha256ToHex(shaPwd + salt);
    return saltPwd;
}

function jwtSign(jwtObj, expiresIn) {
    return Utils.jwtSign(jwtObj, privKey, expiresIn);
}

function jwtVerify(jwtToken) {
    return new Promise((resolve, reject) => {
        Utils.jwtVerify(jwtToken, pubKey, function (err, payload) {
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