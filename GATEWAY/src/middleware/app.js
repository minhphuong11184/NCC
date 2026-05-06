const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const favicon = require('express-favicon')
const app = express()

app.use(cors())
app.use(favicon(__dirname + '/favicon.ico'))
app.use(require('./init'))
app.use(require('./isApi'))

/*======================ADD MIDDLEWARE=====================*/
app.use(require('../core/rateLimit'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(require('api-formatter').Api.middleware(require('../core/config').apiFormater))
app.use(require('../logging/logging'))
app.use(require('./setTimeout'))

app.use('/api/v1', require('../core/router'))
app.use('/api/v2', require('../core/router'))
app.use('/api/v3', require('../core/router'))
/*======================ADD MIDDLEWARE=====================*/














// const httpProxy = require('http-proxy')
// const {
//     endPoint
// } = require('./../../config')

// /*======================CREATE PROXY=====================*/
// const proxy = httpProxy.createServer()
// proxy.on('start', require('./proxyEvent').start)
// proxy.on('error', require('./proxyEvent').error)
// proxy.on('econnreset', require('./proxyEvent').econnreset)
// proxy.on('proxyReq', function (proxyReq, req, res, options) {
//     if (req.urls[1] == "api") {
//         proxyReq.setHeader('x-gateway-request-guid', req.guid || "*")
//     }
// })
// /*=====================================================*/


// const app = {
//     proxy: proxy,
//     middlewares: [],
//     middleware(req, res) {
//         console.log('a')
//         res.write('content')
//         res.end()
//         return
//         req.proxy = app.proxy
//         let step = 0

//         function next() {
//             step++
//             if (typeof app.middlewares[step] === 'function')
//                 app.middlewares[step](req, res, next)
//         }
//         app.middlewares[0](req, res, next)
//     },
//     use(middleware) {
//         app.middlewares.push(middleware)
//     }
// }




// function init(req, res, next) {
//     res.send = send(res)
//     req.query = decodeQuery(req)
//     req.res = res
//     res.req = req
//     next()
// }


// function send(res) {
//     function format(data) {
//         data.data = data.data || []
//         return JSON.stringify({
//             meta: {
//                 success: data.success || true,
//                 messages: data.messages || {},
//                 status: data.status || 200,
//                 name: "Woodsland Restful API",
//                 version: "v1",
//                 counts: data.data.length
//             },
//             data: data.data
//         })
//     }
//     return (data) => {
//         const content = Buffer.from(format(data), 'utf8')
//         res.setHeader("Content-Type", "application/json; charset=utf-8")
//         res.setHeader("Content-Length", content.length)
//         res.setHeader("access-control-allow-origin", "*")
//         res.setHeader("connection", "close")
//         res.write(content)
//         res.end()
//     }
// }

// function decodeQuery(req) {
//     let result = {}
//     let queryString = req.url.split('?')[1]
//     if (queryString !== undefined)
//         queryString.split("&").forEach(e => {
//             let data = e.split("=")
//             result[data[0]] = data[1]
//         })
//     return result
// }


// function urls(req, res, next) {
//     let path = req.url.split('?')[0]
//     req.urls = path.split('/')
//     if (req.urls[1] != 'api') {
//         return proxy.web(req, res, {
//             target: endPoint.admin
//         })
//     }
//     next()
// }



// app.use(init)
// app.use(urls)

module.exports = app