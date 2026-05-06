const httpProxy = require('http-proxy')
const proxy = httpProxy.createServer()

let masterIsAvailable = true
const master = {
    host: '127.0.0.1',
    port: process.env.WEB_PORT || 3000
}
const backup = {
    host: '127.0.0.1',
    port: process.env.WEB_PORT || 3001
}

function checkMaster() {
    const request = require('request')
    request.get(`http://${master.host}:${master.port}/ping`, (err, res, body) => {
        if (res) {
            if (res.statusCode == 200) {
                return masterIsAvailable = true
            }
        }
        masterIsAvailable = false
        setTimeout(() => {
            checkMaster()
        }, 30 * 1000)
    })
}

module.exports = function (req, res, next) {
    if (req.url.split('/')[1] == 'api') {
        next()
    } else {
        proxy.web(req, res, {
            target: masterIsAvailable ? master : backup
        }, (err) => {
            if (masterIsAvailable) {
                checkMaster()
            }
        })
    }
}