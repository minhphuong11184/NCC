class CacheApp {
    constructor() {
        this.data = []
    }
    add(e) {
        this.data.push({
            ...e
        })
        this[e.id] = {
            ...e
        }
        return Object.assign({}, this[e.id])
    }
    mAdd(es) {
        es.forEach(e => {
            this.data.push(e)
            this[e.id] = e
        })
        return true
    }
    getById(id) {
        return Object.assign({}, this[id])
    }
    find(fn) {
        return Object.assign({}, this.data.find(fn))
    }
    filter(fn) {
        let result = []
        this.data.filter(fn).forEach(e => {
            result.push(Object.assign({}, e))
        })
        return result
    }
    findBy(condition) {
        let findBy = []
        Object.keys(this.data[0] || {}).forEach(key => {
            if (condition[key] !== undefined) {
                findBy.push({
                    key: key,
                    value: condition[key]
                })
            }
        })
        if (findBy.length) {
            return this.filter(e => {
                for (let i = 0, length = findBy.length; i < length; i++) {
                    if (e[findBy[i].key] !== findBy[i].value)
                        return false
                }
                return true
            })
        } else {
            return this.findAll()
        }
    }
    findAll() {
        let result = []
        this.data.forEach(e => {
            result.push(Object.assign({}, e))
        })
        return result
    }
    updateById(id, e) {
        let index = this.data.findIndex(i => i.id === id)
        if (index !== -1) {
            this.data[index] = e
            this[id] = e
        }
    }
    deleteById(id) {
        delete this[id]
        let index = this.data.findIndex(i => i.id === id)
        this.data.splice(index, 1)
    }
    flush() {
        this.data = []
        Object.keys(this).forEach(key => {
            if (key != 'data')
                delete this[key]
        })
    }
}

module.exports = CacheApp