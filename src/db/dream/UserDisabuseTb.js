// ``` mongodb
// 表名：user_disabuse_tb
// {
//     // 用户id
//     user_id: ObjectId,
//     // 用户id
//     disabuse_id: ObjectId
// }
// ```
const mongoose = require('mongoose');
const db = require('../index');
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema({
    // 用户id
    user_id: ObjectId,
    // 解惑id
    disabuse_id: ObjectId
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const UserDisabuseTb = db.getDb().model('user_disabuse_tb', schema);

module.exports = UserDisabuseTb;
