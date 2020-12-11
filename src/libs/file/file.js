const path = require("path");
const fs = require('fs');
const log = require("../../log");
const uuid = require('uuid');
const multer = require('multer')

const uploadDir = "upload";
const uploadPath = path.join(process.cwd(), uploadDir);
const configValue = {
    "uploadDir": uploadDir,
    "uploadPath": uploadPath,
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 创建目录
        let realUploadPath = uploadPath + "/" + req.jwt.id;
        if (!fs.existsSync(realUploadPath)) {
            fs.mkdirSync(realUploadPath);
        }

        cb(null, realUploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4());
    }
})

const upload = multer({ storage: storage })
const uploadOpt = upload.single('file');

class UploadUtils {
    constructor() {

    }
    
    init() {
        return new Promise((resolve, reject) => {
            // 判断是否存在 upload目录
            if (!fs.existsSync(uploadPath)) {
                reject(new Error("不存在上传目录:" + uploadPath));
            }
            else {
                resolve();
            }
        });

    }

    upload(req, res, cb) {
        uploadOpt(req, res, cb);
    }

    getRealPath(user_id, file) {
        return uploadPath + "/" + user_id + "/" + file;
    }
}





log.i("***********文件系统配置*******************");
log.i(JSON.stringify(configValue, null, 4));


module.exports = new UploadUtils();