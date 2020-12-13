const db = require("./src/db");
const cache = require("./src/cache");
const UploadUtils = require("./src/libs/file/file");
const log = require("./src/log");
const schedule = require("./src/schedule");


let tasks = [];

// 启动数据库 启动缓存
tasks.push(db.init());
tasks.push(cache.init());
tasks.push(UploadUtils.init());

Promise.all(tasks).then(() => {
    schedule.init();
    log.i("*****************************************");
    log.i("定时任务已经启动完成");
})
.catch((err) => {
    log.e("定时任务启动异常，退出程序");
    log.e("错误信息：" + err);
    process.exit();
});
