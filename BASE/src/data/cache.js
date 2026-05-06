// Khởi tạo class cache
const model = require('./model')
const CacheApp = require('./CacheApp')

const cache = {
    accounts: new CacheApp(),
    PHONE: new CacheApp(),
    accountForms: new CacheApp(),
    marketPrice: new CacheApp(),
    roles: new CacheApp(),
    roleTypes: new CacheApp(),
    roleGroups: new CacheApp(),
    roleValues: new CacheApp(),
    menu: new CacheApp(),
    category: new CacheApp(),
    modules: new CacheApp(),
    customers: new CacheApp(),
    departments: new CacheApp(),
    proposalForms: new CacheApp(),
    items: new CacheApp(),
    itemTypes: new CacheApp(),
    units: new CacheApp(),
    markets: new CacheApp(),
    vendors: new CacheApp(),
    cars: new CacheApp(),
}

// config cache
Object.keys(model).forEach(key => {
    model[key].findAll()
        .then(data => {
            cache[key].mAdd(data.map(i => i.dataValues))
        })
})

module.exports = cache