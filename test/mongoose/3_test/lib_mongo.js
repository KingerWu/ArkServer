var mongoose = require('mongoose');

const options = {
    keepAlive: 120,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: "learn",
    pass: "123456",
};

mongoose.connect('mongodb://localhost:27017/learn', options);
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



module.exports = {
    db: db,
};
