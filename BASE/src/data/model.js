const Sequelize = require('sequelize')
const {
    sequelize
} = require('./connect')

/* ========================= MODEL ================================ */
const model = {
    accounts: require('../model/ACCOUNT')(sequelize, Sequelize),
    roles: require('../model/ROLE')(sequelize, Sequelize),
    roleTypes: require('../model/ROLE_TYPE')(sequelize, Sequelize),
    roleGroups: require('../model/ROLE_GROUP')(sequelize, Sequelize),
    roleValues: require('../model/ROLE_VALUE')(sequelize, Sequelize),
    modules: require('../model/ROLE_MODULE')(sequelize, Sequelize),
    menu: require('../model/MENU')(sequelize, Sequelize),
    departments: require('../model/DEPARTMENT')(sequelize, Sequelize)
}
/* ========================= MODEL ================================ */

/* ========================= ADD FUNCTION ================================ */
Object.keys(model).forEach(key => {
    model[key].getAll = async (req, res) => {
        try {
            const data = await model[key].findAll()
            res.api.sendData(data)
        } catch (error) {
            res.api.sendFail({ number: 4907, message: error })
        }
    }

    model[key].insert = function (req, res, next) {
        console.log(`[model.insert] ${key} body:`, JSON.stringify(req.body))
        model[key].create(req.body)
            .then(instance => {
                res.api.sendData(instance.dataValues)
                next()
            })
            .catch(err => {
                console.log(`[model.insert] ${key} error:`, err.message || err)
                res.api.sendFail({ number: 4907, message: err })
            })
    }

    model[key].updateById = function (req, res) {
        model[key].update(req.body, {
            where: { id: req.params.id || req.account.id }
        })
            .then(() => res.api.sendData({}))
            .catch(err => res.api.sendFail({ number: 4907, message: err }))
    }

    model[key].deleteById = function (req, res) {
        model[key].destroy({
            where: { id: req.params.id }
        })
            .then(() => res.api.sendData({}))
            .catch(err => res.api.sendFail({ number: 4907, message: err }))
    }
})
/* ========================= ADD FUNCTION ================================ */
module.exports = model
