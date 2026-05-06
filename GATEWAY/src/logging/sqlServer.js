const mssql = require('mssql')
const date = require('../core/config').date
//sql server
mssql.isConnected = false
mssql.connect(require('../core/config').msdb, (err) => {
    if (err)
        return console.log('SQL Server MS : connect fail!',err)
    console.log('SQL Server MS : connected.')
    mssql.isConnected = true
})

const insertDataOfRequest = `INSERT INTO [dbo].[DATA] (REQ_GUID,TYPE_ID,[KEY],[VALUE])
                            VALUES (@REQ_GUID,@TYPE_ID,@KEY,@VALUE)`
const insertRequest = `INSERT INTO [dbo].[REQUEST]([GUID],[URL],[METHOD],[VERSION],[R1],[R2],[R3],[R4],[IP_CLIENT],[SIZE],[START],[PASS_TIME],[FINISH],[TIME],[END_POINT],[RES_SIZE],[STATUS_CODE],[ACCOUNT_ID])
                        VALUES	(@GUID,@URL,@METHOD,@VERSION,@R1,@R2,@R3,@R4,@IP_CLIENT,@SIZE,@START,@PASS_TIME,@FINISH,@TIME,@END_POINT,@RES_SIZE,@STATUS_CODE,@ACCOUNT_ID)`

mssql.saveRequest = function (req, res) {
    if (!mssql.isConnected || req.method == 'OPTIONS')
        return
    new mssql.Request()
        .input('GUID', req.guid)
        .input('METHOD', req.method)
        .input('URL', req.url.split('?')[0])
        .input('VERSION', req.urls[2])
        .input('R1', req.urls[3])
        .input('R2', req.urls[4])
        .input('R3', req.urls[5])
        .input('R4', req.urls[6])
        .input('IP_CLIENT', req.connection.remoteAddress.substring(7, req.connection.remoteAddress.length))
        .input('SIZE', req.client.bytesRead)
        .input('START', date.toDateTime(req.timestamp))
        .input('PASS_TIME', date.toDateTime(req.passTime))
        .input('FINISH', date.toDateTime(req.finish))
        .input('TIME', req.finish - req.timestamp)
        .input('END_POINT', req.endPoint)
        .input('RES_SIZE', req.client.bytesWritten)
        .input('STATUS_CODE', res.statusCode)
        .input('ACCOUNT_ID', req.accountId || null)
        .query(insertRequest, (err, record) => {
            if (err) {
                console.log('SQL Server insert failes!')
                mssql.isConnected = false
                setTimeout(() => {
                    mssql.isConnected = true
                },60 * 60 * 1000) // 1 tieng
            }
        })
    Object.keys(req.headers).forEach(key => {
        insertRequestData(req.guid, 100000, key, req.headers[key])
    })
    Object.keys(req.query).forEach(key => {
        insertRequestData(req.guid, 100001, key, req.query[key])
    })
    Object.keys(req.params).forEach(key => {
        insertRequestData(req.guid, 100002, key, req.params[key])
    })
    Object.keys(req.body).forEach(key => {
        insertRequestData(req.guid, 100003, key, req.body[key])
    })
}

function insertRequestData(guid, typeId, key, value) {
    new mssql.Request()
        .input('REQ_GUID', guid)
        .input('TYPE_ID', typeId)
        .input('KEY', key)
        .input('VALUE', value)
        .query(insertDataOfRequest)
}


module.exports = mssql