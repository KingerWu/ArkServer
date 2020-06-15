const uuid = require("uuid");
const CryptoJS = require('crypto-js')

const AccessKey = "Web";
const AccessToken = uuid.v1();


console.log("请求Key", AccessKey);
console.log("请求Secret", AccessToken);

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

function demoGet() {
    // demo 1 Get 请求
    // GET http://localhost:3000/v1/songs/search?key=%E6%9D%A8%E5%8D%83%E5%AC%85&page=0&per_page=30
    let getUrl = "http://localhost:3000/v1/songs/search?key=%E6%9D%A8%E5%8D%83%E5%AC%85&page=0&per_page=30";


    console.log("请求链接", getUrl);

    // 请求方法（GET、POST等）
    let requestMethod = "GET";
    // 请求路径（不需要host和port）
    let requestPath = "/v1/songs/search"
    // 请求参数
    let requestParams = getJsonFromUrl(getUrl);
    // GET 方法没有body，不用请求body的MD5值

    // 增加Header字段：X-Ark-Key = Web，X-Ark-Ver = 1，X-Ark-TimeStamp = 时间戳，X-Ark-Nonce = 随机数
    requestParams["X-Ark-Key"] = "Web";
    requestParams["X-Ark-Ver"] = 1;
    requestParams["X-Ark-TimeStamp"] = Date.parse(new Date());
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

    let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, AccessToken);
    hmac.update(allJoin)
    let result = hmac.finalize()
    console.log("签名", result.toString(CryptoJS.enc.Hex));

}

function demoPost() {
    // demo 1 Get 请求
    // POST http://localhost:3000/v1/users/kinger121314/favs/2/songs
    // {
    //     "song_id": "5eda05d4fc3f3e2b94fdefb7"
    // }
    let postUrl = "http://localhost:3000/v1/users/kinger121314/favs/2/songs";
    let postBody = {
        "song_id": "5eda05d4fc3f3e2b94fdefb7"
    };


    console.log("请求链接", postUrl);
    console.log("请求Body", postBody);

    // 请求方法（GET、POST等）
    let requestMethod = "POST";
    // 请求路径（不需要host和port）
    let requestPath = "/v1/users/kinger121314/favs/2/songs"
    // 请求参数
    let requestParams = getJsonFromUrl(postUrl);
    // Post 请求body的MD5值
    let postBodyString = JSON.stringify(postBody);

    console.log("请求Body to String", postBodyString);
    let postBodyMd5 = CryptoJS.MD5(postBodyString).toString().toUpperCase()
    requestParams["body"] = postBodyMd5;
    // 增加Header字段：X-Ark-Key = Web，X-Ark-Ver = 1，X-Ark-TimeStamp = 时间戳，X-Ark-Nonce = 随机数
    requestParams["X-Ark-Key"] = "Web";
    requestParams["X-Ark-Ver"] = 1;
    requestParams["X-Ark-TimeStamp"] = Date.parse(new Date());
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

    let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, AccessToken);
    hmac.update(allJoin)
    let result = hmac.finalize()
    console.log("签名", result.toString(CryptoJS.enc.Hex));

}


console.log("#####GET DEMO#####");
demoGet();

console.log("#####POST DEMO#####");
demoPost();