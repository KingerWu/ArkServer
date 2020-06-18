// ------------ RSA 加密 ------------
function rsaEncrypt(content) {
    const pubKey = "-----BEGIN PUBLIC KEY-----" + "\n" +
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmmuUW1mZ9g6Ape+84kdbAw3l+" + "\n" +
        "yaZwSe9ojH5IjpevemFAkymTsQkkWQFZYMke325hF7YPDAgw/rtYVGBMrQoOfB3F" + "\n" +
        "/Cch2R27EgkhOYh6R6GpanO2wHGUFSkMgH+frDkvGTGaGNPzb4Oij4Jcp7auwAk6" + "\n" +
        "DhjZf5bDvEQGm27d7QIDAQAB" + "\n" +
        "-----END PUBLIC KEY-----";

    if (pubKey) {
        const publicKey = forge.pki.publicKeyFromPem(pubKey);
        const encryptedText = forge.util.encode64(publicKey.encrypt(content, 'RSA-OAEP'));
        return encryptedText;
    }
}

function getUrlRelativePath(url) {
    var arrUrl = url.split("//");
    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);

    if (relUrl.indexOf("?") != -1) {
        relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}


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

function getRequestParams(url, body) {
    const device = "Web";
    const token = "1b6abc5a-0e71-4877-8322-da4adb9f3e88";


    const requestMethod = pm.request.method;
    const requestPath = getUrlRelativePath(url);

    const requestParams = getJsonFromUrl(url);

    if (body) {
        // Post 请求body的MD5值
        let postBodyString = JSON.stringify(body);
        let postBodyMd5 = CryptoJS.MD5(postBodyString).toString().toUpperCase()
        requestParams["body"] = postBodyMd5;
        console.log("body", postBodyString);

        postman.setEnvironmentVariable("body", postBodyString);
    }

    // 增加Header字段：X-Ark-Key = Web，X-Ark-Ver = 1，X-Ark-TimeStamp = 时间戳，X-Ark-Nonce = 随机数
    requestParams["X-Ark-Key"] = device;
    requestParams["X-Ark-Ver"] = 1;
    requestParams["X-Ark-TimeStamp"] = Date.parse(new Date()) / 1000;
    requestParams["X-Ark-Nonce"] = Math.random().toString(36).substr(2, 6);




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

    console.log("拼接后字符串", allJoin);

    let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, token);
    hmac.update(allJoin)
    let result = hmac.finalize().toString(CryptoJS.enc.Hex)
    requestParams["X-Ark-Sign"] = result.toString(CryptoJS.enc.Hex);


    pm.request.headers.upsert({ key: "X-Ark-Key", value: requestParams["X-Ark-Key"] });
    pm.request.headers.upsert({ key: "X-Ark-Ver", value: requestParams["X-Ark-Ver"] });
    pm.request.headers.upsert({ key: "X-Ark-TimeStamp", value: requestParams["X-Ark-TimeStamp"] });
    pm.request.headers.upsert({ key: "X-Ark-Nonce", value: requestParams["X-Ark-Nonce"] });
    pm.request.headers.upsert({ key: "X-Ark-Sign", value: requestParams["X-Ark-Sign"] });
}

