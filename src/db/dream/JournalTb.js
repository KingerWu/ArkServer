// ``` mongodb
// 表名：journal_tb
// {
//     // 用户id
//     user_id: ObjectId,
//     // 标题
//     content: String,
//     // 内容
//     content: String,
//     // 精力等级
//     energy: Number,
//     // 心流体验
//     feeling: Number,
//     // 创建日期
//     create_time: Date,
//     // 更新日期
//     update_time: Date,
//     // 相册地址
//     pics:[
//         {
//             // 图片地址
//             pic_url: String
//         }
//     ],
// }
// ```

const mongoose = require('mongoose');
const db = require('../index');
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema({
    // 用户id
    user_id: ObjectId,
    // 标题
    content: String,
    // 内容
    content: String,
    // 精力等级
    energy: Number,
    // 心流体验
    feeling: Number,
    // 创建日期
    create_time: Date,
    // 更新日期
    update_time: Date,
    // 相册地址
    pics:[
        {
            // 图片地址
            pic_url: String
        }
    ],
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const JournalTb = db.getDb().model('journal_tb', schema);

module.exports = JournalTb;
