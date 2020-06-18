var express = require('express');
var app = express();
var bodyParser = require('body-parser')
const Model = require("./model");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./router/common/pre'));

app.use(require('./router/v2/index'));
app.use(require('./router/v1/index'));

app.use(function (req, res, next) {
    console.log("404", req.url);
    Model.ErrorMap.RouteNotExist.toResponse(res);
});

app.use(function (err, req, res, next) {
    console.log("500", err);
    Model.ErrorMap.ServerInnerError.toResponse(res);
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});