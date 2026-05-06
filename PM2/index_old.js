require('dotenv').config()
//require('./core/event')
const pm2 = require('pm2')
// const express = require('express')
// const app = express()
// const cors = require('cors')
// const bodyParser = require('body-parser')
// const Api = require('./core/api')
// app.use(cors())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//     extended: true
// }))
// const fs = require('fs')
// const gitPath = "C:\\Program Files\\Git\\cmd"
const path = require('path')

// const git = require('./git')()
// const favicon = require('serve-favicon');

// const {
//     date,
//     apiFormater,
//     port,
//     DIR_BACKUP,
//     DIR_PUBLIC
// } = require('./core/config')

pm2.connect(function (err) {
    if (err) {
        console.error(err)
        process.exit(2)
    }
    console.log('PM2 connected')
    pm2.start(path.join(__dirname,'./../ecosystem.config.js'),{
        cwd : 'D:\\WMS'
    },(err=>{
        if(err)
            console.log(err)
        console.log('PM2 start done.')
    }))
})



// app.use(Api.middleware(apiFormater))

// app.use((req, res, next) => {
//     console.log(`${require('./core/config').date.now()}  ${req.method} : ${req.path}`)
//     next()
// })



// app.use('/api/v2/pm2/public', express.static(DIR_PUBLIC))
// app.use('/api/v2/pm2/backup', express.static(DIR_BACKUP))
// //app.use(favicon(path.join(__dirname, './core/favicon.ico')))
// app.use('/api/v2/pm2/git/pull', (req, res, next) => {
//     if (req.headers['x-github-event'] == 'push') {
//         git.pull(req)
//     }
//     res.api.sendData({
//         status: 1
//     })
// })

// app.use('/api/v2/pm2/git/info', (req, res, next) => {
//     res.api.sendData(git.getInfo())
// })

// app.use('/api/v2/pm2/reload/:process', (req, res, next) => {
//     let data = Object.assign({}, req.body, req.params, req.query)
//     res.api.sendData([])
//     if (data.process)
//         pm2.reload(data.process, (err) => {})
// })

// app.use('/api/v2/pm2/reload', (req, res, next) => {
//     let data = Object.assign({}, req.body, req.params, req.query)
//     if (data.process)
//         pm2.reload(data.process, (err) => {
//             res.api.sendData([])
//         })
//     else
//         res.api.sendData('thiếu tham số process')
// })

// app.post('/api/v2/pm2/start', (req, res, next) => {
//     res.api.sendData([])
//     pm2.start(req.body, function (err, apps) {
//         console.log({
//             apps
//         })
//         pm2.disconnect(); // Disconnects from PM2
//         if (err) throw err
//     });
// })

// app.delete('/api/v2/pm2/delete/:process', (req, res, next) => {
//     res.api.sendData([])
//     if (req.params.process)
//         pm2.delete(req.params.process, (err, proc) => {
//             console.log({
//                 err,
//                 proc
//             })
//         })
// })



// app.use('/api/v2/pm2/list', (req, res, next) => {
//     pm2.list((err, processDescriptionList) => {
//         let data = []
//         processDescriptionList.forEach(e => {
//             data.push({
//                 pid: e.pid,
//                 name: e.name,
//                 pm_id: e.pm_id,
//                 memory: e.monit.memory,
//                 cpu: e.monit.cpu,
//                 status: e.pm2_env.status,
//                 PM2_HOME: e.pm2_env.PM2_HOME,
//                 restart: e.pm2_env.restart_time,
//                 uptime: e.pm2_env.pm_uptime - e.pm2_env.create_at,
//             })
//         })
//         res.api.sendData(data)
//     })
// })


// app.get('/api/v2/pm2/log/list', (req, res, next) => {
//     fs.readdir(process.env.DIR_PUBLIC, (err, files) => {
//         if (err)
//             return res.api.sendFail({
//                 number: 0,
//                 message: err
//             })
//         let fileNames = []
//         files.forEach(file => {
//             fileNames.push(file)
//         })
//         res.api.sendData({
//             fileNames
//         })
//     })
// })

// app.post('/api/v2/pm2/log/:fileName/backup', (req, res, next) => {
//     fs.rename(`${DIR_PUBLIC}/${req.params.fileName}`, `${DIR_BACKUP}/${require('./core/config').date.now()} ${req.params.fileName}`, (err) => {
//         if (err) return res.api.sendFail({
//             number: 0,
//             message: err
//         })
//         res.api.sendData([])
//     })
// })


// app.listen(port, () => {
//     console.log(port)
// })

// module.exports = app