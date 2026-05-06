const jwt = require('jsonwebtoken')
const {secretCode,getErrorMessage} = require('./config')

module.exports = function authentication(req, res, next) {
    const token = req.query.token ||
        req.query.access_token ||
        req.headers.token ||
        ((req.headers.authorization !== undefined) ? req.headers.authorization.replace('Bearer ', '') : null) ||
        req.body.token

    if (!token)
        return res.api.sendFail(getErrorMessage(4905))

    jwt.verify(token, secretCode, (err, result) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4905))
        req.accountId = result.id
        req.isAuthenticated = true
        next()
    })
}