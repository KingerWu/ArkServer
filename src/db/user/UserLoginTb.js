// ``` mongodb
// 表名：user_login_tb
// {
//     // 用户id
//     user_id: ObjectId,
//     // 登录状态 （登录成功 = 1、密码错误 = 2、验证码错误 = 3）
//     status: Number,
//     // 登录ip
//     ip: String,
//     // 登录类型 （Web = 1、Android = 2、iOS = 3）
//     type: Number,
//     // 登录时间
//     login_time: Date,

//     // 硬件设备id 不要求唯一
//     device_id: String,
//     // 硬件设备信息（Web 浏览器， Android 厂商， iOS 型号）
//     device_model: String,
//     // 硬件设备版本信息（Web 浏览器版本， Android 系统版本， iOS 系统版本）
//     device_version: String,

//     // 软件版本-机械号
//     version_code: String,
//     // 软件版本-名称
//     version_name: String,
// }
// ```

const mongoose = require('mongoose');
const db = require('./index');

const schema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    status: Number,
    ip: String,
    type: Number,
    login_time: Date,
    device_id: String,
    device_model: String,
    device_version: String,
    version_code: String,
    version_name: String,
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const UserLoginTb = db.getDb().model('user_login_tb', schema);

module.exports = UserLoginTb;