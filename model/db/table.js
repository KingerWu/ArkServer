const BaseEntity = require("../base");
const MongooseDao = require("./db/db_mongo");
const SequelizeDao = require("./db/db_sequelize");

// 数据库关联字段
const DEFAULT_OBJ = {};
const DEFAULT_STRING = "";

const TYPE_Undefined = "undefined";
const TYPE_MySql = "MySql";
const TYPE_MongoDB = "MongoDB";

class Table extends BaseEntity {
    static type() {
        return TYPE_Undefined;
    }
    static db() {
        return DEFAULT_OBJ;
    }

    static tableName() {
        return DEFAULT_STRING;
    }

    static tableDefinition() {
        return DEFAULT_OBJ;
    }

    static tableOptions() {
        return DEFAULT_OBJ;
    }


    static createOne(obj) {
        return this.db().createOne(this.tableName(), obj);
    }

    static findOne(conditions) {
        return this.db().findOne(this.tableName(), conditions);
    }

    static findMany(conditions, offset = 0, limit = 30) {
        return this.db().findMany(this.tableName(), conditions, offset, limit);
    }

    static updateOne(conditions, obj) {
        return this.db().updateOne(this.tableName(), conditions, obj);
    }

    static deleteOne(conditions) {
        return this.db().deleteOne(this.tableName(), conditions);
    }
}

class MySqlTable extends Table {
    static type() {
        return TYPE_MySql;
    }

    static db() {
        return SequelizeDao;
    }


    static tableDefinition() {
        return DEFAULT_OBJ;
    }

    static tableOptions() {
        return {
            // 禁用修改表名
            freezeTableName: true,
            // 关闭Sequelize的自动添加timestamp
            timestamps: false
        };
    }
}

class MongoDBTable extends Table {
    static type() {
        return TYPE_MongoDB;
    }

    static db() {
        return MongooseDao;
    }


    static tableDefinition() {
        return DEFAULT_OBJ;
    }

    static tableOptions() {
        return DEFAULT_OBJ;
    }
}

module.exports = {
    TYPE_Undefined,
    TYPE_MySql,
    TYPE_MongoDB,
    Table,
    MySqlTable,
    MongoDBTable,
};