const express = require('express')
const app = express.Router()
const path = require('path')
const httpProxy = require('http-proxy')
/////////////////////////////////// PROXY SERVER ///////////////////////////////

const {
    getErrorMessage
} = require('./config')
const proxy = httpProxy.createServer()

proxy.on('start', (req, res, target) => {
    req.passTime = new Date()
    req.endPoint = target.port
    req.target = target
})

proxy.on('econnreset', (err, req, res, target) => {
    res.api.sendFail(getErrorMessage(4922))
})

proxy.on('proxyReq', function (proxyReq, req, res, options) {
    let bodyData = JSON.stringify(req.body)
    proxyReq.setHeader('x-gateway-request-guid', req.guid || "*")
    proxyReq.setHeader('x-gateway-request-no', req.no || "0")
    proxyReq.setHeader('x-gateway-is-authencation', '1')
    proxyReq.setHeader('x-gateway-account-id', req.accountId || "0")
    // Forward token để PRODUCTION verify được
    const token = req.query.token || req.query.access_token ||
        req.headers.token ||
        ((req.headers.authorization !== undefined) ? req.headers.authorization.replace('Bearer ', '') : null) ||
        req.body.token
    if (token) proxyReq.setHeader('Authorization', 'Bearer ' + token)
    proxyReq.setHeader('Content-Type', 'application/json')
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
    proxyReq.write(bodyData)
})
/////////////////////////////////// PROXY SERVER ///////////////////////////////


class LoadBalancer {
    constructor(endPoint) {
        this.endPoint = {}
        this.index = 0
        this.loop = []
        this.currentEndPoint = {}
        // Xac dinh cac end Point
        endPoint.forEach((e, i) => {
            this.endPoint[`${i+1}`] = {
                id: i + 1,
                host: e.host,
                port: e.port,
                weight: e.weight || 1,
            }
        })
        // Them cac endPoint vao vong loop
        Object.keys(this.endPoint).forEach(key => {
            for (let i = 0; i < this.endPoint[key].weight; i++) {
                this.loop.push(this.endPoint[key])
            }
        })
    }
    get() {
        if (!(this.index < this.loop.length))
            this.index = 0
        this.currentEndPoint = this.loop[this.index]
        this.index++
        return this.currentEndPoint
    }
    error() {
        let id = this.currentEndPoint.id
        for (let i = 0; i < this.loop.length; i++) {
            if (this.loop[i].id == id) {
                this.loop.splice(i, 1)
            }
        }
        setTimeout(() => {
            for (let i = 0; i < this.endPoint[id].weight; i++) {
                this.loop.push(this.endPoint[id])
            }
        }, 10 * 60 * 1000) //10 phút Thời gian chèn lại endpoint lỗi đó vào
    }
}

class MasterSalve {
    constructor(endPoint) {
        this.master = endPoint.find(i => i.type == 'master')
        this.backup = endPoint.find(i => i.type != 'master')
        this.masterIsAvailable = true
    }
    get() {
        if (this.masterIsAvailable)
            return this.master
        else
            return this.backup
    }
    error() {
        if (this.masterIsAvailable) { // master đang lỗi thì không cần check nữa, bởi nó đang được check ngầm rồi
            this.checkMaster()
        }
    }
    checkMaster() {
        const request = require('request')
        request.get(`http://${this.master.host}:${this.master.port}/ping`, (err, res, body) => {
            if (res) {
                if (res.statusCode == 200) {
                    return this.masterIsAvailable = true
                }
            }
            this.masterIsAvailable = false
            setTimeout(() => {
                this.checkMaster()
            }, 5 * 1000) // 5 giay
        })
    }
}

const fs = require('fs')
const yaml = require('js-yaml')
try {
    let fileContents = fs.readFileSync(path.join(__dirname, './../../conf.yaml'), 'utf8')
    let cf = yaml.safeLoad(fileContents)
    // Cấu hình router//
    cf.routers.forEach(router => {
        let authencation = (router.authencation == false) ? (req, res, next) => {
            next()
        } : require('./authencation')

        if (Array.isArray(cf.endPoint[router.endPoint])) {
            let master = cf.endPoint[router.endPoint].find(i => i.type == 'master')
            if (master) {
                // Chính phụ
                const masterSalve = new MasterSalve(cf.endPoint[router.endPoint])
                app[router.method || 'use'](router.path, authencation, (req, res, next) => {
                    req.url = req.originalUrl
                    let target = {
                        ...masterSalve.get(),
                        name: router.endPoint
                    }
                    proxy.web(req, res, {
                        target: target
                    }, err => {
                        res.api.sendFail(getErrorMessage(4921))
                        masterSalve.error()
                    })
                })
            } else {
                // Cân bằng tải
                const loadBalancer = new LoadBalancer(cf.endPoint[router.endPoint])
                app[router.method || 'use'](router.path, authencation, (req, res, next) => {
                    req.url = req.originalUrl
                    let target = {
                        ...loadBalancer.get(),
                        name: router.endPoint
                    }
                    proxy.web(req, res, {
                        target: target
                    }, err => {
                        res.api.sendFail(getErrorMessage(4921))
                        loadBalancer.error()
                    })
                })
            }
        } else {
            // Đẩy về bình thường
            app[router.method || 'use'](router.path, authencation, (req, res, next) => {
                req.url = req.originalUrl
                proxy.web(req, res, {
                    target: {
                        ...cf.endPoint[router.endPoint],
                        name: router.endPoint
                    }
                }, err => {
                    res.api.sendFail(getErrorMessage(4921))
                })
            })
        }
    })
    app.use((req, res, next) => {
        req.params
        res.api.sendFail(getErrorMessage(404))
    })

} catch (err) {
    throw err
}



module.exports = app