// ``` mongodb
// 表名：power_panel_tb
// {
//     // 用户id
//     user_id: ObjectId,
//     // 健康状况
//     healthy: Number,
//     // 娱乐情况
//     entertainment: Number,
//     // 爱的现状
//     feeling: Number,
//     // 事业情况
//     cause: Number,
//     // 创建日期
//     create_time: Date
// }
// ```
const mongoose = require('mongoose');
const db = require('../index');
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema({
    // 用户id
    user_id: ObjectId,
    // 健康状况
    healthy: Number,
    // 娱乐情况
    entertainment: Number,
    // 爱的现状
    feeling: Number,
    // 事业情况
    cause: Number,
    // 创建日期
    create_time: Date
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const PowerPanelTb = db.getDb().model('power_panel_tb', schema);

module.exports = PowerPanelTb;
