const mongoose = require('mongoose');
const config = require("../config");
const log = require("../log");
const ObjectId = require('mongoose').Types.ObjectId; 

class Db {
    constructor() {
        this.db = null;
    }
    getDb() {
        return this.db;
    }

    getObjectId(_id) {
        return new ObjectId(_id);
    }

    init() {
        let that = this;
        return new Promise((resolve, reject) => {
            if (that.db != null) {
                resolve(that.db);
                return;
            }
    
            const options = {
                keepAlive: 120,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                user: config.mongo.user,
                pass: config.mongo.pass,
            };

            log.i("***********数据库配置文件*******************");
            log.i(JSON.stringify(options, null, 4));

            mongoose.connect(config.mongo.url, options);
            // 让 mongoose 使用全局 Promise 库
            mongoose.Promise = global.Promise;
                        
            let db = mongoose.connection;
    
            db.on('error', function (err) {
                log.e("Mongoose", 'Mongoose 连接异常: ' + err);
                reject(err);
            });
    
            db.once('open', function () {
                log.i("Mongoose", "Mongoose 已连接，请正常操作");
                that.db = db;
                resolve(that.db);
            });
        });
    }

    create(tb, obj) {
        return new Promise((resolve, reject) => {
            tb(obj).save().then(result => {
                resolve(result);
            });
        });
    }

    findOne(tb, conditions) {
        return new Promise((resolve, reject) => {
            tb.findOne(conditions, function (err, value) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(value);
            });
        });
    }

}

module.exports = new Db();