const redis = require("redis")
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)
const {publishChannel} = require('./config')

client.on("error", function (err) {
    //bỏ qua thông báo reconnect, hệ thống sẽ tự động connect ngầm, các thông báo lỗi khác sẽ vẫn hiển thị
    if (err.code != 'ETIMEDOUT' && err.code != 'ECONNREFUSED' && err.code != 'CONNECTION_BROKEN' && err.code != 'EHOSTDOWN')
        console.log(err)
})

client.on('connect', () => {
    console.log('REDIS : connected');
})

let buf = console.log

console.log = function () {
    let message = 'GATEWAY | '
    for (let i = 0, length = arguments.length; i < length; i++) {
        if (arguments[i] != null)
            message = message + arguments[i].toString() + ' '
    }
    client.publish(publishChannel.logging, message.trim())
    buf.apply(buf, arguments)
}