const express = require('express')
const router = express.Router()
const api = require('./../api/api')
const verify = require('./../core/verify')

// Các route công khai (không cần token) — gắn trực tiếp ở đây nếu cần
// router.use('/public', require('./../api/public'))

// Các route cần xác thực JWT
router.use('/', verify, api)

module.exports = router
