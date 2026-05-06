require('dotenv').config()
require('dotenv').config({
    path: require('path').join(__dirname, './../.env')
})
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(require('api-formatter').Api.middleware(require('./core/config').apiFormater))
app.use('/ping', (req,res)=>{
    res.status(200).send('pong').end()
})
app.use('/api/v2', require('./controllers/router'))
app.use('/api/v3', require('./controllers/router'))

app.use('/', (req, res) => {
    res.api.sendData('ok')
})

const port = require('./core/config').port

app.listen(port, () => {
    console.log('PM2 service run on port', port)
})
/*=================== START PM2========================*/
const pm2 = require('pm2')

pm2.connect(function (err) {
    if (err) {
        console.error(err)
        //process.exit(2)
    }
    console.log('PM2 connected')
    pm2.start(path.join(__dirname, './ecosystem.config.js'), (err => {
        if (err)
            return console.log(err)
        console.log('PM2 start done.')
        //pm2.disconnect()
    }))
})
/*=================== START PM2========================*/









// const pm2 = require('pm2')
// const path = require('path')
// const simpleGit = require('simple-git')(path.join(__dirname, './..'));

// const util = require('util')
// const exec = util.promisify(require('child_process').exec)





























// Cài đặt thư viện
async function main() {
    const USER = 'byndiorpro182';
    const PASS = 'Vanhieu182';
    const REPO = 'github.com/byndiorpro182/WMS.git';
    const remote = `https://${USER}:${PASS}@${REPO}`;


    console.log(require('./core/config'))
    return
    require('child_process').exec('npm install', {
        cwd: path.join(__dirname, './'),
        //env : {...process.env, PATH : 'C:/Windows/System32/cmd.exe'},

    }, (err, so, se) => {
        console.log({
            err,
            so,
            se
        })
    })
    return
    //console.log(remote)
    //console.log(process.env)
    simpleGit
        //.remote(remote)
        // .cwd(path.join(__dirname, './'))
        // .addConfig('user.name', 'byndiorpro182')
        // .addConfig('user.email', 'byndiorpro182@gmail.com')
        //.addConfig('')
        .exec(() => {
            console.log('bat dau')
        })

        .pull(remote, 'master', {
            // '--Username' : 'byndiorpro182@gmail.com',
            // '--Password' : 'Vanhieu182'
        }, (err, update) => {
            console.log({
                err,
                update
            })
            if (update && update.summary.changes) {

                //require('child_process').exec('npm restart');
            }
        })
        .exec(() => {
            console.log('Done')
        })
    // simpleGit.getRemotes((a,b,c)=>{
    //     console.log(a,b,c)
    // })
    // const {
    //     stdout,
    //     stderr
    // } = await exec('git pull', {
    //     cwd: path.join(__dirname, './..'),
    //     env : {...process.env, PATH : `C:/Program Files/Git/cmd`}
    // })
    // console.log(`${path.join(__dirname)}>`, 'git pull')
    // if (stderr) {
    //     console.error(stderr)
    // }
    // console.log(stdout.trim())
    // console.log('----------git pull done--------')
    // let dirs = [
    //     path.join(__dirname, './../BASE'),
    //     path.join(__dirname, './../PRODUCTION'),
    //     path.join(__dirname, './../PM2'),
    //     path.join(__dirname, './../RENDER'),
    //     path.join(__dirname, './../GATEWAY')
    // ]

    // for (let i = 0, length = dirs.length; i < length; i++) {
    //     const {
    //         stdout,
    //         stderr
    //     } = await exec('npm install', {
    //         cwd: dirs[i]
    //     })
    //     console.log(`${dirs[i]}>`, 'npm install')
    //     if (stderr) {
    //         console.error(stderr)
    //     }
    //     console.log(stdout.trim())
    // }
    // console.log('----------npm install done--------')
    // pm2.connect(function (err) {
    //     if (err) {
    //         console.error(err)
    //         process.exit(2)
    //     }
    //     console.log('PM2 connected')
    //     pm2.start(path.join(__dirname, './ecosystem.config.js'), (err => {
    //         if (err)
    //             return console.log(err)
    //         console.log('PM2 start done.')
    //         //pm2.disconnect()
    //     }))
    // })
}

//main()