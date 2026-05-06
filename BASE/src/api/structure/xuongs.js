const express = require('express')
const xuongs = express.Router()
const cache = require('./../../data/cache')

xuongs.get('/', (req,res)=>{
    res.api.sendData(cache.departments.filter(i=>i.type == 'Xưởng'))
})

module.exports = xuongs