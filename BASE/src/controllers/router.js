const express = require('express')
const router = express.Router()
const api = require('./../api/api')
const auth = require('./auth')
const verify = require('./../core/verify')

router.use(require('./../middleware/logging'))
router.use('/', auth)
router.use('/', verify, api)

module.exports = router