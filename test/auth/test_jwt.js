const jwt = require('jsonwebtoken');
const path = require("path");
const fs = require('fs');
const pubKey = fs.readFileSync(path.join(__dirname, 'rsa_1024_pub.pem'), 'utf-8');
const privKey = fs.readFileSync(path.join(__dirname, 'rsa_1024_priv.pem'), 'utf-8');

console.log("公钥", pubKey);
console.log("私钥", privKey);

let jwtObj = {
    "user": "TestArk123456"
};

console.log("jwt object", JSON.stringify(jwtObj));


let jwtToken = jwt.sign(jwtObj, privKey, { algorithm: 'RS256', expiresIn: '5m' });

console.log("jwt", jwtToken);

jwt.verify(jwtToken, pubKey, { algorithms: ['RS256'] }, function (err, payload) {
    if (err) {
        console.log("err", err);
        return;
    }
    console.log("verify", payload);
});