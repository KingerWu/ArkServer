// ``` mongodb
// 表名：user_tb
// {
//     // 用户邮箱
//     email: String,
//     // 用户昵称
//     name: String,
//     // 用户密码
//     password: String,
//     // 是否vip
//     is_vip: Boolean,
// }
// ```

const mongoose = require('mongoose');
const db = require('../index');

const schema = new mongoose.Schema({
    email: { type: String, unique: true, dropDups: true },
    name: { type: String, unique: true, dropDups: true },
    password: String,
    is_vip: Boolean
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const UserTb = db.getDb().model('user_tb', schema);

module.exports = UserTb;