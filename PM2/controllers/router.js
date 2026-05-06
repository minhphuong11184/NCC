const express = require('express')
const router = express.Router()

router.use('/pm2',require('./pm2'))
router.use('/git',require('./git'))
router.use('/npm',require('./npm'))
router.use('/child-process', require('./childProcess'))

module.exports = express.Router().use(require('./logging'), router)