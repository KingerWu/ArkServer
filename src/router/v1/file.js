const express = require('express');
const utils = require('../../utils');
const router = express.Router();
const constant = require("../../constant");
const { body, validationResult } = require('express-validator');

const log = require("../../log")
const UploadUtils = require("../../libs/file/file");

const FileTb = require('../../db/software/FileTb');
const db = require('../../db');
const regex = require('../../utils/regex');
const fs = require('fs');

// { fieldname: 'file',
//   originalname: 'p.png',
//   encoding: '7bit',
//   mimetype: 'image/png',
//   destination:
//    '/Users/whr/workspace/server/ArkServer/upload/5fc90365e0f2743e679da115',
//   filename: 'f4b91c9e-cc4c-41b6-a862-81235184fba8',
//   path:
//    '/Users/whr/workspace/server/ArkServer/upload/5fc90365e0f2743e679da115/f4b91c9e-cc4c-41b6-a862-81235184fba8',
//   size: 1071 }


// var reader = new FileReader();

// reader.addEventListener('load',function () {
//   var hash = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(this.result));
//   var md5 = hash.toString(CryptoJS.enc.Hex)
//   var filename = document.getElementById("input").value.split('/').pop().split('\\').pop();
//   var output = "MD5 (" + filename + ") = " + md5
//   console.log(output);
//   document.getElementById("md5").innerText = output
// });
// reader.readAsBinaryString(document.getElementById("input").files[0]);
function queryFile(user_id, file_path) {
    return new Promise((resolve, reject) => {
        let fileQuery = FileTb.find({ user_id: db.getObjectId(user_id), file_path: file_path });
        fileQuery.exec(function (error, files) {
            if (error) {
                reject(error);
            }
            else {
                resolve(files);
            }
        });
    });
}

function createFile(file, user_id) {
    return new Promise((resolve, reject) => {
        let m = new FileTb;
        m.user_id = db.getObjectId(user_id);
        m.mime_type = file.mimetype;
        m.file_suffix = regex.getFileSuffix(file.originalname);
        m.file_name = file.originalname;
        m.file_size = file.size;
        m.file_md5 = "";
        m.file_path = file.filename;
        m.mode = constant.ConstantMap.FileModePrivate;
        m.save().then(result => {
            resolve(result);
        });
    });
}

router.get('/users/:user/file/:file', utils.asyncWrapper(async function (req, res) {
    // 判断jwt与id是否相等，判断是否是私有文件
    let files = await queryFile(req.params.user, req.params.file);
    if (files && files.length > 0) {
        let file = files[0];
        // 私有的，仅允许被人提取
        if (file.mode === constant.ConstantMap.FileModePrivate && req.params.user != req.jwt.id) {
            constant.ErrorMap.FileNotExist.to(res);

            return;
        }

        // 实现文件下载 
        let filePath = UploadUtils.getRealPath(req.params.user, file.file_path);
        let stats = fs.statSync(filePath);
        if (stats.isFile()) {
            res.set({
                'Content-Type': file.mime_type,
                'Content-Disposition': 'attachment; filename=' + file.file_name,
                'Content-Length': stats.size
            });
            fs.createReadStream(filePath).pipe(res);
        } else {
            constant.ErrorMap.FileNotExist.to(res);
        }
    }
    else {
        constant.ErrorMap.FileNotExist.to(res);
    }
}));




router.post('/file', utils.asyncWrapper(async function (req, res) {
    UploadUtils.upload(req, res, async function(err) {
        if (err) {
            constant.ErrorMap.FileUploadFail.to(res, {
                err: err
            })
        }
        else {
            // 将文件存入日志中
            await createFile(req.file, req.jwt.id);
            constant.HttpMap.CREATE.to(res, {
                path: "/users/" + req.jwt.id + "/file/" + req.file.filename,
                file_name: req.file.filename,
            });
        }
    });
}));

module.exports = router;