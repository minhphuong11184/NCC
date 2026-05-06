const express = require('express')
const auth = express.Router()
const mssql = require('mssql')
const model = require('./../data/model')
const {
    getErrorMessage
} = require('./../core/config')

const {
    getAccount,
    isAccountExist,
    isAccountNotExit,
    checkPassword,
    createToken,
    renderAccount,
    hashPassword,
    tokenVerify,
    passwordCompare,
    checkActive
} = require('./middleware')

auth.post('/login',
    getAccount,
    isAccountExist,
    checkActive,
    checkPassword,
    createToken,
    //renderAccount, 
    (req, res, next) => {
        console.log('req.body2',req.body)
        new mssql.Request()
            .input('ID', req.account.id)
            .query(getAccountById, (err, record) => {
                if (err)
                    res.api.sendFail(getErrorMessage(4907))
                req.account = {
                    id: record.recordset[0].id,
                    account: record.recordset[0].account,
                    lastName: record.recordset[0].lastName,
                    position: record.recordset[0].position,
                    roleId: record.recordset[0].roleId,
                    departmentId: record.recordset[0].departmentId,
                    factoryId: record.recordset[0].factoryId,
                    PHONE: record.recordset[0].PHONE,
                    EMAIL: record.recordset[0].EMAIL,
                    notificationMail: record.recordset[0].notificationMail,
                    department: record.recordset[0].departmentId,
                    updatedAt: record.recordset[0].updatedAt,
                    //Phan quyen
                    active: record.recordset[0].active,
                    //end phan quyen
                    role: {
                        id: record.recordset[0].roleId,
                        types: []
                    }
                }
                next()
            })
    }, (req, res, next) => { // Cong doan lam viec
        new mssql.Request()
            .input('ID', req.account.id)
            .query(getCongDoanLamViec, (err, record) => {
                if (err)
                    res.api.sendFail(getErrorMessage(4907))
                let buf = {
                    id: 100001,
                    code: 'CDLV',
                    name: 'Công đoạn làm việc',
                    value: []
                }
                record.recordset.forEach(e => {
                    buf.value.push({
                        factoryId: e.factoryId,
                        'Nhà máy': e['Nhà máy'],
                        'Kho/Xưởng': e['Kho/Xưởng'],
                        'Tổ': e['Tổ'],
                        'Nhóm': e['Nhóm'],
                        id: e.id,
                        type: e.type,
                        type2: e.type2,
                        code: e.code,
                        name: e.name,
                        error: e.error,
                        factory:e.factory,
                        parentId: e.parentId
                    })
                })
                req.account.role.types.push(buf)
                next()
            })
    }, (req, res, next) => { // Cong doan xuat hang
        new mssql.Request()
            .input('ID', req.account.id)
            .query(getCongDoanXuatHang, (err, record) => {
                if (err)
                    res.api.sendFail(getErrorMessage(4907))
                let buf = {
                    id: 100002,
                    code: 'CDXH',
                    name: 'Công đoạn xuất hàng',
                    value: []
                }
                record.recordset.forEach(e => {
                    buf.value.push({
                        id: e.id,
                        type: e.type,
                        type2: e.type2,
                        code: e.code,
                        name: e.name,
                        parentId: e.parentId
                    })
                })
                req.account.role.types.push(buf)
                next()
            })
    }, (req, res, next) => {
        new mssql.Request()
            .input('ID', req.account.id)
            .query(getMenu, (err, record) => {
                if (err)
                    res.api.sendFail(getErrorMessage(4907))
                let buf = {
                    id: 100006,
                    code: 'MN',
                    name: 'Menu',
                    value: []
                }
                record.recordset.forEach(e => {
                    buf.value.push({
                        id: e.id,
                        path: e.path,
                        type: e.type,
                        name: e.name,
                        parentId: e.parentId,
                        stt: e.sequence ? e.sequence : 50
                    })
                })
                req.account.role.types.push(buf)
                next()
            })
    }, (req, res, next) => {
        new mssql.Request()
            .input('ID', req.account.id)
            .query(getMenuMobile, (err, record) => {
                if (err)
                    res.api.sendFail(getErrorMessage(4907))
                let buf = {
                    id: 100009,
                    code: 'MNMB',
                    name: 'Menu mobile',
                    value: []
                }
                record.recordset.forEach(e => {
                    buf.value.push({
                        id: e.id,
                        path: e.path,
                        type: e.type,
                        name: e.name,
                        parentId: e.parentId
                    })
                })
                req.account.role.types.push(buf)
                next()
            })
    }, (req, res, next) => {
        new mssql.Request()
            .input('ID', req.account.id)
            .query(getChucNang, (err, record) => {
                if (err)
                    res.api.sendFail(getErrorMessage(4907))
                let buf = {
                    id: 100003,
                    code: 'CN',
                    name: 'Chức năng',
                    value: []
                }
                record.recordset.forEach(e => {
                    buf.value.push({
                        id: e.id,
                        code: e.code,
                        name: e.name,
                    })
                })
                req.account.role.types.push(buf)
                next()
            })
    }, (req, res, next) => {
        new mssql.Request()
            .input('ID', req.account.id)
            .query(getCapDoQuanLyDanhMuc, (err, record) => {
                if (err)
                    res.api.sendFail(getErrorMessage(4907))
                let buf = {
                    id: 100007,
                    code: 'CDQLDM',
                    name: 'Cấp độ quản lý danh mục',
                    value: []
                }
                record.recordset.forEach(e => {
                    buf.value.push({
                        id: e.id,
                        permission: e.permission,
                        name: e.name,
                    })
                })
                req.account.role.types.push(buf)
                next()
            })
    }, (req, res, next) => {
        new mssql.Request()
            .input('ID', req.account.id)
            .query(getLoaiTaiKhoan, (err, record) => {
                if (err)
                    res.api.sendFail(getErrorMessage(4907))
                let buf = {
                    id: 100008,
                    code: 'LTK',
                    name: 'Loại tài khoản',
                    value: []
                }
                record.recordset.forEach(e => {
                    buf.value.push(e.value)
                })
                req.account.role.types.push(buf)
                next()
            })
    }, (req, res, next) => {
        let structure = {}
        if (req.account.role.types.find(i => i.id == 100001).value[0] !== undefined)
            getParent(req.account.role.types.find(i => i.id == 100001).value[0].id, structure)
        req.account.structure = structure
        req.account.token = req.token
        res.api.sendData(req.account)
    })

