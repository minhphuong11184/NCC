const client = require('redis').createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)
client.on("error", function (err) {
    //bỏ qua thông báo reconnect, hệ thống sẽ tự động connect ngầm, các thông báo lỗi khác sẽ vẫn hiển thị
    if (err.code != 'ETIMEDOUT' && err.code != 'ECONNREFUSED' && err.code != 'CONNECTION_BROKEN')
        console.log(err)
})

const getSchemaFromTable = {
    ACCOUNT: 'accounts',
    ROLE: 'roles',
    ROLE_TYPE: 'roleTypes',
    ROLE_GROUP: 'roleGroups',
    ROLE_VALUE: 'roleValues',
    MENU: 'menu',
    CATEGORY: 'category',
    MODULE: 'modules',
    CUSTOMER: 'customers',
    DEPARTMENT: 'departments',
    PROPOSALFORM: 'proposalForms',
    ITEM: 'items',
    ITEM_TYPE: 'itemTypes',
    UNIT: 'units',
    MARKET: 'markets',
    VENDOR: 'vendors'
}

function hooks(instance, option) {
    let key = getSchemaFromTable[instance._modelOptions.tableName]
    const cache = require('./cache')
    if (key)
        switch (option.event) {
            case 'INSERT':
                cache[key].add(instance.dataValues)
                break
            case 'UPDATE':
                cache[key].updateById(instance.dataValues.id, instance.dataValues)
                break
            case 'DELETE':
                cache[key].deleteById(instance.dataValues.id)
                break
            default:
                break
        }

    client.publish(require('../core/config').publishChannel.database, JSON.stringify({
        event: option.event,
        schema: instance._modelOptions.schema,
        table: instance._modelOptions.tableName,
        row: instance.dataValues
    }))
}


module.exports = hooks