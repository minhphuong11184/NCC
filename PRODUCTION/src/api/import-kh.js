const express = require('express')
const router = express.Router()
const mssql = require('mssql')

/**
 * POST /import
 * Body: { rows: [...], truncate: bool }
 */
router.post('/import', async (req, res) => {
    try {
        const rows = Array.isArray(req.body.rows) ? req.body.rows : []
        const truncate = !!req.body.truncate
        if (!rows.length) return res.api.sendFail({ number: 4900, message: 'Không có dữ liệu' })

        if (truncate) {
            await new mssql.Request().query('DELETE FROM [prod].[KH_KHAI_THAC]')
            await new mssql.Request().query("DBCC CHECKIDENT ('[prod].[KH_KHAI_THAC]', RESEED, 0)")
        }

        const table = new mssql.Table('[prod].[KH_KHAI_THAC]')
        table.create = false
        table.columns.add('thang', mssql.Int, { nullable: true })
        table.columns.add('nam', mssql.Int, { nullable: true })
        table.columns.add('xa', mssql.NVarChar(100), { nullable: true })
        table.columns.add('ten_ho', mssql.NVarChar(200), { nullable: true })
        table.columns.add('thon', mssql.NVarChar(500), { nullable: true })
        table.columns.add('cccd', mssql.NVarChar(500), { nullable: true })
        table.columns.add('chung_chi', mssql.NVarChar(500), { nullable: true })
        table.columns.add('nhom_chung_chi', mssql.NVarChar(255), { nullable: true })
        table.columns.add('khoanh', mssql.NVarChar(50), { nullable: true })
        table.columns.add('lo', mssql.NVarChar(50), { nullable: true })
        table.columns.add('dien_tich', mssql.Float, { nullable: true })
        table.columns.add('loai_cay', mssql.NVarChar(100), { nullable: true })
        table.columns.add('nam_trong', mssql.Int, { nullable: true })
        table.columns.add('kl_bang_ke', mssql.Float, { nullable: true })
        table.columns.add('kl_go', mssql.Float, { nullable: true })
        table.columns.add('noi_xe', mssql.NVarChar(200), { nullable: true })
        table.columns.add('ngay_lam_hs', mssql.NVarChar(200), { nullable: true })
        table.columns.add('thoi_gian_kt', mssql.NVarChar(500), { nullable: true })
        table.columns.add('so_bkls', mssql.NVarChar(100), { nullable: true })
        table.columns.add('ngay_bkls', mssql.NVarChar(200), { nullable: true })
        table.columns.add('KD', mssql.NVarChar(50), { nullable: true })
        table.columns.add('VD', mssql.NVarChar(50), { nullable: true })
        table.columns.add('source_sheet', mssql.NVarChar(100), { nullable: true })
        table.columns.add('source_file', mssql.NVarChar(500), { nullable: true })
        table.columns.add('lo_go_tron', mssql.NVarChar(100), { nullable: true })
        table.columns.add('lo_go_xe', mssql.NVarChar(100), { nullable: true })
        table.columns.add('dia_chi_cccd', mssql.NVarChar(500), { nullable: true })
        table.columns.add('don_gia', mssql.Float, { nullable: true })
        table.columns.add('thanh_tien', mssql.Float, { nullable: true })
        table.columns.add('xuong_xe', mssql.NVarChar(255), { nullable: true })

        rows.forEach(d => table.rows.add(
            d.thang, d.nam, d.xa, d.ten_ho, d.thon, d.cccd, d.chung_chi,
            d.nhom_chung_chi || null,
            d.khoanh, d.lo, d.dien_tich, d.loai_cay, d.nam_trong,
            d.kl_bang_ke, d.kl_go, d.noi_xe, d.ngay_lam_hs, d.thoi_gian_kt,
            d.so_bkls, d.ngay_bkls, d.KD, d.VD, d.source_sheet, d.source_file,
            d.lo_go_tron || null, d.lo_go_xe || null, d.dia_chi_cccd || null,
            d.don_gia || null, d.thanh_tien || null,
            d.xuong_xe || null
        ))

        const result = await new mssql.Request().bulk(table)
        res.api.sendData({ inserted: result.rowsAffected, truncated: truncate })
    } catch (err) {
        console.error(err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

module.exports = router
