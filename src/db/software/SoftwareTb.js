// ``` mongodb
// 表名：software_tb
// {
//     // 升级类型 （Android = 1、iOS = 2, Web = 3）
//     type: Number,
//     // 软件版本-机械号
//     version_code: String,
//     // 软件版本-名称
//     version_name: String,
//     // 升级开始时间
//     begin_time: Date,
//     // 升级结束时间
//     end_time: Date,
//     // 升级日志
//     changelog: String,
//     // 是否强制升级
//     is_force: Boolean,

//     // Android
//     // 文件大小 MB
//     file_size: String,
//     // 文件md5
//     file_md5: String,
//     // 文件地址
//     file_url: String,

//     // iOS
//     // appstore 跳转地址
//     appstore_url: String,
// }
// ```

const mongoose = require('mongoose');
const db = require('../index');

const schema = new mongoose.Schema({
    // 升级类型 （Android = 1、iOS = 2, Web = 3）
    type: Number,
    // 软件版本-机械号
    version_code: Number,
    // 软件版本-名称
    version_name: String,
    // 升级开始时间
    begin_time: Date,
    // 升级结束时间
    end_time: Date,
    // 升级日志
    changelog: String,
    // 是否强制升级
    is_force: Boolean,

    // Android
    // 文件大小 MB
    file_size: String,
    // 文件md5
    file_md5: String,
    // 文件地址
    file_url: String,

    // iOS
    // appstore 跳转地址
    appstore_url: String,
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const SoftwareTb = db.getDb().model('software_tb', schema);

module.exports = SoftwareTb;