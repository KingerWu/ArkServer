class Result {
    constructor(httpCode, body = {}) {
        this.httpCode = httpCode;
        this.body = body;
    }

    to(res, body) {
        if (body) {
            this.body = body;
        }
        res.status(this.httpCode).send(JSON.stringify(this.body));
    }
}

const HttpMap = {
    CREATE: new Result(201),
    POST: new Result(201),
    UPDATE: new Result(200),
    GET: new Result(200),
    DELETE: new Result(204),
}

module.exports = HttpMap;