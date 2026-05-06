require('dotenv').config({ path: require('path').join(__dirname, './../.env') })
const {
    HTTP_PORT,
    HTTPS_PORT
} = require('./src/core/config')

/*======================APPLICATION=====================*/
const app = require('./src/middleware/app')
/*=====================================================*/

/*======================OPEN HTTP=====================*/
const http = require('http')
http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`HTTP running on port ${HTTP_PORT}`)
})
/*=====================================================*/

/*======================OPEN HTTPS=====================*/
const https = require('https')
const credentials = require('./src/core/credentials')
if (credentials)
    https.createServer(credentials, app).listen(HTTPS_PORT, () => {
        console.log(`HTTPS running on port ${HTTPS_PORT}`);
    })
/*=====================================================*/