function checkParams(params, obj) {
    let missParams = [];
    for (let i = 0; i < params.length; i++) {
        if (!(params[i] in obj)) {
            missParams.push(params[i]);
        }
    }

    return {
        result: missParams.length <= 0,
        params: missParams
    }
}

function isNullable(value) {
    return value;
}

module.exports = {
    checkParams,
};