const express = require('express')
const roleGroups = express.Router()
const model = require('../../data/model')
const cache = require('./../../data/cache')

roleGroups.get('/', (req,res)=>{
    res.api.sendData(cache.roleGroups.findBy(req.query))
} )

roleGroups.post('/', model.roleGroups.insert)

roleGroups.put('/:id', model.roleGroups.updateById)

roleGroups.delete('/:id',model.roleGroups.deleteById)

module.exports = roleGroups