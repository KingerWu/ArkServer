var Sequelize = require('sequelize');
var sequelize = require('./lib_sequelize');
var stdin = process.openStdin();

// Model 第一个参数为表名
// 第二个参数指定列名和数据类型
// 第三个参数是额外的配置
var Runoob = sequelize.define('runoob_tbl', {
    runoob_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    runoob_title: Sequelize.STRING(100),
    runoob_author: Sequelize.STRING(40),
    submission_date: Sequelize.DATE,
}, {
    // 禁用修改表名
    freezeTableName: true,
    // 关闭Sequelize的自动添加timestamp
    timestamps: false
});


// 将数据库表同步到数据库
sequelize.sync();


function optCreate() {
    Runoob.create({
        runoob_title: "学习 sequelize",
        runoob_author: "菜鸟教程",
        submission_date: new Date().toISOString().split('T')[0],
    }).then(() => {
        console.log("Runoob create.");
    });
}

function optRetrieve() {
    Runoob.findOne({ where: { runoob_title: "学习 sequelize" } }).then(runoob => {
        console.log(runoob.dataValues);
    })
}


function optUpdate() {
    Runoob.findOne({ where: { runoob_title: "学习 sequelize" } }).then(runoob => {
        runoob.update({ runoob_author: 'me' }, { fields: ['runoob_author'] }).then(() => {
            console.log("Runoob udpate");
        })
    })
}


function optDelete() {
    Runoob.findOne({ where: { runoob_title: "学习 sequelize" } }).then(runoob => {
        runoob.destroy({ force: true })
    })
}



console.log("****************************");
console.log("1: 创建并存储一个Runoob对象。");
console.log("2: 查询一个Runoob对象");
console.log("3: 修改一个Runoob对象");
console.log("4: 删除一个Runoob对象。");
console.log("请输入以上命令, 并以回车作为结束:");

stdin.on('data', function (chunk) {
    chunk = chunk.toString().replace(/[\r\n]/g, "");
    switch (chunk) {
        case "1":
            optCreate();
            break;

        case "2":
            optRetrieve();
            break;

        case "3":
            optUpdate();
            break;

        case "4":
            optDelete();
            break;

        default:
            console.log("不支持此命令.");
            break;
    }
});