
const uuid = require("uuid");
const CryptoJS = require('crypto-js')
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require("path");

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
        updatePwd();
    })
    .catch(err => {
        console.error('无法连接数据库', err);
    });


async function updatePwd() {
    const salt = uuid.v4();
    console.log("salt", salt);
    // 将salt 写入文件保存
    fs.writeFileSync(path.join(__dirname, 'salt.txt'), salt);

    // Model 第一个参数为表名
    // 第二个参数指定列名和数据类型
    // 第三个参数是额外的配置
    const UserTb = sequelize.define('user_tb', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING(20),
            allowNull: false,
            unique: true
        },
        pass: {
            // 更新为100的长度
            type: Sequelize.STRING(100),
            allowNull: false
        }
    }, {
        // 禁用修改表名
        freezeTableName: true,
        // 关闭Sequelize的自动添加timestamp
        timestamps: false
    });


    UserTb.sync({ alter: true }).then(async function (result) {
        await sequelize.transaction({}, async (t) => {
            let users = await UserTb.findAll({
                transaction: t
            });
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                let shaPwd = CryptoJS.SHA256(user.pass).toString(CryptoJS.enc.Hex);
                let saltPwd = CryptoJS.SHA256(shaPwd + salt).toString(CryptoJS.enc.Hex);


                console.log(user.name, user.pass + "->" + saltPwd);
                await user.update({
                    pass: saltPwd,
                }, {
                    transaction: t
                });
            }
        })
    })

}

