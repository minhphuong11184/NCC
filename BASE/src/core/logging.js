const {
    msdb
} = require('./config')

const mssql = require('mssql')
let sql = {}

sql.isConnected = false

new mssql.ConnectionPool(msdb).connect()
    .then(pool => {
        sql = pool
        sql.isConnected = true
        console.log('SQL Server MS : connected')
    }).catch(err => {
        sql.isConnected = false
        console.log('SQL Server MS : connect fail!')
    })


function logging(req, res, next) {
    if (req.isConnected) {
        let guid = req.headers['x-gateway-request-guid']
        if (guid)
            Object.keys(req.body).forEach(key => {
                insertRequestData(guid, 100003, key, req.body[key])
            })
    }
    next()
}

function insertRequestData(guid, typeId, key, value) {
    let query = {
        insertRequestData: `INSERT INTO [dbo].[DATA] (REQ_GUID,TYPE_ID,[KEY],[VALUE])
                        VALUES (@REQ_GUID,@TYPE_ID,@KEY,@VALUE)`,
    }
    sql.request()
        .input('REQ_GUID', guid)
        .input('TYPE_ID', typeId)
        .input('KEY', key)
        .input('VALUE', value)
        .query(query.insertRequestData, (err) => {
            if (err)
                console.log(err)
        })
}

module.exports = logging