// ``` mongodb
// 表名：dream_person_info_tb
// {
//     // 用户id
//     user_id: ObjectId,
//     // 最后一次登录时间
//     login_time: Date,
//     // 累积登录天数
//     login_days: Number,
// }
// ```
const mongoose = require('mongoose');
const db = require('../index');
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema({
    // 用户id
    user_id: ObjectId,
    // 最后一次登录时间
    login_time: Date,
    // 累积登录天数
    login_days: Number,
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const DreamPersonInfoTb = db.getDb().model('dream_person_info_tb', schema);

module.exports = DreamPersonInfoTb;
