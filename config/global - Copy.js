const conf = {
    database: {
        user: process.env.WMSDB_USER,
        password: process.env.WMSDB_PASSWORD,
        server: process.env.WMSDB_SERVER,
        database: process.env.WMSDB_DATABASE,
        port:  parseInt(process.env.WMSDB_PORT || 1433),
    },
    msdb: {
        user: process.env.MSDB_USER,
        password: process.env.MSDB_PASSWORD,
        server: process.env.MSDB_SERVER,
        database: process.env.MSDB_DATABASE,
        port:  parseInt(process.env.MSDB_PORT || 1433),
    },
    mongodb: {
        connectString: process.env.MONGODB_STRING || 'mongodb://127.0.0.1:27017'
    },
    rpc: {
        host: '127.0.0.1',
        port: 50001
    },
    secretCode: 'secret',
    tokenLife: '10 days',
    saltRounds: 10,
    apiFormater: {
        name: 'Woodsland Restful API',
        version: 'v1',
        httpError: true
    },
    request: {
        timeout: 15 * 1000
    },
    publishChannel: {
        logging: 'logging',
        database: 'database',
        package: 'package'
    },
    form: { // Đây là form mẫu
        databaseEvent: {
            event: 'INSERT' || 'UPDATE' || 'DELETE',
            database: {

            },
            table: 'abc',
            schema: 'abc',
            row: {
                id: 123,
                code: 'abc'
            }
        }
    },
    date: {
        now() {
            let date = new Date()
            let year = date.getFullYear()
            let month = (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1)
            let day = (date.getDate() < 10 ? '0' : '') + date.getDate()
            let hours = (date.getHours() < 10 ? '0' : '') + date.getHours()
            let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
            let seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
            let milliseconds
            if (date.getMilliseconds() < 10) {
                milliseconds = `00${date.getMilliseconds()}`
            } else if (date.getMilliseconds() < 100) {
                milliseconds = `0${date.getMilliseconds()}`
            } else {
                milliseconds = date.getMilliseconds()
            }
            return year + '-' + month + '-' + day + ' ' +
                hours + ':' + minutes + ':' + seconds + ':' + milliseconds
        },
        toDateTime(date = new Date()) {
            let year = date.getFullYear()
            let month = (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1)
            let day = (date.getDate() < 10 ? '0' : '') + date.getDate()
            let hours = (date.getHours() < 10 ? '0' : '') + date.getHours()
            let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
            let seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
            let milliseconds
            if (date.getMilliseconds() < 10) {
                milliseconds = `00${date.getMilliseconds()}`
            } else if (date.getMilliseconds() < 100) {
                milliseconds = `0${date.getMilliseconds()}`
            } else {
                milliseconds = date.getMilliseconds()
            }
            return year + '-' + month + '-' + day + ' ' +
                hours + ':' + minutes + ':' + seconds + ':' + milliseconds
        },
        time() {
            let date = new Date()
            let hours = (date.getHours() < 10 ? '0' : '') + date.getHours()
            let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
            let seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
            let milliseconds
            if (date.getMilliseconds() < 10) {
                milliseconds = `00${date.getMilliseconds()}`
            } else if (date.getMilliseconds() < 100) {
                milliseconds = `0${date.getMilliseconds()}`
            } else {
                milliseconds = date.getMilliseconds()
            }
            return hours + ':' + minutes + ':' + seconds + ':' + milliseconds
        }
    },
    server: {
        base: {
            host: '127.0.0.1',
            port: 221
        },
        prod: {
            host: '127.0.0.1',
            port: 222
        },
        fpm: {
            host: '127.0.0.1',
            port: 223
        },
        lgt: {
            host: '127.0.0.1',
            port: 224
        },
        pm2: {
            host: '127.0.0.1',
            port: 225
        },
        render: {
            host: '127.0.0.1',
            port: 229
        },
        admin: {
            host: '127.0.0.1',
            port: 3000
        },
    },
    getErrorMessage: (number) => {
        return {
            success: false,
            number: number,
            message: conf.errorMessage[number] || ''
        }
    },
    errorMessage: {
        '404': 'Đường dẫn không tồn tại',
        '429': 'Request đạt tới giới hạn',
        '4100': 'NOT PERMISSION  ACCOUNT',
        '4101': 'NOT PERMISSION AUTHENTIC',
        '4102': 'NOT PERMISSION COMMAND_PERMISSION',
        '4103': 'NOT PERMISSION CONVERSION_RATE',
        '4104': 'NOT PERMISSION FACTORY',
        '4105': 'NOT PERMISSION GENERATED',
        '4106': 'NOT PERMISSION GENERATED_CONVERSION',
        '4107': 'NOT PERMISSION GENERATED_UPDATE',
        '4108': 'NOT PERMISSION GROUP_ITEM',
        '4109': 'NOT PERMISSION INFO_ERROR',
        '4110': 'NOT PERMISSION INVENTORY_UPDATE',
        '4111': 'NOT PERMISSION ITEM',
        '4112': 'NOT PERMISSION ITEM_OF_PROCESS',
        '4113': 'NOT PERMISSION ITEMS_IN_ORDER',
        '4114': 'NOT PERMISSION ITEMS_OF_PACKAGE',
        '4115': 'NOT PERMISSION OPERATION',
        '4116': 'NOT PERMISSION ORDER',
        '4117': 'NOT PERMISSION PACKAGE',
        '4118': 'NOT PERMISSION PACKAGE_TYPE',
        '4119': 'NOT PERMISSION PLAN_PRODUCTION',
        '4120': 'NOT PERMISSION PROCESS',
        '4121': 'NOT PERMISSION PRODUCT_OF_ORDER',
        '4122': 'NOT PERMISSION RECEIVE',
        '4123': 'NOT PERMISSION RELATIONSHIP_FACTORY_AND_PROCESS',
        '4124': 'NOT PERMISSION RELATIONSHIP_PROCESS_AND_TEAMS',
        '4125': 'NOT PERMISSION ROLE',
        '4126': 'NOT PERMISSION ROLE_OF_ACCOUNT',
        '4127': 'NOT PERMISSION ROLE_WITH_ROW',
        '4128': 'NOT PERMISSION ROLE_WITH_TABLE',
        '4129': 'NOT PERMISSION TABLE',
        '4130': 'NOT PERMISSION TEAMS',
        '4131': 'NOT PERMISSION TYPE_RLS',
        '4132': 'NOT PERMISSION UNIT',
        '4133': 'NOT PERMISSION WOOD_TYPE',
        '420': 'Đã tồn tại',
        '430': 'Chưa được tạo',
        '4401': 'Bán thành phẩm này không có trong danh sách bán thành phẩm của order đó',
        '4500': 'Thiếu nguyên vật liệu để tạo ra được các sản phẩm trong package',
        '4501': 'Số lượng thành phẩm(cần khắc phục) không đủ để xuất',
        '4502': 'Số lượng nguyên vật liệu không đủ để xuất',
        '4503': 'Chưa tạo BOM cho thành phẩm',
        '4504': 'Không thể tạo pallet tại công đoạn này',
        '4504': 'Tạo palleet không thành công',
        '4505': 'Số lượng ghi nhận vượt quá kế hoạch',
        '4540': 'Không tìm thấy nơi xử lý lỗi cho bộ phận này',
        '4600': 'Không đủ quyền (quyền RLS)',
        '4700': 'Xuất mẻ sấy không thành công',
        '4800': 'Giải mã IKEA không thành công',
        '4801': 'Mã IKEA đã tồn tại',
        '4900': 'Thiếu trường dữ liệu hoặc trường dữ liệu trống',
        '4901': 'Mã hóa mật khẩu không thành công',
        '4902': 'Giải mã mật khẩu không thành công',
        '4903': 'So sánh mật khẩu không đúng',
        '4904': 'Tạo mã token không thành công',
        '4905': 'Giải mã token không thành công, hoặc mã đã hết hạn',
        '4906': 'Mã token không đúng',
        '4907': 'Lỗi SQL Server',
        '4907': 'Logging không thành công',
        '4907': 'Lỗi SQL Server',
        '4908': 'Sai tên tài khoản',
        '4909': 'Đang xây dựng',
        '4910': 'Check validator không qua',
        '4921': 'Proxy error : Không tìm thấy service xử lý request',
        '4922': 'Proxy econnreset.',
        '4931': 'Định dạng dữ liệu không thành công',
        'ETIMEOUT': ' Timeout: Request failed to complete in 20000ms',
    }
}

module.exports = conf