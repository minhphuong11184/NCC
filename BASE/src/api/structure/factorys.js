const express = require('express')
const factorys = express.Router()
const cache = require('./../../data/cache')

factorys.get('/', (req, res) => {
    res.api.sendData(cache.departments.filter(i => i.type == 'Nhà máy'))
})

module.exports = factorys