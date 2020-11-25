/**
 * 将请求封装async
 * 
 * @param {*} fn 
 */
function asyncWrapper(fn) {
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