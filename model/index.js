const Db = require("./db/lib_db");
const Api = require("./api/");
const Cache = require("./cache/index");

module.exports = Object.assign(Db, Api, Cache);