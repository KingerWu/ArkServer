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


sequelize
    .authenticate()
    .then(() => {
        console.log('连接已经建立成功');
    })
    .catch(err => {
        console.error('无法连接数据库', err);
    });