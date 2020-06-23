const path = require("path");
const fs = require('fs');

const configValue = fs.readFileSync(path.join(__dirname, "./config.json"), 'utf-8');
const config = JSON.parse(configValue);

module.exports = config;