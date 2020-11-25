const config = require("../config");
const log = require("../log");
const redis = require('redis');

class Cache {
    constructor() {
        this.cache = null;
    }
    init() {
        let that = this;
        return new Promise((resolve, reject) => {
            if (that.cache != null) {
                resolve(that.cache);
                return;
            }
    
            let options = {
                host: config.redis.host,
                port: config.redis.port,
                password: config.redis.pass
            };

            log.i("***********缓存配置文件*******************");
            log.i(JSON.stringify(options, null, 4));

            const client = redis.createClient(options);
            client.on('connect', function () {
                log.i("redis", 'redis connect');
                that.cache = client;
                resolve(that.cache);
            });
            
            client.on('error', function (err) {
                log.e("redis", "redis error - " + err);
                reject(err);
            });
        });
    }

    set(key, value) {
        let that = this;
        return new Promise((resolve, reject) => {
            that.cache.set(key, value, (err, value) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(value);
                }
            });
        });
    }

    get(key) {
        let that = this;
        return new Promise((resolve, reject) => {
            that.cache.get(key, (err, value) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(value);
                }
            });
        });
    }

    del(key) {
        let that = this;
        return new Promise((resolve, reject) => {
            that.cache.del(key, (err, value) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(value);
                }
            });
        });
    }
}

module.exports = new Cache();