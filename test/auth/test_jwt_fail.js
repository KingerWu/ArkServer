const jwt = require('jsonwebtoken');
const path = require("path");
const fs = require('fs');
const pubKey = fs.readFileSync(path.join(__dirname, 'rsa_1024_pub.pem'), 'utf-8');
const privKey = fs.readFileSync(path.join(__dirname, 'rsa_1024_priv.pem'), 'utf-8');

// console.log("公钥", pubKey);
// console.log("私钥", privKey);


const jwtToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVGVzdEFyazEyMzQ1NiIsImlhdCI6MTU5MjIwNDUwMSwiZXhwIjoxNTkyMjA0ODAxfQ.RDx3MN_CEmTvFpdN0LG5PsoniC2x-5E0wQeAix8De7vdiifZAXAqrr7a71aUvwzJe9CHzW6xl3g6IdV72DERkOoPbSHliIybR9MbnQS4nYEIyHWjy69By-ezo5QfHyKDKq1Z88rs8Qa9LT6ZriHW78NOBxuGco7uFyRpqmZyzSM";


jwt.verify(jwtToken, pubKey, { algorithms: ['RS256'] }, function (err, payload) {
    if (err) {
        console.log("err", err);
        return;
    }
    console.log("verify", payload);
});