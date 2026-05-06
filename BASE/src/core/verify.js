const jwt = require('jsonwebtoken')
const {
    secretCode,
    errorMessage
} = require('./config')
const lowercaseKeys = require('lowercase-keys')
const mssql = require('mssql')


function verify(req, res, next) {
    let request = new mssql.Request()
    addMethod(request, req)

    const token = req.query.token || req.body.token ||
        ((req.headers.authorization !== undefined) ? req.headers.authorization.replace('Bearer ', '') : '')

    jwt.verify(token, secretCode, (err, result) => {
        if (err)
            return res.api.sendFail({
                code: '4905',
                message: err
            })
        if (req.log !== undefined) {
            req.log.accountId = result.id
        }
        req.token = {}
        req.token.accountId = result.id
        request.input('ACCOUNT_ID', result.id)
        request.output('ERROR')
        next()
    })
}


function addMethod(request, req) {
    req.input = function (param, value) {
        request.input(param, value)
        return req
    }
    req.execute = function (proc) {
        request.execute(proc, (err, record) => {
            if (err)
                return req.api.sendFail(err)
            if (record.output.ERROR > 0 && record.output.ERROR != null)
                return req.api.sendFail({
                    number: record.output.ERROR,
                    message: errorMessage[record.output.ERROR]
                })

            let result = []
            if (record.recordset !== undefined) {
                record.recordset.forEach(e => {
                    result.push(lowercaseKeys(e))
                })
                return req.api.sendData(result)
            }
            return req.api.sendData([])
        })
    }

    req.error = function (err) {
        req.api.sendFail(err)
    }
}
module.exports = verify