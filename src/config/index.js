const path = require("path");
const fs = require('fs');
const log = require("../log");

const configValue = fs.readFileSync(path.join(__dirname, "./config.json"), 'utf-8');
const config = JSON.parse(configValue);

log.i("***********开启加载配置文件*******************");
log.i(JSON.stringify(config, null, 4));

module.exports = config