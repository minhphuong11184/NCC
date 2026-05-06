const date = {
    now() {
        let date = new Date()
        let year = date.getFullYear()
        let month = (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1)
        let day = (date.getDate() < 10 ? '0' : '') + date.getDate()
        let hours = (date.getHours() < 10 ? '0' : '') + date.getHours()
        let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        let seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
        let milliseconds
        if (date.getMilliseconds() < 10) {
            milliseconds = `00${date.getMilliseconds()}`
        } else if (date.getMilliseconds() < 100) {
            milliseconds = `0${date.getMilliseconds()}`
        } else {
            milliseconds = date.getMilliseconds()
        }
        return year + '-' + month + '-' + day + ' ' +
            hours + ':' + minutes + ':' + seconds + ':' + milliseconds
    },
    toDateTime(date = new Date()) {
        let year = date.getFullYear()
        let month = (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1)
        let day = (date.getDate() < 10 ? '0' : '') + date.getDate()
        let hours = (date.getHours() < 10 ? '0' : '') + date.getHours()
        let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        let seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
        let milliseconds
        if (date.getMilliseconds() < 10) {
            milliseconds = `00${date.getMilliseconds()}`
        } else if (date.getMilliseconds() < 100) {
            milliseconds = `0${date.getMilliseconds()}`
        } else {
            milliseconds = date.getMilliseconds()
        }
        return year + '-' + month + '-' + day + ' ' +
            hours + ':' + minutes + ':' + seconds + ':' + milliseconds
    },
    time() {
        let date = new Date()
        let hours = (date.getHours() < 10 ? '0' : '') + date.getHours()
        let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        let seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
        let milliseconds
        if (date.getMilliseconds() < 10) {
            milliseconds = `00${date.getMilliseconds()}`
        } else if (date.getMilliseconds() < 100) {
            milliseconds = `0${date.getMilliseconds()}`
        } else {
            milliseconds = date.getMilliseconds()
        }
        return hours + ':' + minutes + ':' + seconds + ':' + milliseconds
    }
}


module.exports = function (req, res, next) {
    let start = new Date()
    let url = req._parsedUrl.pathname
    res.on('finish', () => {
        console.log(`${date.time().slice(0,8)} | ${req.headers['x-gateway-request-no'] || 0} | ${req.method.padEnd(4)} : ${url.padEnd(20)} ${res.statusCode} ${Date.now() - start}ms`)
    })
    next()
}