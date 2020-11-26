// ``` mongodb
// 表名：device_tb
// {
//     // 秘钥名
//     key: String,
//     // 秘钥值
//     token: String
// }
// ```

const mongoose = require('mongoose');
const db = require('../index');

const schema = new mongoose.Schema({
    key: String,
    token: String,
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const DeviceTb = db.getDb().model('device_tb', schema);

module.exports = DeviceTb;
