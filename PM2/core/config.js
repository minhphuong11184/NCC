const fs = require('fs')
const yaml = require('js-yaml')

let config
try {
    let fileContents = fs.readFileSync(require('path').join(__dirname, './../config.yaml'), 'utf8')
    config = yaml.safeLoad(fileContents)

} catch (err) {
    if(err)
        throw console.log(err)
}

config.port = process.env.PM2_PORT || 225



module.exports = config