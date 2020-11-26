// ``` mongodb
// 表名：user_pay_tb
// {
//     // 用户id
//     user_id: ObjectId,
//     // 用户开通日期
//     begin_time: Date,
//     // 用户结束日期
//     end_time: Date
// }
// ```

const mongoose = require('mongoose');
const db = require('./index');

const schema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    begin_time: Date,
    end_time: Date,
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const UserPayTb = db.getDb().model('user_pay_tb', schema);

module.exports = UserPayTb;