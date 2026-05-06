const MongoClient = require('mongodb').MongoClient

let request
MongoClient.isConnected = false
MongoClient.connect(process.env.MONGODB_STRING, {
    useUnifiedTopology: true
}, function (err, client) {
    if (err)
        return console.log('MongoDB : connect failse!')
    MongoClient.isConnected = true
    request = client.db(process.env.MONGODB_DATABASE).collection('request')

})

MongoClient.saveRequest = function (req, res) {
    if (req.guid == undefined || req.method != 'OPTIONS' || MongoClient.isConnected == false)
        return
    let document = {
        _id: req.guid,
        timestamp: req.timestamp,
        eventTime: req.eventTime,
        method: req.method,
        finish: req.finish,
        time: req.time,
        accountId: req.accountId,
        passTime: req.passTime,
        endPoint: req.endPoint,
        body: req.body,
        query: req.query,
        params: req.params,
        pathname: req._parsedUrl.pathname,
        url: req.url,
        headers: req.headers,
        size: req.client.bytesRead,
        remoteAddress: req.connection.remoteAddress.substring(7, req.connection.remoteAddress.length),
        response: {
            statusCode: req.res.statusCode,
            statusMessage: req.res.statusMessage,
            size: req.client.bytesWritten
        },
        complete: req.complete
    }
    request.insertOne(document).then(res => {}).catch(err => {
        console.log('MongoDB insert failse !')
    })
}

module.exports = MongoClient