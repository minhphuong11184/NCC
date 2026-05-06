const express = require('express')
const modules = express.Router()
const model = require('../../data/model')
const cache = require('./../../data/cache')

modules.get('/', (req,res)=>{
    res.api.sendData(cache.modules.findBy(req.query))
} )

modules.post('/', model.modules.insert)

modules.put('/:id', model.modules.updateById)

modules.delete('/:id',model.modules.deleteById)

module.exports = modules