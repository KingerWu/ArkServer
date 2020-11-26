const db = require("./src/db");
const cache = require("./src/cache");
const log = require("./src/log");
const config = require("./src/config");

let tasks = [];

tasks.push(db.init());
tasks.push(cache.init());

Promise.all(tasks).then(() => {
    let taskApp = new Promise((resolve, reject) => {
        const express = require('express');
        const app = express();
        app.listen(config.common.port, function () {
            log.i("服务器已经启动:" + config.common.port);
            resolve();
        })
        .on('error', function(err) { 
            reject(err);
        });
    });
    taskApp.then(() => {
        log.i("*****************************************");
        log.i("所有服务已经启动完成，软件正常运行");
    });
})
.catch((err) => {
    log.e("服务启动异常，退出程序");
    log.e("错误信息：" + err);
    process.exit();
});
