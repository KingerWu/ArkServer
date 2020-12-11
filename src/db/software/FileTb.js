// ``` mongodb
// 表名：file_tb
// {
//     // 用户id 上传者
//     user_id: ObjectId,
//     // 文件后缀
//     file_suffix: String,
//     // 文件名称
//     file_name: String,
//     // 文件大小
//     file_size: String,
//     // 文件md5
//     file_md5: String,
//     // 文件真实地址
//     file_path: String,
//     // 文件类型 （私有专属 = 1， 全局分享 = 2）
//     mode:  Number,
// }
// ```

const mongoose = require('mongoose');
const db = require('../index');

const schema = new mongoose.Schema({
    // 用户id 上传者
    user_id: mongoose.Schema.Types.ObjectId,
    // 文档类别
    mime_type: String,
    // 文件后缀
    file_suffix: String,
    // 文件名称
    file_name: String,
    // 文件大小
    file_size: String,
    // 文件md5
    file_md5: String,
    // 文件真实地址
    file_path: String,
    // 文件类型 （私有专属 = 1， 全局分享 = 2）
    mode:  Number,
});

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
const FileTb = db.getDb().model('file_tb', schema);

module.exports = FileTb;