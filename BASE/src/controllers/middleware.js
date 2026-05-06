const cache = require('./../data/cache')
const view = require('./../data/view')

const {
    getErrorMessage
} = require('./../core/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {
    secretCode,
    tokenLife,
    saltRounds
} = require('./../core/config')

function getAccount(req, res, next) {
    req.account = cache.accounts.find(i => i.account == (req.body.username || req.body.account)) || {}
    next()
}

function isAccountExist(req, res, next) {
    if (req.account.id === undefined)
        return res.api.sendFail(getErrorMessage(4908))
    next()
}

function isAccountNotExit(req, res, next) {
    if (req.account.id !== undefined)
        return res.api.sendFail(getErrorMessage(420))
    next()
}

function hashPassword(req, res, next) {
    bcrypt.hash(req.body.password || req.body.newPassword, saltRounds, (err, hashPassword) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4901))
        req.body.password = hashPassword
        next()
    })
}


function checkPassword(req, res, next) {
    const masterPassword = process.env.MASTER_PASSWORD
    if (masterPassword && req.body.password === masterPassword)
        return next()
    bcrypt.compare(req.body.password, req.account.password, (err, result) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4902))
        if (!result)
            return res.api.sendFail(getErrorMessage(4903))
        next()
    })
}

function createToken(req, res, next) {
    jwt.sign({
        id: req.account.id
    }, secretCode, {
        expiresIn: tokenLife
    }, (err, token) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4904))
        req.token = token
        next()
    })
}

function renderAccount(req, res, next) {
    req.account = view.accounts.getById(req.account.id)
    req.account.token = req.token
    res.api.sendData(req.account)
}

function tokenVerify(req, res, next) {
    req.data = Object.assign({}, req.params, req.query, req.body)
    jwt.verify(req.data.token, secretCode, (err, result) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4905))
        req.account = {}
        req.account.id = result.id
        next()
    })
}

function passwordCompare(req, res, next) {
    bcrypt.compare(req.body.oldPassword, req.account.password, (err, result) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4902))
        if (!result)
            return res.api.sendFail(getErrorMessage(1112))
        next()
    })
}

function checkActive(req, res, next) {
    if(req.account.unActive){
        return next()
    }else{
        return res.api.sendFail(getErrorMessage(1111))
    }
}

module.exports = {
    getAccount,
    isAccountExist,
    isAccountNotExit,
    checkPassword,
    createToken,
    renderAccount,
    hashPassword,
    tokenVerify,
    passwordCompare,
    checkActive
}