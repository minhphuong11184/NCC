require('dotenv').config({ path: require('path').join(__dirname, './../.env') })
const http = require('http')

const app = require('./src/middleware/app')
const { port } = require('./src/core/config')

const server = http.createServer(app).listen(port, () => {
    console.log(`PRODUCTION Server : open port ${server.address().port}`)
})
