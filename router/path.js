var express = require('express');
var router = express.Router();


router.get('/ab?cd', function (req, res) {
    res.send('ab?cd');
});

router.get('/ab+cd', function (req, res) {
    res.send('ab+cd');
});

router.get('/ab*cd', function (req, res) {
    res.send('ab*cd');
});

router.get('/ab(cd)?e', function (req, res) {
    res.send('ab(cd)?e');
});


router.get(/a/, function (req, res) {
    res.send('/a/');
});

router.get(/.*fly$/, function (req, res) {
    res.send('/.*fly$/');
});

module.exports = router;