const CryptoJS = require('crypto-js')
const Model = require("../../model");

function getJsonFromUrl(url) {
    var question = url.indexOf("?");
    var hash = url.indexOf("#");
    if (hash == -1 && question == -1) return {};
    if (hash == -1) hash = url.length;
    var query = question == -1 || hash == question + 1 ? url.substring(hash) :
        url.substring(question + 1, hash);
    var result = {};
    query.split("&").forEach(function (part) {
        if (!part) return;
        part = part.split("+").join(" "); // replace every + with space, regexp-free version
        var eq = part.indexOf("=");
        var key = eq > -1 ? part.substr(0, eq) : part;
        var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
        var from = key.indexOf("[");
        if (from == -1) result[decodeURIComponent(key)] = val;
        else {
            var to = key.indexOf("]", from);
            var index = decodeURIComponent(key.substring(from + 1, to));
            key = decodeURIComponent(key.substring(0, from));
            if (!result[key]) result[key] = [];
            if (!index) result[key].push(val);
            else result[key][index] = val;
        }
    });
    return result;
}

function signSuccess() {
    return {
        result: true,
        type: "success"
    }
}



function signKeyError() {
    return {
        result: false,
        type: "key"
    }
}


function signParamLost(key) {
    return {
        result: false,
        type: "lost",
        key: key
    }
}


async function checkSign(req) {
    // 字段检查
    let xArkKey = req.get('X-Ark-Key');
    let xArkVer = req.get('X-Ark-Ver');
    let xArkTimeStamp = req.get('X-Ark-TimeStamp');
    let xArkNonce = req.get('X-Ark-Nonce');
    let xArkSign = req.get('X-Ark-Sign');

    if (xArkKey && xArkVer && xArkTimeStamp && xArkNonce && xArkSign) {
        let AccessKey = xArkKey;
        let device = await Model.DeviceTb.findOne({ key: AccessKey });

        if (device) {
            let AccessToken = device.token;

            let requestMethod = req.method;
            // 请求路径（不需要host和port）
            let requestPath = req.path;
            // 请求参数
            let requestParams = getJsonFromUrl(req.originalUrl);

            let bodyString = JSON.stringify(req.body);
            if (bodyString !== "{}") {
                let bodyMd5 = CryptoJS.MD5(bodyString).toString().toUpperCase()
                requestParams["body"] = bodyMd5;
            }
    
            requestParams["X-Ark-Key"] = xArkKey;
            requestParams["X-Ark-Ver"] = xArkVer;
            requestParams["X-Ark-TimeStamp"] = xArkTimeStamp;
            requestParams["X-Ark-Nonce"] = xArkNonce;



            let requestParamKeys = [];
            for (let key in requestParams) {
                requestParamKeys.push(key.toUpperCase());
            }
            requestParamKeys = requestParamKeys.sort();
    
            let allJoin = requestMethod + "&" + requestPath;
            requestParamKeys.forEach(requestParamKey => {
                for (let key in requestParams) {
                    if (requestParamKey === key.toUpperCase()) {
                        allJoin = allJoin + "&" + requestParamKey + "=" + requestParams[key];
                    }
                }
            });
            let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, AccessToken);
            hmac.update(allJoin)
            let result = hmac.finalize()
            let hexResult = result.toString(CryptoJS.enc.Hex);

            if (hexResult === xArkSign) {
                return signSuccess();
            }
            else {
                return signKeyError();
            }
        }
        else {
            return signKeyError();
        }
    }
    else {
        if (!xArkKey) {
            return signParamLost("X-Ark-Key");
        }
        else if (!xArkVer) {
            return signParamLost("X-Ark-Ver");
        }
        else if (!xArkTimeStamp) {
            return signParamLost("X-Ark-TimeStamp");
        }
        else if (!xArkNonce) {
            return signParamLost("X-Ark-Nonce");
        }
        else {
            return signParamLost("X-Ark-Sign");
        }
    }
}


module.exports = {
    checkSign
}