const express = require('express')
const roleValues = express.Router()
const model = require('../../data/model')
const cache = require('./../../data/cache')

roleValues.get('/', (req,res)=>{
    res.api.sendData(cache.roleValues.findBy(req.query))
} )

roleValues.post('/', model.roleValues.insert)

roleValues.put('/:id', model.roleValues.updateById)

roleValues.delete('/:id',model.roleValues.deleteById)

module.exports = roleValues