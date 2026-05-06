const express = require('express')
const accounts = express.Router()
const model = require('../../data/model')
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../core/config')

const ADMIN_IDS = [100400, 102089, 102015, 100001]

accounts.post('/raw', (_req, res) => {
    new mssql.Request()
        .query(`SELECT A.ID id,
        A.ACCOUNT account,
        A.LAST_NAME 'lastName',
        PHONE,
        position
        FROM base.ACCOUNT A`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

accounts.get('/', (req, res) => {
    const accountId = parseInt(req.headers['x-gateway-account-id'])
    console.log('[accounts] accountId:', accountId, 'isAdmin:', ADMIN_IDS.includes(accountId))
    if (ADMIN_IDS.includes(accountId)) {
        new mssql.Request()
            .query(`SELECT A.ID id,
            A.ACCOUNT account,
            A.LAST_NAME 'lastName',
            A.departmentId departmentId,
            A.ROLE_ID roleId,
            A.EMAIL,
            A.PHONE,
            A.unActive,
            A.ATTENDANCE_CODE attendanceCode
            FROM base.ACCOUNT A`, (err, record) => {
                if (err) {
                    console.log('[accounts] SQL error:', err.message)
                    return res.api.sendFail(getErrorMessage(4907))
                }
                res.api.sendData(record.recordset)
            })
    } else {
        new mssql.Request()
            .input('ID', accountId)
            .query(getAccount, (err, record) => {
                if (err)
                    return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            })
    }
})

accounts.post('/delete-role-value-desktop', (req, res) => {
    new mssql.Request()
        .input('ACCOUNT_ID', req.body.accountId)
        .input('MENU_ID', req.body.menuId)
        .input('ROLE_TYPE_ID', 100006)
        .query(`
        DELETE FROM base.ROLE_MENU
        WHERE ROLE_VALUE_ID IN (
            SELECT ID FROM base.ROLE_VALUE
            WHERE ROLE_ID = @ACCOUNT_ID AND VALUE = @MENU_ID AND ROLE_TYPE_ID = @ROLE_TYPE_ID
        )
        DELETE FROM base.ROLE_VALUE
        WHERE ROLE_ID = @ACCOUNT_ID AND VALUE = @MENU_ID AND ROLE_TYPE_ID = @ROLE_TYPE_ID
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

accounts.post('/delete-role-value-desktop-mobile', (req, res) => {
    new mssql.Request()
        .input('ROLE_ID', req.body.roleId)
        .input('VALUE', req.body.value)
        .input('ROLE_TYPE_ID', req.body.roleTypeId)
        .query(`
        DELETE FROM base.ROLE_MENU
        WHERE ROLE_VALUE_ID IN (
            SELECT ID FROM base.ROLE_VALUE
            WHERE ROLE_ID = @ROLE_ID AND VALUE = @VALUE AND ROLE_TYPE_ID = @ROLE_TYPE_ID
        )
        DELETE FROM base.ROLE_VALUE
        WHERE ROLE_ID = @ROLE_ID AND VALUE = @VALUE AND ROLE_TYPE_ID = @ROLE_TYPE_ID
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

accounts.post('/delete-role-value-mobile', (req, res) => {
    new mssql.Request()
        .input('ACCOUNT_ID', req.body.accountId)
        .input('MENU_ID', req.body.menuId)
        .input('ROLE_TYPE_ID', 100009)
        .query(`
        DELETE FROM base.ROLE_MENU
        WHERE ROLE_VALUE_ID = (
            SELECT ID FROM base.ROLE_VALUE
            WHERE ROLE_ID = @ACCOUNT_ID AND VALUE = @MENU_ID AND ROLE_TYPE_ID = @ROLE_TYPE_ID
        )
        DELETE FROM base.ROLE_VALUE
        WHERE ROLE_ID = @ACCOUNT_ID AND VALUE = @MENU_ID AND ROLE_TYPE_ID = @ROLE_TYPE_ID
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

accounts.get('/user-in-menu', (req, res) => {
    new mssql.Request()
        .input('MENU_ID', req.query.menuId)
        .input('ROLE_TYPE_ID', req.query.type)
        .query(`
        SELECT DISTINCT A.ID, ACCOUNT, LAST_NAME, D.NAME DEPARTMENT_NAME, D.CODE MAPHONGBAN,
            A.POSITION POSITION,
            CASE WHEN RM.ROLE_VALUE_ID IS NULL THEN N'KHÔNG' ELSE N'CÓ' END roleMenu
        FROM base.ACCOUNT A
            INNER JOIN base.ROLE_VALUE RV ON A.ID = RV.ROLE_ID
            INNER JOIN base.DEPARTMENT D ON A.departmentId = D.ID
            LEFT JOIN base.ROLE_MENU RM ON RV.ID = RM.ROLE_VALUE_ID
        WHERE VALUE = @MENU_ID AND ROLE_TYPE_ID = @ROLE_TYPE_ID
            AND a.ID NOT IN (100400, 102089, 101676, 101651) AND A.unActive = 1
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

accounts.get('/menu-phan-quyen', (req, res) => {
    new mssql.Request()
        .input('TYPE', req.query.type)
        .input('ACCOUNT_ID', req.query.accountId)
        .query(`
        SELECT DISTINCT M.ID, PARENT_ID, NAME, species FROM base.MENU M
        INNER JOIN base.ROLE_VALUE RV ON CONVERT(NVARCHAR, M.ID) = RV.VALUE
        WHERE TYPE = @TYPE AND M.id NOT IN (101214, 101370) AND ROLE_ID = @ACCOUNT_ID
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

accounts.get('/account-by-department', (req, res) => {
    new mssql.Request()
        .input('DEPARTMENT_ID', req.query.departmentId)
        .query(`
        SELECT D.NAME, A.LAST_NAME, P.NAME POSITION, A.EMAIL, A.PHONE, A.PHONE_EXT
        FROM base.ROLE_DEPARTMENT RD
        INNER JOIN base.DEPARTMENT D ON D.ID = RD.DEPARTMENT_ID
        INNER JOIN base.ACCOUNT A ON RD.ACCOUNT_ID = A.ID
        INNER JOIN base.POSITION P ON RD.POSITION_ID = P.ID
        WHERE D.ID = @DEPARTMENT_ID AND a.id NOT IN (100400, 102089) AND p.ID NOT IN (24)
        ORDER BY RD.[ORDER]
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

accounts.get('/account-in-department', (req, res) => {
    new mssql.Request()
        .query(`
        SELECT DISTINCT a1.ID, a1.LAST_NAME FROM base.DEPARTMENT d
        INNER JOIN base.ACCOUNT a1 ON d.accountId = a1.ID
        UNION
        SELECT DISTINCT a1.ID, a1.LAST_NAME FROM base.DEPARTMENT d
        INNER JOIN base.ACCOUNT a1 ON d.accountId1 = a1.ID
        UNION
        SELECT DISTINCT a1.ID, a1.LAST_NAME FROM base.DEPARTMENT d
        INNER JOIN base.ACCOUNT a1 ON d.accountId2 = a1.ID
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

accounts.put('/:id', (req, _res, next) => {
    delete req.body.password
    next()
}, model.accounts.updateById)

accounts.delete('/:id', model.accounts.deleteById)

let getAccount = `SELECT A.ID id,
A.ACCOUNT account,
A.LAST_NAME 'lastName',
A.departmentId departmentId,
A.ROLE_ID roleId,
A.EMAIL,
A.PHONE,
A.unActive,
p.NAME positionName
FROM base.ACCOUNT A left join
base.ROLE_DEPARTMENT rd on a.ID = rd.ACCOUNT_ID and a.departmentId = rd.DEPARTMENT_ID
left join base.POSITION p on rd.POSITION_ID = p.ID
WHERE A.LAST_NAME is not null AND A.ID NOT IN (
    SELECT K.ID
    FROM base.ACCOUNT K
    LEFT JOIN base.ROLE_VALUE KRV ON KRV.ROLE_ID = K.ROLE_ID
    LEFT JOIN (
        SELECT A.ID, A.ACCOUNT, RV.[VALUE]
        FROM base.ACCOUNT A
        LEFT JOIN base.ROLE_VALUE RV ON RV.ROLE_ID = A.ROLE_ID
        WHERE A.ID = @ID AND ROLE_TYPE_ID = 100001
    ) G ON G.[VALUE] = KRV.VALUE
    WHERE K.ID <> @ID AND KRV.ROLE_TYPE_ID = 100001 AND G.ID IS NULL
    GROUP BY K.ID
    UNION ALL
    SELECT A.ID
    FROM (
        SELECT * FROM base.ACCOUNT A WHERE A.CREATE_BY <> @ID
    ) A LEFT JOIN (
        SELECT ROLE_ID FROM base.ROLE_VALUE WHERE ROLE_TYPE_ID = 100001 GROUP BY ROLE_ID
    ) R ON R.ROLE_ID = A.ID
    WHERE R.ROLE_ID IS NULL
)`

module.exports = accounts
