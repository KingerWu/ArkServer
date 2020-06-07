var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('/*', function (req, res, next) {
    let offset = 0;
    let limit = 30;
    if (req.query) {
        offset = req.query.page ? parseInt(req.query.page) : offset;
        limit = req.query.per_page ? parseInt(req.query.per_page) : limit;
    }
    req.offset = offset;
    req.limit = limit;

    next();
});

app.use('/v1', require('./router/v1/user'));
app.use('/v1', require('./router/v1/fav'));
app.use('/v1', require('./router/v1/song'));

app.use(require('./router/common/index'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});