auth.post('/signup',
    getAccount,
    isAccountNotExit,
    hashPassword,
    (req, res, next) => {
        req.body.createBy = req.headers['x-gateway-account-id']
        req.body.account = req.body.account || req.body.username
        next()
    },
    model.accounts.insert,
    (req, res, next) => {
        console.log("req", req);
        let update = `UPDATE base.ACCOUNT
                    SET ROLE_ID = ID
                    WHERE ACCOUNT = @ACCOUNT`
        new mssql.Request()
            .input('ACCOUNT', req.body.account)
            .query(update, (err, record) => {
                if (err)
                    res.api.sendFail(getErrorMessage(4907))
            })
    })

auth.get('/token', tokenVerify, createToken, renderAccount)
auth.get('/token/:token', tokenVerify, createToken, renderAccount)
    //reset password

//auth.post('/password/reset',
//    getAccount,
//    isAccountExist,
 //   (req, res, next) => { //cấu hình lại dữ liệu
 //       req.body = { // Mật khẩu = 1
 //           password: '$2b$10$.s7LIIlFTdrXEyKZLdQspO3qFd0t1QrCMdlMRqnfQosm4akq3IIVm'
 //       }
 //       next()
 //   }, model.accounts.updateById)
auth.put('/password',  //Dùng cho tính năng quên mật khẩu
    getAccount,
    isAccountExist,
//    passwordCompare,
    hashPassword,
    (req, res, next) => { //cấu hình lại dữ liệu
        req.body = {
            password: req.body.password
        }
        console.log(req.body)
        next()
    }, model.accounts.updateById)
