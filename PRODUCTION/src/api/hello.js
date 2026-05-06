const express = require('express')
const hello = express.Router()

// GET /api/v1/hello  → chỉ cần JWT hợp lệ là truy cập được
hello.get('/', (req, res) => {
    res.api.sendData({
        message: 'Xin chào từ PRODUCTION service',
        accountId: req.token && req.token.accountId
    })
})

module.exports = hello
