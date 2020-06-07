const fs = require('fs');
const path = require('path');

function requireClass(dirPath, filterName = 'index.js') {
    const results = {};
    fs.readdirSync(dirPath).filter((value) => {
        return value !== filterName;
    }).map(value => {
        let result = require(dirPath + '/' + value);
        if (typeof result == 'function') {
            results[result.name] = result;
        }
        else {
            results[path.basename(value, ".js")] = result;
        }
    });

    return results;
}


function asyncWrapper(fn) {
    return (req, res, next) => {
        console.log("route", fn.name);
        return Promise.resolve(fn(req, res, next))
            .then(() => {
            })
            .catch((err) => {
                next(err)
            });
    }
}

module.exports = {
    requireClass,
    asyncWrapper
};