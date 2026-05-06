const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Kích hoạt kết nối DB khi service khởi động
require('./../data/connect')

const app = express()

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(require('api-formatter').Api.middleware(require('./../core/config').apiFormater))

app.use('/ping', (req, res) => res.status(200).send('pong').end())

app.use('/api/v1', require('./../controllers/router'))
app.use('/api/v2', require('./../controllers/router'))

module.exports = app
