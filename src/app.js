const config = require("./config");
const log = require("./log");
const express = require('express');
const app = express();

class App {

    init() {
        let that = this;
        return new Promise((resolve, reject) => {
            
            app.use(require('./router/pre/index'));
            app.use(require('./router/v1/index'));
            app.use(require('./router/after/index'));

            app.listen(config.common.port, function () {
                log.i("服务器已经启动:" + config.common.port);
                resolve();
            })
            .on('error', function(err) { 
                reject(err);
            });
        });
    }
}



module.exports = new App();