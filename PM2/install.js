var Service = require('node-windows').Service;
const path = require('path')

var svc = new Service({
    name: 'WMS PROCESS MANAGER',
    description: 'This service of Woodsland Company',
    script: path.join(__dirname, 'index.js'),
    //maxRestarts : 1,
    //maxRetries : 1
})

svc.on('alreadyinstalled', function () {
	console.log('Đã cài đặt')
})
svc.on('install', function () {
    //svc.start()
	console.log('Cài đặt thành công')
})

svc.install()
