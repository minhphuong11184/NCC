const config = require('./../../../config/global')

config.schema = 'base'

config.port = process.env.BASE_PORT || 221
config.rpc = {
    host: '127.0.0.1',
    port: process.env.BASE_GRPC_PORT || 50001
}

module.exports = config
