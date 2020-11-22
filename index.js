var express = require('express');
var app = express();

// restful api ，根据express-generator的内容，这部分适合抽象到router中
app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/', function (req, res) {
    res.send('Got a POST request');
});

app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user');
});

app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user');
});

// error test
app.get('/error', function (req, res) {
    throw new Error("test error.");
});

// 当路由无法找到的时候，跳转404页面
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

// 当执行错误时，跳转500页面
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 监听3000端口
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});