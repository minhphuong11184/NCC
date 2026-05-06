const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    const RoleValue = sequelize.define('ROLE_VALUE', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        guid: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'GUID',
            defaultValue: DataTypes.UUIDV4
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'ROLE_ID'
        },
        roleTypeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'ROLE_TYPE_ID'
        },
        value: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'VALUE'
        }
    }, {
        tableName: 'ROLE_VALUE',
        timestamps: false,
        schema: 'base',
    });

    // (async () => {
    //     await RoleValue.sync({
    //         alter: true
    //     });
    //     // await RoleValue.bulkCreate()
    // })();

    return RoleValue
};