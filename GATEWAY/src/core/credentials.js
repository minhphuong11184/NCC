const fs = require('fs')
const path = require('path')

const SSL_KEY  = process.env.SSL_KEY_PATH
const SSL_CERT = process.env.SSL_CERT_PATH
const SSL_CA   = process.env.SSL_CA_PATH

let credentials = null
if (SSL_KEY && SSL_CERT && SSL_CA) {
    try {
        credentials = {
            key:  fs.readFileSync(path.resolve(SSL_KEY), 'utf8'),
            cert: fs.readFileSync(path.resolve(SSL_CERT), 'utf8'),
            ca:   fs.readFileSync(path.resolve(SSL_CA), 'utf8')
        }
    } catch (error) {
        console.log('HTTPS not available:', error.message)
    }
}

module.exports = credentials