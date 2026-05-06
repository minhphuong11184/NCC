const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    const Module = sequelize.define('MODULE', {
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
        tableName: 'MODULE',
        timestamps: false,
        schema: 'base',
    });

    // (async () => {
    //     await Module.sync({
    //         alter: true
    //     });
    //     // await Module.bulkCreate()
    // })();

    return Module
};