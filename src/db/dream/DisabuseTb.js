
// ``` mongodb
// 表名：disabuse_tb
// {
//     // 标题
//     title: String,
//     // 内容类型 (文本 = 1, 链接 = 2)
//     content_type: Number,
//     // 内容
//     content: String,
//     // 累积登录 多少天 才能阅读
//     read_day: Number,
// }
// ```


const mongoose = require('mongoose');
const db = require('../index');
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema({
    // 标题
    title: String,
    // 内容类型 (文本 = 1, 链接 = 2)
    content_type: Number,
    // 内容
    content: String,
    // 累积登录 多少天 才能阅读
    read_day: Number,
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const DisabuseTb = db.getDb().model('disabuse_tb', schema);

module.exports = DisabuseTb;
