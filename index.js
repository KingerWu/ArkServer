const db = require("./src/db");
const cache = require("./src/cache");
const log = require("./src/log");


let tasks = [];

// 启动数据库 启动缓存
tasks.push(db.init());
tasks.push(cache.init());

Promise.all(tasks).then(() => {
    // 启动应用
    let taskApp = require("./src/app");
    taskApp.init().then(() => {
        log.i("*****************************************");
        log.i("所有服务已经启动完成，软件正常运行");
    });
})
.catch((err) => {
    log.e("服务启动异常，退出程序");
    log.e("错误信息：" + err);
    process.exit();
});
