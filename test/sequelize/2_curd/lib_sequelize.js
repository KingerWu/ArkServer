const Sequelize = require('sequelize');

// 创建mysql连接池
const sequelize = new Sequelize('learn', 'root', '123456', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})
module.exports = sequelize;