//
    auth.put('/password-update', //update password mới sau 6 tháng
    getAccount,
    isAccountExist,
    passwordCompare,
    hashPassword,
    (req, res, next) => { //cấu hình lại dữ liệu
        req.body = {
            password: req.body.password
        }
        console.log(req.body)
        next()
    }, model.accounts.updateById)

function getParent(deparmentId, structure) {
    const cache = require('./../data/cache')
    let deparment = cache.departments.getById(deparmentId) || {}
    if (deparment.id !== undefined) {
        structure[deparment.type2] = deparment
        console.log('deparment',deparment.parentId)
        if (deparment.parentId > 10) {
            getParent(deparment.parentId, structure)
        }
    }
}
let getAccountById = `SELECT EMAIL,notificationMail ,  PHONE, a.id,account,LAST_NAME lastName,ROLE_ID roleId, factoryId, departmentId, p.NAME as position
                             FROM base.ACCOUNT a
                             LEFT JOIN base.ROLE_DEPARTMENT rd on a.departmentId = rd.DEPARTMENT_ID and a.ID = rd.ACCOUNT_ID
                             LEFT JOIN base.POSITION p on rd.POSITION_ID = p.ID
                    WHERE a.ID = @ID`

//let getAccountById = `SELECT EMAIL,notificationMail ,  PHONE, id,account,LAST_NAME lastName,
//                     ROLE_ID roleId, factoryId, departmentId, POSITION as position, updatedAt
//                    FROM base.ACCOUNT
//                    WHERE ID = @ID`

let getCongDoanLamViec = `SELECT 
CASE
WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[ID]
WHEN L1.TYPE = N'Nhà máy' THEN L1.[ID]
WHEN L2.TYPE = N'Nhà máy' THEN L2.[ID]
WHEN L3.TYPE = N'Nhà máy' THEN L3.[ID]
ELSE '-'
END AS 'factoryId',
CASE
    WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[NAME]
    WHEN L1.TYPE = N'Nhà máy' THEN L1.[NAME]
    WHEN L2.TYPE = N'Nhà máy' THEN L2.[NAME]
    WHEN L3.TYPE = N'Nhà máy' THEN L3.[NAME]
    ELSE '-'
END AS 'Nhà máy',
CASE
    WHEN L0.[TYPE] = N'Xưởng' OR L0.[TYPE] = N'Kho' THEN L0.[NAME]
    WHEN L1.TYPE = N'Xưởng' OR L1.[TYPE] = N'Kho' THEN L1.[NAME]
    WHEN L2.TYPE = N'Xưởng' OR L2.[TYPE] = N'Kho' THEN L2.[NAME]
    WHEN L3.TYPE = N'Xưởng' OR L3.[TYPE] = N'Kho' THEN L3.[NAME]
    ELSE '-'
END AS 'Kho/Xưởng',
CASE
    WHEN L0.[TYPE] = N'Tổ' OR L0.[TYPE] = N'QC' THEN L0.NAME
    WHEN L1.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L1.[NAME]
    WHEN L2.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L2.[NAME]
    WHEN L3.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L3.[NAME]
    ELSE '-'
END AS 'Tổ',
CASE
    WHEN L0.[TYPE] = N'Nhóm' THEN L0.NAME
    WHEN L1.TYPE = N'Nhóm' THEN L1.NAME
    WHEN L2.TYPE = N'Nhóm' THEN L2.NAME
    WHEN L3.TYPE = N'Nhóm' THEN L3.NAME
    ELSE '-'
END AS 'Nhóm',
                        RT.ID tid,
                        RT.CODE tcode,
                        RT.NAME tname,
                        D.ID id,
                        D.TYPE type,
                        D.TYPE2 type2,
                        D.CODE code,
                        D.NAME name,
                        D.ERROR error,
                        D.factoryId factory,
                        D.PARENT_ID parentId
                        FROM base.ROLE_VALUE RV
                        LEFT JOIN base.ROLE_TYPE RT ON RT.ID = RV.ROLE_TYPE_ID
                        LEFT JOIN base.DEPARTMENT D ON D.ID = RV.[VALUE]
                        LEFT JOIN base.DEPARTMENT L0 ON L0.ID = D.ID
                        LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
                        LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
                        LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
                        WHERE ROLE_ID = @ID
                        AND ROLE_TYPE_ID = 100001
                        ORDER BY D.NAME`

