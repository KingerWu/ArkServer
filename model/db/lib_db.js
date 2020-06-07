
const db_mongo = require("./db/db_mongo");
const db_sequelize = require("./db/db_sequelize");

const table = require("./table");
const TbMap = require("./table/");

// 创建表格
Object.keys(TbMap).forEach(function(key){
    let tbModel = TbMap[key];
    if (tbModel.type() === table.TYPE_MySql) {
        db_sequelize.createTable(tbModel.tableName(), tbModel.tableDefinition(), tbModel.tableOptions());
    }
    else if (tbModel.type() === table.TYPE_MongoDB) {
        db_mongo.createTable(tbModel.tableName(), tbModel.tableDefinition(), tbModel.tableOptions());
    }
});

// 同步数据库
db_sequelize.syncTable();

module.exports = Object.assign(table, TbMap);