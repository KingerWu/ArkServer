const uuid = require("uuid");
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
        addDeviceToken();
    })
    .catch(err => {
        console.error('无法连接数据库', err);
    });


async function addDeviceToken() {
    const devices = [
        "Web",
        "Android",
        "iOS",
        "Pc"
    ];

    const DeviceTb = sequelize.define('device_tb', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: Sequelize.STRING(20),
            allowNull: false,
            unique: true
        },
        token: {
            type: Sequelize.STRING(100),
            allowNull: false
        }
    }, {
        // 禁用修改表名
        freezeTableName: true,
        // 关闭Sequelize的自动添加timestamp
        timestamps: false
    });

    DeviceTb.sync().then(async function (result) {
        devices.forEach(async device => {
            let token = uuid.v4();
            console.log(device, token);
    
            await DeviceTb.create({
                key: device,
                token: token
            })
        })
    })
}