let getCongDoanXuatHang = `SELECT 
                        RT.ID tid,
                        RT.CODE tcode,
                        RT.NAME tname,
                        D.ID id,
                        D.TYPE type,
                        D.TYPE2 type2,
                        D.CODE code,
                        D.NAME name,
                        D.PARENT_ID parentId
                        FROM base.ROLE_VALUE RV
                        LEFT JOIN base.ROLE_TYPE RT ON RT.ID = RV.ROLE_TYPE_ID
                        LEFT JOIN base.DEPARTMENT D ON D.ID = RV.[VALUE]
                        WHERE ROLE_ID = @ID
                        AND ROLE_TYPE_ID = 100002`
let getMenu = `SELECT 
                RT.ID tid,
                RT.CODE tcode,
                RT.NAME tname,
                M.ID id,
                M.PATH path,
                M.TYPE type,
                M.NAME name,
                M.PARENT_ID parentId,
                M.[sequence]
                FROM base.ROLE_VALUE RV
                LEFT JOIN base.ROLE_TYPE RT ON RT.ID = RV.ROLE_TYPE_ID
                LEFT JOIN base.MENU M ON M.ID = RV.[VALUE]
                WHERE ROLE_ID = @ID
                AND ROLE_TYPE_ID = 100006 and M.isActive = 1 order by M.[sequence]`
let getMenuMobile = `SELECT 
                RT.ID tid,
                RT.CODE tcode,
                RT.NAME tname,
                M.ID id,
                M.PATH path,
                M.TYPE type,
                M.NAME name,
                M.PARENT_ID parentId
                FROM base.ROLE_VALUE RV
                LEFT JOIN base.ROLE_TYPE RT ON RT.ID = RV.ROLE_TYPE_ID
                LEFT JOIN base.MENU M ON M.ID = RV.[VALUE]
                WHERE ROLE_ID = @ID
                AND ROLE_TYPE_ID = 100009`
let getChucNang = `SELECT 
                    RT.ID tid,
                    RT.CODE tcode,
                    RT.NAME tname,
                    RG.ID id,
                    RG.CODE code,
                    RG.NAME name
                    FROM base.ROLE_VALUE RV
                    LEFT JOIN base.ROLE_TYPE RT ON RT.ID = RV.ROLE_TYPE_ID
                    LEFT JOIN base.ROLE_GROUP RG ON RG.ID = RV.[VALUE]
                    WHERE ROLE_ID = @ID
                    AND ROLE_TYPE_ID = 100003`
let getCapDoQuanLyDanhMuc = `SELECT 
                    RT.ID tid,
                    RT.CODE tcode,
                    RT.NAME tname,
                    C.ID id,
                    C.PERMISSION permission,
                    C.NAME name
                    FROM base.ROLE_VALUE RV
                    LEFT JOIN base.ROLE_TYPE RT ON RT.ID = RV.ROLE_TYPE_ID
                    LEFT JOIN base.CATEGORY C ON C.ID = RV.[VALUE]
                    WHERE ROLE_ID = @ID
                    AND ROLE_TYPE_ID = 100007`

let getLoaiTaiKhoan = `SELECT 
RV.VALUE value
FROM base.ROLE_VALUE RV
LEFT JOIN base.ROLE_TYPE RT ON RT.ID = RV.ROLE_TYPE_ID
WHERE ROLE_ID = @ID
AND ROLE_TYPE_ID = 100008`
module.exports = auth