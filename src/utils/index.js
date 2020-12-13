const constant = require("../constant");
const { body, validationResult, query } = require('express-validator');

/**
 * 将请求封装async
 * 
 * @param {*} fn 
 */
function asyncWrapper(fn) {
    let checkParamResult = validationResult(req);
    if (!checkParamResult.isEmpty()) {
        constant.ErrorMap.RequestParamLost.to(res, {
            errors: checkParamResult.array()
        });
        return;
    }


    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next))
            .then(() => {
            })
            .catch((err) => {
                next(err)
            });
    }
}


module.exports = {
    asyncWrapper,
};