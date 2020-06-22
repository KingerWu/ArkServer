// 连接redis数据库
var redis = require('redis');
var client = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
    password: "123456"
});

client.on('connect', function () {
    console.log('connect');
});

client.on('error', function (err) {
    console.log('error event - ' + client.host + ':' + client.port + ' - ' + err);
});

client.set("string key", "string value", redis.print);
client.get("string key", redis.print)

client.get("string test", (err, value) => {
    if (err) {
        console.log("err", err);
    }
    else {
        console.log("value", value);
    }
})
client.del("string key", redis.print)

client.quit(function (err, res) {
    console.log('Exiting from quit command.');
});