const express = require('express')
const api = express.Router()

// ================= Auth / Account / Role / Menu =================
api.use('/accounts', require('./auth/accounts'))
api.use('/account', require('./auth/accounts'))
api.use('/roles', require('./auth/roles'))
api.use('/role-values', require('./auth/roleValues'))
api.use('/role-types', require('./auth/roleTypes'))
api.use('/role-groups', require('./auth/roleGroups'))
api.use('/modules', require('./auth/modules'))
api.use('/menu', require('./auth/menu'))

// ================= Structure (Department / Factory / Xuong) ====
api.use('/departments', require('./structure/departments'))
api.use('/department', require('./structure/departments'))
api.use('/xuongs', require('./structure/xuongs'))
api.use('/factorys', require('./structure/factorys'))

module.exports = api
