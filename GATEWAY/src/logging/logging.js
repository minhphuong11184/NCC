const { v4: uuidv4 } = require('uuid')
const sqlServer = require('./sqlServer')

let number = 1

function getNo() {
    number++
    if (number > 9)
        number = 1
    return number
}

function logging(req, res, next) {
    req.guid = uuidv4()
    req.no = getNo()
    req.urls = req.url.split('?')[0].split('/')
    res.on('finish', () => {
        req.finish = new Date()
        req.time = req.finish - req.timestamp
        console.log(`${require('../core/config').date.now().slice(0,19)} | ${req.no} | ${req.method.padEnd(4)}: ${req._parsedUrl.pathname.padEnd(20)} => ${(req.target ? (req.target.name+':'+ req.target.port) : '').padEnd(8)} ${res.statusCode} ${req.time}ms`)
        if (!req.isAuthenticated) return
        sqlServer.saveRequest(req, res)
    })
    next()
}

module.exports = logging