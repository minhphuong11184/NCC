const config = require('./../../../config/global')

config.schema = 'prod'
config.port = process.env.PROD_PORT || 222

module.exports = config
