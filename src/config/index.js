const path = require("path");
const fs = require('fs');
const log = require("../log");
const localPath = ".local.json";

let configValue = fs.readFileSync(path.join(__dirname, "./config.json"), 'utf-8');
// 判断是否有本地配置文件
if (fs.existsSync(path.join(process.cwd(), localPath))) {
    configValue = fs.readFileSync(path.join(process.cwd(), localPath), 'utf-8');
}

const config = JSON.parse(configValue);

log.i("***********开启加载配置文件*******************");
log.i(JSON.stringify(config, null, 4));

module.exports = config