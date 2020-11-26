// ``` mongodb
// 表名：own_worth_tb
// {
//     // 用户id
//     user_id: ObjectId,
//     // 类目 （工作观 = 1， 人生观 = 2）
//     type: Number,
//     // 内容
//     content: String,
//     // 创建日期
//     create_time: Date,
//     // 更新日期
//     update_time: Date,
// }
// ```

const mongoose = require('mongoose');
const db = require('../index');
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema({
    // 用户id
    user_id: ObjectId,
    // 类目 （工作观 = 1， 人生观 = 2）
    type: Number,
    // 内容
    content: String,
    // 创建日期
    create_time: Date,
    // 更新日期
    update_time: Date,
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const OwnWorthTb = db.getDb().model('own_worth_tb', schema);

module.exports = OwnWorthTb;
