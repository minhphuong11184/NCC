const Sequelize = require('sequelize')
const mssql = require('mssql')
const { database } = require('./../core/config')

// ========= Pool chính: TanTrao2026_DB (local) =========
mssql.connect(database, (err) => {
    if (err) {
        console.log('[PRODUCTION] SQL Server mssql connect failed!')
        throw err
    }
    console.log('[PRODUCTION] SQL Server mssql connected')
})

const sequelize = new Sequelize(database.database, database.user, database.password, {
    host: database.server,
    port: database.port,
    dialect: 'mssql',
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    logging: false
})

sequelize
    .authenticate()
    .then(() => console.log('[PRODUCTION] Sequelize connected'))
    .catch(err => {
        console.error(`[PRODUCTION] Sequelize connect failed: ${err}`)
        throw err
    })

// Woodsland: dữ liệu được lấy qua Goxe API (xem goxeApi.js).
// Không kết nối DB Woodsland trực tiếp nữa.

module.exports = { sequelize, mssql }
