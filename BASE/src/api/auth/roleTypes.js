const express = require('express')
const roleTypes = express.Router()
const model = require('../../data/model')
const cache = require('./../../data/cache')

roleTypes.get('/', (req,res)=>{
    res.api.sendData(cache.roleTypes.findBy(req.query))
} )

roleTypes.post('/', model.roleTypes.insert)

roleTypes.put('/:id', model.roleTypes.updateById)

roleTypes.delete('/:id',model.roleTypes.deleteById)

module.exports = roleTypes