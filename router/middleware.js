var express = require('express');
var router = express.Router();

// 使用中间件-显示时间
router.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next();
});

// 中间件显示请求地址、方法
router.use('/user/:id', function (req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
}, function (req, res, next) {
    console.log('Request Type:', req.method);
    next();
});

// 中间件-跳过路由 或展示页面
router.get('/user/:id', function (req, res, next) {
    if (req.params.id == 0) {
        next('route');
    }
    else {
        next();
    }
}, function (req, res, next) {
    res.send('regular');
});

// 使用中间件-展示跳过
router.use(function (req, res, next) {
    console.log("如果非0，则我无法输出。");
    next();
});


// 路由，展示页面
router.get('/user/:id', function (req, res, next) {
    console.log(req.params.id);
    res.send('special');
});

module.exports = router;