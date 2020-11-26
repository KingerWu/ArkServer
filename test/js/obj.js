class Err {
    constructor(httpCode) {
        this.httpCode = httpCode;
    }
}

let err = new Err(201);

console.log(err.httpCode);
console.log("运行完成");