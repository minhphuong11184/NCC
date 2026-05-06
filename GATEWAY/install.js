var Service = require('node-windows').Service;
var svc = new Service({
	name: 'WMS API GATEWAY',
	description: 'This service of Woodsland company, management all traffic, CORS support, authorization and access control, throttling, monitoring, and API version management for WMS.',
	script: require('path').join(__dirname, 'index.js'),
	nodeOptions: []
})

svc.on('alreadyinstalled', function () {
	console.log('Đã cài đặt')
})
svc.on('install', function () {
	//svc.start()
	console.log('Cài đặt thành công')
})

svc.install()