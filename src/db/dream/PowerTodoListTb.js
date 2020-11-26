// ``` mongodb
// 表名：power_todo_list_tb
// {
//     // 用户id
//     user_id: ObjectId,
//     // 类目 （健康状况 = 1， 娱乐情况 = 2，爱的现状 = 3， 事业情况 = 4）
//     type: Number,
//     // 内容
//     content: String,
//     // 状态 (就绪 = 1， 完成 = 2， 未完成 = 3)
//     status: Number,
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
    // 类目 （健康状况 = 1， 娱乐情况 = 2，爱的现状 = 3， 事业情况 = 4）
    type: Number,
    // 内容
    content: String,
    // 状态 (就绪 = 1， 完成 = 2， 未完成 = 3)
    status: Number,
    // 创建日期
    create_time: Date,
    // 更新日期
    update_time: Date,
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const PowerTodoListTb = db.getDb().model('power_todo_list_tb', schema);

module.exports = PowerTodoListTb;
