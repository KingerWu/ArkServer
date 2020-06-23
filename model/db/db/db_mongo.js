const BaseDao = require("./db_common");
const mongoose = require('mongoose');
const Config = require("../../../config");

const options = {
    keepAlive: 120,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: Config.mongo.user,
    pass: Config.mongo.pass,
};

mongoose.connect(Config.mongo.url, options);
// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('Mongoose 连接异常: ' + err);
});

db.on('disconnected', function () {
    console.log('Mongoose 已断开连接');
});

db.once('open', function () {
    // we're connected!
    console.log("Mongoose 已连接，请正常操作");
});

const CACHE = {};

class MongooseDao extends BaseDao {
    /**
     * 创建表单/集合
     * 
     * @param {*} tableName 
     * @param {*} tableDefinition 
     * @param {*} tableOptions 
     */
    static createTable(tableName, tableDefinition, tableOptions) {
        let schema = new mongoose.Schema(tableDefinition, tableOptions);
        CACHE[tableName] = db.model(tableName, schema, tableName);
    }

    static createOne(tableName, obj) {
        let that = this;
        return new Promise((resolve, reject) => {
            new CACHE[tableName](obj).save().then(result => {
                resolve(result);
            });
        });
    }

    static findOne(tableName, conditions) {
        return new Promise((resolve, reject) => {
            CACHE[tableName].findOne(conditions).then(result => {
                resolve(result);
            });
        });
    }

    static findMany(tableName, conditions, offset = 0, limit = 30) {
        return new Promise((resolve, reject) => {
            CACHE[tableName].find(conditions, null, { skip: offset, limit: limit }).then(results => {
                resolve(results);
            })
        });
    }

    static updateOne(tableName, conditions, obj) {
        return new Promise((resolve, reject) => {
            CACHE[tableName].updateOne(conditions, obj).then(() => {
                resolve();
            });
        });
    }

    static deleteOne(tableName, conditions) {
        return new Promise((resolve, reject) => {
            CACHE[tableName].deleteOne(conditions).then(() => {
                resolve();
            });
        });
    }
}

module.exports = MongooseDao;
