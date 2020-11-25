function d() {
    console.debug(...arguments);
}

function i() {
    console.info(...arguments);
}

function w() {
    console.warn(...arguments);
}

function e() {
    console.error(...arguments);
}

module.exports = {
    d,
    i,
    w,
    e
};