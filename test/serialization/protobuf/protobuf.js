var Data = require('./data_pb').protobuf.Data;

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
};

// 校验格式
var errMsg = Data.verify(data);
if (errMsg) {
    console.log(errMsg);
}
else {
    // 序列化
    let protoSerializeResult = Data.encode(data).finish();
    console.log(protoSerializeResult);

    // 反序列化
    let protoParseResult = Data.decode(protoSerializeResult);
    console.log(protoParseResult.toJSON());
}
