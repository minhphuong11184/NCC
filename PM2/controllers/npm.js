const express = require('express')
const npm = express.Router()
const path = require('path')
const exec = require('child_process').exec

npm.use('/install', (req, res, next) => {
    let data = Object.assign({}, req.body, req.query)
    if (data.service) {
        const {
            apps
        } = require('./../ecosystem.config')
        let app = apps.find(i => i.name == data.service)
        if (app) {
            exec('npm install', {
                cwd: path.dirname(app.script)
            }, (err, stdout, stderr) => {
                res.api.sendData({
                    name: app.name,
                    err,
                    stdout,
                    stderr
                })
            })
        } else {
            res.api.sendData('Không tìm thấy service')
        }
    } else {
        next()
    }
}, (req, res, next) => {
    const {
        apps
    } = require('./../ecosystem.config')

    let result = []
    apps.forEach(app => {
        exec('npm install', {
            cwd: path.dirname(app.script)
        }, (err, stdout, stderr) => {
            result.push({
                name: app.name,
                err,
                stdout,
                stderr
            })
            if (result.length == apps.length)
                res.api.sendData(result)
        })
    })
})


npm.use('/command', (req, res, next) => {
    let data = Object.assign({}, req.body, req.query)
    const {
        apps
    } = require('./../ecosystem.config')
    let app = apps.find(i => i.name == data.service)
    if (app && data.command)
        exec(data.command, {
            cwd: path.dirname(app.script)
        }, (err, stdout, stderr) => {
            res.api.sendData({
                err,
                stdout,
                stderr
            })
        })
    else
        res.api.sendData(`Không tìm thấy service : ${data.service}`)
})

module.exports = npm