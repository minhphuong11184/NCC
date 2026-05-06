const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    const RoleGroup = sequelize.define('ROLE_GROUP', {
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
        tableName: 'ROLE_GROUP',
        timestamps: false,
        schema: 'base',
    });
    // (async () => {
    //     await RoleGroup.sync({
    //         alter: true
    //     });
    //     // await Acount.bulkCreate()
    // })();

    return RoleGroup
};