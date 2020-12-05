// ``` mongodb
// 表名：user_token_tb
// {
//     // 用户id
//     user_id: ObjectId,
//     // 登录类型 （Web = 1、Android = 2、iOS = 3）
//     type: Number,
//     // token值
//     refresh_token: String
// }
// ```

const mongoose = require('mongoose');
const db = require('../index');

const schema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    type: Number,
    refresh_token: String,
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const UserTokenTb = db.getDb().model('user_token_tb', schema);

module.exports = UserTokenTb;