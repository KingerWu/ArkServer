var mongoose = require('mongoose');
mongoose.connect('mongodb://learn:123456@localhost:27017/learn', { useNewUrlParser: true, useUnifiedTopology: true });
// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

db.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

db.once('open', function () {
    // we're connected!
    console.log("we're connected!");

    var kittySchema = mongoose.Schema({
        name: String
    });


    kittySchema.methods.speak = function () {
        var greeting = this.name
            ? "Meow name is " + this.name
            : "I don't have a name";
        console.log(greeting);
    }

    var Kitten = mongoose.model('Kitten', kittySchema);


    var fluffy = new Kitten({ name: 'fluffy' });
    fluffy.speak(); // "Meow name is fluffy"


    fluffy.save(function (err, fluffy) {
        if (err) return console.error(err);
        fluffy.speak();
    });


    Kitten.find(function (err, kittens) {
        if (err) return console.error(err);
        console.log(kittens);
    })
});


