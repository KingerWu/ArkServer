const express = require('express');
const router = express.Router();

// 添加对应的offset 和 limit
router.all('/*', function (req, res, next) {
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



module.exports = router;