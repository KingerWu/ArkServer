const moment = require('moment'); 

let date = moment().startOf("isoWeek");

console.log(date.toLocaleString());