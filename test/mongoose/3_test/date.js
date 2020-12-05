var mongoose = require('mongoose');
var { db } = require('./lib_mongo');
var moment = require('moment'); // require

const schema = new mongoose.Schema({
    type: Number,
    email: String,
    code: String,
    is_used: Boolean,
    begin_time: Date,
    end_time: Date
});

//参数表示生成验证码的位数
function randomString(len) {
    //chars中去除了容易混淆的字母或数字，例如O和0
    var chars = '0123456789';
    var maxPos = chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
var UserCodeTb = db.model('UserCodeTb', schema);

// var m = new UserCodeTb;
// m.type = 1;
// m.email = "4@qq.com";
// m.code = randomString(6);
// m.is_used = false;
// m.begin_time = moment().toDate();

// var endDate = moment(m.begin_time);
// endDate.add(2, "minutes");
// m.end_time = endDate.toDate();


// m.save(function (err) {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     // saved!
//     console.log("UserCodeTb save.");
// })

// 当前时间 往前推1个小时
var currentTime = moment();
currentTime.add(-20, "minutes");
console.log(currentTime.format("YYYY-MM-DD HH:mm:ss").toString());


let query = UserCodeTb.find();
query.where("begin_time").gt(currentTime);
query.sort({ begin_time: - 1 });
query.exec(function (error, userCodes){
    if (error) {
        console.log(error);
    }
    else {
        console.log(JSON.stringify(userCodes, null, 4));
    }
}) 