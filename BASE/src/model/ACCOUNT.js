const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
    const Acount = sequelize.define('ACCOUNT', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        account: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'ACCOUNT'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'PASSWORD'
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'FIRST_NAME'
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'LAST_NAME'
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'ROLE_ID'
        },
        factoryId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'POSITION'
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        createBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'CREATE_BY'
        },
        PHONE: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'PHONE'
        },
        EMAIL: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'EMAIL'
        },
        unActive: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'unActive'
        },
        timeUnActive: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'timeUnActive',
        },
        attendanceCode: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'ATTENDANCE_CODE'
        },
        //email: {
        //    type: DataTypes.STRING,
        //    allowNull: true,
        //   field: 'EMAIL',
            
        //}
    }, {
        tableName: 'ACCOUNT',
        timestamps: false,
        schema: 'base'
    })
    return Acount
}