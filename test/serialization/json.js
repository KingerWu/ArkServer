// 数据
const data = {
    items: [
        {
            position: [0, 0, 0],
            index: 0,
            info: {
                a: 'text text text...',
                b: 10.12,
            },
        },
    ],
}


// 序列化
let jsonSerializeResult = JSON.stringify(data);
console.log(jsonSerializeResult);

// 反序列化
let jsonParseResult = JSON.parse(jsonSerializeResult);
console.log(jsonParseResult);