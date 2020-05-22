var mongoose = require('mongoose');
var { db } = require('./lib_mongo');
var stdin = process.openStdin();

// 构建Schema 类似于 合集
var schema = new mongoose.Schema({
    name: String,
    binary: Buffer,
    living: Boolean,
    updated: { type: Date, default: Date.now },
    age: { type: Number, min: 18, max: 65 },
    mixed: mongoose.Schema.Types.Mixed,
    _someId: mongoose.Schema.Types.ObjectId,
    decimal: mongoose.Schema.Types.Decimal128,
    array: [],
    ofString: [String],
    ofNumber: [Number],
    ofDates: [Date],
    ofBuffer: [Buffer],
    ofBoolean: [Boolean],
    ofMixed: [mongoose.Schema.Types.Mixed],
    ofObjectId: [mongoose.Schema.Types.ObjectId],
    ofArrays: [[]],
    ofArrayOfNumbers: [[Number]],
    nested: {
        stuff: { type: String, lowercase: true, trim: true }
    }
})

// 构建model, 而它的实例就代表着可以从数据库保存和读取的 documents
var Thing = db.model('Thing', schema);

function optCreate() {
    var m = new Thing;
    m.name = 'Statue of Liberty';
    m.age = 25;
    m.updated = new Date;
    m.binary = Buffer.alloc(5);
    m.living = false;
    m.mixed = { any: { thing: 'i want' } };
    m.markModified('mixed');
    m._someId = new mongoose.Types.ObjectId;
    m.array.push(1);
    m.ofString.push("strings!");
    m.ofNumber.unshift(1, 2, 3, 4);
    m.ofDates.addToSet(new Date);
    m.ofBuffer.pop();
    m.ofMixed = [1, [], 'three', { four: 5 }];
    m.nested.stuff = 'good';
    m.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        // saved!
        console.log("Thing save.");
    })
}

function optRetrieve() {
    Thing.findOne({ name: 'Statue of Liberty' }, function (err, thing) {
        if (err) {
            console.log(err);
            return;
        }
        // retrieve!
        console.log("" + thing);
    });
}


function optUpdate() {
    Thing.updateOne({ age: 25 }, { $set: { age: 30 } }, function(err) {
        if (err) {
            console.log(err);
            return;
        }
        // update!
        console.log("Thing update.");
    });
}


function optDelete() {
    Thing.deleteOne({ name: 'Statue of Liberty' }, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        // remove!
        console.log("Thing remove.");
    });
}




console.log("****************************");
console.log("1: 创建并存储一个Thing对象。");
console.log("2: 查询一个Thing对象");
console.log("3: 修改一个Thing对象");
console.log("4: 删除一个Thing对象。");
console.log("请输入以上命令, 并以回车作为结束:");

stdin.on('data', function (chunk) {
    chunk = chunk.toString().replace(/[\r\n]/g, "");
    switch (chunk) {
        case "1":
            optCreate();
            break;

        case "2":
            optRetrieve();
            break;

        case "3":
            optUpdate();
            break;
            
        case "4":
            optDelete();
            break;

        default:
            console.log("不支持此命令.");
            break;
    }
});