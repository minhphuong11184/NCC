const express = require('express')
const pm2 = express.Router()

pm2.use('/reload/:process', reload)
pm2.use('/reload', reload)

pm2.use('/start/:process', start)
pm2.use('/start', start)

pm2.use('/list', list)

pm2.use('/delete/:process', remove)
pm2.use('/delete', remove)

pm2.use('/flush/:process', flush)
pm2.use('/flush', flush)

pm2.use('/kill', kill)
pm2.use('/connect', connect)
pm2.use('/disconnect', disconnect)


function list(req, res, next) {
    require('pm2').list((err, processDescriptionList) => {
        if (err)
            return res.api.sendData(err)
        let data = []
        processDescriptionList.forEach(e => {
            data.push({
                //pid: e.pid,
                name: e.name,
                pm_id: e.pm_id,
                memory: e.monit.memory,
                cpu: e.monit.cpu,
                status: e.pm2_env.status,
                //PM2_HOME: e.pm2_env.PM2_HOME,
                restart: e.pm2_env.restart_time,
                //uptime: e.pm2_env.pm_uptime - e.pm2_env.create_at,
            })
        })
        res.api.sendData(data)
    })
}

function reload(req, res, next) {
    let data = Object.assign({}, req.body, req.query, req.params)
    if (data.process) {
        require('pm2').reload(data.process, (err) => {
            res.api.sendData(`Reload hoàn thành : ${data.process}`)
        })
    } else {
        res.api.sendData('Thiếu tham số process')
    }
}


function remove(req, res, next) {
    let data = Object.assign({}, req.body, req.query, req.params)
    if (data.process) {
        require('pm2').delete(data.process, (err) => {
            if (err)
                return res.api.sendData(err)
            res.api.sendData(`delete hoàn thành : ${data.process}`)
        })
    } else {
        res.api.sendData('Thiếu tham số process')
    }
}


function flush(req, res, next) {
    let data = Object.assign({}, req.body, req.query, req.params)
    if (data.process) {
        require('pm2').flush(data.process, () => {
            res.api.sendData(`PM2 flush ${data.process} finish`)
        })
    } else {
        let {
            apps
        } = require('./../ecosystem.config.js')
        apps.forEach(app => {
            require('pm2').flush(app.name, () => {})
        })
        res.api.sendData('PM2 flush finish')
    }
}


function start(req, res, next) {
    let data = Object.assign({}, req.body, req.query, req.params)
    if (data.process) {
        let {
            apps
        } = require('./../ecosystem.config.js')

        let app = apps.find(i => i.name = data.process)
        if (app) {
            require('pm2').start(app, err => {
                if (err)
                    return res.api.sendData(err)
                res.api.sendData(`Start app ${data.process} thành công`)
            })
        } else {
            res.api.sendData('Không tìm thấy app trong cấu hình ecosystem.config.js')
        }
    } else {
        res.api.sendData('Thiếu tham số process')
    }
}


function kill(req, res, next) {
    require('pm2').killDaemon(err => {
        if (err)
            return res.api.sendData(err)
        res.api.sendData('Kill done.')
    })
}



function connect(req, res, next) {
    require('pm2').connect(err => {
        if (err)
            return res.api.sendData(err)
        res.api.sendData('PM2 connect thành công')
    })
}

function disconnect(req, res, next) {
    require('pm2').disconnect()
    res.api.sendData('PM2 disconnected!!!')

}

module.exports = pm2