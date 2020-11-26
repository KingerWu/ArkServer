// ``` mongodb
// 表名：user_code_tb
// {
//     // 验证码类型 （注册 = 1、登录 = 2、修改密码 = 3、账号注销 = 4）
//     type: Number,
//     // 邮件地址
//     email: String,
//     // 验证码
//     code: String,
//     // 验证码是否被使用
//     is_used: Boolean,
//     // 验证码发送日期
//     begin_time: Date,
//     // 验证码过期日期
//     end_time: Date
// }
// ```


const mongoose = require('mongoose');
const db = require('../index');

const schema = new mongoose.Schema({
    type: Number,
    email: String,
    code: String,
    is_used: Boolean,
    begin_time: Date,
    end_time: Date
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const UserCodeTb = db.getDb().model('user_code_tb', schema);

module.exports = UserCodeTb;