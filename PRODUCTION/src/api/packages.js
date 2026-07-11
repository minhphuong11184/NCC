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
            `WITH ranked AS (
                SELECT id,
                    ROW_NUMBER() OVER (
                        PARTITION BY LTRIM(RTRIM(ISNULL(Chu_rung, ''))),
                                     MONTH(Ngay_nhap),
                                     YEAR(Ngay_nhap),
                                     LTRIM(RTRIM(ISNULL(Xuong_xe, '')))
                        ORDER BY Ngay_nhap, TT, id
                    ) AS stt_chu_rung
                FROM [prod].[NHAP_GO_TRON]
             )
             SELECT N.*, CAST(N.[Ngay_nhap] AS DATE) AS NGAY, R.stt_chu_rung
             FROM [prod].[NHAP_GO_TRON] N
             JOIN ranked R ON R.id = N.id
             WHERE N.id = @code`,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )
})

/**
 * GET /all-phieu-go-tron?thang=&nam=
 * Trả về phiếu gỗ tròn có Khoi_luong > 0 trong tháng/năm (nếu truyền).
 * Nếu không truyền thang/nam → trả tất cả (giữ backward compat).
 */
router.get('/all-phieu-go-tron', (req, res) => {
    const thang = parseInt(req.query.thang) || null
    const nam = parseInt(req.query.nam) || null
    const request = new mssql.Request()
    let dateFilter = ''
    if (thang) { request.input('thang', thang); dateFilter += ' AND MONTH(N.Ngay_nhap) = @thang' }
    if (nam) { request.input('nam', nam); dateFilter += ' AND YEAR(N.Ngay_nhap) = @nam' }
    request
        .query(
            `WITH ranked AS (
                SELECT id,
                    ROW_NUMBER() OVER (
                        PARTITION BY LTRIM(RTRIM(ISNULL(Chu_rung, ''))),
                                     MONTH(Ngay_nhap),
                                     YEAR(Ngay_nhap),
                                     LTRIM(RTRIM(ISNULL(Xuong_xe, '')))
                        ORDER BY Ngay_nhap, TT, id
                    ) AS stt_chu_rung
                FROM [prod].[NHAP_GO_TRON]
             )
             SELECT N.*, CAST(N.[Ngay_nhap] AS DATE) AS NGAY, R.stt_chu_rung
             FROM [prod].[NHAP_GO_TRON] N
             JOIN ranked R ON R.id = N.id
             WHERE N.Khoi_luong IS NOT NULL AND N.Khoi_luong > 0${dateFilter}
             ORDER BY N.Lo_go_tron, N.TT, N.id`,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907))
                res.api.sendData(record.recordset)
            }
        )
})

module.exports = router
