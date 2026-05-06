const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(require('api-formatter').Api.middleware(require('./../core/config').apiFormater))
app.use('/ping', (req,res)=>{
    res.status(200).send('pong').end()
})
app.use('/api/v1', require('./../controllers/router'))
app.use('/api/v2', require('./../controllers/router'))
app.use('/api/v3', require('./../controllers/router'))
//
//app.use((req, res, next) => {
//    res.api.sendFail(require('./../core/config').getErrorMessage(404))
//})
module.exports = app