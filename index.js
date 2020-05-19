var express = require('express');
var app = express();

// 路由测试
app.use('/rest', require('./router/rest'));
app.use('/path', require('./router/path'));

// 中间件测试
app.use('/middle', require('./router/middleware'));

app.get('/error', function (req, res) {
    throw new Error("test error.");
});

app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});