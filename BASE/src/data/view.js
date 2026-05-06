const cache = require('./cache')
const mssql = require('mssql')
const view = {
    items: {
        getById(id) {
            let item = cache.items.getById(id)
            item.unit = cache.units.getById(item.unitId)
            item.type = cache.itemTypes.getById(item.typeId)
            delete item.unitId
            delete item.typeId
            return item
        },
        find(fn) {
            let item = cache.items.find(fn)
            return this.getById(item.id)
        },
        filter(fn) {
            let items = cache.items.filter(fn)
            items.forEach((e, i) => {
                items[i] = this.getById(e.id)
            })
            return items
        },
        findBy(condition) {
            let findBy = []
            Object.keys(cache.items.data[0]).forEach(key => {
                if (condition[key] !== undefined) {
                    findBy.push({
                        key: key,
                        value: condition[key]
                    })
                }
            })
            if (findBy.length) {
                let items = cache.items.filter(e => {
                    for (let i = 0, length = findBy.length; i < length; i++) {
                        if (e[findBy[i].key] != findBy[i].value)
                            return false
                    }
                    return true
                })
                items.forEach((e, i) => {
                    items[i] = this.getById(e.id)
                })
                return items
            } else {
                if (condition.typeId) {
                    let items = cache.items.filter(e => e.typeId = condition.typeId)
                    return items
                }
                return this.findAll()
            }
        },
        findAll() {
            let items = cache.items.findAll()
            items.forEach((e, i) => {
                items[i] = this.getById(e.id)
            })
            return items
        }
    },
    accounts: {
        getById(id) {
            let account = cache.accounts.getById(id)
            //let role = cache.roles.getById(account.roleId)
            let role = {
                id: account.roleId
            }
            let roleTypes = cache.roleTypes.findAll()
            for (let i = 0, length = roleTypes.length; i < length; i++) {
                roleTypes[i].value = cache.roleValues.filter(e => e.roleId == role.id && e.roleTypeId == roleTypes[i].id)
                    .map(e => e.value)
            }
            account.role = role
            role.types = roleTypes

            let structure = {}
            getParent(account.role.types.find(i => i.id == 100001).value[0], structure)
            account.structure = structure
            account.role.types.find(i => i.id == 100001).value = getStepsByIds(account.role.types.find(i => i.id == 100001).value)
            account.role.types.find(i => i.id == 100002).value = getStepsByIds(account.role.types.find(i => i.id == 100002).value)
            account.role.types.find(i => i.id == 100003).value = getGroupsByIds(account.role.types.find(i => i.id == 100003).value)
            account.role.types.find(i => i.id == 100004).value = getModuleByIds(account.role.types.find(i => i.id == 100004).value)
            account.role.types.find(i => i.id == 100005).value = getGroupsByIds(account.role.types.find(i => i.id == 100005).value)
            account.role.types.find(i => i.id == 100006).value = getMenuByIds(account.role.types.find(i => i.id == 100006).value, 'desktop')
            account.role.types.find(i => i.id == 100007).value = getCategoryByIds(account.role.types.find(i => i.id == 100007).value)
            account.role.types.find(i => i.id == 100009).value = getMenuByIds(account.role.types.find(i => i.id == 100009).value, 'mobile')
            delete account.password
            return account
        }
    }
}


function getStepsByIds(ids) {
    let destinations = []
    ids.forEach(e => {
        destinations.push(cache.departments.find(i => i.id == e))
    })
    return destinations
}

function getModuleByIds(ids) {
    let result = []
    ids.forEach(e => {
        result.push(cache.modules.find(i => i.id == e))
    })
    return result
}

function getGroupsByIds(ids) {
    let groups = []
    ids.forEach(e => {
        groups.push(cache.roleGroups.find(i => i.id == e))
    })
    return groups
}

function getMenuByIds(ids, type) {
    let menu = []
    ids.forEach(e => {
        let buf = cache.menu.find(i => i.id == e && i.type == type)
        if (buf.id)
            menu.push(buf)
    })
    return menu
}

function getCategoryByIds(ids) {
    let categorys = []
    ids.forEach(e => {
        categorys.push(cache.category.find(i => i.id == e))
    })
    return categorys
}

function getParent(deparmentId, structure) {
    console.log(deparmentId,structure)
    let deparment = cache.departments.getById(deparmentId) || {}
    if (deparment.id !== undefined) {
        structure[deparment.type2] = deparment
        if (deparment.parentId > 10) {
            getParent(deparment.parentId, structure)
        }
    }
}








module.exports = view