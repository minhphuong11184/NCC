const config = require('./../../../config/global')

config.HTTP_PORT = process.env.GATEWAY_HTTP_PORT || 2003
config.HTTPS_PORT = process.env.GATEWAY_HTTPS_PORT || 2002

module.exports = config

