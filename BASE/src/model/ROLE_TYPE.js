const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    const RoleType = sequelize.define('ROLE_TYPE', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CODE'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NAME'
        }
    }, {
        tableName: 'ROLE_TYPE',
        timestamps: false,
        schema: 'base',
    });
    // (async () => {
    //     await RoleType.sync({
    //         alter: true
    //     });
    //     // await Acount.bulkCreate()
    // })();

    return RoleType
};