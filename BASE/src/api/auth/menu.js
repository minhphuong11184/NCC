const express = require('express')
const menu = express.Router()
const model = require('../../data/model')
const cache = require('./../../data/cache')

const mssql = require('mssql')

menu.get('/', (req,res)=>{
    res.api.sendData(cache.menu.findBy(req.query))
} )

menu.post('/', model.menu.insert)

menu.put('/:id', model.menu.updateById)

menu.delete('/:id',model.menu.deleteById)

module.exports = menu