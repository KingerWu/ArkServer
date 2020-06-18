const BaseEntity = require("../base");
const Utils = require("../../utils/utils");

class Err extends BaseEntity {
    constructor(httpCode, errCode, errMessage) {
        super();
        this.httpCode = httpCode;
        this.errCode = errCode;
        this.errMessage = errMessage;
    }

    get json() {
        return this.toJson();
    }

    get res() {
        return this.json;
    }

    toJson(...param) {
        let message = this.errMessage;
        if (param && param.length > 0) {
            message = Utils.formatWithArg(message, param);
        }

        return JSON.stringify({
            "code": this.errCode,
            "message": message
        });
    }

    toResponse(res) {
        res.status(this.httpCode).send(this.res);
    }

    toResponse(res, ...param) {
        res.status(this.httpCode).send(this.toJson(param));
    }
}

const ErrMap = {
    UserNameExist: new Err(403, 10000, "用户名已存在"),
    UserNameInconformity: new Err(400, 10001, "用户名不符合格式要求"),
    PasswordInconformity: new Err(400, 10002, "密码不符合格式要求"),
    UserNameNotExist: new Err(404, 10003, "用户名不存在"),
    PasswordError: new Err(403, 10004, "密码错误"),
    PasswordDecryptError: new Err(403, 10005, "密码解析失败"),
    RefreshTokenInvalid: new Err(401, 10006, "refresh token失效"),
    RefreshTokenNotMatch: new Err(401, 10007, "用户与refresh token不匹配"),
    AccessTokenInvalid: new Err(401, 10008, "access token 错误"),
    AccessTokenExpired: new Err(401, 10009, "access token 过期"),
    AccessTokenNull: new Err(401, 10010, "access token 缺失"),

    FavExist: new Err(403, 11000, "收藏列表已存在"),
    FavNotExist: new Err(404, 11001, "收藏列表不存在"),
    SongAlreadyInFav: new Err(403, 11002, "歌曲已存在此收藏列表中"),
    FavInconformity: new Err(403, 11003, "收藏列表不符合格式要求"),

    SongNotExist: new Err(404, 12000, "歌曲未收录"),
    SearchKeyInconformity: new Err(400, 12001, "搜索关键字不符合格式要求"),

    ApiTooLow: new Err(403, 13000, "请升级到最新的客户端"),
    SignCheckFail: new Err(403, 13001, "接口验证签名失败"),
    SignParamLost: new Err(403, 13002, "接口签名字段缺失, 缺失字段:${1}"),

    ServerInnerError: new Err(500, 100000, "服务器内部错误"),
    RouteNotExist: new Err(404, 100001, "路由查找失败"),
}

// check 不允许重复的错误码
for (let i in ErrMap) {
    for (let j in ErrMap) {
        if (i === j) {
            continue;
        }

        if (ErrMap[i].errCode === ErrMap[j].errCode) {
            throw new Error("存在重复的错误码，请检查代码:" + ErrMap[i] + "," + ErrMap[j]);
        }
    }
}

module.exports = ErrMap;