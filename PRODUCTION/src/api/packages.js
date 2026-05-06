const express = require('express')
const router = express.Router()
const mssql = require('mssql')
const { getErrorMessage } = require('./../core/config')

/**
 * GET /code-phieu-ban-giao-go-tron?start&end
 * Trả về danh sách phiếu nhập gỗ tròn (dạng dropdown {label,value})
 */
router.get('/code-phieu-ban-giao-go-tron', (req, res) => {
    new mssql.Request()
        .input('start', req.query.start)
        .input('end', req.query.end)
        .query(
            `SELECT CONCAT(Chu_rung, '-', So_phieu, '-', id) AS label, id AS value
             FROM [prod].[NHAP_GO_TRON]
             WHERE Chu_rung IS NOT NULL
               AND (@start IS NULL OR Ngay_nhap >= @start)
               AND (@end   IS NULL OR Ngay_nhap <  @end)
             ORDER BY Ngay_nhap DESC`,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )
})

/**
 * GET /bien-ban-gio-go-tron?code=<id>
 * Trả về chi tiết 1 phiếu nhập (dùng ID làm code).
 */
router.get('/bien-ban-gio-go-tron', (req, res) => {
    new mssql.Request()
        .input('code', req.query.code)
        .query(
            `SELECT *, CAST([Ngay_nhap] AS DATE) AS NGAY
             FROM [prod].[NHAP_GO_TRON]
             WHERE id = @code`,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )
})

/**
 * GET /all-phieu-go-tron
 * Trả về tất cả phiếu có Khoi_luong > 0 (đầy đủ cột)
 */
router.get('/all-phieu-go-tron', (req, res) => {
    new mssql.Request()
        .query(
            `SELECT *, CAST([Ngay_nhap] AS DATE) AS NGAY
             FROM [prod].[NHAP_GO_TRON]
             WHERE Khoi_luong IS NOT NULL AND Khoi_luong > 0
             ORDER BY Ngay_nhap, So_phieu`,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )
})

module.exports = router
