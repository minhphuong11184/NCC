const express = require('express')
const roles = express.Router()
const model = require('../../data/model')
const cache = require('./../../data/cache')
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../core/config')

roles.get('/', (req, res) => {
    res.api.sendData(cache.roles.findBy(req.query))
})

roles.get('/:id', (req, res, next) => {
    new mssql.Request()
        .input('ID', req.params.id)
        .query(getRole, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            record.recordset.forEach(e => {
                req.role = {
                    id: e.id,
                    code: e.code,
                    name: e.name,
                }

                req.role['loai_tai_khoan'] = {
                    id: 100008,
                    values: []
                }
                req.role['menu'] = {
                    id: 100006,
                    values: []
                }
                req.role['menu_mobile'] = {
                    id: 100009,
                    values: []
                }
                req.role['bo_phan_lam_viec'] = {
                    id: 100001,
                    values: []
                }
                req.role['bo_phan_xuat_hang'] = {
                    id: 100002,
                    values: []
                }
                req.role['cap_do_quan_ly_danh_muc'] = {
                    id: 100007,
                    values: [],
                    views: []
                }
            })
            if (req.role === undefined) {
                res.api.sendFail({})
            } else {
                next()
            }
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('ID', req.params.id)
        .input('ACCOUNT_ID', req.headers['x-gateway-account-id'])
        .query(getLoaiTaiKhoan, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            record.recordset.forEach(e => {
                let buf = {}
                Object.keys(e).forEach(key => {
                    buf[key] = e[key]
                })
                req.role['loai_tai_khoan'].values.push(buf)
            })
            next()
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('ID', req.params.id)
        .input('ACCOUNT_ID', req.headers['x-gateway-account-id'])
        .query(getMenu, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            record.recordset.forEach(e => {
                let buf = {}
                Object.keys(e).forEach(key => {
                    buf[key] = e[key]
                })
                req.role['menu'].values.push(buf)
            })
            next()
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('ID', req.params.id)
        .input('ACCOUNT_ID', req.headers['x-gateway-account-id'])
        .query(getMenuMobile, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            record.recordset.forEach(e => {
                let buf = {}
                Object.keys(e).forEach(key => {
                    buf[key] = e[key]
                })
                req.role['menu_mobile'].values.push(buf)
            })
            console.log("req.role['menu_mobile'].values",req.params.id,req.headers['x-gateway-account-id'])
            next()
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('ID', req.params.id)
        .input('ACCOUNT_ID', req.headers['x-gateway-account-id'])
        .query(getBoPhanLamViec, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            record.recordset.forEach(e => {
                let buf = {}
                Object.keys(e).forEach(key => {
                    buf[key] = e[key]
                })
                req.role['bo_phan_lam_viec'].values.push(buf)
            })
            next()
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('ID', req.params.id)
        .input('ACCOUNT_ID', req.headers['x-gateway-account-id'])
        .query(getBoPhanXuatHang, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            record.recordset.forEach(e => {
                let buf = {}
                Object.keys(e).forEach(key => {
                    buf[key] = e[key]
                })
                req.role['bo_phan_xuat_hang'].values.push(buf)
            })
            next()
        })
}, (req, res, next) => {
    new mssql.Request()
        .input('ID', req.params.id)
        .input('ACCOUNT_ID', req.headers['x-gateway-account-id'])
        .query(getCapDoQuanLyDanhMuc, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            record.recordset.forEach(e => {
                let buf = {}
                Object.keys(e).forEach(key => {
                    buf[key] = e[key]
                })
                req.role['cap_do_quan_ly_danh_muc'].values.push(buf)
            })
            record.recordset.forEach(e => {
                let obj = req.role['cap_do_quan_ly_danh_muc'].views.find(i => i.name == e.name)
                if (!obj) {
                    req.role['cap_do_quan_ly_danh_muc'].views.push({
                        name: e.name
                    })
                    obj = req.role['cap_do_quan_ly_danh_muc'].views.find(i => i.name == e.name)
                }
                obj[e.permission] = e.state
            })
            next()
        })
}, (req, res, next) => {
    res.api.sendData(req.role)
})

roles.post('/', model.roles.insert)

roles.put('/:id', model.roles.updateById)

roles.delete('/:id', model.roles.deleteById)



let getRole = `SELECT id,ACCOUNT code, LAST_NAME 'name' FROM base.ACCOUNT
WHERE ROLE_ID = @ID`
let getLoaiTaiKhoan = `SELECT DM.VALUE name,
HT.ID id,
CASE
	WHEN HT.ID IS NULL THEN 0
	ELSE 1
END AS 'state'
FROM (
SELECT RV.[VALUE]
FROM base.ACCOUNT A
LEFT JOIN base.ROLE_VALUE RV ON RV.ROLE_ID = A.ROLE_ID
WHERE RV.ROLE_TYPE_ID = 100008
AND A.ID = @ACCOUNT_ID
) DM
LEFT JOIN (
	SELECT ID,VALUE
	FROM base.ROLE_VALUE
	WHERE ROLE_ID = @ID
	AND ROLE_TYPE_ID = 100008
) HT ON HT.VALUE = DM.value `
let getMenu = `SELECT M.ID menuId,
M.PARENT_ID parentId,
M.NAME name,
M.PATH path,
M.TYPE type,
HT.ID id,
CASE
	WHEN HT.ID IS NULL THEN 0
	ELSE 1
END AS 'state'
FROM 
(
	SELECT M.ID, M.[NAME], M.[PATH], M.[TYPE],
	CASE
		WHEN M.PARENT_ID IN (	SELECT M.ID
								FROM base.ACCOUNT A
								LEFT JOIN base.ROLE_VALUE RV ON RV.ROLE_ID = A.ROLE_ID
								LEFT JOIN base.MENU M ON M.ID = RV.VALUE
								WHERE  RV.ROLE_TYPE_ID = 100006
								AND A.ID = @ACCOUNT_ID 
							) THEN M.PARENT_ID
		ELSE NULL
		END AS PARENT_ID
	FROM base.ACCOUNT A
	LEFT JOIN base.ROLE_VALUE RV ON RV.ROLE_ID = A.ROLE_ID
	LEFT JOIN base.MENU M ON M.ID = RV.VALUE
	WHERE  RV.ROLE_TYPE_ID = 100006
	AND A.ID = @ACCOUNT_ID
)
M
LEFT JOIN (
SELECT ID,VALUE
	FROM base.ROLE_VALUE
	WHERE ROLE_ID = @ID
	AND ROLE_TYPE_ID = 100006
) HT ON HT.VALUE = M.ID
WHERE M.[TYPE] = 'desktop'
`
let getMenuMobile = `
SELECT M.ID menuId,
M.PARENT_ID parentId,
M.NAME name,
M.PATH path,
M.TYPE type,
M.species,
HT.ID id,
CASE
	WHEN HT.ID IS NULL THEN 0
	ELSE 1
END AS 'state'
FROM 
(
	SELECT distinct M.ID, M.[NAME], M.[PATH], M.[TYPE], M.species,
	CASE
		WHEN M.PARENT_ID IN (	SELECT distinct M.ID
								FROM base.ACCOUNT A
								LEFT JOIN base.ROLE_VALUE RV ON RV.ROLE_ID = A.ROLE_ID
								LEFT JOIN base.MENU M ON M.ID = RV.VALUE
								WHERE  RV.ROLE_TYPE_ID = 100009
								AND A.ID = @ACCOUNT_ID 
							) THEN M.PARENT_ID
		ELSE NULL
		END AS PARENT_ID
	FROM base.ACCOUNT A
	LEFT JOIN base.ROLE_VALUE RV ON RV.ROLE_ID = A.ROLE_ID
	LEFT JOIN base.MENU M ON M.ID = RV.VALUE
	WHERE  RV.ROLE_TYPE_ID = 100009
	AND A.ID = @ACCOUNT_ID
)
M
LEFT JOIN (
SELECT ID,VALUE
	FROM base.ROLE_VALUE
	WHERE ROLE_ID = @ID
	AND ROLE_TYPE_ID = 100009
) HT ON HT.VALUE = M.ID
WHERE M.[TYPE] = 'mobile'
`
let getBoPhanLamViec = `SELECT D.ID departmentId,
D.PARENT_ID parentId,
D.TYPE type,
D.TYPE2 type2,
D.CODE code,
D.NAME name,
HT.ID id,
CASE
	WHEN HT.ID IS NULL THEN 0
	ELSE 1
END AS 'state'
FROM (
	SELECT D.ID, D.TYPE, D.TYPE2,D.CODE,D.NAME,
	CASE
		WHEN D.PARENT_ID IN (	SELECT D.ID
								FROM base.ACCOUNT A
								LEFT JOIN base.ROLE_VALUE RV ON RV.ROLE_ID = A.ROLE_ID
								LEFT JOIN base.DEPARTMENT D ON D.ID = RV.VALUE
								WHERE  RV.ROLE_TYPE_ID = 100001
								AND A.ID = @ACCOUNT_ID 
							) THEN D.PARENT_ID
		ELSE NULL
		END AS PARENT_ID
	FROM base.ACCOUNT A
	LEFT JOIN base.ROLE_VALUE RV ON RV.ROLE_ID = A.ROLE_ID
	LEFT JOIN base.DEPARTMENT D ON D.ID = RV.VALUE
	WHERE  RV.ROLE_TYPE_ID = 100001
	AND A.ID = @ACCOUNT_ID
) D
LEFT JOIN (
	SELECT ID,VALUE
	FROM base.ROLE_VALUE
	WHERE ROLE_ID = @ID
	AND ROLE_TYPE_ID = 100001
) HT ON HT.VALUE = D.ID`

let getBoPhanXuatHang = `SELECT D.ID departmentId,
D.PARENT_ID parentId,
D.TYPE type,
D.TYPE2 type2,
D.CODE code,
D.NAME name,
HT.ID id,
CASE
	WHEN HT.ID IS NULL THEN 0
	ELSE 1
END AS 'state'
FROM (
	SELECT D.ID, D.TYPE, D.TYPE2,D.CODE,D.NAME,
	CASE
		WHEN D.PARENT_ID IN (	SELECT D.ID
								FROM base.ACCOUNT A
								LEFT JOIN base.ROLE_VALUE RV ON RV.ROLE_ID = A.ROLE_ID
								LEFT JOIN base.DEPARTMENT D ON D.ID = RV.VALUE
								WHERE  RV.ROLE_TYPE_ID = 100002
								AND A.ID = @ACCOUNT_ID 
							) THEN D.PARENT_ID
		ELSE NULL
		END AS PARENT_ID
	FROM base.ACCOUNT A
	LEFT JOIN base.ROLE_VALUE RV ON RV.ROLE_ID = A.ROLE_ID
	LEFT JOIN base.DEPARTMENT D ON D.ID = RV.VALUE
	WHERE  RV.ROLE_TYPE_ID = 100002
	AND A.ID = @ACCOUNT_ID
) D
LEFT JOIN (
	SELECT ID,VALUE
	FROM base.ROLE_VALUE
	WHERE ROLE_ID = @ID
	AND ROLE_TYPE_ID = 100002
) HT ON HT.VALUE = D.ID`

let getCapDoQuanLyDanhMuc = `SELECT C.ID categoryId,
C.NAME name,
C.PERMISSION permission,
HT.ID id,
CASE
	WHEN HT.ID IS NULL THEN 0
	ELSE 1
END AS 'state'
FROM 
(
	SELECT * 
	FROM base.CATEGORY 
	WHERE [NAME] IN (
		SELECT C.[NAME]
		FROM base.ACCOUNT A
		LEFT JOIN base.ROLE_VALUE RV ON RV.ROLE_ID = A.ROLE_ID
		LEFT JOIN base.CATEGORY C ON C.ID = RV.VALUE
		WHERE A.ID = @ACCOUNT_ID
		AND RV.ROLE_TYPE_ID = 100007
		AND C.PERMISSION = 'ALL' 
	)
) C
LEFT JOIN (
	SELECT ID,VALUE
	FROM base.ROLE_VALUE
	WHERE ROLE_ID = @ID
	AND ROLE_TYPE_ID = 100007
) HT ON HT.VALUE = C.ID`

module.exports = roles