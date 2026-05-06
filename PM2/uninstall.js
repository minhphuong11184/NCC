var Service = require('node-windows').Service;
const path = require('path')

var svc = new Service({
    name: 'WMS PROCESS MANAGER',
    description: 'This service of Woodsland Company',
    script: path.join(__dirname, 'index.js'),
    //maxRestarts : 1,
    //maxRetries : 1
})

svc.on('uninstall', function () {
    console.log('Gỡ cài đặt hoàn tất')
})

svc.uninstall()