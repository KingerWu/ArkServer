const Db = require("./db/lib_db");
const Api = require("./api/");


module.exports = Object.assign(Db, Api)