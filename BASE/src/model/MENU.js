const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    const Menu = sequelize.define('MENU', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'PARENT_ID'
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TYPE'
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
        },
        path: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'PATH'
        },
        sequence: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        permission: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        isActive: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
    }, {
        tableName: 'MENU',
        timestamps: false,
        schema: 'base',
    });

    // (async () => {
    //     await Menu.sync({
    //         alter: true
    //     });
    //     // await Menu.bulkCreate()
    // })();

    return Menu
};