const BaseCache = require("./cache_common");
// 连接redis数据库
const redis = require('redis');
const client = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
    password: "123456"
});

client.on('connect', function () {
    console.log("redis", 'redis connect');
});

client.on('error', function (err) {
    console.log("redis", "redis error - " + err);
});

class RedisCache extends BaseCache {

    static set(key, value) {
        return new Promise((resolve, reject) => {
            client.set(key, value);
            resolve();
        });
    }

    static set(key, value, timeout) {
        return new Promise((resolve, reject) => {
            client.set(key, value, 'EX', timeout);
            resolve();
        });
    }

    static get(key) {
        return new Promise((resolve, reject) => {
            client.get(key, (err, value) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(value);
                }
            });
        });
    }

    static del(key) {
        return new Promise((resolve, reject) => {
            client.del(key);
            resolve();
        });
    }
}

module.exports = RedisCache;
