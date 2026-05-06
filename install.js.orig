const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path')


async function main() {
    let r = {}
    /*=================== Cài PM2 =============================*/
    // r = await exec('npm install pm2 -g')

    // if (r.err)
    //     throw r.err
    // console.log('PM2 install done.')
    /*=========================================================*/

    /*=================== Tải thư viện ==========================*/
    let services = ['GATEWAY', 'PM2', 'BASE', 'PRODUCTION', 'RENDER','HR','SERVE', 'REACT', 'MOBILE','WOOD']

    for (let i = 0; i < services.length; i++) {
        console.log(`${i+1}`, '.', services[i], 'install...')
        r = await exec('npm install', {
            cwd: path.join(__dirname, services[i])
        })
        if (r.err)
            throw r.err
        console.log('Cài đặt thành công.', '\r\n')
    }
    /*=========================================================*/

    /*=================== React build ======================*/
    console.log('React run build...')
    r = await exec('npm run build', {
        cwd: path.join(__dirname, './REACT')
    })

    if (r.err)
        throw r.err
    console.log('React build done.')
    /*==========================================================*/

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