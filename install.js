const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path')


async function main() {
    let r = {}

    /*=================== Tải thư viện ==========================*/
    let services = ['GATEWAY', 'PM2', 'BASE', 'PRODUCTION', 'DESKTOP']

    for (let i = 0; i < services.length; i++) {
        console.log(`${i + 1}`, '.', services[i], 'install...')
        r = await exec('npm install', {
            cwd: path.join(__dirname, services[i])
        })
        if (r.err)
            throw r.err
        console.log('Cài đặt thành công.', '\r\n')
    }
    /*=========================================================*/

    /*============== Cài API GATEWAY SERVICE ==================*/
    r = await exec('node install', {
        cwd: path.join(__dirname, './GATEWAY')
    })
    if (r.err)
        throw r.err
    console.log('API Gateway Service :', r.stdout)
    /*=========================================================*/


    /*=================== Cài PM2 SERVICE ======================*/
    r = await exec('node install', {
        cwd: path.join(__dirname, './PM2')
    })

    if (r.err)
        throw r.err
    console.log('PM2 Service :', r.stdout)
    /*==========================================================*/
}

main()
