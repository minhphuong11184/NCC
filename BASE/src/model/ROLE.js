const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    const Role = sequelize.define('ROLE', {
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
        tableName: 'ROLE',
        timestamps: false,
        schema: 'base',
    });

    // (async () => {
    //     await Role.sync({
    //         alter: true
    //     });
    //     // await Acount.bulkCreate()
    // })();

    return Role
};