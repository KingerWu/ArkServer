class Result {
    constructor(httpCode, body = {}) {
        this.httpCode = httpCode;
        this.body = body;
    }

    to(res) {
        res.status(this.httpCode).send(JSON.stringify(this.body));
    }
}

const HttpMap = {
    CREATE: new Result(201),
    POST: new Result(201),
    GET: new Result(200),
    DELETE: new Result(204),
}

module.exports = HttpMap;