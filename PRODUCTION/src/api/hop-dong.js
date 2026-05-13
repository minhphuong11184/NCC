const express = require('express')
const router = express.Router()
const mssql = require('mssql')

/**
 * GET /danh-sach?thang=1&nam=2025
 * Lấy danh sách PLHD theo từng chủ rừng từ KH_KHAI_THAC
 */
router.get('/danh-sach', async (req, res) => {
    try {
        const thang = parseInt(req.query.thang) || null
        const nam = parseInt(req.query.nam) || null
        const xuongXe = (req.query.xuong_xe || '').toString().trim() || null

        const request = new mssql.Request()
        let where = 'ten_ho IS NOT NULL'
        if (thang) { request.input('thang', thang); where += ' AND thang = @thang' }
        if (nam) { request.input('nam', nam); where += ' AND nam = @nam' }
        if (xuongXe) {
            request.input('xuong', xuongXe)
            where += " AND LTRIM(RTRIM(ISNULL(xuong_xe, ''))) = @xuong"
        }

        // Group theo chủ rừng
        const { recordset: chuRungList } = await request.query(`
            SELECT
                ten_ho, MAX(xa) AS xa, MAX(thon) AS thon,
                MAX(cccd) AS cccd, MAX(dia_chi_cccd) AS dia_chi_cccd,
                MAX(chung_chi) AS chung_chi,
                MAX(nhom_chung_chi) AS nhom_chung_chi,
                MAX(xuong_xe) AS xuong_xe,
                SUM(kl_bang_ke) AS tong_kl_bang_ke,
                SUM(kl_go) AS tong_kl_go,
                MIN(don_gia) AS don_gia,
                SUM(thanh_tien) AS tong_thanh_tien,
                MAX(so_bkls) AS so_bkls,
                MAX(ngay_bkls) AS ngay_bkls,
                MAX(so_hop_dong) AS so_hop_dong,
                MAX(ngay_hop_dong) AS ngay_hop_dong,
                MAX(so_phu_luc) AS so_phu_luc,
                MAX(ngay_phu_luc) AS ngay_phu_luc,
                MAX(source_sheet) AS source_sheet,
                MAX(CAST(da_chia AS INT)) AS da_chia,
                MAX(ngay_chia) AS ngay_chia
            FROM [prod].[KH_KHAI_THAC]
            WHERE ${where}
            GROUP BY ten_ho
            ORDER BY ten_ho
        `)

        // Chi tiết lô theo chủ rừng
        const request2 = new mssql.Request()
        let where2 = 'ten_ho IS NOT NULL'
        if (thang) { request2.input('thang', thang); where2 += ' AND thang = @thang' }
        if (nam) { request2.input('nam', nam); where2 += ' AND nam = @nam' }
        if (xuongXe) {
            request2.input('xuong', xuongXe)
            where2 += " AND LTRIM(RTRIM(ISNULL(xuong_xe, ''))) = @xuong"
        }

        const { recordset: loList } = await request2.query(`
            SELECT
                ten_ho, lo_go_tron, lo_go_xe, khoanh, lo, dien_tich,
                nam_trong, kl_bang_ke, kl_go, don_gia, thanh_tien,
                so_bkls, ngay_bkls, KD, VD
            FROM [prod].[KH_KHAI_THAC]
            WHERE ${where2}
            ORDER BY ten_ho, lo_go_tron
        `)

        const loByChuru = {}
        loList.forEach(l => {
            if (!loByChuru[l.ten_ho]) loByChuru[l.ten_ho] = []
            loByChuru[l.ten_ho].push(l)
        })

        const recordset = chuRungList.map(cr => ({
            ...cr,
            lo_list: loByChuru[cr.ten_ho] || []
        }))

        res.api.sendData(recordset)
    } catch (err) {
        console.error(err)
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

module.exports = router
