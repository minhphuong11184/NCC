const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    const Department = sequelize.define('DEPARTMENT', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TYPE'
        },
        type2: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TYPE2'
        },
        parentId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'PARENT_ID'
        },
        factoryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        accountId1: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        accountId2: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        packageTypeGroupId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'PACKAGE_TYPE_GROUP_ID'
        },
        GROUP_ID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'GROUP_ID'
        },
        moduleId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'MODULE_ID'
        }
    }, {
        tableName: 'DEPARTMENT',
        timestamps: false,
        schema: 'base',
    });

    // (async () => {
    //     await Department.sync({
    //         alter: true
    //     });
    //     // await Department.bulkCreate()
    // })();

    return Department
};