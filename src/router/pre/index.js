const express = require('express');
const router = express.Router();
const utils = require("../../utils/index")
const constant = require("../../constant");
const log = require("../../log");

router.use(require('./common'));
router.use(require('./sign'));
router.use(require('./token'));

module.exports = router;