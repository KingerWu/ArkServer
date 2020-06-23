const BaseDao = require("./db_common");
const Sequelize = require('sequelize');
const Config = require("../../../config");

// 创建mysql连接池
const sequelize = new Sequelize(Config.mysql.db, Config.mysql.user, Config.mysql.pass, {
    dialect: 'mysql',
    host: Config.mysql.host,
    port: Config.mysql.port,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})



const CACHE = {};

class SequelizeDao extends BaseDao {
    /**
     * 创建表单/集合
     * 
     * @param {*} tableName 
     * @param {*} tableDefinition 
     * @param {*} tableOptions 
     */
    static createTable(tableName, tableDefinition, tableOptions) {
        CACHE[tableName] = sequelize.define(tableName, tableDefinition, tableOptions);
    }

    /**
     * 同步表单/集合
     */
    static syncTable() {
        // 将数据库表同步到数据库
        sequelize.sync();
    }

    static createOne(tableName, obj) {
        return new Promise((resolve, reject) => {
            CACHE[tableName]
                .build(obj)
                .save()
                .then(() => {
                    this.findOne(tableName, obj).then(result => {
                        resolve(result);
                    })
                })
        });
    }


    static findOne(tableName, conditions) {
        return new Promise((resolve, reject) => {
            CACHE[tableName].findOne({
                where: conditions,
            }).then(result => {
                resolve(result);
            })
        });
    }

    static findMany(tableName, conditions, offset = 0, limit = 30) {
        return new Promise((resolve, reject) => {
            CACHE[tableName].findAll({
                where: conditions,
                offset: offset,
                limit: limit
            }).then(results => {
                resolve(results);
            })
        });
    }

    static updateOne(tableName, conditions, obj) {
        return new Promise((resolve, reject) => {
            this.findOne(tableName, conditions).then(result => {
                result.update(obj).then(() => {
                    resolve();
                })
            })
        });
    }

    static deleteOne(tableName, conditions) {
        return new Promise((resolve, reject) => {
            this.findOne(tableName, conditions).then(result => {
                result.destroy({ force: true }).then(() => {
                    resolve();
                })
            })
        });
    }
}

module.exports = SequelizeDao;