var stdin = process.openStdin();


console.log("****************************");
console.log("请输入以上命令, 并以回车作为结束:");

stdin.on('data', function (chunk) {
    chunk = chunk.toString().replace(/[\r\n]/g, "");
    switch (chunk) {
        case "1":
            console.log("1");
            break;
        case "2":
            console.log("2");
            break;

        default:
            console.log("不支持此命令.");
            break;
    }
});