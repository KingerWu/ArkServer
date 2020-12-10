const express = require('express');
const utils = require('../../utils');
const router = express.Router();
const constant = require("../../constant");
const { body, validationResult } = require('express-validator');

const log = require("../../log")
const UploadUtils = require("../../libs/file/file");



router.post('/file', utils.asyncWrapper(async function (req, res) {
    // req.file 是 `avatar` 文件
    // req.body 对象中是表单中提交的文本字段(如果有)

    UploadUtils.upload(req, res, (err) => {
        if (err) {
            constant.ErrorMap.FileUploadFail.to(res, {
                err: err
            })
        }
        else {
            constant.HttpMap.CREATE.to(res);
        }
    });
}));
  

module.exports = router;